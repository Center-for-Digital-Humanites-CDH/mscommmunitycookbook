'use client';

import { useState, useMemo } from 'react';
import styles from './CountyGrid.module.css';

interface County {
  name: string;
  count: number;
}

const COUNTIES: County[] = [
  { name: 'Hinds County', count: 40 },
  { name: 'Forrest County', count: 23 },
  { name: 'Washington County', count: 17 },
  { name: 'Jones County', count: 12 },
  { name: 'Bolivar County', count: 12 },
  { name: 'Jackson County', count: 9 },
  { name: 'Leflore County', count: 9 },
  { name: 'Lauderdale County', count: 8 },
  { name: 'Lincoln County', count: 8 },
  { name: 'Sunflower County', count: 8 },
  { name: 'Yazoo County', count: 8 },
  { name: 'Coahoma County', count: 7 },
  { name: 'Copiah County', count: 7 },
  { name: 'Oktibbeha County', count: 7 },
  { name: 'Pike County', count: 7 },
  { name: 'Adams County', count: 6 },
  { name: 'Harrison County', count: 6 },
  { name: 'Lafayette County', count: 6 },
  { name: 'Lee County', count: 6 },
  { name: 'Alcorn County', count: 5 },
  { name: 'Calhoun County', count: 5 },
  { name: 'Holmes County', count: 5 },
  { name: 'Lowndes County', count: 5 },
  { name: 'Marion County', count: 5 },
  { name: 'Monroe County', count: 5 },
  { name: 'Tallahatchie County', count: 5 },
  { name: 'Warren County', count: 5 },
  { name: 'Yalobusha County', count: 5 },
  { name: 'Leake County', count: 4 },
  { name: 'Rankin County', count: 4 },
  { name: 'Tate County', count: 4 },
  { name: 'Wayne County', count: 4 },
  { name: 'Amite County', count: 3 },
  { name: 'Attala County', count: 3 },
  { name: 'Chickasaw County', count: 3 },
  { name: 'Claiborne County', count: 3 },
  { name: 'Lawrence County', count: 3 },
  { name: 'Neshoba County', count: 3 },
  { name: 'Newton County', count: 3 },
  { name: 'Panola County', count: 3 },
  { name: 'Pearl River County', count: 3 },
  { name: 'Prentiss County', count: 3 },
  { name: 'Tunica County', count: 3 },
  { name: 'Winston County', count: 3 },
  { name: 'Carroll County', count: 2 },
  { name: 'Clarke County', count: 2 },
  { name: 'Clay County', count: 2 },
  { name: 'George County', count: 2 },
  { name: 'Humphreys County', count: 2 },
  { name: 'Jefferson County', count: 2 },
  { name: 'Lamar County', count: 2 },
  { name: 'Marshall County', count: 2 },
  { name: 'Montgomery County', count: 2 },
  { name: 'Noxubee County', count: 2 },
  { name: 'Pontotoc County', count: 2 },
  { name: 'Quitman County', count: 2 },
  { name: 'Simpson County', count: 2 },
  { name: 'Covington County', count: 1 },
  { name: 'DeSoto County', count: 1 },
  { name: 'Franklin County', count: 1 },
  { name: 'Hancock County', count: 1 },
  { name: 'Issaquena County', count: 1 },
  { name: 'Jasper County', count: 1 },
  { name: 'Kemper County', count: 1 },
  { name: 'Madison County', count: 1 },
  { name: 'Perry County', count: 1 },
  { name: 'Scott County', count: 1 },
  { name: 'Smith County', count: 1 },
  { name: 'Stone County', count: 1 },
  { name: 'Tippah County', count: 1 },
  { name: 'Union County', count: 1 },
  { name: 'Walthall County', count: 1 },
  { name: 'Wilkinson County', count: 1 },
  { name: 'Benton County', count: 0 },
  { name: 'Choctaw County', count: 0 },
  { name: 'Greene County', count: 0 },
  { name: 'Grenada County', count: 0 },
  { name: 'Itawamba County', count: 0 },
  { name: 'Jefferson Davis County', count: 0 },
  { name: 'Sharkey County', count: 0 },
  { name: 'Tishomingo County', count: 0 },
  { name: 'Webster County', count: 0 },
];

const ITEMS_PER_PAGE = 12;

type Filter = 'all' | 'high' | 'medium' | 'low' | 'none';

function getTier(count: number): string {
  if (count >= 10) return 'high';
  if (count >= 3) return 'medium';
  if (count >= 1) return 'low';
  return 'none';
}

const filterLabels: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All Counties (82)' },
  { key: 'high', label: 'High Production (10+)' },
  { key: 'medium', label: 'Medium Production (3–9)' },
  { key: 'low', label: 'Low Production (1–2)' },
  { key: 'none', label: 'No Cookbooks (9)' },
];

export default function CountyGrid() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let result = COUNTIES;
    if (search) {
      result = result.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));
    } else if (filter !== 'all') {
      result = result.filter((c) => {
        if (filter === 'high') return c.count >= 10;
        if (filter === 'medium') return c.count >= 3 && c.count <= 9;
        if (filter === 'low') return c.count >= 1 && c.count <= 2;
        if (filter === 'none') return c.count === 0;
        return true;
      });
    }
    return result;
  }, [search, filter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const pageData = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  function handleFilter(f: Filter) {
    setFilter(f);
    setSearch('');
    setPage(1);
  }

  function handleSearch(val: string) {
    setSearch(val);
    setPage(1);
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
            <button
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 1}
              className={styles.pageBtn}
            >
              ← Previous
            </button>
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
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page === totalPages}
              className={styles.pageBtn}
            >
              Next →
            </button>
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
                <span className={`${styles.badge} ${styles[`badge_${tier}`]}`}>
                  {county.count}
                </span>
              </div>
              {county.count === 0 && (
                <p className={styles.noneLabel}>No cookbooks recorded</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
