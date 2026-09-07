import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wivoikwlpzqbfypigxad.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey;

let serverAdminClient: SupabaseClient | null = null;
let serverAnonClient: SupabaseClient | null = null;

export function getServerSupabaseAdmin(): SupabaseClient {
  if (!serverAdminClient) {
    serverAdminClient = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: { persistSession: false },
    });
  }
  return serverAdminClient;
}

export function getServerSupabaseClient(): SupabaseClient {
  if (!serverAnonClient) {
    serverAnonClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false },
    });
  }
  return serverAnonClient;
}
