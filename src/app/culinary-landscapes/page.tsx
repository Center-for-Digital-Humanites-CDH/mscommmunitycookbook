import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import CountyGrid from '@/components/CountyGrid';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Culinary Landscapes — Mississippi Community Cookbook Project',
};

const decades = [
  { decade: '1890s', count: 1 },
  { decade: '1900s', count: 10 },
  { decade: '1910s', count: 14 },
  { decade: '1920s', count: 20 },
  { decade: '1930s', count: 9 },
  { decade: '1940s', count: 35 },
  { decade: '1950s', count: 97 },
  { decade: '1960s', count: 148 },
];

const maxCount = Math.max(...decades.map((d) => d.count));

const orgs = [
  { label: 'Civic & Club Organizations', count: 170, pct: '49.7%', barWidth: '100%', variant: 'civic' },
  { label: 'Church Organizations', count: 154, pct: '45.0%', barWidth: '90.6%', variant: 'church' },
  { label: 'Business & Professional', count: 18, pct: '5.3%', barWidth: '10.6%', variant: 'business' },
];

const topCounties = [
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
];

export default function CulinaryLandscapesPage() {
  return (
    <>
      <PageHero
        title="Culinary Landscapes"
        backgroundImage="/images/landscapes-bg.jpeg"
        backgroundPosition="center 10%"
      />

      <div className={styles.wrapper}>

        {/* ── Database Overview ── */}
        <section className={styles.section}>
          <h2 className={styles.h2}>Database Overview</h2>
          <p className={styles.para}>
            The following analysis is drawn from a database of approximately 350 Mississippi community cookbooks
            that were published before 1970. This database includes cookbooks that I have collected (now part of
            The University of Southern Mississippi&apos;s cookbook collection), cookbooks preserved by libraries,
            and, in a few cases, cookbooks that I know about from newspaper coverage that were published but may
            no longer exist. Where verifiable information on the descriptive category (such as the organization
            that published the cookbook) was not available, I&apos;ve excluded it from my statistical profile so
            the number of cookbooks used for each of these profiles differs.
          </p>
          <p className={styles.note}>
            <em>
              The Mississippi Community Cookbook Project is an ongoing project. All the information provided is
              subject to revision.
            </em>
          </p>
        </section>

        {/* ── Cookbooks by Decade ── */}
        <section className={styles.section}>
          <h3 className={styles.h3}>Cookbooks by Decade</h3>
          <p className={styles.para}>
            The number of cookbooks published in Mississippi increased decade by decade. The first cookbook
            published in the state was the <em>Spinning-Wheel Cook-Book of Old Southern Recipes</em> published
            by the Spinning Wheel Club in Woodville, Mississippi, in 1899. (The cookbook was preserved when it
            was reprinted in 1939.) It was the only community cookbook published before 1900. However, the numbers
            grew steadily and in the 1960s over 148 cookbooks were published.
          </p>
          <p className={styles.para}>
            The authors of these cookbooks often did not date their cookbooks, presumably hoping that these
            cookbooks would be viewed as timeless and could be sold for years. Even the rise of national
            publishers after World War II did not lead to the regular dating of cookbooks. Just over 160 of the
            cookbooks included in the following chart included a printed date.
          </p>
          <p className={styles.para}>
            Previous studies have dated the cookbooks based on their appearance and, especially for nationally
            produced cookbooks, this technique is not without merit. However, given the importance of
            demonstrating change over time for this study, I researched undated cookbooks. Using contributors&apos;
            names, advertisers, and newspaper references I have dated most of these cookbooks or, at least, have
            narrowed the possible date so that I can be fairly certain of the decade when it was produced.
            Nonetheless, the dates below are in some cases estimates and are subject to revision.
          </p>

          <div className={styles.chartCard}>
            <div className={styles.chartCardHeader}>
              <span className={styles.chartLabel}>Cookbooks by Decade</span>
              <span className={styles.chartMeta}>Total: 342 cookbooks</span>
            </div>
            <div className={styles.decadeChart}>
              {/* Horizontal guide lines */}
              <div className={styles.guideLines} aria-hidden>
                {[75, 50, 25].map((pct) => (
                  <div key={pct} className={styles.guideLine} style={{ bottom: `${pct}%` }}>
                    <span className={styles.guideValue}>{Math.round((pct / 100) * maxCount)}</span>
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
                        style={{ height: `${(d.count / maxCount) * 100}%` }}
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
          <h3 className={styles.h3}>Publisher Types: Local versus National</h3>
          <p className={styles.para}>
            Anyone could create a community cookbook. The simplest, often presented as wedding presents, were
            handwritten cards bound with a ribbon or a metal ring. However, most were more substantial
            productions. Recipes were collected and organized, advertising was sold to pay for the cost of
            printing, and a hundred or more copies of the cookbook were printed and sold to raise funds for a
            charitable endeavor.
          </p>
          <p className={styles.para}>
            These cookbooks often did not include publication information. If the cookbook was printed locally,
            the publisher may have viewed the production as a &ldquo;print job&rdquo; rather than a book.
            National publishers, who first emerged at the turn of the twentieth century and rose to prominence in
            the postwar era, were also initially reluctant to list publication information fearing that it would
            diminish their local appeal. The following numbers represent both my best guess as to the publisher
            and recorded publishers.
          </p>

          <div className={styles.chartCard}>
            <div className={styles.chartCardHeader}>
              <span className={styles.chartLabel}>Publisher Distribution</span>
              <span className={styles.chartMeta}>276 dated cookbooks</span>
            </div>
            <div className={styles.pieLayout}>
              <div className={styles.donut}>
                <div className={styles.donutCenter}>
                  <span className={styles.donutNum}>276</span>
                  <span className={styles.donutSub}>cookbooks</span>
                </div>
              </div>
              <div className={styles.pieLegend}>
                <div className={`${styles.legendCard} ${styles.legendCardLocal}`}>
                  <div className={styles.legendSwatch} />
                  <div className={styles.legendInfo}>
                    <span className={styles.legendTitle}>Local Publishers</span>
                    <span className={styles.legendCount}>146</span>
                    <span className={styles.legendPct}>52.9%</span>
                  </div>
                </div>
                <div className={`${styles.legendCard} ${styles.legendCardNational}`}>
                  <div className={`${styles.legendSwatch} ${styles.legendSwatchNational}`} />
                  <div className={styles.legendInfo}>
                    <span className={styles.legendTitle}>National Publishers</span>
                    <span className={styles.legendCount}>130</span>
                    <span className={styles.legendPct}>47.1%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Organizations ── */}
        <section className={styles.section}>
          <h3 className={styles.h3}>Organizations That Published Cookbooks</h3>
          <p className={styles.para}>
            Some cookbooks were created to forge tighter bonds with a club or community, but most were created to
            raise funds for charitable endeavors: remodeling a church rectory or repairing the church&apos;s
            roof, creating a cemetery, funding a school trip, raising money for textbooks or scholarships, or
            supporting local youth initiatives. The following chart classifies the groups that created these
            cookbooks as churches, civic organizations and clubs, extension service clubs, and professional
            organizations.
          </p>
          <p className={styles.para}>
            In the following chart, civic groups, such as a parent-teacher association, and clubs, such as garden
            or literary club, have been grouped together since their fundraising efforts were similar. Church
            cookbooks, produced by women&apos;s auxiliaries and missionary societies, generally raised funds for
            church improvements. Mississippi State University&apos;s Extension Services were responsible for
            dozens of community cookbooks. Most were prepared with the help of a county demonstration agent. For
            a historical overview of Mississippi&apos;s home demonstration program, visit the{' '}
            <a href="https://mississippiencyclopedia.org/entries/home-demonstration/" target="_blank" rel="noopener noreferrer">
              Mississippi Encyclopedia
            </a>
            . Finally, professional organizations and businesses also occasionally sponsored cookbooks. The
            professional organizations raised funds for their own activities while businesses used the cookbook to
            promote their services. These cookbooks were much more common in the 1970s and the decades that
            followed.
          </p>

          <div className={styles.chartCard}>
            <div className={styles.chartCardHeader}>
              <span className={styles.chartLabel}>Organization Types</span>
              <span className={styles.chartMeta}>342 classified cookbooks</span>
            </div>
            <div className={styles.orgCards}>
              {orgs.map((org) => (
                <div key={org.label} className={`${styles.orgCard} ${styles[`orgCard_${org.variant}`]}`}>
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
          <h3 className={styles.h3}>Cookbooks by County</h3>
          <p className={styles.para}>
            Mississippi spans 48,000 square miles divided into 82 counties. Many of these counties are rural and
            the county seat (or, in a few cases, seats) are generally the largest town. Yet communities small and
            large produced community cookbooks. As of this counting, all but nine of the 82 counties in
            Mississippi created at least one cookbook.
          </p>
          <p className={styles.para}>
            Hinds County, home of the state capital, Jackson, created the largest number followed by Forrest,
            Washington, Jones, and Bolivar. The large numbers from Forrest and Jones reflect in part a
            statistical bias, since Hattiesburg, the researcher&apos;s home, is located in Forrest and Jones is
            the adjacent community. However, these numbers also reflect the cultural and educational importance of
            the cities that produced the largest number of cookbooks. Forrest is home to The University of
            Southern Mississippi which, for years, housed a Home Economics Department. Jones is home to Laurel, a
            community with considerable lumber and oil wealth and numerous cultural institutions. The other
            counties with the highest counts, Washington and Bolivar Counties, were the site of prominent Delta
            cities. Disproportionate as some of these counts may be, collectively the largest five contributors
            account for less than a third of the total number of cookbooks.
          </p>

          {/* Summary stats */}
          <div className={styles.statGrid}>
            <div className={`${styles.statCard} ${styles.statHigh}`}>
              <span className={styles.statNum}>5</span>
              <span className={styles.statLabel}>High Production</span>
              <span className={styles.statSub}>10+ cookbooks</span>
            </div>
            <div className={`${styles.statCard} ${styles.statMedium}`}>
              <span className={styles.statNum}>39</span>
              <span className={styles.statLabel}>Medium Production</span>
              <span className={styles.statSub}>3–9 cookbooks</span>
            </div>
            <div className={`${styles.statCard} ${styles.statLow}`}>
              <span className={styles.statNum}>29</span>
              <span className={styles.statLabel}>Low Production</span>
              <span className={styles.statSub}>1–2 cookbooks</span>
            </div>
            <div className={`${styles.statCard} ${styles.statNone}`}>
              <span className={styles.statNum}>9</span>
              <span className={styles.statLabel}>No Cookbooks</span>
              <span className={styles.statSub}>recorded</span>
            </div>
          </div>

          {/* Top 10 */}
          <div className={styles.chartCard}>
            <div className={styles.chartCardHeader}>
              <span className={styles.chartLabel}>Top 10 Counties</span>
              <span className={styles.chartMeta}>342 total · 73 of 82 counties</span>
            </div>
            <div className={styles.countyList}>
              {topCounties.map((c, i) => (
                <div key={c.name} className={styles.countyRow}>
                  <span className={styles.countyRank}>{i + 1}</span>
                  <span className={styles.countyName}>{c.name}</span>
                  <div className={styles.countyTrack}>
                    <div
                      className={styles.countyFill}
                      style={{ width: `${(c.count / 40) * 100}%` }}
                    />
                  </div>
                  <span className={styles.countyCount}>{c.count}</span>
                </div>
              ))}
            </div>
            <p className={styles.chartNote}><em>Future updates will include additional demographic information and maps.</em></p>
          </div>

          <CountyGrid />
        </section>

        {/* ── Maps ── */}
        <section className={styles.section}>
          <h2 className={styles.h2}>Cookbook Map</h2>
          <p className={styles.para}>
            Cookbooks were published in every city and many small towns in Mississippi. This map includes
            information (similar to the previous list) on over 300 cookbooks published in Mississippi before
            1970. In some cases, the date has been estimated. Clicking on a location pin provides information
            about the cookbooks published in that community.
          </p>

          <h3 className={styles.h3sub}>Cookbook Locations (Pre-1970)</h3>
          <div className={styles.mapWrap}>
            <iframe
              src="https://southernmiss.maps.arcgis.com/apps/instant/sidebar/index.html?appid=7feb969fb94241feb29f40dc3c3291a0"
              width="100%"
              height="900"
              style={{ border: 0, display: 'block' }}
              allowFullScreen
            />
          </div>

          <hr className={styles.divider} />
          <h3 className={styles.h3sub}>Regional Distribution of Pre-1970 Cookbooks</h3>
          <p className={styles.para}>
            Mississippi community cookbooks were published throughout the state. This map shows the percent of
            known cookbooks published before 1970 found in each of five regions. The distribution is remarkably
            even (despite the greater number of cookbooks published in Jackson, the state capital, and bias
            introduced by the researcher&apos;s residence in southern Mississippi. Statewide publications were
            excluded.)
          </p>
          <div className={styles.mapWrap}>
            <iframe
              src="https://southernmiss.maps.arcgis.com/apps/instant/basic/index.html?appid=42774c450dc0419097e5892c50f24d87"
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
