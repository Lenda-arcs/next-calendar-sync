// _shared/supabaseClient.ts
// Reusable Supabase clients for Edge Functions

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Client with ANON key for user-authenticated requests
export function createSupabaseClient() {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
  
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase environment variables (URL or ANON_KEY)");
  }
  
  return createClient(supabaseUrl, supabaseAnonKey);
}

// Client with SERVICE_ROLE key for admin operations
export function createSupabaseAdminClient() {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Missing Supabase environment variables (URL or SERVICE_ROLE_KEY)");
  }
  
  return createClient(supabaseUrl, supabaseServiceKey);
} 