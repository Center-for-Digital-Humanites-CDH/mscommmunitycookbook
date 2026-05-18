'use client';

import { useState, useRef } from 'react';
import styles from './EssaySection.module.css';

interface Props {
  title: string;
  children: React.ReactNode;
}

export default function EssaySection({ title, children }: Props) {
  const [open, setOpen] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  function toggle() {
    setOpen((prev) => !prev);
  }

  return (
    <div className={`${styles.root} ${open ? styles.rootOpen : ''}`}>
      <button
        className={styles.trigger}
        onClick={toggle}
        aria-expanded={open}
      >
        <span className={styles.triggerText}>{title}</span>
        <span className={`${styles.icon} ${open ? styles.iconOpen : ''}`}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </button>

      <div
        ref={bodyRef}
        className={styles.body}
        style={open ? { maxHeight: bodyRef.current ? bodyRef.current.scrollHeight + 'px' : '9999px' } : { maxHeight: 0 }}
      >
        <div className={styles.inner}>
          {children}
        </div>
      </div>
    </div>
  );
}
