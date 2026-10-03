import type { Metadata } from 'next';
import Image from 'next/image';
import PageHero from '@/components/PageHero';
import { getPageContent } from '@/lib/pageContent';
import styles from './page.module.css';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Cookery — Mississippi Community Cookbook Project',
};

export default async function CookeryPage() {
  const c = await getPageContent('cookery');

  return (
    <>
      <PageHero
        title={c['hero.title']}
        backgroundImage={c['hero.image']}
        backgroundPosition={c['hero.position']}
      />

      <div className={styles.wrapper}>
        <div className={styles.prose}>

          <div dangerouslySetInnerHTML={{ __html: c['intro'] }} />

          {/* First cookbook — floats left on desktop */}
          <figure className={`${styles.figure} ${styles.figureLeft}`}>
            <Image
              src={c['left.image']}
              alt={c['left.alt']}
              width={180}
              height={220}
              className={styles.coverImg}
            />
            {c['left.caption'] && <figcaption>{c['left.caption']}</figcaption>}
          </figure>

          <div dangerouslySetInnerHTML={{ __html: c['left.text'] }} />

          {/* Second cookbook — floats right on desktop */}
          <figure className={`${styles.figure} ${styles.figureRight}`}>
            <Image
              src={c['right.image']}
              alt={c['right.alt']}
              width={180}
              height={220}
              className={styles.coverImg}
            />
            {c['right.caption'] && <figcaption>{c['right.caption']}</figcaption>}
          </figure>

          <div dangerouslySetInnerHTML={{ __html: c['right.text'] }} />

        </div>
      </div>
    </>
  );
}
