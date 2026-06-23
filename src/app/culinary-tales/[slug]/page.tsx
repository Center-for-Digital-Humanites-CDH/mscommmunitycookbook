import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllPosts, getPostBySlug } from '@/lib/posts';
import styles from './page.module.css';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return { title: `${post.title} — Culinary Tales` };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section
        className={styles.hero}
        style={{ backgroundImage: `url(${post.backgroundImage})` }}
      >
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <div className={styles.breadcrumb}>
            <Link href="/culinary-tales">Culinary Tales</Link>
            <span className={styles.sep}>→</span>
            <span className={styles.current}>{post.title}</span>
          </div>
          <h1>{post.title}</h1>
          <div className={styles.blogMeta}>
            <span>{formattedDate}</span>
            {post.category && (
              <>
                <span className={styles.dot}>•</span>
                <span>{post.category}</span>
              </>
            )}
            <span className={styles.dot}>•</span>
            <span>By {post.author}</span>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className={styles.blogContent}>
        <div className={styles.container}>
          {post.excerpt && (
            <div className={styles.summary}>
              <p className={styles.excerptText}>{post.excerpt}</p>
            </div>
          )}

          <article
            className={styles.article}
            dangerouslySetInnerHTML={{ __html: post.content || '' }}
          />

          <div className={styles.nav}>
            <Link href="/culinary-tales" className={styles.backLink}>
              ← Back to Culinary Tales
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
