'use client';

import { useState, useEffect, useCallback } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import dynamic from 'next/dynamic';
import { PAGES, pageDefaults, type PageDef, type PageField } from '@/content/pages';
import type { CookbookRow } from '@/lib/landscapeStats';
import ChartEditor from './ChartEditor';
import ListEditor from './ListEditor';
import { ImageField, positionPercent } from './PageFieldInputs';
import admin from './page.module.css';
import styles from './PagesAdmin.module.css';

const RichEditor = dynamic(() => import('./RichEditor'), { ssr: false });

export default function PagesAdmin({ supabase, onDirtyChange }: {
  supabase: SupabaseClient;
  onDirtyChange?: (dirty: boolean) => void;
}) {
  const [page, setPage] = useState<PageDef>(PAGES[0]);
  const [values, setValues] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [cookbookRows, setCookbookRows] = useState<CookbookRow[] | null>(null);

  const defaults = pageDefaults(page);
  const hasCharts = page.groups.some((g) => g.fields.some((f) => f.type === 'chart'));
  const changedKeys = Object.keys(values).filter((k) => values[k] !== saved[k]);
  const dirty = changedKeys.length > 0;

  const fetchPage = useCallback(
    (p: PageDef) => supabase.from('page_content').select('key, value').eq('page', p.id),
    [supabase],
  );

  function applyRows(p: PageDef, rows: { key: string; value: string }[] | null) {
    const content = pageDefaults(p);
    for (const row of rows || []) if (row.key in content) content[row.key] = row.value;
    setValues(content);
    setSaved(content);
    setLoading(false);
  }

  useEffect(() => {
    fetchPage(page).then(({ data, error }) => {
      if (error) setMsg('Error: ' + error.message);
      applyRows(page, data);
    });
  }, [page, fetchPage]);

  // Charts count from the cookbook list, so load it once when a page with charts is opened
  useEffect(() => {
    if (!hasCharts || cookbookRows) return;
    supabase.from('cookbooks').select('date, organization, county').then(({ data }) => setCookbookRows(data || []));
  }, [hasCharts, cookbookRows, supabase]);

  useEffect(() => { onDirtyChange?.(dirty); }, [dirty, onDirtyChange]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  function choosePage(next: PageDef) {
    if (next.id === page.id) return;
    if (dirty && !confirm('You have unsaved changes on this page. Leave without saving?')) return;
    setLoading(true);
    setMsg('');
    setPage(next);
  }

  function set(key: string, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setMsg('');
  }

  async function save() {
    if (!dirty || saving) return;
    setSaving(true);
    setMsg('');

    // Fields put back to their original text don't need a row
    const toDelete = changedKeys.filter((k) => values[k] === defaults[k]);
    const toUpsert = changedKeys
      .filter((k) => values[k] !== defaults[k])
      .map((key) => ({ page: page.id, key, value: values[key], updated_at: new Date().toISOString() }));

    const results = await Promise.all([
      toUpsert.length ? supabase.from('page_content').upsert(toUpsert) : null,
      toDelete.length ? supabase.from('page_content').delete().eq('page', page.id).in('key', toDelete) : null,
    ]);
    const error = results.find((r) => r?.error)?.error;
    if (error) {
      setSaving(false);
      setMsg('Error: ' + error.message);
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();
    await fetch('/api/admin/revalidate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session?.access_token}` },
      body: JSON.stringify({ path: page.path }),
    }).catch(() => {});

    setSaved(values);
    setSaving(false);
    setMsg('✓ Saved. The changes are live on the site now.');
  }

  function renderInput(field: PageField) {
    const value = values[field.key] ?? '';
    switch (field.type) {
      case 'rich':
        return <RichEditor value={value} onChange={(html) => set(field.key, html)} placeholder="Write the text for this part of the page…" />;
      case 'image':
        return <ImageField value={value} onChange={(url) => set(field.key, url)} supabase={supabase} />;
      case 'list':
        return <ListEditor field={field} value={value} onChange={(json) => set(field.key, json)} supabase={supabase} />;
      case 'chart':
        return <ChartEditor kind={field.chart!} numbersKey={field.key} values={values} set={set} rows={cookbookRows} />;
      case 'lines':
        return <textarea rows={3} value={value} onChange={(e) => set(field.key, e.target.value)} />;
      case 'number':
        return (
          <input
            type="number"
            min={0}
            className={styles.numberInput}
            value={value}
            onChange={(e) => set(field.key, e.target.value.replace(/[^0-9]/g, ''))}
          />
        );
      case 'position': {
        // The photo and label this position belongs to, e.g. hero.position → hero.image / hero.title
        const base = field.key.replace(/position$/, '');
        const percent = positionPercent(value);
        return (
          <div className={styles.positionField}>
            <div
              className={styles.bannerPreview}
              style={{
                aspectRatio: field.aspect || '16 / 6',
                backgroundImage: `url(${values[`${base}image`]})`,
                backgroundPosition: `center ${percent}%`,
              }}
            >
              <span>{(values[`${base}title`] || '').replace(/\n/g, ' ')}</span>
            </div>
            <div className={styles.sliderRow}>
              <span>Top of photo</span>
              <input
                type="range"
                min={0}
                max={100}
                value={percent}
                onChange={(e) => set(field.key, `center ${e.target.value}%`)}
              />
              <span>Bottom of photo</span>
            </div>
          </div>
        );
      }
      default:
        return <input value={value} onChange={(e) => set(field.key, e.target.value)} />;
    }
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.pagePicker}>
        <span className={styles.pickerLabel}>Choose a page to edit</span>
        <div className={styles.pickerList}>
          {PAGES.map((p) => (
            <button
              key={p.id}
              className={`${styles.pageBtn} ${p.id === page.id ? styles.pageBtnActive : ''}`}
              onClick={() => choosePage(p)}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className={admin.empty}>Loading…</p>
      ) : (
        <>
          <p className={styles.intro}>
            Edit the text and photos on the <strong>{page.name}</strong> page.
            Anything you haven&rsquo;t changed shows the original wording. Click <strong>Save changes</strong> at the bottom when you&rsquo;re done.
          </p>

          {page.groups.map((group) => (
            <section key={group.title} className={styles.group}>
              <h4 className={styles.groupTitle}>{group.title}</h4>
              {group.fields.filter((f) => !f.hidden).map((field) => {
                const keys = field.edits ?? [field.key];
                const edited = keys.some((k) => values[k] !== defaults[k]);
                return (
                  <div key={field.key} className={styles.field}>
                    <div className={styles.fieldHead}>
                      <label>{field.label}</label>
                      {edited && (
                        <>
                          <span className={styles.editedTag}>Edited</span>
                          <button
                            type="button"
                            className={styles.resetBtn}
                            onClick={() => {
                              if (!confirm(`Put back the original version of ${field.type === 'chart' ? 'this chart' : 'this field'}?`)) return;
                              setValues((prev) => ({ ...prev, ...Object.fromEntries(keys.map((k) => [k, defaults[k]])) }));
                            }}
                          >
                            Reset to original
                          </button>
                        </>
                      )}
                    </div>
                    {field.hint && <p className={admin.fieldHint}>{field.hint}</p>}
                    {renderInput(field)}
                  </div>
                );
              })}
            </section>
          ))}
        </>
      )}

      <div className={styles.saveBar}>
        <span className={dirty ? styles.unsaved : styles.allSaved}>
          {dirty ? `● ${changedKeys.length} unsaved change${changedKeys.length === 1 ? '' : 's'}` : msg || '✓ All changes saved'}
        </span>
        {msg.startsWith('Error') && <span className={admin.error}>{msg}</span>}
        <a href={page.path} target="_blank" rel="noopener noreferrer" className={admin.backBtn}>View page ↗</a>
        <button onClick={save} disabled={!dirty || saving} className={styles.saveBtn}>
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </div>
  );
}
