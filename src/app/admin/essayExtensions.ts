import { Extension } from '@tiptap/react';
import Superscript from '@tiptap/extension-superscript';
import FigureImage from './FigureImage';

// Footnotes link a superscript number (<a id="ref-1" href="#fn-1">) to a list item (<li id="fn-1">)
// and back. The editor drops unknown attributes, so keep `id` on links and list items, and `style`
// on paragraphs (used for the italic epigraphs at the top of an essay).
const KeepAttributes = Extension.create({
  name: 'keepAttributes',
  addGlobalAttributes() {
    return [
      {
        types: ['link', 'listItem', 'heading'],
        attributes: {
          id: {
            default: null,
            parseHTML: (el) => el.getAttribute('id'),
            renderHTML: (attrs) => (attrs.id ? { id: attrs.id } : {}),
          },
        },
      },
      {
        types: ['paragraph'],
        attributes: {
          style: {
            default: null,
            parseHTML: (el) => el.getAttribute('style'),
            renderHTML: (attrs) => (attrs.style ? { style: attrs.style } : {}),
          },
        },
      },
    ];
  },
});

// Extra editor features used only for Experimental Kitchen essays
export const essayExtensions = [Superscript, FigureImage, KeepAttributes];
