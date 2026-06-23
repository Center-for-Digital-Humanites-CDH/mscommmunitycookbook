import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Culinary Tales — Mississippi Community Cookbook Project',
};

export default function CulinaryTalesPage() {
  const allPosts = getAllPosts();

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
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <h1>Culinary Tales</h1>
        </div>
      </section>

      <div className={styles.content}>
        <p className={styles.intro}>
          Cookbooks tell stories. The best of these, if all goes according to plan, will appear in my
          forthcoming book on community cookbooks. However, I am constantly finding stories that I would
          love to share and when I have time I will add some to the blog.
        </p>

        {allPosts.length === 0 ? (
          <section className={styles.comingSoon}>
            <h2 className={styles.sectionTitle}>Stories Coming Soon</h2>
            <div className={styles.comingSoonContent}>
              <p>
                Dr. Andrew Haley is currently preparing fascinating culinary tales from the Mississippi
                Community Cookbook Project archives.
              </p>
              <p>
                Check back regularly for new content, or{' '}
                <Link href="/cookbooks">explore our cookbook collection</Link> while you wait.
              </p>
            </div>
          </section>
        ) : (
          <>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Recent Stories</h2>
              <div className={styles.grid}>
                {recentPosts.map((post) => (
                  <article
                    key={post.slug}
                    className={styles.card}
                    style={{ '--hover-bg': `url(${post.backgroundImage})` } as React.CSSProperties}
                  >
                    <div className={styles.postMeta}>
                      <span className={styles.date}>{formatDate(post.date)}</span>
                      {post.category && <span className={styles.category}>{post.category}</span>}
                    </div>
                    <h3 className={styles.postTitle}>
                      <Link href={`/culinary-tales/${post.slug}`}>{post.title}</Link>
                    </h3>
                    <p className={styles.excerpt}>{post.excerpt}</p>
                    <Link href={`/culinary-tales/${post.slug}`} className={styles.readMore}>
                      Read More →
                    </Link>
                  </article>
                ))}
              </div>
            </section>

            {pastPosts.length > 0 && (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Past Stories</h2>
                <div className={styles.grid}>
                  {pastPosts.map((post) => (
                    <article
                      key={post.slug}
                      className={styles.card}
                      style={{ '--hover-bg': `url(${post.backgroundImage})` } as React.CSSProperties}
                    >
                      <div className={styles.postMeta}>
                        <span className={styles.date}>{formatDate(post.date)}</span>
                        {post.category && <span className={styles.category}>{post.category}</span>}
                      </div>
                      <h3 className={styles.postTitle}>
                        <Link href={`/culinary-tales/${post.slug}`}>{post.title}</Link>
                      </h3>
                      <p className={styles.excerpt}>{post.excerpt}</p>
                      <Link href={`/culinary-tales/${post.slug}`} className={styles.readMore}>
                        Read More →
                      </Link>
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
