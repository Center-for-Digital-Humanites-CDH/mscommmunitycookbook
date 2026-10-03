import type { Metadata } from 'next';
import Image from 'next/image';
import PageHero from '@/components/PageHero';
import { getPageContent } from '@/lib/pageContent';
import styles from './page.module.css';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Proof of the Pudding — Mississippi Community Cookbook Project',
};

export default async function ProofPuddingPage() {
  const c = await getPageContent('proof-pudding');

  return (
    <>
      <PageHero
        title={c['hero.title']}
        backgroundImage={c['hero.image']}
        backgroundPosition={c['hero.position']}
      />

      <div className={styles.wrapper}>
        <div className={styles.prose}>

          {/* Cookbook cover — floats right on desktop */}
          <figure className={`${styles.figure} ${styles.figureRight}`}>
            <Image
              src={c['photo.image']}
              alt={c['photo.alt']}
              width={200}
              height={260}
              className={styles.coverImg}
            />
            {c['photo.caption'] && <figcaption>{c['photo.caption']}</figcaption>}
          </figure>

          <div dangerouslySetInnerHTML={{ __html: c['text'] }} />

        </div>
      </div>
    </>
  );
}
