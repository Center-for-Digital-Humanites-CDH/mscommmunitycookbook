import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import CountyGrid from '@/components/CountyGrid';
import { supabaseAdmin } from '@/lib/supabase';
import { getPageContent } from '@/lib/pageContent';
import styles from './page.module.css';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Culinary Landscapes — Mississippi Community Cookbook Project',
};

const MS_COUNTIES = [
  'Adams','Alcorn','Amite','Attala','Benton','Bolivar','Calhoun','Carroll',
  'Chickasaw','Choctaw','Claiborne','Clarke','Clay','Coahoma','Copiah',
  'Covington','DeSoto','Forrest','Franklin','George','Greene','Grenada',
  'Hancock','Harrison','Hinds','Holmes','Humphreys','Issaquena','Itawamba',
  'Jackson','Jasper','Jefferson','Jefferson Davis','Jones','Kemper','Lafayette',
  'Lamar','Lauderdale','Lawrence','Leake','Lee','Leflore','Lincoln','Lowndes',
  'Madison','Marion','Marshall','Monroe','Montgomery','Neshoba','Newton',
  'Noxubee','Oktibbeha','Panola','Pearl River','Perry','Pike','Pontotoc',
  'Prentiss','Quitman','Rankin','Scott','Sharkey','Simpson','Smith','Stone',
  'Sunflower','Tallahatchie','Tate','Tippah','Tishomingo','Tunica','Union',
  'Walthall','Warren','Washington','Wayne','Webster','Wilkinson','Winston',
  'Yalobusha','Yazoo',
];

function num(value: string, fallback: number) {
  const n = parseInt(value);
  return isNaN(n) ? fallback : n;
}

