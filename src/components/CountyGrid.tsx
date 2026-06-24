'use client';

import { useState, useMemo } from 'react';
import styles from './CountyGrid.module.css';

interface County {
  name: string;
  count: number;
}

const ITEMS_PER_PAGE = 12;

type Filter = 'all' | 'high' | 'medium' | 'low' | 'none';

function getTier(count: number): Filter {
  if (count >= 10) return 'high';
  if (count >= 3) return 'medium';
  if (count >= 1) return 'low';
  return 'none';
}

export default function CountyGrid({ counties }: { counties: County[] }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [page, setPage] = useState(1);

  const high  = useMemo(() => counties.filter((c) => c.count >= 10).length, [counties]);
  const medium = useMemo(() => counties.filter((c) => c.count >= 3 && c.count <= 9).length, [counties]);
  const low   = useMemo(() => counties.filter((c) => c.count >= 1 && c.count <= 2).length, [counties]);
  const none  = useMemo(() => counties.filter((c) => c.count === 0).length, [counties]);

  const filterLabels: { key: Filter; label: string }[] = [
    { key: 'all',    label: `All Counties (${counties.length})` },
    { key: 'high',   label: `High Production (10+)` },
    { key: 'medium', label: `Medium Production (3–9)` },
    { key: 'low',    label: `Low Production (1–2)` },
    { key: 'none',   label: `No Cookbooks (${none})` },
  ];

  const filtered = useMemo(() => {
    let result = counties;
    if (search) {
      result = result.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));
    } else if (filter !== 'all') {
      result = result.filter((c) => getTier(c.count) === filter);
    }
    return result;
  }, [counties, search, filter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const pageData = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  function handleFilter(f: Filter) { setFilter(f); setSearch(''); setPage(1); }
  function handleSearch(val: string) { setSearch(val); setPage(1); }

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

  const start = filtered.length === 0 ? 0 : (page - 1) * ITEMS_PER_PAGE + 1;
  const end = Math.min(page * ITEMS_PER_PAGE, filtered.length);

  return (
    <div className={styles.root}>
      <h4 className={styles.heading}>Complete County Inventory</h4>
      <p className={styles.intro}>
        Explore cookbook production across all 82 Mississippi counties. Use the search to find specific
        counties, or click the category buttons to filter by production level.
      </p>

      <div className={styles.filterRow}>
        {filterLabels.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => handleFilter(key)}
            className={`${styles.filterBtn} ${filter === key && !search ? styles.filterActive : ''}`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className={styles.searchWrap}>
        <span className={styles.searchIcon}>🔎</span>
        <input
          type="text"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search for a county..."
          className={styles.searchInput}
        />
      </div>

      <div className={styles.paginationBar}>
        <span className={styles.pageInfo}>
          {filtered.length === 0
            ? 'No counties found'
            : `Showing ${start}–${end} of ${filtered.length} counties`}
        </span>
        {totalPages > 1 && (
          <div className={styles.pageControls}>
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
        )}
      </div>

      <div className={styles.grid}>
        {pageData.map((county) => {
          const tier = getTier(county.count);
          return (
            <div key={county.name} className={`${styles.card} ${styles[tier]}`}>
              <div className={styles.cardHeader}>
                <h5 className={styles.cardName}>{county.name}</h5>
                <span className={`${styles.badge} ${styles[`badge_${tier}`]}`}>{county.count}</span>
              </div>
              {county.count === 0 && <p className={styles.noneLabel}>No cookbooks recorded</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
