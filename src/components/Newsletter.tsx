'use client';

import { useState } from 'react';
import styles from './Newsletter.module.css';

export default function Newsletter() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');

    const form = e.currentTarget;
    const email = (form.elements.namedItem('EMAIL') as HTMLInputElement).value;

    let url =
      'https://gmail.us20.list-manage.com/subscribe/post-json?u=89d95b1506296222cdb651ffd&id=cb0a80759d&f_id=0095cdedf0';
    url += `&EMAIL=${encodeURIComponent(email)}&c=__mailchimpCallback__`;

    const script = document.createElement('script');
    script.src = url;

    (window as any).__mailchimpCallback__ = (res: any) => {
      document.body.removeChild(script);
      delete (window as any).__mailchimpCallback__;

      if (res.result === 'success') {
        setStatus('success');
        setMessage('Thank you for subscribing!');
        form.reset();
      } else {
        setStatus('error');
        let msg = res.msg || 'Something went wrong. Please try again.';
        if (msg.includes('0 - ')) msg = msg.replace('0 - ', '');
        setMessage(msg);
      }
    };

    document.body.appendChild(script);
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
          {/* Mailchimp bot protection */}
          <div style={{ position: 'absolute', left: '-5000px' }} aria-hidden="true">
            <input type="text" name="b_89d95b1506296222cdb651ffd_cb0a80759d" tabIndex={-1} defaultValue="" />
          </div>
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