async function getLandscapeData(c: Record<string, string>) {
  const db = supabaseAdmin();
  const { data: cookbookRows } = await db.from('cookbooks').select('date, organization, county');
  const cookbooks = cookbookRows || [];

  // ── Publishers (numbers entered in the admin) ──
  const publisherLocal = num(c['publishers.local'], 0);
  const publisherNational = num(c['publishers.national'], 0);
  const publisherTotal = publisherLocal + publisherNational;
  const publisherLocalPct = publisherTotal > 0 ? ((publisherLocal / publisherTotal) * 100).toFixed(1) : '0.0';
  const publisherNationalPct = publisherTotal > 0 ? ((publisherNational / publisherTotal) * 100).toFixed(1) : '0.0';

  // ── Decades ──
  const firstDecade = Math.floor(num(c['decades.first'], 1890) / 10) * 10;
  const lastDecade = Math.max(firstDecade, Math.floor(num(c['decades.last'], 1960) / 10) * 10);
  const decadeCounts: Record<string, number> = {};
  cookbooks.forEach((cb) => {
    const year = parseInt(cb.date);
    if (!isNaN(year) && year >= firstDecade && year < lastDecade + 10) {
      const decade = `${Math.floor(year / 10) * 10}s`;
      decadeCounts[decade] = (decadeCounts[decade] || 0) + 1;
    }
  });
  const decades = [];
  for (let d = firstDecade; d <= lastDecade; d += 10) {
    decades.push({ decade: `${d}s`, count: decadeCounts[`${d}s`] || 0 });
  }
  const totalDecades = decades.reduce((s, d) => s + d.count, 0);

  // ── Organizations ──
  const orgCounts: Record<string, number> = {};
  cookbooks.forEach((cb) => {
    if (cb.organization) orgCounts[cb.organization] = (orgCounts[cb.organization] || 0) + 1;
  });
  const rawOrgs = [
    { label: c['orgs.civic'], key: 'Civic/Club', variant: 'civic' },
    { label: c['orgs.church'], key: 'Church', variant: 'church' },
    { label: c['orgs.business'], key: 'Business/Professional', variant: 'business' },
    { label: c['orgs.extension'], key: 'Extension', variant: 'extension' },
  ]
    .map((o) => ({ ...o, count: orgCounts[o.key] || 0 }))
    .filter((o) => o.count > 0)
    .sort((a, b) => b.count - a.count);
  const totalOrgs = rawOrgs.reduce((s, o) => s + o.count, 0);
  const maxOrg = rawOrgs[0]?.count || 1;
  const orgs = rawOrgs.map((o) => ({
    label: o.label,
    count: o.count,
    variant: o.variant,
    pct: `${((o.count / totalOrgs) * 100).toFixed(1)}%`,
    barWidth: `${(o.count / maxOrg) * 100}%`,
  }));

  // ── Counties ──
  const countyCounts: Record<string, number> = {};
  cookbooks.forEach((cb) => {
    const raw = cb.county?.trim();
    if (!raw) return;
    const name = raw.replace(/\s+county$/i, '');
    countyCounts[name] = (countyCounts[name] || 0) + 1;
  });

  // Build full 82-county list — DB counts merged with complete MS county list
  const allCounties = MS_COUNTIES
    .map((name) => ({ name: `${name} County`, count: countyCounts[name] || 0 }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

  const countyEntries = Object.entries(countyCounts).sort((a, b) => b[1] - a[1]);
  const topCounties = countyEntries.slice(0, 10).map(([name, count]) => ({
    name: `${name} County`,
    count,
  }));
  const maxCounty = topCounties[0]?.count || 1;

  const highFrom = Math.max(2, num(c['counties.high'], 10));
  const mediumFrom = Math.min(highFrom - 1, Math.max(2, num(c['counties.medium'], 3)));
  const high = allCounties.filter((cc) => cc.count >= highFrom).length;
  const medium = allCounties.filter((cc) => cc.count >= mediumFrom && cc.count < highFrom).length;
  const low = allCounties.filter((cc) => cc.count >= 1 && cc.count < mediumFrom).length;
  const none = allCounties.filter((cc) => cc.count === 0).length;
  const totalCounty = countyEntries.reduce((s, [, v]) => s + v, 0);
  const countiesWithData = countyEntries.length;

  return {
    decades, totalDecades, orgs, totalOrgs, topCounties, maxCounty,
    high, medium, low, none, highFrom, mediumFrom, totalCounty, countiesWithData, allCounties,
    publisherLocal, publisherNational, publisherTotal, publisherLocalPct, publisherNationalPct,
  };
}

const range = (from: number, to: number) => (from === to ? `${from}` : `${from}–${to}`);

export default async function CulinaryLandscapesPage() {
  const c = await getPageContent('culinary-landscapes');
  const {
    decades, totalDecades, orgs, totalOrgs, topCounties, maxCounty,
    high, medium, low, none, highFrom, mediumFrom, totalCounty, countiesWithData, allCounties,
    publisherLocal, publisherNational, publisherTotal, publisherLocalPct, publisherNationalPct,
  } = await getLandscapeData(c);
  const maxDecade = Math.max(...decades.map((d) => d.count));

  return (
    <>
      <PageHero
        title={c['hero.title']}
        backgroundImage={c['hero.image']}
        backgroundPosition={c['hero.position']}
      />

      <div className={styles.wrapper}>

        {/* ── Database Overview ── */}
        <section className={styles.section}>
          <h2 className={styles.h2}>{c['overview.heading']}</h2>
          <div className={styles.rich} dangerouslySetInnerHTML={{ __html: c['overview.text'] }} />
          {c['overview.note'] && (
            <p className={styles.note}>
              <em>{c['overview.note']}</em>
            </p>
          )}
        </section>

        {/* ── Cookbooks by Decade ── */}
        <section className={styles.section}>
          <h3 className={styles.h3}>{c['decades.heading']}</h3>
          <div className={styles.rich} dangerouslySetInnerHTML={{ __html: c['decades.text'] }} />

          <div className={styles.chartCard}>
            <div className={styles.chartCardHeader}>
              <span className={styles.chartLabel}>{c['decades.chartTitle']}</span>
              <span className={styles.chartMeta}>Total: {totalDecades} cookbooks</span>
            </div>
            <div className={styles.decadeChart}>
              <div className={styles.guideLines} aria-hidden>
                {[75, 50, 25].map((pct) => (
                  <div key={pct} className={styles.guideLine} style={{ bottom: `${pct}%` }}>
                    <span className={styles.guideValue}>{Math.round((pct / 100) * maxDecade)}</span>
                  </div>
                ))}
              </div>
              <div className={styles.bars}>
                {decades.map((d) => (
                  <div key={d.decade} className={styles.barCol}>
                    <span className={styles.barCount}>{d.count}</span>
                    <div className={styles.barTrack}>
                      <div
                        className={styles.bar}
                        style={{ height: `${maxDecade > 0 ? (d.count / maxDecade) * 100 : 0}%` }}
                      />
                    </div>
                    <span className={styles.barLabel}>{d.decade}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Publisher Types ── */}
        <section className={styles.section}>
          <h3 className={styles.h3}>{c['publishers.heading']}</h3>
          <div className={styles.rich} dangerouslySetInnerHTML={{ __html: c['publishers.text'] }} />

          <div className={styles.chartCard}>
            <div className={styles.chartCardHeader}>
              <span className={styles.chartLabel}>{c['publishers.chartTitle']}</span>
              <span className={styles.chartMeta}>{publisherTotal} dated cookbooks</span>
            </div>
            <div className={styles.pieLayout}>
              <div
                className={styles.donut}
                // The split follows the numbers; the stylesheet's fixed angle only matched the original 146 / 130
                style={{ background: `conic-gradient(var(--primary-color) 0% ${publisherLocalPct}%, #3d5a8a ${publisherLocalPct}% 100%)` }}
              >
                <div className={styles.donutCenter}>
                  <span className={styles.donutNum}>{publisherTotal}</span>
                  <span className={styles.donutSub}>cookbooks</span>
                </div>
              </div>
              <div className={styles.pieLegend}>
                <div className={`${styles.legendCard} ${styles.legendCardLocal}`}>
                  <div className={styles.legendSwatch} />
                  <div className={styles.legendInfo}>
                    <span className={styles.legendTitle}>{c['publishers.localLabel']}</span>
                    <span className={styles.legendCount}>{publisherLocal}</span>
                    <span className={styles.legendPct}>{publisherLocalPct}%</span>
                  </div>
                </div>
                <div className={`${styles.legendCard} ${styles.legendCardNational}`}>
                  <div className={`${styles.legendSwatch} ${styles.legendSwatchNational}`} />
                  <div className={styles.legendInfo}>
                    <span className={styles.legendTitle}>{c['publishers.nationalLabel']}</span>
                    <span className={styles.legendCount}>{publisherNational}</span>
                    <span className={styles.legendPct}>{publisherNationalPct}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Organizations ── */}
        <section className={styles.section}>
          <h3 className={styles.h3}>{c['orgs.heading']}</h3>
          <div className={styles.rich} dangerouslySetInnerHTML={{ __html: c['orgs.text'] }} />

          <div className={styles.chartCard}>
            <div className={styles.chartCardHeader}>
              <span className={styles.chartLabel}>{c['orgs.chartTitle']}</span>
              <span className={styles.chartMeta}>{totalOrgs} classified cookbooks</span>
            </div>
            <div className={styles.orgCards}>
              {orgs.map((org) => (
                <div key={org.variant} className={`${styles.orgCard} ${styles[`orgCard_${org.variant}`]}`}>
                  <div className={styles.orgAccent} />
                  <div className={styles.orgBody}>
                    <div className={styles.orgTop}>
                      <span className={styles.orgLabel}>{org.label}</span>
                      <div className={styles.orgStats}>
                        <span className={styles.orgNum}>{org.count}</span>
                        <span className={styles.orgPct}>{org.pct}</span>
                      </div>
                    </div>
                    <div className={styles.orgTrack}>
                      <div
                        className={`${styles.orgFill} ${styles[`orgFill_${org.variant}`]}`}
                        style={{ width: org.barWidth }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Counties ── */}
        <section className={styles.section}>
          <h3 className={styles.h3}>{c['counties.heading']}</h3>
          <div className={styles.rich} dangerouslySetInnerHTML={{ __html: c['counties.text'] }} />

          <div className={styles.statGrid}>
            <div className={`${styles.statCard} ${styles.statHigh}`}>
              <span className={styles.statNum}>{high}</span>
              <span className={styles.statLabel}>{c['counties.highLabel']}</span>
              <span className={styles.statSub}>{highFrom}+ cookbooks</span>
            </div>
            <div className={`${styles.statCard} ${styles.statMedium}`}>
              <span className={styles.statNum}>{medium}</span>
              <span className={styles.statLabel}>{c['counties.mediumLabel']}</span>
              <span className={styles.statSub}>{range(mediumFrom, highFrom - 1)} cookbooks</span>
            </div>
            <div className={`${styles.statCard} ${styles.statLow}`}>
              <span className={styles.statNum}>{low}</span>
              <span className={styles.statLabel}>{c['counties.lowLabel']}</span>
              <span className={styles.statSub}>{range(1, mediumFrom - 1)} cookbooks</span>
            </div>
            <div className={`${styles.statCard} ${styles.statNone}`}>
              <span className={styles.statNum}>{none}</span>
              <span className={styles.statLabel}>{c['counties.noneLabel']}</span>
              <span className={styles.statSub}>recorded</span>
            </div>
          </div>

          <div className={styles.chartCard}>
            <div className={styles.chartCardHeader}>
              <span className={styles.chartLabel}>{c['counties.topTitle']}</span>
              <span className={styles.chartMeta}>{totalCounty} total · {countiesWithData} of 82 counties</span>
            </div>
            <div className={styles.countyList}>
              {topCounties.map((cc, i) => (
                <div key={cc.name} className={styles.countyRow}>
                  <span className={styles.countyRank}>{i + 1}</span>
                  <span className={styles.countyName}>{cc.name}</span>
                  <div className={styles.countyTrack}>
                    <div
                      className={styles.countyFill}
                      style={{ width: `${(cc.count / maxCounty) * 100}%` }}
                    />
                  </div>
                  <span className={styles.countyCount}>{cc.count}</span>
                </div>
              ))}
            </div>
            {c['counties.topNote'] && <p className={styles.chartNote}><em>{c['counties.topNote']}</em></p>}
          </div>

          <CountyGrid
            counties={allCounties}
            levels={{
              high: highFrom,
              medium: mediumFrom,
              highLabel: c['counties.highLabel'],
              mediumLabel: c['counties.mediumLabel'],
              lowLabel: c['counties.lowLabel'],
              noneLabel: c['counties.noneLabel'],
              heading: c['counties.gridHeading'],
              intro: c['counties.gridIntro'],
            }}
          />
        </section>

        {/* ── Maps ── */}
        <section className={styles.section}>
          <h2 className={styles.h2}>{c['maps.heading']}</h2>
          <div className={styles.rich} dangerouslySetInnerHTML={{ __html: c['maps.text'] }} />

          <h3 className={styles.h3sub}>{c['maps.firstTitle']}</h3>
          <div className={styles.mapWrap}>
            <iframe
              src={c['maps.firstUrl']}
              width="100%"
              height="900"
              style={{ border: 0, display: 'block' }}
              allowFullScreen
            />
          </div>

          <hr className={styles.divider} />
          <h3 className={styles.h3sub}>{c['maps.secondTitle']}</h3>
          <div className={styles.rich} dangerouslySetInnerHTML={{ __html: c['maps.secondText'] }} />
          <div className={styles.mapWrap}>
            <iframe
              src={c['maps.secondUrl']}
              width="100%"
              height="900"
              style={{ border: 0, display: 'block' }}
              allowFullScreen
            />
          </div>
        </section>

      </div>
    </>
  );
}
