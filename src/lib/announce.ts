import type { SupabaseClient } from '@supabase/supabase-js';

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://mscommunitycookbooks.usmcdh.org').replace(/\/$/, '');
const GMAIL_ACCOUNT = process.env.NEXT_PUBLIC_NEWSLETTER_GMAIL || '';
// Browsers start cutting off very long links, so past this we copy the list instead of putting it in the link
const MAX_BCC_LENGTH = 1500;

export interface AnnouncePost {
  title: string;
  slug: string;
  excerpt: string;
}

export async function fetchActiveEmails(supabase: SupabaseClient): Promise<string[]> {
  const { data: { session } } = await supabase.auth.getSession();
  const res = await fetch('/api/admin/subscribers', {
    headers: { Authorization: `Bearer ${session?.access_token}` },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Could not load subscribers.');
  return (data.subscribers as { email: string; active: boolean }[]).filter((s) => s.active).map((s) => s.email);
}

export async function copyEmails(emails: string[]) {
  await navigator.clipboard.writeText(emails.join(', '));
}

// Opens a Gmail draft with everyone in Bcc and a short message linking to the post.
// Returns a note to show the admin, if any.
export async function composeInGmail(post: AnnouncePost, emails: string[]): Promise<string> {
  const link = `${SITE_URL}/culinary-tales/${post.slug}`;
  const body = [
    'Hello,',
    '',
    `A new story is up on Culinary Tales: ${post.title}`,
    '',
    ...(post.excerpt ? [post.excerpt, ''] : []),
    `Read it here: ${link}`,
    '',
    'Thank you for following the Mississippi Community Cookbook Project!',
    '',
    'To stop receiving these emails, just reply with "unsubscribe".',
  ].join('\n');

  const bcc = emails.join(',');
  const tooLong = bcc.length > MAX_BCC_LENGTH;
  const params = new URLSearchParams({ view: 'cm', fs: '1', su: `New on Culinary Tales: ${post.title}`, body });
  if (GMAIL_ACCOUNT) params.set('authuser', GMAIL_ACCOUNT);
  if (!tooLong) params.set('bcc', bcc);

  // Open the tab before any await so the browser doesn't treat it as a popup
  window.open(`https://mail.google.com/mail/?${params}`, '_blank', 'noopener');

  if (tooLong) {
    await copyEmails(emails);
    return `The list is long, so the ${emails.length} emails were copied instead. Paste them into Bcc in Gmail.`;
  }
  return `Gmail opened with ${emails.length} subscriber${emails.length === 1 ? '' : 's'} in Bcc. Review it and press Send.`;
}
