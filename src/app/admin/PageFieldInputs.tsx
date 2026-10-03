'use client';

import { useState, useRef } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import admin from './page.module.css';
import styles from './PagesAdmin.module.css';

// Inputs shared by the Pages tab and its list editor

export async function uploadPageImage(supabase: SupabaseClient, file: File) {
  if (!file.type.startsWith('image/')) throw new Error('That file is not an image.');
  const ext = file.name.split('.').pop();
  const filename = `page-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage
    .from('post-images')
    .upload(filename, file, { cacheControl: '31536000', upsert: false });
  if (error) throw new Error('Upload failed: ' + error.message);
  return supabase.storage.from('post-images').getPublicUrl(filename).data.publicUrl;
}

export function ImageField({ value, onChange, supabase }: {
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
export function positionPercent(value: string) {
  const m = value.match(/(\d+)%/);
  if (m) return Number(m[1]);
  if (value.includes('top')) return 0;
  if (value.includes('bottom')) return 100;
  return 50;
}
