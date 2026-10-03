import type { Metadata } from 'next';
import Link from 'next/link';
import Newsletter from '@/components/Newsletter';
import { getPageContent } from '@/lib/pageContent';
import { HOME_TILE_LINKS } from '@/content/pages';
import styles from './page.module.css';

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Mississippi's Culinary Legacy — Mississippi Community Cookbook Project",
};

// Shows each line of a multi-line field on its own line
function Lines({ text }: { text: string }) {
  return text.split('\n').map((line, i) => (
    <span key={i}>
      {i > 0 && <br />}
      {line}
    </span>
  ));
}

export default async function HomePage() {
  const c = await getPageContent('home');

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroAccent} />
          <h1><Lines text={c['hero.title']} /></h1>
          <p className={styles.heroSub}><Lines text={c['hero.subtitle']} /></p>
        </div>
      </section>

      {/* Tiles */}
      <section className={styles.tilesSection}>
        <div className={styles.tilesGrid}>
          {HOME_TILE_LINKS.map(({ id, href }) => (
            <Link
              key={id}
              href={href}
              className={styles.tile}
              style={{ backgroundImage: `url(${c[`tile.${id}.image`]})`, backgroundPosition: c[`tile.${id}.position`] }}
            >
              <div className={styles.tileOverlay} />
              <div className={styles.tileContent}>
                <h3>{c[`tile.${id}.title`]}</h3>
                <p>{c[`tile.${id}.subtitle`]}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Welcome */}
      <section className={styles.welcome}>
        <div className={styles.welcomeInner} dangerouslySetInnerHTML={{ __html: c['welcome'] }} />
      </section>

      {/* Newsletter */}
      <div className={styles.newsletterWrap}>
        <Newsletter />
      </div>
    </div>
  );
}
