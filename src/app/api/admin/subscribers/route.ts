import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// The subscribers table is locked by RLS, so the admin tab goes through here.
// Any signed-in user counts as an admin (public sign-ups are disabled in Supabase).
async function requireUser(request: Request) {
  const token = request.headers.get('authorization')?.replace(/^Bearer /, '');
  if (!token) return null;
  const { data } = await supabaseAdmin().auth.getUser(token);
  return data.user;
}

const unauthorized = () => NextResponse.json({ error: 'Not signed in.' }, { status: 401 });

export async function GET(request: Request) {
  if (!(await requireUser(request))) return unauthorized();
  const { data, error } = await supabaseAdmin()
    .from('subscribers')
    .select('id, email, subscribed_at, active')
    .order('subscribed_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ subscribers: data });
}

export async function POST(request: Request) {
  if (!(await requireUser(request))) return unauthorized();
  const { email } = await request.json();
  const normalized = String(email || '').toLowerCase().trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
  }
  const { error } = await supabaseAdmin().from('subscribers').insert({ email: normalized });
  if (error) {
    const msg = error.code === '23505' ? 'That email is already on the list.' : error.message;
    return NextResponse.json({ error: msg }, { status: 400 });
  }
  return NextResponse.json({ success: true });
}

export async function PATCH(request: Request) {
  if (!(await requireUser(request))) return unauthorized();
  const { id, active } = await request.json();
  const { error } = await supabaseAdmin().from('subscribers').update({ active: Boolean(active) }).eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  if (!(await requireUser(request))) return unauthorized();
  const { id } = await request.json();
  const { error } = await supabaseAdmin().from('subscribers').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
