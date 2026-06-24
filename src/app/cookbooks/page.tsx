import type { Metadata } from 'next';
import Image from 'next/image';
import PageHero from '@/components/PageHero';
import CookbookInventory from '@/components/CookbookInventory';
import { supabaseAdmin } from '@/lib/supabase';
import styles from './page.module.css';

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
  const cookbooks = await getCookbooks();

  return (
    <>
      <PageHero
        title="Cookbooks"
        backgroundImage="/images/cookbooks-bg.jpeg"
        backgroundPosition="center 30%"
      />

      <div className={styles.wrapper}>
        <p className={styles.para}>
          Following the Civil War, community cookbooks—along with bake sales and craft sales—became an
          important means by which women in the United States raised funds to support charitable endeavors.
          The Mississippi Community Cookbook Project, the nucleus of a book manuscript, seeks to document
          Mississippi community cookbooks published before 1970, and the influence of these cookbooks on
          life in Mississippi.
        </p>

        <div className={styles.floatLeft}>
          <figure className={styles.figure}>
            <Image
              src="/images/cookbook-rials-kitchen.jpg"
              alt="Rials' Kitchen Secrets cookbook cover"
              width={240}
              height={300}
              className={styles.img}
            />
            <figcaption>Rials Creek Methodist Church (Magee, Miss.) 1951</figcaption>
          </figure>
          <p className={styles.para}>
            Collectively, these cookbooks are the basis for <em>Kissin&apos; Don&apos;t Last, Cookery Do</em>,
            the tentative title of a book I am preparing that looks at the history of community cookbooks as a
            means of understanding the role of community cookbooks in American life.
          </p>
          <p className={styles.para}>
            Using Mississippi as a case study, it explores how women shaped local life through their cookbooks
            and the charitable works the cookbooks funded, yet it also examines how national trends in cooking
            influenced women&apos;s understanding of food.
          </p>
        </div>

        <div className={styles.floatRight}>
          <figure className={styles.figure}>
            <Image
              src="/images/cookbook-whats-cooking-y.jpeg"
              alt="What's Cooking at the Y cookbook cover"
              width={240}
              height={300}
              className={styles.img}
            />
            <figcaption>Young Women&apos;s Christian Association (Laurel, Miss.) 1968</figcaption>
          </figure>
          <p className={styles.para}>
            This website will be updated nearer to the book&apos;s publication with some of the more compelling
            statistical findings, but for now it serves as a taxonomy, providing insights into when, where, and
            who published cookbooks in Mississippi.
          </p>
          <p className={styles.para}>
            The largest collection of Mississippi cookbooks resides in the archives of The University of Southern
            Mississippi. In partnership with Jennifer Brannock, Curator of Mississippiana and Rare Books at
            Southern Miss, I have worked with University Libraries to amass over two hundred cookbooks published
            before 1970. Additional Mississippi cookbooks are held at university and public libraries throughout
            the United States as well as at Mississippi&apos;s Department of History and Archives. Not all
            cookbooks have survived. There may be dozens, perhaps even hundreds, of cookbooks that have been lost.
          </p>
        </div>

        <CookbookInventory cookbooks={cookbooks} />
      </div>
    </>
  );
}
