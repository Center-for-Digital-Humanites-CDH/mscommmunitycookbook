import Image from '@tiptap/extension-image';
import { mergeAttributes } from '@tiptap/react';

export type FigureSize = 'small' | 'medium' | 'full';

// Image with an optional caption and display size.
// Saved as <figure data-size="medium"><img><figcaption>…</figcaption></figure>
// so the public post page can style it without any extra code.
const FigureImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      caption: {
        default: null,
        parseHTML: (el: HTMLElement) =>
          el.tagName === 'FIGURE' ? el.querySelector('figcaption')?.textContent || null : null,
        renderHTML: () => ({}),
      },
      size: {
        default: 'full',
        parseHTML: (el: HTMLElement) =>
          el.closest('figure')?.getAttribute('data-size') || el.getAttribute('data-size') || 'full',
        renderHTML: () => ({}),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'figure',
        getAttrs: (el: HTMLElement) => {
          const img = el.querySelector('img');
          if (!img) return false;
          return { src: img.getAttribute('src'), alt: img.getAttribute('alt'), title: img.getAttribute('title') };
        },
      },
      { tag: 'img[src]' },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    const size = (node.attrs.size as FigureSize) || 'full';
    const img = ['img', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)];
    return node.attrs.caption
      ? ['figure', { 'data-size': size }, img, ['figcaption', {}, node.attrs.caption]]
      : ['figure', { 'data-size': size }, img];
  },
}).configure({ inline: false, allowBase64: false });

export default FigureImage;
