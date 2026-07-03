import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// In Demo Mode (no env vars), Supabase calls are skipped gracefully.
// The supabase client is null in Demo Mode.
export const isSupabaseConfigured =
  Boolean(supabaseUrl) && Boolean(supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        // Supabase JS v2 stores session in localStorage by default.
        // This is the standard Supabase browser pattern.
        // Security is enforced by Row Level Security policies, not token storage.
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;
