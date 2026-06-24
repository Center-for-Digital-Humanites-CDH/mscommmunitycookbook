import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { essays, getEssayById } from '../essays';
import styles from './page.module.css';

export function generateStaticParams() {
  return essays.map((e) => ({ slug: e.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const essay = getEssayById(slug);
  if (!essay) return {};
  return {
    title: `${essay.title} — Experimental Kitchen`,
  };
}

export default async function EssayPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const essay = getEssayById(slug);
  if (!essay) notFound();

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <Link href="/experimental-kitchen" className={styles.backLink}>
          ← Experimental Kitchen
        </Link>
      </div>

      <article className={styles.article}>
        <header className={styles.header}>
          <p className={styles.section}>Experimental Kitchen</p>
          <h1 className={styles.title}>{essay.title}</h1>
          {essay.subtitle && <p className={styles.subtitle}>{essay.subtitle}</p>}
        </header>

        <div className={styles.body}>
          {essay.content}
        </div>

        <footer className={styles.footer}>
          <Link href="/experimental-kitchen" className={styles.footerLink}>
            ← Back to Experimental Kitchen
          </Link>
        </footer>
      </article>
    </div>
  );
}
