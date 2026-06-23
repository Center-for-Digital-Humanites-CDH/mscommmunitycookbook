import { supabase } from './supabase';
import { remark } from 'remark';
import remarkHtml from 'remark-html';

export interface Post {
  id?: string;
  slug: string;
  title: string;
  date: string;
  author: string;
  excerpt: string;
  background_image: string;
  category?: string;
  published: boolean;
  content?: string;
}

export async function getAllPosts(): Promise<Post[]> {
  const { data, error } = await supabase
    .from('posts')
    .select('id, slug, title, date, author, excerpt, background_image, category, published')
    .eq('published', true)
    .order('date', { ascending: false });

  if (error || !data) return [];
  return data as Post[];
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (error || !data) return null;

  const processed = await remark().use(remarkHtml).process(data.content || '');
  return { ...data, content: processed.toString() } as Post;
}
