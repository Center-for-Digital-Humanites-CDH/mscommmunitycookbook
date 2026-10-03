'use client';

import { useState, useEffect } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import { announcementHtml, composeInGmail, copyEmails, type AnnouncePost } from '@/lib/announce';
import styles from './SubscribersAdmin.module.css';

interface Subscriber {
  id: string;
  email: string;
  subscribed_at: string;
  active: boolean;
}

interface PostOption extends AnnouncePost {
  id: string;
}

export default function SubscribersAdmin({ supabase }: { supabase: SupabaseClient }) {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [posts, setPosts] = useState<PostOption[]>([]);
  const [postId, setPostId] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('active');
  const [newEmail, setNewEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(true);

  async function api(method: string, body?: object) {
    const { data: { session } } = await supabase.auth.getSession();
    const res = await fetch('/api/admin/subscribers', {
      method,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session?.access_token}` },
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'Request failed.');
    return data;
  }

  async function load() {
    try {
      const data = await api('GET');
      setSubscribers(data.subscribers);
    } catch (e) {
      flash('Error: ' + (e as Error).message);
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
    supabase
      .from('posts')
      .select('id, title, slug, excerpt, background_image, author, date, category')
      .eq('published', true)
      .order('date', { ascending: false })
      .then(({ data }) => {
        if (data) {
          setPosts(data);
          if (data[0]) setPostId(data[0].id);
        }
      });
    // Keep the list fresh while the tab is open
    const timer = setInterval(load, 30000);
    return () => clearInterval(timer);
  }, []);

  function flash(text: string) {
    setMsg(text);
    setTimeout(() => setMsg(''), 8000);
  }

  const selectedPost = posts.find((p) => p.id === postId);
  const activeEmails = subscribers.filter((s) => s.active).map((s) => s.email);
  const filtered = subscribers.filter((s) => {
    if (filter === 'active' && !s.active) return false;
    if (filter === 'inactive' && s.active) return false;
    return !search || s.email.includes(search.toLowerCase());
  });

  async function copyActive() {
    if (!activeEmails.length) return flash('Error: No active subscribers to copy.');
    await copyEmails(activeEmails);
    flash(`✓ Copied ${activeEmails.length} email${activeEmails.length === 1 ? '' : 's'}`);
  }

  function exportCsv() {
    const rows = [['email', 'status', 'subscribed_at'], ...subscribers.map((s) => [
      s.email,
      s.active ? 'active' : 'unsubscribed',
      new Date(s.subscribed_at).toISOString().split('T')[0],
    ])];
    const csv = rows.map((r) => r.map((v) => `"${v.replace(/"/g, '""')}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `subscribers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function announce() {
    const post = posts.find((p) => p.id === postId);
    if (!post) return flash('Error: Pick a post to announce.');
    if (!activeEmails.length) return flash('Error: No active subscribers to email.');
    flash(await composeInGmail(post, activeEmails));
  }

  async function addSubscriber(e: React.FormEvent) {
    e.preventDefault();
    try {
      await api('POST', { email: newEmail });
      setNewEmail('');
      flash('✓ Subscriber added');
      load();
    } catch (err) {
      flash('Error: ' + (err as Error).message);
    }
  }

  async function toggleActive(s: Subscriber) {
    try {
      await api('PATCH', { id: s.id, active: !s.active });
      load();
    } catch (err) {
      flash('Error: ' + (err as Error).message);
    }
  }

  async function remove(s: Subscriber) {
    if (!confirm(`Permanently delete ${s.email}? To just stop emailing them, use Unsubscribe instead.`)) return;
    try {
      await api('DELETE', { id: s.id });
      load();
    } catch (err) {
      flash('Error: ' + (err as Error).message);
    }
  }

  if (loading) return <p className={styles.loading}>Loading…</p>;

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <h3>Newsletter Subscribers</h3>
        <p className={styles.sub}>
          Everyone who signed up through the Subscribe form on the site. The list refreshes every 30 seconds.
        </p>
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}><span className={styles.statNum}>{activeEmails.length}</span>Active</div>
        <div className={styles.stat}><span className={styles.statNum}>{subscribers.length - activeEmails.length}</span>Unsubscribed</div>
        <div className={styles.stat}><span className={styles.statNum}>{subscribers.length}</span>Total</div>
      </div>

      <div className={styles.card}>
        <h4>Announce a new post</h4>
        <p className={styles.hint}>
          Copies a designed email for the post and opens Gmail with every active subscriber in Bcc
          (they can&rsquo;t see each other&rsquo;s addresses). Click in the message, press Ctrl+V, review, then Send.
        </p>
        <div className={styles.row}>
          <select value={postId} onChange={(e) => setPostId(e.target.value)} className={styles.select}>
            {posts.length === 0 && <option value="">No published posts</option>}
            {posts.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
          </select>
          <button onClick={() => setShowPreview((v) => !v)} className={styles.secondaryBtn}>
            {showPreview ? 'Hide preview' : 'Preview email'}
          </button>
          <button onClick={announce} className={styles.primaryBtn}>Compose in Gmail</button>
        </div>
        {showPreview && selectedPost && (
          <iframe title="Email preview" srcDoc={announcementHtml(selectedPost)} className={styles.preview} />
        )}
      </div>

      <div className={styles.toolbar}>
        <input
          className={styles.search}
          placeholder="Search emails…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={filter} onChange={(e) => setFilter(e.target.value as typeof filter)} className={styles.select}>
          <option value="active">Active</option>
          <option value="inactive">Unsubscribed</option>
          <option value="all">All</option>
        </select>
        <button onClick={copyActive} className={styles.secondaryBtn}>Copy active emails</button>
        <button onClick={exportCsv} className={styles.secondaryBtn}>Export CSV</button>
        <button onClick={load} className={styles.secondaryBtn}>Refresh</button>
      </div>

      {msg && <p className={msg.startsWith('Error') ? styles.error : styles.success}>{msg}</p>}

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr><th>Email</th><th>Subscribed</th><th>Status</th><th /></tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={4} className={styles.empty}>No subscribers match.</td></tr>
            )}
            {filtered.map((s) => (
              <tr key={s.id}>
                <td className={styles.email}>{s.email}</td>
                <td>{new Date(s.subscribed_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                <td>
                  <span className={s.active ? styles.badgeActive : styles.badgeInactive}>
                    {s.active ? 'Active' : 'Unsubscribed'}
                  </span>
                </td>
                <td className={styles.actions}>
                  <button onClick={() => toggleActive(s)} className={styles.linkBtn}>
                    {s.active ? 'Unsubscribe' : 'Reactivate'}
                  </button>
                  <button onClick={() => remove(s)} className={styles.deleteBtn}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <form onSubmit={addSubscriber} className={styles.addRow}>
        <input
          type="email"
          required
          placeholder="Add someone by email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          className={styles.search}
        />
        <button type="submit" className={styles.secondaryBtn}>Add</button>
      </form>
    </div>
  );
}
