import Image from 'next/image';
import Link from 'next/link';
import styles from './EssayTabs.module.css';

export interface EssayTabItem {
  id: string;
  cardImage: string;
  cardImageAlt: string;
  title: string;
  seriesLabel?: string;
  wide?: boolean;
  content?: React.ReactNode;
}

interface Props {
  tabs: EssayTabItem[];
  columns?: 2 | 3;
}

export default function EssayTabs({ tabs, columns = 2 }: Props) {
  return (
    <div
      className={styles.grid}
      style={{ '--cols': columns } as React.CSSProperties}
    >
      {tabs.map((tab) => (
        <Link
          key={tab.id}
          href={`/experimental-kitchen/${tab.id}`}
          className={`${styles.card} ${tab.wide ? styles.cardWide : ''}`}
        >
          <Image
            src={tab.cardImage}
            alt={tab.cardImageAlt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={styles.cardBgImg}
          />
          <div className={styles.cardOverlay} />
          <div className={styles.cardContent}>
            {tab.seriesLabel && (
              <span className={styles.seriesBadge}>{tab.seriesLabel}</span>
            )}
            <h3 className={styles.cardTitle}>{tab.title}</h3>
            <span className={styles.cardCta}>
              Read essay
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" /><path d="M12 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
