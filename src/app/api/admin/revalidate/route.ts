import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { supabaseAdmin } from '@/lib/supabase';
import { PAGES } from '@/content/pages';

// Called by the admin after saving page edits so the change shows up right away
export async function POST(request: Request) {
  const token = request.headers.get('authorization')?.replace(/^Bearer /, '');
  if (!token) return NextResponse.json({ error: 'Not signed in.' }, { status: 401 });
  const { data } = await supabaseAdmin().auth.getUser(token);
  if (!data.user) return NextResponse.json({ error: 'Not signed in.' }, { status: 401 });

  const { path } = await request.json();
  if (!PAGES.some((p) => p.path === path)) {
    return NextResponse.json({ error: 'Unknown page.' }, { status: 400 });
  }
  revalidatePath(path);
  // Essays live on the Experimental Kitchen page but each has its own page too
  if (path === '/experimental-kitchen') revalidatePath('/experimental-kitchen/[slug]', 'page');
  return NextResponse.json({ success: true });
}
