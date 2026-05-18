import type { Metadata } from 'next';
import Image from 'next/image';
import PageHero from '@/components/PageHero';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Cookery — Mississippi Community Cookbook Project',
};

export default function CookeryPage() {
  return (
    <>
      <PageHero
        title="Cookery"
        backgroundImage="/images/cookery-bg.jpeg"
        backgroundPosition="center 20%"
      />

      <div className={styles.wrapper}>
        <div className={styles.prose}>

          <p>
            Tentatively titled <em>Kissin Don&apos;t Last, Cookery Do</em>, my history of community
            cookbooks takes a deep dive into community cookbooks in Mississippi in order to better
            understand how these homespun cookbooks empowered women to shape the places they called
            home. Community cookbooks funded literary societies, church renovations, parks, school
            trips, and child welfare programs and, to a degree that is nearly impossible to measure,
            they provided opportunities for women to address social needs that the political system,
            still dominated by men in the first two thirds of the twentieth century, ignored.
          </p>

          <p>Nearly every cookbook I have researched tells a story.</p>

          {/* Belzoni cookbook — floats left on desktop */}
          <figure className={`${styles.figure} ${styles.figureLeft}`}>
            <Image
              src="/images/cookbook-belzoni-garden.jpeg"
              alt="Belzoni Garden Club Cook Book cover"
              width={180}
              height={220}
              className={styles.coverImg}
            />
            <figcaption>Belzoni Garden Club (Belzoni, Miss.) 1967</figcaption>
          </figure>

          <p>
            Since the records of charitable spending for the hundreds of groups that created
            cookbooks in Mississippi are not available, the cookbooks themselves are often
            (supplemented by local research) the best record we have of women&apos;s efforts to
            shape their communities. In the book, I examine select community cookbooks, less to
            examine the recipes, than to explore the politics.
          </p>

          <p>That is not to say that the recipes do not matter.</p>

          {/* Morehead cookbook — floats right on desktop */}
          <figure className={`${styles.figure} ${styles.figureRight}`}>
            <Image
              src="/images/cookbook-morehead.jpeg"
              alt="Ladies of the Home Demonstration Club of Moorhead cookbook cover"
              width={180}
              height={220}
              className={styles.coverImg}
            />
            <figcaption>Ladies of the Home Demonstration Club of Moorhead, Mississippi (Moorhead, Miss.) 1965</figcaption>
          </figure>

          <p>
            In the second half of the book, I place these local cookbooks in a national context,
            examining how the selection of recipes transcended local preferences and demonstrated a
            remarkable knowledge of national culinary cultures.
          </p>

          <p>
            Not surprisingly, although I do not agree with all the causes these women championed, I
            have developed considerable respect for the women who gathered to create community
            cookbooks. They not only mastered the kitchen, but demonstrated their skills as artists,
            publishers, and businesspeople.
          </p>

          <p>
            As I complete the manuscript, I will share many of its findings in this section of the
            website. Check back for more!
          </p>

        </div>
      </div>
    </>
  );
}
