
import { createClient } from '@supabase/supabase-js';
// Fix: Added .ts extension to the import path.
import type { Database } from '../types/supabase.ts';

// Note: The user should add these to their .env.local file
const DUMMY_URL = 'https://void.supabase.co';
// FIX: The previous key was too short and syntactically invalid, causing a crash.
// This is a validly formatted but non-functional placeholder key.
const DUMMY_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

const supabaseUrl = DUMMY_URL;
const supabaseAnonKey = DUMMY_KEY;


if (supabaseUrl === DUMMY_URL || supabaseAnonKey === DUMMY_KEY) {
    console.warn(`%cSupabase is not configured.`, `color: #ff6347; font-size: 14px; font-weight: bold;`);
    console.warn(`The application is running with placeholder credentials and will not connect to a database. Please create a Supabase project and provide your Supabase URL and Anon Key for full functionality.`);
}


export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);