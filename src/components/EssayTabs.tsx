'use client';

import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import styles from './EssayTabs.module.css';

export interface EssayTabItem {
  id: string;
  cardImage: string;
  cardImageAlt: string;
  title: string;
  seriesLabel?: string;
  wide?: boolean;
  content: React.ReactNode;
}

interface Props {
  tabs: EssayTabItem[];
  columns?: 2 | 3;
}

export default function EssayTabs({ tabs, columns = 2 }: Props) {
  const [openId, setOpenId] = useState<string | null>(null);
  const openTab = tabs.find((t) => t.id === openId) ?? null;

  const close = useCallback(() => setOpenId(null), []);

  useEffect(() => {
    if (openId) {
      document.body.style.overflow = 'hidden';
      window.scrollTo({ top: 0, behavior: 'instant' });
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [openId]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') close();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [close]);

  return (
    <>
      <div
        className={styles.grid}
        style={{ '--cols': columns } as React.CSSProperties}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.card} ${tab.wide ? styles.cardWide : ''}`}
            onClick={() => setOpenId(tab.id)}
          >
            {/* Background image — always rendered, revealed on hover */}
            <Image
              src={tab.cardImage}
              alt={tab.cardImageAlt}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className={styles.cardBgImg}
            />
            {/* White overlay — fades out on hover to reveal image */}
            <div className={styles.cardOverlay} />

            {/* Text content — sits above both layers */}
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
          </button>
        ))}
      </div>

      {/* Modal */}
      {openTab && (
        <div
          className={styles.backdrop}
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label={openTab.title}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalMeta}>
                {openTab.seriesLabel && (
                  <span className={styles.modalSeries}>{openTab.seriesLabel}</span>
                )}
                <h2 className={styles.modalTitle}>{openTab.title}</h2>
              </div>
              <button
                className={styles.closeBtn}
                onClick={close}
                aria-label="Close essay"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className={styles.modalBody}>
              {openTab.content}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
