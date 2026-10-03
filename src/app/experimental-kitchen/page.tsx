import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import EssaySection from '@/components/EssaySection';
import EssayTabs from '@/components/EssayTabs';
import { getPageContent } from '@/lib/pageContent';
import { essaysFromContent } from '@/lib/essays';
import styles from './page.module.css';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Experimental Kitchen — Mississippi Community Cookbook Project',
};

export default async function ExperimentalKitchenPage() {
  const c = await getPageContent('experimental-kitchen');
  const tabItems = essaysFromContent(c['essays']).map(({ slug, title, cardImage, cardImageAlt }) => ({
    id: slug,
    title,
    cardImage,
    cardImageAlt,
    wide: true,
  }));

  return (
    <>
      <PageHero
        title={c['hero.title']}
        backgroundImage={c['hero.image']}
        backgroundPosition={c['hero.position']}
      />

      <div className={styles.wrapper}>
        <div className={styles.rich} dangerouslySetInnerHTML={{ __html: c['intro'] }} />

        {/* ── Data Pipeline ── */}
        <section className={styles.section}>
          <h2 className={styles.h2}>{c['pipeline.heading']}</h2>
          <div className={styles.rich} dangerouslySetInnerHTML={{ __html: c['pipeline.intro'] }} />
          <EssaySection title={c['pipeline.button']}>
            <div dangerouslySetInnerHTML={{ __html: c['pipeline.essay'] }} />
          </EssaySection>
        </section>

        {/* ── Research Findings ── */}
        <section className={styles.section}>
          <h2 className={styles.h2}>{c['findings.heading']}</h2>
          <div className={styles.rich} dangerouslySetInnerHTML={{ __html: c['findings.intro'] }} />
          <EssayTabs tabs={tabItems} columns={2} />
        </section>
      </div>
    </>
  );
}
