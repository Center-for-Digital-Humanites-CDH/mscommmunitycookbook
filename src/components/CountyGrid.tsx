'use client';

import { useState, useMemo } from 'react';
import styles from './CountyGrid.module.css';

interface County {
  name: string;
  count: number;
}

const ITEMS_PER_PAGE = 12;

type Filter = 'all' | 'high' | 'medium' | 'low' | 'none';

// Production levels and wording, set from the admin Pages tab
export interface CountyLevels {
  high: number;
  medium: number;
  highLabel: string;
  mediumLabel: string;
  lowLabel: string;
  noneLabel: string;
  heading: string;
  intro: string;
}

export default function CountyGrid({ counties, levels }: { counties: County[]; levels: CountyLevels }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [page, setPage] = useState(1);

  const { high, medium } = levels;
  const getTier = useMemo(() => (count: number): Filter => {
    if (count >= high) return 'high';
    if (count >= medium) return 'medium';
    if (count >= 1) return 'low';
    return 'none';
  }, [high, medium]);

  const none = useMemo(() => counties.filter((c) => c.count === 0).length, [counties]);
  const range = (from: number, to: number) => (from === to ? `${from}` : `${from}–${to}`);

  const filterLabels: { key: Filter; label: string }[] = [
    { key: 'all',    label: `All Counties (${counties.length})` },
    { key: 'high',   label: `${levels.highLabel} (${high}+)` },
    { key: 'medium', label: `${levels.mediumLabel} (${range(medium, high - 1)})` },
    { key: 'low',    label: `${levels.lowLabel} (${range(1, medium - 1)})` },
    { key: 'none',   label: `${levels.noneLabel} (${none})` },
  ];

  const filtered = useMemo(() => {
    let result = counties;
    if (search) {
      result = result.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));
    } else if (filter !== 'all') {
      result = result.filter((c) => getTier(c.count) === filter);
    }
    return result;
  }, [counties, search, filter, getTier]);

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
      <h4 className={styles.heading}>{levels.heading}</h4>
      <p className={styles.intro}>{levels.intro}</p>

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
