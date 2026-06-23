'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './Header.module.css';

const navLinks = [
  { href: '/', label: 'Home', key: 'home', icon: true },
  { href: '/cookbooks', label: 'Cookbooks', key: 'cookbooks' },
  { href: '/culinary-landscapes', label: 'Culinary Landscapes', key: 'landscapes' },
  { href: '/experimental-kitchen', label: 'Experimental Kitchen', key: 'kitchen' },
  { href: '/cookery', label: 'Cookery', key: 'cookery' },
  { href: '/proof-pudding', label: 'Proof of the Pudding', key: 'proof' },
  { href: '/culinary-tales', label: 'Culinary Tales', key: 'tales' },
  { href: '/tasted-tested', label: 'Tasted & Tested', key: 'tested' },
];

export default function Header() {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  function getActiveHref() {
    if (pathname.startsWith('/culinary-tales')) return '/culinary-tales';
    return pathname;
  }

  useEffect(() => { setDrawerOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  const activeHref = getActiveHref();

  return (
    <>
      <header className={styles.header}>
        <div className={styles.navContainer}>

          {/* Desktop tab bar */}
          <nav className={styles.tabBar}>
            {navLinks.map((link) => {
              const isActive = activeHref === link.href;
              return (
                <Link
                  key={link.key}
                  href={link.href}
                  className={`${styles.tab} ${isActive ? styles.tabActive : ''}`}
                >
                  {link.icon ? (
                    <svg className={styles.homeIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      <polyline points="9,22 9,12 15,12 15,22" />
                    </svg>
                  ) : link.label}
                </Link>
              );
            })}
          </nav>

          {/* Hamburger — mobile only */}
          <button
            className={styles.hamburger}
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
            aria-expanded={drawerOpen}
          >
            <span className={styles.bar} />
            <span className={styles.bar} />
            <span className={styles.bar} />
          </button>
        </div>
      </header>

      {drawerOpen && (
        <div className={styles.overlay} onClick={() => setDrawerOpen(false)} />
      )}

      <aside className={`${styles.drawer} ${drawerOpen ? styles.drawerOpen : ''}`} aria-hidden={!drawerOpen}>
        <div className={styles.drawerHeader}>
          <span className={styles.drawerTitle}>Menu</span>
          <button className={styles.drawerClose} onClick={() => setDrawerOpen(false)} aria-label="Close menu">
            <span className={styles.bar} />
            <span className={styles.bar} />
          </button>
        </div>
        <nav className={styles.drawerNav}>
          <ul>
            {navLinks.map((link) => (
              <li key={link.key}>
                <Link
                  href={link.href}
                  className={activeHref === link.href ? styles.drawerActive : ''}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}
