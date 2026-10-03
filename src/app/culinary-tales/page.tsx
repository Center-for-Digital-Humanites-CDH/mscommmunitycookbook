import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';
import { getPageContent } from '@/lib/pageContent';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Culinary Tales — Mississippi Community Cookbook Project',
};

export const revalidate = 60;

export default async function CulinaryTalesPage() {
  const [allPosts, c] = await Promise.all([getAllPosts(), getPageContent('culinary-tales')]);

  const now = new Date();
  const oneMonthAgo = new Date(now);
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const freshPosts = allPosts.filter((p) => new Date(p.date) >= oneMonthAgo);
  const recentPosts = freshPosts.length >= 3 ? freshPosts : allPosts.slice(0, 3);
  const recentSlugs = new Set(recentPosts.map((p) => p.slug));
  const pastPosts = allPosts.filter((p) => !recentSlugs.has(p.slug));

  function formatDate(d: string) {
    return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  return (
    <div className={styles.page}>
      <section
        className={styles.hero}
        style={{ backgroundImage: `url(${c['hero.image']})`, backgroundPosition: c['hero.position'] }}
      >
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <h1>{c['hero.title']}</h1>
        </div>
      </section>

      <div className={styles.content}>
        <p className={styles.intro}>{c['intro']}</p>

        {allPosts.length === 0 ? (
          <section className={styles.comingSoon}>
            <h2 className={styles.sectionTitle}>{c['empty.heading']}</h2>
            <div className={styles.comingSoonContent} dangerouslySetInnerHTML={{ __html: c['empty.text'] }} />
          </section>
        ) : (
          <>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>{c['recentHeading']}</h2>
              <div className={styles.grid}>
                {recentPosts.map((post) => (
                  <article
                    key={post.slug}
                    className={styles.card}
                    style={{ '--hover-bg': `url(${post.background_image})` } as React.CSSProperties}
                  >
                    <div className={styles.postMeta}>
                      <span className={styles.date}>{formatDate(post.date)}</span>
                      {post.category && <span className={styles.category}>{post.category}</span>}
                    </div>
                    <h3 className={styles.postTitle}>
                      <Link href={`/culinary-tales/${post.slug}`}>{post.title}</Link>
                    </h3>
                    <p className={styles.excerpt}>{post.excerpt}</p>
                    <Link href={`/culinary-tales/${post.slug}`} className={styles.readMore}>Read More →</Link>
                  </article>
                ))}
              </div>
            </section>

            {pastPosts.length > 0 && (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>{c['pastHeading']}</h2>
                <div className={styles.grid}>
                  {pastPosts.map((post) => (
                    <article
                      key={post.slug}
                      className={styles.card}
                      style={{ '--hover-bg': `url(${post.background_image})` } as React.CSSProperties}
                    >
                      <div className={styles.postMeta}>
                        <span className={styles.date}>{formatDate(post.date)}</span>
                        {post.category && <span className={styles.category}>{post.category}</span>}
                      </div>
                      <h3 className={styles.postTitle}>
                        <Link href={`/culinary-tales/${post.slug}`}>{post.title}</Link>
                      </h3>
                      <p className={styles.excerpt}>{post.excerpt}</p>
                      <Link href={`/culinary-tales/${post.slug}`} className={styles.readMore}>Read More →</Link>
                    </article>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}
