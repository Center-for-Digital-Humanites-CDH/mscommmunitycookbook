import { parseList } from '@/content/pages';

export interface Essay {
  slug: string;
  title: string;
  subtitle: string;
  cardImage: string;
  cardImageAlt: string;
  content: string;
}

function toSlug(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// Essays as edited in the admin (Pages → Experimental Kitchen → Essays)
export function essaysFromContent(json: string | undefined): Essay[] {
  return parseList(json)
    .map((item) => ({
      slug: toSlug(item.slug || item.title || ''),
      title: item.title || '',
      subtitle: item.subtitle || '',
      cardImage: item.cardImage || '',
      cardImageAlt: item.cardImageAlt || '',
      content: item.content || '',
    }))
    .filter((e) => e.slug && e.title);
}
