'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { useEffect, useImperativeHandle, forwardRef } from 'react';
import styles from './RichEditor.module.css';

export interface RichEditorHandle {
  insertImage: (url: string) => void;
  getHTML: () => string;
}

interface Props {
  value: string;
  onChange: (html: string) => void;
}

const RichEditor = forwardRef<RichEditorHandle, Props>(({ value, onChange }, ref) => {
  const editor = useEditor({
    extensions: [
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
        placeholder: 'Start writing your post here…',
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
      </div>

      <EditorContent editor={editor} />
    </div>
  );
});

RichEditor.displayName = 'RichEditor';
export default RichEditor;
