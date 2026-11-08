import { createClient } from '@supabase/supabase-js';

const defaultUrl = 'https://gllhiyerwiezlipsbgyr.supabase.co';
const defaultKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdsbGhpeWVyd2llemxpcHNiZ3lyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI2NDg1NDMsImV4cCI6MjEwODIyNDU0M30.-zjSyj-o373rztKsv6N-QIYfZnukTvl-pnrZTrXgTig';

const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || defaultUrl).trim();
const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || defaultKey).trim();

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('https://') &&
  !supabaseUrl.includes('PASTE_')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
      },
    })
  : null;
