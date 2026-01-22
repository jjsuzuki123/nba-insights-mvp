// src/lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// This client is safe to use for public, anon-access calls.
// (Later, we’ll keep sensitive stuff server-only if needed.)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
