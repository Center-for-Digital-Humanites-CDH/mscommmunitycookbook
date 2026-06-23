'use client';

import { useState, useMemo, useCallback } from 'react';
import styles from './CookbookInventory.module.css';

interface Cookbook {
  Title: string;
  Author: string;
  Date: string;
  Community: string;
  County?: string;
  'Organization (Church, Civic/Club, Business/Professional)': string;
  Source: string;
  Website?: string;
}

interface Props {
  cookbooks: Cookbook[];
}

const ITEMS_PER_PAGE = 50;

function toTitleCase(str: string) {
  return str.toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
}

function getDecade(date: string) {
  const year = parseInt(date);
  if (isNaN(year)) return '';
  return Math.floor(year / 10) * 10 + 's';
}

export default function CookbookInventory({ cookbooks }: Props) {
  const [search, setSearch] = useState('');
  const [community, setCommunity] = useState('');
  const [county, setCounty] = useState('');
  const [organization, setOrganization] = useState('');
  const [source, setSource] = useState('');
  const [decade, setDecade] = useState('');
  const [sort, setSort] = useState('date-desc');
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState<Cookbook | null>(null);

  const communities = useMemo(() => [...new Set(cookbooks.map((b) => b.Community))].sort(), [cookbooks]);
  const counties = useMemo(() => [...new Set(cookbooks.map((b) => b.County).filter(Boolean))].sort(), [cookbooks]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    let result = cookbooks.filter((b) => {
      const org = b['Organization (Church, Civic/Club, Business/Professional)'] || '';

      if (q && ![b.Title, b.Author, b.Community, b.County, org].some((v) => v?.toLowerCase().includes(q))) return false;
      if (community && b.Community !== community) return false;
      if (county && b.County !== county) return false;
      if (source && b.Source !== source) return false;
      if (decade && getDecade(b.Date) !== decade) return false;
      if (organization) {
        if (organization === 'Extension') {
          if (!org.toLowerCase().includes('extension')) return false;
        } else if (org !== organization) return false;
      }
      return true;
    });

    const [field, dir] = sort.split('-');
    result = [...result].sort((a, b) => {
      let av: string | number = '';
      let bv: string | number = '';
      if (field === 'date') {
        av = parseInt(a.Date) || 0;
        bv = parseInt(b.Date) || 0;
        return dir === 'asc' ? (av as number) - (bv as number) : (bv as number) - (av as number);
      }
      av = (a.Title || '').toLowerCase();
      bv = (b.Title || '').toLowerCase();
      return dir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
    });

    return result;
  }, [cookbooks, search, community, county, organization, source, decade, sort]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const pageData = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const hasFilters = search || community || county || organization || source || decade;

  function clearFilters() {
    setSearch('');
    setCommunity('');
    setCounty('');
    setOrganization('');
    setSource('');
    setDecade('');
    setPage(1);
  }

  function handleFilterChange(setter: (v: string) => void) {
    return (e: React.ChangeEvent<HTMLSelectElement>) => {
      setter(e.target.value);
      setPage(1);
    };
  }

  function pageNumbers() {
    if (totalPages <= 1) return [];
    const max = 5;
    let start = Math.max(1, page - Math.floor(max / 2));
    let end = Math.min(totalPages, start + max - 1);
    if (end - start + 1 < max) start = Math.max(1, end - max + 1);
    const nums: (number | '...')[] = [];
    if (start > 1) { nums.push(1); if (start > 2) nums.push('...'); }
    for (let i = start; i <= end; i++) nums.push(i);
    if (end < totalPages) { if (end < totalPages - 1) nums.push('...'); nums.push(totalPages); }
    return nums;
  }

  return (
    <section className={styles.inventory}>
      <h2>Cookbook Inventory List</h2>

      <div className={styles.introText}>
        <p>
          What follows is a master list of community cookbooks published in Mississippi before 1970. It is
          incomplete. I&apos;ve excluded some items that I have been unable to date (currently no more than a
          dozen titles). For some of the cookbooks listed, the dates are estimated. However, I have only
          included cookbooks where I have been able to narrow the estimated date of publication to within a
          few years. A few of the cookbooks I have not personally viewed. Most I have.
        </p>
        <p>
          If a cookbook is owned by Southern Miss, I&apos;ve listed it as USM (even if other locations have
          it). If Southern Miss has made it available online, it is listed as USM Online and linked to the
          source. Other large collections at Mississippi institutions are listed by abbreviations: UM is the
          University of Mississippi, MSU is Mississippi State University, and MDAH is the Mississippi
          Department of Archives and History. For all other institutions, I have provided a name. In some
          cases, it is possible I have listed a location that does not own the exact copy listed, but
          generally I have tried to list the location that owns the catalogued edition. If the location is
          listed as &ldquo;Unknown&rdquo;, I have credible information that the cookbook exists (usually
          newspaper references) but have not located a copy.
        </p>
        <p>
          If you know of a cookbook that should be included, please contact me at{' '}
          <a href="mailto:mscommunitycookbook@gmail.com">mscommunitycookbook@gmail.com</a>. If you have a
          copy of a cookbook that is not listed or is listed as &ldquo;Unknown,&rdquo; please contact me. I
          would love to see it.
        </p>
      </div>

      {/* Search + Filters */}
      <div className={styles.controls}>
        <div className={styles.searchWrap}>
          <span className={styles.searchIcon}></span>
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search cookbooks by title, author, community, county, or organization..."
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filters}>
          <select value={community} onChange={handleFilterChange(setCommunity)} className={community ? styles.active : ''}>
            <option value="">All Communities</option>
            {communities.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>

          <select value={county} onChange={handleFilterChange(setCounty)} className={county ? styles.active : ''}>
            <option value="">All Counties</option>
            {counties.map((c) => <option key={c} value={c as string}>{c}</option>)}
          </select>

          <select value={organization} onChange={handleFilterChange(setOrganization)} className={organization ? styles.active : ''}>
            <option value="">All Organizations</option>
            <option value="Church">Church</option>
            <option value="Civic/Club">Civic/Club</option>
            <option value="Business/Professional">Business/Professional</option>
            <option value="Extension">Extension</option>
          </select>

          <select value={source} onChange={handleFilterChange(setSource)} className={source ? styles.active : ''}>
            <option value="">All Sources</option>
            <option value="USM">USM</option>
            <option value="USM Online">USM Online</option>
            <option value="UM">UM</option>
            <option value="MSU">MSU</option>
            <option value="MDAH">MDAH</option>
            <option value="Unknown">Unknown</option>
          </select>

          <select value={decade} onChange={handleFilterChange(setDecade)} className={decade ? styles.active : ''}>
            <option value="">All Decades</option>
            {['1890s', '1900s', '1910s', '1920s', '1930s', '1940s', '1950s', '1960s'].map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results bar */}
      <div className={styles.resultsBar}>
        <span>
          {hasFilters
            ? `Showing ${filtered.length} filtered results`
            : `Showing all ${filtered.length} cookbooks`}
        </span>
        {hasFilters && (
          <button onClick={clearFilters} className={styles.clearBtn}>Clear All Filters</button>
        )}
      </div>

      {/* Sort */}
      <div className={styles.sortRow}>
        <label htmlFor="sort">Sort by:</label>
        <select id="sort" value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }}>
          <option value="date-desc">Date (Newest First)</option>
          <option value="date-asc">Date (Oldest First)</option>
        </select>
      </div>

      {/* Cookbook list */}
      <div className={styles.list}>
        {pageData.map((book, i) => {
          const org = book['Organization (Church, Civic/Club, Business/Professional)'] || '';
          const typeClass = org.toLowerCase().replace(/[^a-z]/g, '');
          return (
            <div key={i} className={`${styles.item} ${styles[`item_${typeClass}`] || ''}`} onClick={() => setModal(book)}>
              <div className={styles.itemMain}>
                <div className={styles.title}>{book.Title}</div>
                <div className={styles.author}>{book.Author}</div>
              </div>

              <div className={styles.yearBadge}>{book.Date || 'Unknown'}</div>

              <div className={styles.itemMeta}>
                <span className={styles.communityBadge}>{book.Community}</span>
                {book.County && <span className={styles.countyBadge}>{book.County} County</span>}
                <span className={`${styles.typeBadge} ${styles[typeClass] || ''}`}>{toTitleCase(org)}</span>
                {book.Source === 'USM Online' && book.Website ? (
                  <a href={book.Website} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className={`${styles.sourceTag} ${styles.usmOnline}`}>
                    USM Online 🔗
                  </a>
                ) : book.Source === 'Unknown' ? (
                  <span className={`${styles.sourceTag} ${styles.unknown}`}>Unknown</span>
                ) : (
                  <span className={styles.sourceTag}>{book.Source}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <span>
            Showing {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} cookbooks
          </span>
          <div className={styles.paginationControls}>
            <button onClick={() => setPage((p) => p - 1)} disabled={page === 1} className={styles.pageBtn}>← Previous</button>
            <div className={styles.pageNums}>
              {pageNumbers().map((n, i) =>
                n === '...' ? (
                  <span key={i} className={styles.ellipsis}>...</span>
                ) : (
                  <button
                    key={i}
                    onClick={() => setPage(n as number)}
                    className={`${styles.pageNum} ${n === page ? styles.pageNumActive : ''}`}
                  >
                    {n}
                  </button>
                )
              )}
            </div>
            <button onClick={() => setPage((p) => p + 1)} disabled={page === totalPages} className={styles.pageBtn}>Next →</button>
          </div>
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className={styles.modalBackdrop} onClick={() => setModal(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setModal(null)}>×</button>

            <h2 className={styles.modalTitle}>{modal.Title}</h2>
            <p className={styles.modalAuthor}>{modal.Author}</p>

            <div className={styles.modalBadges}>
              <span className={styles.yearBadge}>{modal.Date || 'Unknown'}</span>
              <span className={styles.communityBadge}>{modal.Community}</span>
              {modal.County && <span className={styles.countyBadge}>{modal.County} County</span>}
              <span className={`${styles.typeBadge} ${styles[modal['Organization (Church, Civic/Club, Business/Professional)'].toLowerCase().replace(/[^a-z]/g, '')] || ''}`}>
                {toTitleCase(modal['Organization (Church, Civic/Club, Business/Professional)'])}
              </span>
            </div>

            <div className={styles.modalDetail}>
              <span>Source:</span>
              <span>{modal.Source}</span>
            </div>

            {modal.Website && (
              <div className={styles.modalLink}>
                <a href={modal.Website} target="_blank" rel="noopener noreferrer" className={`${styles.sourceTag} ${styles.usmOnline}`}>
                  View Online 🔗
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
