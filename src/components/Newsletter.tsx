'use client';

import { useState } from 'react';
import styles from './Newsletter.module.css';

export default function Newsletter() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');

    const email = (e.currentTarget.elements.namedItem('EMAIL') as HTMLInputElement).value;

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setMessage('Thank you for subscribing!');
        (e.target as HTMLFormElement).reset();
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  }

  return (
    <div className={styles.newsletter}>
      <div className={styles.inner}>
        <h3 className={styles.heading}>Subscribe to Culinary Tales</h3>
        <p className={styles.sub}>
          Get the latest stories, recipes, and updates from the Mississippi Community Cookbook Project delivered to your inbox.
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="email"
            name="EMAIL"
            placeholder="Your email address"
            required
            className={styles.input}
          />
          <button type="submit" disabled={status === 'loading'} className={styles.btn}>
            {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>

        {message && (
          <div className={`${styles.msg} ${status === 'success' ? styles.msgSuccess : styles.msgError}`}>
            {message}
          </div>
        )}

        <p className={styles.spam}>We respect your privacy. No spam, ever.</p>
      </div>
    </div>
  );
}
