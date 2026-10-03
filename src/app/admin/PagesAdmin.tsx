'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import dynamic from 'next/dynamic';
import { PAGES, pageDefaults, type PageDef, type PageField } from '@/content/pages';
import admin from './page.module.css';
import styles from './PagesAdmin.module.css';

const RichEditor = dynamic(() => import('./RichEditor'), { ssr: false });

async function uploadPageImage(supabase: SupabaseClient, file: File) {
  if (!file.type.startsWith('image/')) throw new Error('That file is not an image.');
  const ext = file.name.split('.').pop();
  const filename = `page-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage
    .from('post-images')
    .upload(filename, file, { cacheControl: '31536000', upsert: false });
  if (error) throw new Error('Upload failed: ' + error.message);
  return supabase.storage.from('post-images').getPublicUrl(filename).data.publicUrl;
}

function ImageField({ value, onChange, supabase }: {
  value: string;
  onChange: (url: string) => void;
  supabase: SupabaseClient;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function upload(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      onChange(await uploadPageImage(supabase, file));
    } catch (err) {
      setError((err as Error).message);
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = '';
  }

  return (
    <div className={styles.imageField}>
      <div
        className={`${styles.dropzone} ${dragging ? styles.dropzoneActive : ''}`}
        onClick={() => !uploading && fileRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); upload(e.dataTransfer.files[0]); }}
      >
        {value
          ? <img src={value} alt="" className={styles.imagePreview} />
          : <span className={styles.dropText}>Drop a photo here or click to choose one</span>}
        {uploading && <span className={styles.dropOverlay}>Uploading…</span>}
      </div>
      <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => upload(e.target.files?.[0])} />
      <div className={styles.imageActions}>
        <button type="button" className={admin.editBtn} onClick={() => fileRef.current?.click()} disabled={uploading}>
          {value ? 'Replace photo' : 'Choose photo'}
        </button>
        <span className={styles.dropHint}>or drag a new photo onto it</span>
      </div>
      {error && <p className={admin.error}>{error}</p>}
    </div>
  );
}

// Positions are stored as CSS like 'center 30%'; the slider edits the percentage
function positionPercent(value: string) {
  const m = value.match(/(\d+)%/);
  if (m) return Number(m[1]);
  if (value.includes('top')) return 0;
  if (value.includes('bottom')) return 100;
  return 50;
}

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

  const defaults = pageDefaults(page);
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
      case 'lines':
        return <textarea rows={3} value={value} onChange={(e) => set(field.key, e.target.value)} />;
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
              {group.fields.map((field) => {
                const edited = values[field.key] !== defaults[field.key];
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
                            onClick={() => confirm('Put back the original version of this field?') && set(field.key, defaults[field.key])}
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
