'use client';

import { useState } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import dynamic from 'next/dynamic';
import { parseList, type ListItem, type PageField } from '@/content/pages';
import { ImageField, positionPercent } from './PageFieldInputs';
import admin from './page.module.css';
import styles from './ListEditor.module.css';

const RichEditor = dynamic(() => import('./RichEditor'), { ssr: false });

interface Props {
  field: PageField;
  value: string;
  onChange: (json: string) => void;
  supabase: SupabaseClient;
}

function newId() {
  return Math.random().toString(36).slice(2, 10);
}

export default function ListEditor({ field, value, onChange, supabase }: Props) {
  const items = parseList(value);
  const [open, setOpen] = useState<string | null>(null);
  const itemName = field.itemName || 'entry';

  const save = (next: ListItem[]) => onChange(JSON.stringify(next));

  function update(id: string, key: string, v: string) {
    save(items.map((item) => (item.id === id ? { ...item, [key]: v } : item)));
  }

  function move(index: number, by: number) {
    const next = [...items];
    const [item] = next.splice(index, 1);
    next.splice(index + by, 0, item);
    save(next);
  }

  function remove(item: ListItem) {
    if (!confirm(`Remove ${item.name || `this ${itemName}`} from the page?`)) return;
    save(items.filter((i) => i.id !== item.id));
  }

  function add() {
    const item: ListItem = { id: newId(), name: '' };
    for (const f of field.itemFields || []) if (f.key !== 'name') item[f.key] = f.type === 'position' ? 'center' : '';
    save([...items, item]);
    setOpen(item.id);
  }

  return (
    <div className={styles.list}>
      {items.map((item, i) => {
        const isOpen = open === item.id;
        return (
          <div key={item.id} className={`${styles.item} ${isOpen ? styles.itemOpen : ''}`}>
            <div className={styles.itemHead}>
              {item.image
                ? <img src={item.image} alt="" className={styles.thumb} />
                : <span className={styles.thumb} />}
              <button type="button" className={styles.itemTitle} onClick={() => setOpen(isOpen ? null : item.id)}>
                {item.name || <em>Unnamed {itemName}</em>}
              </button>
              <div className={styles.itemActions}>
                <button type="button" title="Move up" disabled={i === 0} onClick={() => move(i, -1)}>↑</button>
                <button type="button" title="Move down" disabled={i === items.length - 1} onClick={() => move(i, 1)}>↓</button>
                <button type="button" className={admin.editBtn} onClick={() => setOpen(isOpen ? null : item.id)}>
                  {isOpen ? 'Done' : 'Edit'}
                </button>
                <button type="button" className={admin.deleteBtn} onClick={() => remove(item)}>Remove</button>
              </div>
            </div>

            {isOpen && (
              <div className={styles.itemBody}>
                {(field.itemFields || []).map((f) => {
                  const v = item[f.key] ?? '';
                  return (
                    <div key={f.key} className={styles.field}>
                      <label>{f.label}</label>
                      {f.hint && <p className={admin.fieldHint}>{f.hint}</p>}
                      {f.type === 'rich' && (
                        <RichEditor value={v} onChange={(html) => update(item.id, f.key, html)} placeholder="Write here…" />
                      )}
                      {f.type === 'image' && (
                        <ImageField value={v} onChange={(url) => update(item.id, f.key, url)} supabase={supabase} />
                      )}
                      {f.type === 'lines' && (
                        <textarea rows={4} value={v} onChange={(e) => update(item.id, f.key, e.target.value)} />
                      )}
                      {f.type === 'text' && (
                        <input value={v} onChange={(e) => update(item.id, f.key, e.target.value)} />
                      )}
                      {f.type === 'position' && (
                        <div className={styles.position}>
                          <div
                            className={styles.positionPreview}
                            style={{
                              aspectRatio: f.aspect || '4 / 5',
                              backgroundImage: item.image ? `url(${item.image})` : undefined,
                              backgroundPosition: `center ${positionPercent(v)}%`,
                            }}
                          />
                          <div className={styles.slider}>
                            <span>Top</span>
                            <input
                              type="range"
                              min={0}
                              max={100}
                              value={positionPercent(v)}
                              onChange={(e) => update(item.id, f.key, `center ${e.target.value}%`)}
                            />
                            <span>Bottom</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      <button type="button" className={styles.addBtn} onClick={add}>+ Add a {itemName}</button>
    </div>
  );
}
