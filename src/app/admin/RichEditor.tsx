'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { useEffect, useImperativeHandle, useRef, useState, forwardRef } from 'react';
import { essayExtensions } from './essayExtensions';
import styles from './RichEditor.module.css';

export interface RichEditorHandle {
  insertImage: (url: string) => void;
  getHTML: () => string;
}

interface Props {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  // 'essay' adds footnote numbers, small headings and pictures with captions
  variant?: 'post' | 'essay';
  // Needed for the essay image button: uploads a photo and returns its address
  onUploadImage?: (file: File) => Promise<string>;
}

const RichEditor = forwardRef<RichEditorHandle, Props>(({ value, onChange, placeholder, variant = 'post', onUploadImage }, ref) => {
  const essay = variant === 'essay';
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const editor = useEditor({
    extensions: essay
      ? [
          StarterKit.configure({ heading: { levels: [2, 3, 4] }, link: false, underline: false }),
          Underline,
          Link.configure({ openOnClick: false, HTMLAttributes: { rel: 'noopener noreferrer' } }),
          ...essayExtensions,
          Placeholder.configure({ placeholder: placeholder || 'Write the essay here…' }),
        ]
      : [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: 'noopener noreferrer' },
      }),
      Image.configure({ inline: false }),
      Placeholder.configure({
        placeholder: placeholder || 'Start writing your post here…',
      }),
    ],
    content: value || '',
    editorProps: {
      attributes: {
        class: styles.editorArea,
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '', { emitUpdate: false });
    }
  }, [value, editor]);

  useImperativeHandle(ref, () => ({
    insertImage(url: string) {
      editor?.chain().focus().setImage({ src: url }).run();
    },
    getHTML() {
      return editor?.getHTML() ?? '';
    },
  }));

  function setLink() {
    const prev = editor?.getAttributes('link').href ?? '';
    const url = window.prompt('Enter URL:', prev);
    if (url === null) return;
    if (url === '') {
      editor?.chain().focus().unsetLink().run();
    } else {
      editor?.chain().focus().setLink({ href: url }).run();
    }
  }

  async function insertPicture(file: File | undefined) {
    if (!file || !onUploadImage || !editor) return;
    setUploading(true);
    try {
      const src = await onUploadImage(file);
      const caption = window.prompt('Caption under the picture (optional):', '') || null;
      editor.chain().focus().insertContent({ type: 'image', attrs: { src, alt: caption || '', caption } }).run();
    } catch (err) {
      alert((err as Error).message);
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = '';
  }

  if (!editor) return null;

  const btn = (active: boolean) =>
    `${styles.toolBtn} ${active ? styles.toolBtnActive : ''}`;

  return (
    <div className={styles.wrapper}>
      <div className={styles.toolbar}>
        {/* History */}
        <button type="button" title="Undo" className={styles.toolBtn} onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
          ↩
        </button>
        <button type="button" title="Redo" className={styles.toolBtn} onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
          ↪
        </button>

        <div className={styles.divider} />

        {/* Headings */}
        <button type="button" title="Heading 2" className={btn(editor.isActive('heading', { level: 2 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          H2
        </button>
        <button type="button" title="Heading 3" className={btn(editor.isActive('heading', { level: 3 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
          H3
        </button>
        {essay && (
          <button type="button" title="Small heading (e.g. Footnotes)" className={btn(editor.isActive('heading', { level: 4 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}>
            H4
          </button>
        )}

        <div className={styles.divider} />

        {/* Inline formatting */}
        <button type="button" title="Bold" className={btn(editor.isActive('bold'))} onClick={() => editor.chain().focus().toggleBold().run()}>
          <strong>B</strong>
        </button>
        <button type="button" title="Italic" className={btn(editor.isActive('italic'))} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <em>I</em>
        </button>
        <button type="button" title="Underline" className={btn(editor.isActive('underline'))} onClick={() => editor.chain().focus().toggleUnderline().run()}>
          <span style={{ textDecoration: 'underline' }}>U</span>
        </button>
        {essay && (
          <button type="button" title="Footnote number (superscript)" className={btn(editor.isActive('superscript'))} onClick={() => editor.chain().focus().toggleSuperscript().run()}>
            x²
          </button>
        )}

        <div className={styles.divider} />

        {/* Lists */}
        <button type="button" title="Bullet List" className={btn(editor.isActive('bulletList'))} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          ≡•
        </button>
        <button type="button" title="Numbered List" className={btn(editor.isActive('orderedList'))} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          ≡1
        </button>

        <div className={styles.divider} />

        {/* Block */}
        <button type="button" title="Blockquote" className={btn(editor.isActive('blockquote'))} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          ❝
        </button>
        <button type="button" title="Horizontal Rule" className={styles.toolBtn} onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          —
        </button>

        <div className={styles.divider} />

        {/* Link */}
        <button type="button" title={editor.isActive('link') ? 'Edit link' : 'Insert link'} className={btn(editor.isActive('link'))} onClick={setLink}>
          🔗
        </button>
        {editor.isActive('link') && (
          <button type="button" title="Remove link" className={styles.toolBtn} onClick={() => editor.chain().focus().unsetLink().run()}>
            ✂
          </button>
        )}

        {essay && onUploadImage && (
          <>
            <div className={styles.divider} />
            <button type="button" title="Insert a picture with a caption" className={styles.toolBtn} disabled={uploading} onClick={() => fileRef.current?.click()}>
              {uploading ? 'Uploading…' : '🖼 Picture'}
            </button>
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => insertPicture(e.target.files?.[0])} />
          </>
        )}
      </div>

      <EditorContent editor={editor} />
    </div>
  );
});

RichEditor.displayName = 'RichEditor';
export default RichEditor;
