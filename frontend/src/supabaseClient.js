import { createClient } from '@supabase/supabase-js';

// Vite requires variables to start with VITE_
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase URL or Key. Check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);