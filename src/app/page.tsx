import type { Metadata } from 'next';
import Link from 'next/link';
import Newsletter from '@/components/Newsletter';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: "Mississippi's Culinary Legacy",
};

const tiles = [
  { href: '/cookbooks', label: 'Cookbooks', sub: 'Community Cookbook Inventory', bg: 'cookbooks' },
  { href: '/culinary-landscapes', label: 'Culinary Landscapes', sub: 'Charts and Maps', bg: 'landscapes' },
  { href: '/experimental-kitchen', label: 'Experimental Kitchen', sub: 'AI Insights', bg: 'kitchen' },
  { href: '/cookery', label: 'Cookery', sub: 'The Book Project', bg: 'cookery' },
  { href: '/proof-pudding', label: 'Proof of the Pudding', sub: 'Notes on Sources', bg: 'proof' },
  { href: '/culinary-tales', label: 'Culinary Tales', sub: 'The Blog', bg: 'tales' },
  { href: '/tasted-tested', label: 'Tasted and Tested', sub: 'About this Site', bg: 'tested' },
];

const bgMap: Record<string, string> = {
  cookbooks: '/images/cookbooks-bg.jpeg',
  landscapes: '/images/landscapes-bg.jpeg',
  kitchen: '/images/kitchen-bg.jpeg',
  cookery: '/images/cookery-bg.jpeg',
  proof: '/images/hero-bg.jpeg',
  tales: '/images/tales-bg.jpeg',
  tested: '/images/tested-bg.jpeg',
};

export default function HomePage() {
  return (
    <>
      <section className={styles.hero}>
        <h1>The Mississippi Community Cookbook Project</h1>
        <p className={styles.heroSub}>
          The Mississippi Community Cookbook Project catalogs and explores cookbooks published
          by charitable, civic, and church organizations in Mississippi before 1970
          (and occasionally beyond).
        </p>
      </section>

      <section className={styles.tilesSection}>
        <div className={styles.tilesGrid}>
          {tiles.map((tile) => (
            <Link
              key={tile.href}
              href={tile.href}
              className={styles.tile}
              style={{ backgroundImage: `url(${bgMap[tile.bg]})` }}
            >
              <div className={styles.tileOverlay} />
              <div className={styles.tileContent}>
                <h3>{tile.label}</h3>
                <p>{tile.sub}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.welcome}>
        <p>
          Welcome to the Mississippi Community Cookbook Project. For information (lists, data, maps) about
          Mississippi community cookbooks published before 1970, visit the &ldquo;Cookbooks&rdquo; and
          &ldquo;Culinary Landscapes&rdquo; pages. For essays that mine cookbook data for curious insights,
          visit the &ldquo;Experimental Kitchen.&rdquo; These essays are updated periodically. For additional
          essays on all things food and cookbook related, visit the blog at &ldquo;Culinary Tales.&rdquo; Blog
          posts are posted regularly and include announcements about updates on the website.
        </p>
      </section>

      <div className={styles.newsletterWrap}>
        <Newsletter />
      </div>
    </>
  );
}
