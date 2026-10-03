import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    const db = supabaseAdmin();
    const normalized = email.toLowerCase().trim();
    const { error } = await db
      .from('subscribers')
      .insert({ email: normalized });

    if (error) {
      if (error.code === '23505') {
        // Re-activate someone who previously unsubscribed
        const { data: reactivated } = await db
          .from('subscribers')
          .update({ active: true })
          .eq('email', normalized)
          .eq('active', false)
          .select('id');
        if (reactivated?.length) return NextResponse.json({ success: true });
        return NextResponse.json({ error: 'This email is already subscribed.' }, { status: 409 });
      }
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
