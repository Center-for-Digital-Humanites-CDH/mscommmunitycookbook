import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkHtml from 'remark-html';

const postsDir = path.join(process.cwd(), 'src/content/blog');

export interface Post {
  slug: string;
  title: string;
  date: string;
  author: string;
  excerpt: string;
  backgroundImage: string;
  category?: string;
  published: boolean;
  content?: string;
}

export function getAllPosts(): Post[] {
  if (!fs.existsSync(postsDir)) return [];

  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith('.md'));

  const posts = files.map((file) => {
    const raw = fs.readFileSync(path.join(postsDir, file), 'utf-8');
    const { data } = matter(raw);
    const fileSlug = file.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace('.md', '');

    return {
      slug: (data.slug as string) || fileSlug,
      title: (data.title as string) || '',
      date: (data.date as string) || '',
      author: (data.author as string) || '',
      excerpt: (data.excerpt as string) || '',
      backgroundImage: (data.backgroundImage as string) || '',
      category: data.category as string | undefined,
      published: Boolean(data.published),
    };
  });

  return posts
    .filter((p) => p.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  if (!fs.existsSync(postsDir)) return null;

  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith('.md'));

  for (const file of files) {
    const raw = fs.readFileSync(path.join(postsDir, file), 'utf-8');
    const { data, content } = matter(raw);
    const fileSlug = file.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace('.md', '');
    const postSlug = (data.slug as string) || fileSlug;

    if (postSlug === slug) {
      const processed = await remark().use(remarkHtml).process(content);
      return {
        slug: postSlug,
        title: (data.title as string) || '',
        date: (data.date as string) || '',
        author: (data.author as string) || '',
        excerpt: (data.excerpt as string) || '',
        backgroundImage: (data.backgroundImage as string) || '',
        category: data.category as string | undefined,
        published: Boolean(data.published),
        content: processed.toString(),
      };
    }
  }
  return null;
}
