import type { Metadata } from 'next';
import Image from 'next/image';
import PageHero from '@/components/PageHero';
import CookbookInventory from '@/components/CookbookInventory';
import { supabaseAdmin } from '@/lib/supabase';
import { getPageContent } from '@/lib/pageContent';
import styles from './page.module.css';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Cookbooks — Mississippi Community Cookbook Project',
};

async function getCookbooks() {
  const db = supabaseAdmin();
  const { data } = await db
    .from('cookbooks')
    .select('title, author, date, community, county, organization, source, website')
    .order('title', { ascending: true });

  if (!data) return [];

  return data.map((row) => ({
    Title: row.title || '',
    Author: row.author || '',
    Date: row.date || '',
    Community: row.community || '',
    County: row.county || undefined,
    'Organization (Church, Civic/Club, Business/Professional)': row.organization || '',
    Source: row.source || '',
    Website: row.website || undefined,
  }));
}

export default async function CookbooksPage() {
  const [cookbooks, c] = await Promise.all([getCookbooks(), getPageContent('cookbooks')]);

  return (
    <>
      <PageHero
        title={c['hero.title']}
        backgroundImage={c['hero.image']}
        backgroundPosition={c['hero.position']}
      />

      <div className={styles.wrapper}>
        <div className={styles.rich} dangerouslySetInnerHTML={{ __html: c['intro'] }} />

        <div className={styles.floatLeft}>
          <figure className={styles.figure}>
            <Image
              src={c['left.image']}
              alt={c['left.alt']}
              width={240}
              height={300}
              className={styles.img}
            />
            {c['left.caption'] && <figcaption>{c['left.caption']}</figcaption>}
          </figure>
          <div className={styles.rich} dangerouslySetInnerHTML={{ __html: c['left.text'] }} />
        </div>

        <div className={styles.floatRight}>
          <figure className={styles.figure}>
            <Image
              src={c['right.image']}
              alt={c['right.alt']}
              width={240}
              height={300}
              className={styles.img}
            />
            {c['right.caption'] && <figcaption>{c['right.caption']}</figcaption>}
          </figure>
          <div className={styles.rich} dangerouslySetInnerHTML={{ __html: c['right.text'] }} />
        </div>

        <CookbookInventory cookbooks={cookbooks} />
      </div>
    </>
  );
}
