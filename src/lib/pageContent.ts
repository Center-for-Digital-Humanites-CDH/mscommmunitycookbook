import { supabase } from './supabase';
import { getPageDef, pageDefaults } from '@/content/pages';

// Returns every editable field for a page: saved edits from Supabase on top of the defaults.
export async function getPageContent(pageId: string): Promise<Record<string, string>> {
  const page = getPageDef(pageId);
  if (!page) throw new Error(`Unknown page: ${pageId}`);

  const content = pageDefaults(page);
  const { data } = await supabase.from('page_content').select('key, value').eq('page', pageId);
  for (const row of data || []) {
    if (row.key in content) content[row.key] = row.value;
  }
  return content;
}
