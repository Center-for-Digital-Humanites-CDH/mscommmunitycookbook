import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Public client — used for reading published posts
export const supabase = createClient(url, anon);

// Admin client — bypasses RLS, used only in server actions/API routes
export function supabaseAdmin() {
  return createClient(url, service);
}
