// supabase/functions/sync-feed/index.ts
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createSupabaseAdminClient } from "../_shared/supabaseClient.ts";
import { getCorsHeaders } from "../_shared/cors.ts";
import { syncOAuthCalendar } from "./oauth-calendar-sync.ts";
import { applyFilterRules } from "./filter-rules.ts";
import { fetchExistingEvents, deleteStaleEvents } from "./helpers.ts";

serve(async (req) => {
  const origin = req.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);
  
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }
  
  try {
    const body = await req.json();
    const { feed_id, mode = "default", window_days } = body;
    const isHistorical = mode === "historical";
    const daysToSync = window_days ?? (isHistorical ? 365 : 90);
    
    const supabase = createSupabaseAdminClient();
    
    const { data: feed, error: feedError } = await supabase
      .from("calendar_feeds")
      .select("id, calendar_name, user_id")
      .eq("id", feed_id)
      .single();
      
    if (feedError || !feed) {
      return new Response("Feed not found", {
        status: 404,
        headers: corsHeaders
      });
    }

    // Validate that this is an OAuth feed
    if (!feed.calendar_name?.startsWith("oauth:")) {
      return new Response("Only OAuth calendar feeds are supported", {
        status: 400,
        headers: corsHeaders
      });
    }

    // Define common variables used in both sync paths
    const nowUTC = new Date();
    
    // Parse OAuth calendar info from calendar_name
    // Format: "oauth:google:calendarId:displayName"
    const oauthParts = feed.calendar_name.split(":");
    if (oauthParts.length >= 3) {
      const provider = oauthParts[1];
      const calendarId = oauthParts[2];
      
      if (provider === "google") {
        try {
          const enrichedEvents = await syncOAuthCalendar({
            feedId: feed.id,
            calendarId: calendarId,
            userId: feed.user_id,
            isHistorical: isHistorical,
            windowDays: daysToSync
          });
          
          // Handle stale event cleanup
          const windowStart = isHistorical ? 
            new Date(nowUTC.getTime() - daysToSync * 24 * 60 * 60 * 1000) : 
            nowUTC;
          const windowEnd = isHistorical ? 
            nowUTC : 
            new Date(nowUTC.getTime() + daysToSync * 24 * 60 * 60 * 1000);
          
          // Apply filter rules based on user's sync approach
          const filteredEvents = await applyFilterRules(feed.user_id, feed.id, enrichedEvents);
          
          const { data: existingEvents } = await fetchExistingEvents(supabase, feed.user_id, feed.id, windowStart, windowEnd);
          await deleteStaleEvents(supabase, filteredEvents, existingEvents);
          
          // Upsert events
          if (filteredEvents.length > 0) {
            const { error: upsertError } = await supabase
              .from("events")
              .upsert(filteredEvents, {
                onConflict: ["user_id", "uid", "recurrence_id"]
              });
            
            if (upsertError) throw upsertError;
          }
          
          // Update sync timestamp
          await supabase
            .from("calendar_feeds")
            .update({
              last_synced_at: nowUTC.toISOString()
            })
            .eq("id", feed_id);
          
          return new Response(JSON.stringify({
            success: true,
            count: enrichedEvents.length,
            type: "oauth"
          }), {
            status: 200,
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json"
            }
          });
        } catch (error) {
          console.error("OAuth sync error:", error);
          return new Response(`Failed to sync OAuth calendar: ${error.message}`, {
            status: 500,
            headers: corsHeaders
          });
        }
      }
    }
    
    return new Response("Unsupported OAuth provider or invalid calendar format", {
      status: 400,
      headers: corsHeaders
    });
    
  } catch (e) {
    console.error("Sync error:", e?.stack || e);
    return new Response(`Failed to sync: ${e?.stack || e?.message || "Unknown error"}`, {
      status: 500,
      headers: corsHeaders
    });
  }
});
