import type { SupabaseClient } from '@supabase/supabase-js';

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://mscommunitycookbooks.usmcdh.org').replace(/\/$/, '');
const GMAIL_ACCOUNT = process.env.NEXT_PUBLIC_NEWSLETTER_GMAIL || '';
// Browsers start cutting off very long links, so past this we copy the list instead of putting it in the link
const MAX_BCC_LENGTH = 1500;

export interface AnnouncePost {
  title: string;
  slug: string;
  excerpt: string;
  background_image?: string;
  author?: string;
  date?: string;
  category?: string;
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

function esc(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
}

function absolute(url: string) {
  return url.startsWith('http') ? url : `${SITE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
}

const SERIF = "'Playfair Display', Georgia, 'Times New Roman', serif";
const SANS = "Inter, 'Helvetica Neue', Arial, sans-serif";

// Inline styles and tables only, so the design survives being pasted into Gmail
export function announcementHtml(post: AnnouncePost) {
  const link = `${SITE_URL}/culinary-tales/${post.slug}`;
  const date = post.date
    ? new Date(post.date.split('T')[0] + 'T12:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : '';
  const byline = [post.author && `By ${esc(post.author)}`, date].filter(Boolean).join(' &nbsp;·&nbsp; ');

  const explore = [
    { label: 'Cookbooks', sub: 'Browse the inventory', href: '/cookbooks' },
    { label: 'Culinary Landscapes', sub: 'Maps &amp; charts', href: '/culinary-landscapes' },
    { label: 'Culinary Tales', sub: 'All stories', href: '/culinary-tales' },
  ].map((x) => `
        <td width="31%" valign="top" style="background:#fdf6f0;border:1px solid #f0dccb;border-radius:10px;padding:14px 12px;">
          <a href="${SITE_URL}${x.href}" style="display:block;text-decoration:none;">
            <span style="display:block;font-family:${SERIF};font-size:15px;font-weight:600;color:#a85d2a;">${x.label}</span>
            <span style="display:block;font-family:${SANS};font-size:12px;color:#666666;margin-top:3px;">${x.sub}</span>
          </a>
        </td>`).join('<td width="3%" style="font-size:0;">&nbsp;</td>');

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4eee8;">
  <tr><td align="center" style="padding:24px 12px;">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;border-collapse:separate;">

      <tr><td style="background:#2c2c2c;border-radius:14px 14px 0 0;padding:26px 32px 22px;text-align:center;">
        <div style="font-family:${SANS};font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#d4956f;">Mississippi Community Cookbook Project</div>
        <div style="font-family:${SERIF};font-size:30px;font-weight:600;color:#ffffff;margin-top:6px;">Culinary Tales</div>
        <div style="width:48px;height:3px;background:#c8763d;margin:14px auto 0;line-height:3px;font-size:0;">&nbsp;</div>
      </td></tr>

      ${post.background_image ? `<tr><td style="background:#2c2c2c;line-height:0;">
        <a href="${link}"><img src="${esc(absolute(post.background_image))}" alt="${esc(post.title)}" width="600" style="display:block;width:100%;max-width:600px;height:auto;border:0;"></a>
      </td></tr>` : ''}

      <tr><td style="background:#ffffff;padding:32px 36px 30px;">
        <div style="display:inline-block;background:#fdf0e6;color:#a85d2a;font-family:${SANS};font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;padding:5px 12px;border-radius:999px;">${esc(post.category || 'New Story')}</div>
        <h1 style="font-family:${SERIF};font-size:28px;line-height:1.25;color:#1a1a1a;margin:16px 0 8px;font-weight:600;">${esc(post.title)}</h1>
        ${byline ? `<div style="font-family:${SANS};font-size:13px;color:#888888;margin-bottom:18px;">${byline}</div>` : ''}
        ${post.excerpt ? `<p style="font-family:${SANS};font-size:16px;line-height:1.7;color:#3a3a3a;margin:0 0 26px;">${esc(post.excerpt)}</p>` : ''}
        <table role="presentation" cellpadding="0" cellspacing="0"><tr><td style="background:#c8763d;border-radius:8px;">
          <a href="${link}" style="display:inline-block;padding:14px 28px;font-family:${SANS};font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;">Read the Full Story &rarr;</a>
        </td></tr></table>
      </td></tr>

      <tr><td style="background:#ffffff;padding:4px 36px 30px;border-top:1px solid #f0e6dd;">
        <div style="font-family:${SANS};font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#999999;padding:22px 0 12px;">Explore the Project</div>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>${explore}
        </tr></table>
      </td></tr>

      <tr><td style="background:#faf6f2;border-radius:0 0 14px 14px;padding:22px 32px;text-align:center;border-top:1px solid #f0e6dd;">
        <div style="font-family:${SANS};font-size:12px;line-height:1.7;color:#888888;">
          You&rsquo;re receiving this because you subscribed to Culinary Tales.<br>
          To stop receiving these emails, just reply with &ldquo;unsubscribe&rdquo;.<br>
          <a href="${SITE_URL}" style="color:#a85d2a;text-decoration:none;">mscommunitycookbooks.usmcdh.org</a>
        </div>
      </td></tr>

    </table>
  </td></tr>
</table>`;
}

function announcementText(post: AnnouncePost) {
  return [
    `New on Culinary Tales: ${post.title}`,
    '',
    post.excerpt,
    '',
    `Read the full story: ${SITE_URL}/culinary-tales/${post.slug}`,
    '',
    'To stop receiving these emails, just reply with "unsubscribe".',
  ].join('\n');
}

// Copies the designed email, then opens a Gmail draft with everyone in Bcc and the subject filled in.
// Returns a note to show the admin.
export async function composeInGmail(post: AnnouncePost, emails: string[]): Promise<string> {
  const html = announcementHtml(post);
  await navigator.clipboard.write([
    new ClipboardItem({
      'text/html': new Blob([html], { type: 'text/html' }),
      'text/plain': new Blob([announcementText(post)], { type: 'text/plain' }),
    }),
  ]);

  const bcc = emails.join(',');
  const tooLong = bcc.length > MAX_BCC_LENGTH;
  const params = new URLSearchParams({ view: 'cm', fs: '1', su: `New on Culinary Tales: ${post.title}` });
  if (GMAIL_ACCOUNT) params.set('authuser', GMAIL_ACCOUNT);
  if (!tooLong) params.set('bcc', bcc);
  window.open(`https://mail.google.com/mail/?${params}`, '_blank', 'noopener');

  if (tooLong) {
    return `The email design is copied. The list is too long for the link, so use "Copy active emails" and paste them into Bcc, then click in the message and press Ctrl+V.`;
  }
  return `Gmail opened with ${emails.length} subscriber${emails.length === 1 ? '' : 's'} in Bcc. Click in the message box and press Ctrl+V to paste the designed email, then Send.`;
}
