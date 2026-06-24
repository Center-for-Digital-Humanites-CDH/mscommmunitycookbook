'use client';

import { useState, useEffect } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import styles from './LandscapesAdmin.module.css';

export default function LandscapesAdmin({ supabase }: { supabase: SupabaseClient }) {
  const [local, setLocal] = useState('');
  const [national, setNational] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('site_settings')
        .select('key, value')
        .in('key', ['publisher_local', 'publisher_national']);
      if (data) {
        data.forEach((row) => {
          if (row.key === 'publisher_local') setLocal(row.value);
          if (row.key === 'publisher_national') setNational(row.value);
        });
      }
      setLoading(false);
    }
    load();
  }, []);

  async function save() {
    if (!local || !national) return;
    setSaving(true);
    setMsg('');

    const updates = [
      supabase.from('site_settings').upsert({ key: 'publisher_local', value: local }),
      supabase.from('site_settings').upsert({ key: 'publisher_national', value: national }),
    ];

    const results = await Promise.all(updates);
    const err = results.find((r) => r.error)?.error;

    setSaving(false);
    if (err) {
      setMsg('Error: ' + err.message);
    } else {
      setMsg('Saved! The Culinary Landscapes page will update immediately.');
      setTimeout(() => setMsg(''), 3000);
    }
  }

  if (loading) return <p className={styles.loading}>Loading…</p>;

  const localNum = parseInt(local) || 0;
  const nationalNum = parseInt(national) || 0;
  const total = localNum + nationalNum;
  const localPct = total > 0 ? ((localNum / total) * 100).toFixed(1) : '0.0';
  const nationalPct = total > 0 ? ((nationalNum / total) * 100).toFixed(1) : '0.0';

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <h3>Culinary Landscapes — Publisher Distribution</h3>
        <p className={styles.sub}>
          These two numbers appear in the &ldquo;Publisher Types: Local versus National&rdquo; chart.
          All other statistics (decades, organizations, counties) calculate automatically from the cookbooks table.
        </p>
      </div>

      <div className={styles.card}>
        <div className={styles.fields}>
          <div className={styles.field}>
            <label>Local Publishers</label>
            <p className={styles.hint}>Cookbooks printed by a local printer or self-published</p>
            <input
              type="number"
              min="0"
              value={local}
              onChange={(e) => setLocal(e.target.value)}
              placeholder="e.g. 146"
            />
          </div>
          <div className={styles.field}>
            <label>National Publishers</label>
            <p className={styles.hint}>Cookbooks printed by a national publishing company</p>
            <input
              type="number"
              min="0"
              value={national}
              onChange={(e) => setNational(e.target.value)}
              placeholder="e.g. 130"
            />
          </div>
        </div>

        {(localNum > 0 || nationalNum > 0) && (
          <div className={styles.preview}>
            <span className={styles.previewLabel}>Preview</span>
            <div className={styles.previewRow}>
              <span className={styles.previewName}>Local Publishers</span>
              <span className={styles.previewCount}>{localNum}</span>
              <span className={styles.previewPct}>{localPct}%</span>
            </div>
            <div className={styles.previewRow}>
              <span className={styles.previewName}>National Publishers</span>
              <span className={styles.previewCount}>{nationalNum}</span>
              <span className={styles.previewPct}>{nationalPct}%</span>
            </div>
            <div className={styles.previewTotal}>Total: {total} cookbooks</div>
          </div>
        )}

        {msg && <p className={msg.startsWith('Error') ? styles.error : styles.success}>{msg}</p>}

        <button onClick={save} disabled={saving || !local || !national} className={styles.saveBtn}>
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
