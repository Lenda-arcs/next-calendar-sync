// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.
// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
const allowedOrigins = [
  "http://localhost:4321",
  "https://[REPLACE-SOMEDOMAIN].com"
];
function getCorsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": allowedOrigins.includes(origin || "") ? origin : "null",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS"
  };
}
serve(async (req)=>{
  const denoEnv = Deno.env;
  const origin = req.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);
  // Handle preflight request
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }
  try {
    const THIRTY_MINUTES_AGO = new Date(Date.now() - 30 * 60 * 1000).toISOString();
    const FUNCTION_BASE = `${denoEnv.get("FUNCTION_BASE")}`;
    const headers = new Headers({
      Authorization: `Bearer ${denoEnv.get("SUPABASE_SERVICE_ROLE_KEY")}`,
      "Content-Type": "application/json"
    });
    const supabase = createClient(denoEnv.get("SUPABASE_URL"), denoEnv.get("SUPABASE_SERVICE_ROLE_KEY"));
    // Get all feeds that haven't been synced in the last 30 minutes
    const { data: feeds, error: feedsError } = await supabase.from("calendar_feeds").select("id").or(`last_synced_at.is.null,last_synced_at.lt.${THIRTY_MINUTES_AGO}`);
    if (feedsError) {
      throw new Error(`Failed to fetch feeds: ${feedsError.message}`);
    }
    const results = [];
    const errors = [];
    // Sync each feed
    for (const feed of feeds ?? []){
      try {
        const response = await fetch(`${FUNCTION_BASE}/sync-feed`, {
          method: "POST",
          headers,
          body: JSON.stringify({
            feed_id: feed.id
          })
        });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to sync feed ${feed.id}: ${errorText}`);
        }
        const result = await response.json();
        results.push({
          feed_id: feed.id,
          ...result
        });
      } catch (error) {
        console.error(`Error syncing feed ${feed.id}:`, error);
        errors.push({
          feed_id: feed.id,
          error: error.message
        });
      }
    }
    return new Response(JSON.stringify({
      success: true,
      synced_feeds: results,
      errors: errors,
      total_feeds: feeds?.length ?? 0,
      successful_syncs: results.length,
      failed_syncs: errors.length
    }), {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      }
    });
  } catch (e) {
    return new Response(JSON.stringify({
      success: false,
      error: e.message
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      }
    });
  }
});
