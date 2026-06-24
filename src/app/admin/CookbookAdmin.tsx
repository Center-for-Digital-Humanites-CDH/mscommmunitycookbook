'use client';

import { useState, useEffect } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import styles from './CookbookAdmin.module.css';

interface Cookbook {
  id: string;
  title: string;
  author: string;
  date: string;
  community: string;
  county: string;
  organization: string;
  source: string;
  website: string;
}

const EMPTY: Omit<Cookbook, 'id'> = {
  title: '',
  author: '',
  date: '',
  community: '',
  county: '',
  organization: '',
  source: '',
  website: '',
};

const ORG_OPTIONS = ['Church', 'Civic/Club', 'Business/Professional', 'Extension'];
const SOURCE_OPTIONS = ['USM', 'USM Online', 'UM', 'MSU', 'MDAH', 'Unknown'];

export default function CookbookAdmin({ supabase }: { supabase: SupabaseClient }) {
  const [cookbooks, setCookbooks] = useState<Cookbook[]>([]);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<Partial<Cookbook> | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from('cookbooks')
      .select('*')
      .order('title', { ascending: true });
    if (data) setCookbooks(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  const filtered = cookbooks.filter((c) => {
    const q = search.toLowerCase();
    return !q || [c.title, c.author, c.community, c.county, c.organization, c.source]
      .some((v) => v?.toLowerCase().includes(q));
  });

  function handleChange(field: keyof Cookbook, value: string) {
    setEditing((prev) => ({ ...prev, [field]: value }));
  }

  async function save() {
    if (!editing || !editing.title) return;
    setSaving(true);
    setMsg('');

    const payload = {
      title: editing.title,
      author: editing.author || '',
      date: editing.date || '',
      community: editing.community || '',
      county: editing.county || '',
      organization: editing.organization || '',
      source: editing.source || '',
      website: editing.source === 'USM Online' ? (editing.website || '') : '',
    };

    let error;
    if (editing.id) {
      ({ error } = await supabase.from('cookbooks').update(payload).eq('id', editing.id));
    } else {
      ({ error } = await supabase.from('cookbooks').insert(payload));
    }

    setSaving(false);
    if (error) {
      setMsg('Error: ' + error.message);
    } else {
      setMsg('Saved!');
      await load();
      setTimeout(() => { setMsg(''); setEditing(null); }, 1000);
    }
  }

  async function deleteCookbook(id: string, title: string) {
    if (!confirm(`Delete "${title}" permanently?`)) return;
    await supabase.from('cookbooks').delete().eq('id', id);
    await load();
  }

  /* ── Form ── */
  if (editing) {
    return (
      <div className={styles.wrap}>
        <div className={styles.formHeader}>
          <button className={styles.backBtn} onClick={() => setEditing(null)}>← All Cookbooks</button>
          <h3>{editing.id ? 'Edit Cookbook' : 'Add New Cookbook'}</h3>
        </div>

        <div className={styles.formGrid}>
          <div className={styles.formMain}>
            <div className={styles.field}>
              <label>Title *</label>
              <input value={editing.title || ''} onChange={(e) => handleChange('title', e.target.value)} placeholder="Cookbook title" />
            </div>
            <div className={styles.field}>
              <label>Author / Publisher</label>
              <input value={editing.author || ''} onChange={(e) => handleChange('author', e.target.value)} placeholder="e.g. Junior League of Jackson" />
            </div>
            <div className={styles.row2}>
              <div className={styles.field}>
                <label>Date / Year</label>
                <input value={editing.date || ''} onChange={(e) => handleChange('date', e.target.value)} placeholder="e.g. 1965 or ca. 1960" />
              </div>
              <div className={styles.field}>
                <label>Community</label>
                <input value={editing.community || ''} onChange={(e) => handleChange('community', e.target.value)} placeholder="e.g. Jackson" />
              </div>
            </div>
            <div className={styles.row2}>
              <div className={styles.field}>
                <label>County</label>
                <input value={editing.county || ''} onChange={(e) => handleChange('county', e.target.value)} placeholder="e.g. Hinds" />
              </div>
              <div className={styles.field}>
                <label>Organization Type</label>
                <select value={editing.organization || ''} onChange={(e) => handleChange('organization', e.target.value)}>
                  <option value="">— Select —</option>
                  {ORG_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            </div>
            <div className={styles.row2}>
              <div className={styles.field}>
                <label>Source / Location</label>
                <select value={editing.source || ''} onChange={(e) => handleChange('source', e.target.value)}>
                  <option value="">— Select —</option>
                  {SOURCE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className={styles.field}>
                <label>USM Online Link</label>
                <input
                  value={editing.website || ''}
                  onChange={(e) => handleChange('website', e.target.value)}
                  placeholder="https://aquila.usm.edu/..."
                  disabled={editing.source !== 'USM Online'}
                />
              </div>
            </div>

            {msg && <p className={msg.startsWith('Error') ? styles.error : styles.success}>{msg}</p>}

            <div className={styles.formActions}>
              <button onClick={() => setEditing(null)} className={styles.cancelBtn}>Cancel</button>
              <button onClick={save} disabled={saving || !editing.title} className={styles.saveBtn}>
                {saving ? 'Saving…' : editing.id ? 'Save Changes' : 'Add Cookbook'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── List ── */
  return (
    <div className={styles.wrap}>
      <div className={styles.listHeader}>
        <div className={styles.listHeaderLeft}>
          <h3>Cookbook Inventory</h3>
          <span className={styles.count}>{cookbooks.length} cookbooks</span>
        </div>
        <button className={styles.addBtn} onClick={() => setEditing({ ...EMPTY })}>+ Add Cookbook</button>
      </div>

      <input
        className={styles.search}
        type="text"
        placeholder="Search by title, author, community, county…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <p className={styles.loading}>Loading…</p>
      ) : (
        <div className={styles.table}>
          <div className={styles.tableHead}>
            <span>Title</span>
            <span>Community</span>
            <span>Date</span>
            <span>Source</span>
            <span></span>
          </div>
          {filtered.length === 0 && <p className={styles.empty}>No results.</p>}
          {filtered.map((c) => (
            <div key={c.id} className={styles.tableRow}>
              <span className={styles.rowTitle}>{c.title}</span>
              <span className={styles.rowMeta}>{c.community}{c.county ? `, ${c.county} Co.` : ''}</span>
              <span className={styles.rowDate}>{c.date || '—'}</span>
              <span className={styles.rowSource}>{c.source || '—'}</span>
              <span className={styles.rowActions}>
                <button onClick={() => setEditing({ ...c })} className={styles.editBtn}>Edit</button>
                <button onClick={() => deleteCookbook(c.id, c.title)} className={styles.deleteBtn}>Delete</button>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
