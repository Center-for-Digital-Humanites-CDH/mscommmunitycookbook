'use client';

import { useState, useEffect, useRef } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import dynamic from 'next/dynamic';
import type { RichEditorHandle } from './RichEditor';
import styles from './page.module.css';

const RichEditor = dynamic(() => import('./RichEditor'), { ssr: false });
const CookbookAdmin = dynamic(() => import('./CookbookAdmin'), { ssr: false });
const LandscapesAdmin = dynamic(() => import('./LandscapesAdmin'), { ssr: false });

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  background_image: string;
  published: boolean;
  date: string;
}

const EMPTY: Omit<Post, 'id'> = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  author: 'Dr. Andrew Haley',
  category: '',
  background_image: '',
  published: false,
  date: new Date().toISOString().split('T')[0],
};


export default function AdminDashboard({ supabase }: { supabase: SupabaseClient }) {
  const [section, setSection] = useState<'cookbooks' | 'landscapes' | 'posts'>('cookbooks');
  const [posts, setPosts] = useState<Post[]>([]);
  const [editing, setEditing] = useState<Partial<Post> | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [view, setView] = useState<'list' | 'editor'>('list');
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const heroFileRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<RichEditorHandle>(null);
  const [heroUploading, setHeroUploading] = useState(false);
  const [heroUploadMsg, setHeroUploadMsg] = useState('');

  async function loadPosts() {
    const { data } = await supabase
      .from('posts')
      .select('*')
      .order('date', { ascending: false });
    if (data) setPosts(data);
  }

  useEffect(() => { loadPosts(); }, []);

  function newPost() {
    setEditing({ ...EMPTY });
    setView('editor');
    setUploadMsg('');
  }

  function editPost(post: Post) {
    setEditing({ ...post });
    setView('editor');
    setUploadMsg('');
  }

  function autoSlug(title: string) {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  function handleChange(field: keyof Post, value: string | boolean) {
    setEditing((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === 'title' && !prev?.id) {
        updated.slug = autoSlug(value as string);
      }
      return updated;
    });
  }

  async function uploadImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadMsg('Uploading…');

    const ext = file.name.split('.').pop();
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error } = await supabase.storage
      .from('post-images')
      .upload(filename, file, { cacheControl: '3600', upsert: false });

    if (error) {
      setUploadMsg('Upload failed: ' + error.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from('post-images').getPublicUrl(filename);
    editorRef.current?.insertImage(data.publicUrl);
    setUploadMsg('✓ Image inserted into editor');
    setUploading(false);
    if (fileRef.current) fileRef.current.value = '';
  }

  async function uploadHeroImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setHeroUploading(true);
    setHeroUploadMsg('Uploading…');

    const ext = file.name.split('.').pop();
    const filename = `hero-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error } = await supabase.storage
      .from('post-images')
      .upload(filename, file, { cacheControl: '3600', upsert: false });

    if (error) {
      setHeroUploadMsg('Upload failed: ' + error.message);
      setHeroUploading(false);
      return;
    }

    const { data } = supabase.storage.from('post-images').getPublicUrl(filename);
    handleChange('background_image', data.publicUrl);
    setHeroUploadMsg('✓ Uploaded and set as hero image');
    setHeroUploading(false);
    if (heroFileRef.current) heroFileRef.current.value = '';
  }

  async function save() {
    if (!editing) return;
    setSaving(true);
    setMsg('');

    const payload = {
      title: editing.title,
      slug: editing.slug,
      excerpt: editing.excerpt,
      content: editing.content,
      author: editing.author,
      category: editing.category,
      background_image: editing.background_image,
      published: editing.published,
      date: editing.date,
    };

    let error;
    if (editing.id) {
      ({ error } = await supabase.from('posts').update(payload).eq('id', editing.id));
    } else {
      ({ error } = await supabase.from('posts').insert(payload));
    }

    setSaving(false);
    if (error) {
      setMsg('Error: ' + error.message);
    } else {
      setMsg('Saved!');
      await loadPosts();
      setTimeout(() => { setMsg(''); setView('list'); }, 1200);
    }
  }

  async function deletePost(id: string) {
    if (!confirm('Delete this post permanently?')) return;
    await supabase.from('posts').delete().eq('id', id);
    await loadPosts();
  }

  async function signOut() {
    await supabase.auth.signOut();
    window.location.reload();
  }

  if (view === 'editor' && editing) {
    return (
      <div className={styles.dashboard}>
        <div className={styles.topBar}>
          <button className={styles.backBtn} onClick={() => setView('list')}>← All Posts</button>
          <h2>{editing.id ? 'Edit Post' : 'New Post'}</h2>
          <button className={styles.signOutBtn} onClick={signOut}>Sign out</button>
        </div>

        <div className={styles.editorGrid}>
          {/* ── Main column ── */}
          <div className={styles.editorMain}>
            <div className={styles.field}>
              <label>Title</label>
              <input value={editing.title || ''} onChange={(e) => handleChange('title', e.target.value)} placeholder="Post title" />
            </div>
            <div className={styles.field}>
              <label>Slug (URL path)</label>
              <input value={editing.slug || ''} onChange={(e) => handleChange('slug', e.target.value)} placeholder="post-url-slug" />
            </div>
            <div className={styles.field}>
              <label>Excerpt</label>
              <textarea rows={3} value={editing.excerpt || ''} onChange={(e) => handleChange('excerpt', e.target.value)} placeholder="Short summary shown on the blog list (1–2 sentences)..." />
            </div>

            {/* ── Image upload ── */}
            <div className={styles.imageUploadBox}>
              <div className={styles.imageUploadHeader}>
                <span className={styles.imageUploadTitle}>📷 Insert Image into Post</span>
                <span className={styles.imageUploadSub}>Click where you want the image in the editor below, then upload here</span>
              </div>
              <div className={styles.imageUploadRow}>
                <input ref={fileRef} type="file" accept="image/*" onChange={uploadImage} className={styles.fileInput} disabled={uploading} />
                <span className={styles.imageUploadHint}>JPG, PNG, WEBP supported</span>
              </div>
              {uploadMsg && <p className={styles.uploadMsg}>{uploadMsg}</p>}
            </div>

            {/* ── Rich text editor ── */}
            <div className={styles.field}>
              <label>Content</label>
              <RichEditor
                ref={editorRef}
                value={editing.content || ''}
                onChange={(html) => handleChange('content', html)}
              />
            </div>
          </div>

          {/* ── Sidebar ── */}
          <div className={styles.editorSidebar}>
            <div className={styles.sideCard}>
              <h3>Publish</h3>
              <label className={styles.toggle}>
                <input type="checkbox" checked={editing.published || false} onChange={(e) => handleChange('published', e.target.checked)} />
                <span>{editing.published ? 'Published — visible on site' : 'Draft — hidden from site'}</span>
              </label>
              {msg && <p className={msg.startsWith('Error') ? styles.error : styles.success}>{msg}</p>}
              <button onClick={save} disabled={saving} className={styles.saveBtn}>
                {saving ? 'Saving…' : 'Save Post'}
              </button>
            </div>

            <div className={styles.sideCard}>
              <h3>Details</h3>
              <div className={styles.field}>
                <label>Date</label>
                <input type="date" value={(editing.date || '').split('T')[0]} onChange={(e) => handleChange('date', e.target.value)} />
              </div>
              <div className={styles.field}>
                <label>Author</label>
                <input value={editing.author || ''} onChange={(e) => handleChange('author', e.target.value)} />
              </div>
              <div className={styles.field}>
                <label>Category</label>
                <input value={editing.category || ''} onChange={(e) => handleChange('category', e.target.value)} placeholder="e.g. Food History" />
              </div>
              <div className={styles.field}>
                <label>Hero Background Image</label>
                <p className={styles.fieldHint}>The large image behind the post title. Upload from your laptop or type a URL.</p>
                <input
                  ref={heroFileRef}
                  type="file"
                  accept="image/*"
                  onChange={uploadHeroImage}
                  className={styles.fileInput}
                  disabled={heroUploading}
                />
                {heroUploadMsg && <p className={styles.uploadMsg}>{heroUploadMsg}</p>}
                <input
                  value={editing.background_image || ''}
                  onChange={(e) => handleChange('background_image', e.target.value)}
                  placeholder="https://... or /images/file.jpg"
                  style={{ marginTop: '0.5rem' }}
                />
                {editing.background_image && (
                  <img src={editing.background_image} alt="preview" className={styles.imgPreview} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.topBar}>
        <h2>Admin</h2>
        <div className={styles.topActions}>
          <button className={styles.signOutBtn} onClick={signOut}>Sign out</button>
        </div>
      </div>

      <div className={styles.sectionTabs}>
        <button
          className={`${styles.sectionTab} ${section === 'cookbooks' ? styles.sectionTabActive : ''}`}
          onClick={() => setSection('cookbooks')}
        >
          Cookbooks
        </button>
        <button
          className={`${styles.sectionTab} ${section === 'landscapes' ? styles.sectionTabActive : ''}`}
          onClick={() => setSection('landscapes')}
        >
          Culinary Landscapes
        </button>
        <button
          className={`${styles.sectionTab} ${section === 'posts' ? styles.sectionTabActive : ''}`}
          onClick={() => setSection('posts')}
        >
          Culinary Tales Posts
        </button>
      </div>

      {section === 'cookbooks' ? (
        <CookbookAdmin supabase={supabase} />
      ) : section === 'landscapes' ? (
        <LandscapesAdmin supabase={supabase} />
      ) : (
        <>
          <div className={styles.postListHeader}>
            <span />
            <button className={styles.newBtn} onClick={newPost}>+ New Post</button>
          </div>
          <div className={styles.postList}>
            {posts.length === 0 && <p className={styles.empty}>No posts yet. Create your first one!</p>}
            {posts.map((post) => (
              <div key={post.id} className={styles.postRow}>
                <div className={styles.postRowMain}>
                  <span className={post.published ? styles.badgePublished : styles.badgeDraft}>
                    {post.published ? 'Published' : 'Draft'}
                  </span>
                  <span className={styles.postRowTitle}>{post.title}</span>
                  <span className={styles.postRowDate}>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                </div>
                <div className={styles.postRowActions}>
                  <button onClick={() => editPost(post)} className={styles.editBtn}>Edit</button>
                  <button onClick={() => deletePost(post.id)} className={styles.deleteBtn}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
