import type { Metadata } from 'next';
import Link from 'next/link';
import Newsletter from '@/components/Newsletter';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: "Mississippi's Culinary Legacy — Mississippi Community Cookbook Project",
};

const tiles = [
  { href: '/cookbooks', label: 'Cookbooks', sub: 'Community Cookbook Inventory', bg: '/images/cookbooks-bg.jpeg', pos: 'center 30%' },
  { href: '/culinary-landscapes', label: 'Culinary Landscapes', sub: 'Charts and Maps', bg: '/images/landscapes-bg.jpeg', pos: 'center 5%' },
  { href: '/experimental-kitchen', label: 'Experimental Kitchen', sub: 'AI Insights', bg: '/images/kitchen-bg.jpeg', pos: 'center 25%' },
  { href: '/cookery', label: 'Cookery', sub: 'The Book Project', bg: '/images/cookery-bg.jpeg', pos: 'center 35%' },
  { href: '/proof-pudding', label: 'Proof of the Pudding', sub: 'Notes on Sources', bg: '/images/proof-bg.jpeg', pos: 'center 10%' },
  { href: '/culinary-tales', label: 'Culinary Tales', sub: 'The Blog', bg: '/images/tales-bg.jpeg', pos: 'center 10%' },
  { href: '/tasted-tested', label: 'Tasted and Tested', sub: 'About this Site', bg: '/images/tested-bg.jpeg', pos: 'center 20%' },
];

export default function HomePage() {
  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroAccent} />
          <h1>The Mississippi Community<br />Cookbook Project</h1>
          <p className={styles.heroSub}>
            The Mississippi Community Cookbook Project catalogs and explores cookbooks published by
            charitable, civic, and church organizations in Mississippi before 1970 (and occasionally
            beyond).
          </p>
        </div>
      </section>

      {/* Tiles */}
      <section className={styles.tilesSection}>
        <div className={styles.tilesGrid}>
          {tiles.map((tile) => (
            <Link
              key={tile.href}
              href={tile.href}
              className={styles.tile}
              style={{ backgroundImage: `url(${tile.bg})`, backgroundPosition: tile.pos }}
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

      {/* Welcome */}
      <section className={styles.welcome}>
        <div className={styles.welcomeInner}>
          <p>
            Welcome to the Mississippi Community Cookbook Project. For information about Mississippi
            community cookbooks published before 1970, visit the <Link href="/cookbooks">Cookbooks</Link> and{' '}
            <Link href="/culinary-landscapes">Culinary Landscapes</Link> pages. For essays that mine
            cookbook data for curious insights, visit the <Link href="/experimental-kitchen">Experimental Kitchen</Link>.
            For additional essays on all things food and cookbook related, visit the blog at{' '}
            <Link href="/culinary-tales">Culinary Tales</Link>.
          </p>
        </div>
      </section>

      {/* Newsletter */}
      <div className={styles.newsletterWrap}>
        <Newsletter />
      </div>
    </div>
  );
}
