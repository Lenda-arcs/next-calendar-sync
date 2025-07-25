// supabase/functions/sync-feed/index.ts
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import ical from "npm:ical";
import { createSupabaseAdminClient } from "../_shared/supabaseClient.ts";
import { getCorsHeaders } from "../_shared/cors.ts";
import { matchTags, matchStudioId } from "../_shared/matching.ts";
import { extractStudentCounts } from "./enrichInstance.ts";
import { extractCalendarName, ensureUTCString, generateRecurrenceInstances, fetchExistingEvents, deleteStaleEvents } from "./helpers.ts";
import { syncOAuthCalendar } from "./oauth-calendar-sync.ts";
import { applyFilterRules } from "./filter-rules.ts";

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
      .select("id, feed_url, calendar_name, user_id")
      .eq("id", feed_id)
      .single();
      
    if (feedError || !feed) {
      return new Response("Feed not found", {
        status: 404,
        headers: corsHeaders
      });
    }

    // Define common variables used in both sync paths
    const nowUTC = new Date();
    
    // Check if this is an OAuth calendar feed
    const isOAuthFeed = !feed.feed_url && feed.calendar_name?.startsWith("oauth:");
    
    if (isOAuthFeed) {
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
    }

    // Continue with .ics feed sync if not OAuth
    if (!feed.feed_url) {
      return new Response("No feed URL provided", {
        status: 400,
        headers: corsHeaders
      });
    }
    
    const { data: rules } = await supabase
      .from("tag_rules")
      .select("keyword, keywords, location_keywords, tag_id")
      .eq("user_id", feed.user_id);
      
    const { data: tags } = await supabase
      .from("tags")
      .select("id, slug");
      
    const tagMap = Object.fromEntries((tags || []).map((t) => [t.id, t.slug]));
    
    console.log(`Fetching calendar feed from URL: ${feed.feed_url}`);
    
    // Retry logic for temporary failures
    let icsRes;
    let lastError;
    const maxRetries = 3;
    const retryDelay = 1000; // 1 second
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
                 // Add specific headers for better compatibility with different calendar providers
         const headers: Record<string, string> = {
           'Accept': 'text/calendar, application/calendar, text/plain, */*',
           'Cache-Control': 'no-cache'
         };
         
         // Use different User-Agent based on provider
         if (feed.feed_url.includes('mailbox.org')) {
           headers['User-Agent'] = 'curl/7.68.0'; // Mailbox.org seems to prefer curl-like requests
         } else if (feed.feed_url.includes('icloud.com')) {
           headers['User-Agent'] = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36';
         } else {
           headers['User-Agent'] = 'Mozilla/5.0 (compatible; CalendarSync/1.0)';
         }
         
         icsRes = await fetch(feed.feed_url, { headers });
        
        if (icsRes.ok) {
          break; // Success, exit retry loop
        }
        
        // If it's a client error (4xx), don't retry
        if (icsRes.status >= 400 && icsRes.status < 500) {
          console.error(`Client error fetching calendar feed (attempt ${attempt}): ${icsRes.status} ${icsRes.statusText}`);
          throw new Error(`Calendar feed returned client error: ${icsRes.status} ${icsRes.statusText}. Please check if the calendar URL is correct and publicly accessible.`);
        }
        
        // For server errors (5xx), log and potentially retry
        lastError = new Error(`Server error fetching calendar feed: ${icsRes.status} ${icsRes.statusText}`);
        console.error(`Server error fetching calendar feed (attempt ${attempt}/${maxRetries}): ${icsRes.status} ${icsRes.statusText}`);
        
        if (attempt === maxRetries) {
          throw lastError;
        }
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
        
      } catch (error) {
        lastError = error;
        console.error(`Error fetching calendar feed (attempt ${attempt}/${maxRetries}):`, error.message);
        
        if (attempt === maxRetries) {
          throw new Error(`Failed to fetch calendar feed after ${maxRetries} attempts: ${error.message}`);
        }
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
      }
    }
    
    const icsText = await icsRes.text();
    
    if (!icsText || icsText.trim().length === 0) {
      console.error("Calendar feed returned empty content");
      throw new Error("Calendar feed returned empty content");
    }
    
    console.log(`Successfully fetched calendar feed, content length: ${icsText.length}`);
    const calendarName = extractCalendarName(icsText);
    const parsed = ical.parseICS(icsText);
    const shouldSkip = isHistorical ? 
      (end) => end > nowUTC : // skip future events
      (end) => end <= nowUTC;
    
    //TODO: Maybe outsource this to a separate function
    const { data: studios } = await supabase
      .from("billing_entities")
      .select("id, location_match")
      .eq("user_id", feed.user_id)
      .eq("entity_type", "studio"); // Only fetch studio entities for location matching
    
    const enrichedEvents = [];
    
    for (const entry of Object.values(parsed)) {
      if (entry.type !== "VEVENT") continue;
      
      const uid = entry.uid;
      const summary = entry.summary ?? "";
      const description = entry.description ?? "";
      const content = `${summary} ${description}`.toLowerCase();
      const eventTags = matchTags(content, entry.location, rules || [], tagMap);
      
      // Calculate the appropriate start date for recurrence generation
      const recurrenceStartDate = isHistorical ? 
        new Date(nowUTC.getTime() - daysToSync * 24 * 60 * 60 * 1000) : 
        nowUTC;
      
      const instances = generateRecurrenceInstances(entry, daysToSync, recurrenceStartDate);
      
      for (const instance of instances) {
        const instanceEndTimeUTC = new Date(ensureUTCString(instance.end));
        if (shouldSkip(instanceEndTimeUTC)) continue;
        
        const { data: existingEvent } = await supabase
          .from("events")
          .select("*")
          .eq("user_id", feed.user_id)
          .eq("uid", uid)
          .eq("recurrence_id", instance.recurrence_id || null)
          .maybeSingle();
        
        const { studentsStudio, studentsOnline } = extractStudentCounts(description, isHistorical);
        
        enrichedEvents.push({
          uid,
          recurrence_id: instance.recurrence_id || "",
          title: summary,
          start_time: ensureUTCString(instance.start),
          end_time: ensureUTCString(instance.end),
          location: instance.location || "",
          description: instance.description || "",
          feed_id: feed.id,
          user_id: feed.user_id,
          updated_at: new Date().toISOString(),
          visibility: existingEvent?.visibility || "public", // Will be updated by privacy service
          image_url: existingEvent?.image_url || null,
          custom_tags: existingEvent?.custom_tags || [],
          tags: eventTags || [],
          status: instance.status?.toLowerCase() || "confirmed",
          studio_id: existingEvent?.studio_id || matchStudioId(instance.location, studios),
          students_studio: existingEvent?.students_studio || studentsStudio,
          students_online: existingEvent?.students_online || studentsOnline
        });
      }
    }
    
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
    
    const { error: upsertError } = await supabase
      .from("events")
      .upsert(filteredEvents, {
        onConflict: ["user_id", "uid", "recurrence_id"]
      });
    
    if (upsertError) throw upsertError;
    
    await supabase
      .from("calendar_feeds")
      .update({
        last_synced_at: nowUTC.toISOString(),
        calendar_name: calendarName || null
      })
      .eq("id", feed_id);
    
    return new Response(JSON.stringify({
      success: true,
      count: enrichedEvents.length
    }), {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      }
    });
    
  } catch (e) {
    console.error("Sync error:", e?.stack || e);
    return new Response(`Failed to sync: ${e?.stack || e?.message || "Unknown error"}`, {
      status: 500,
      headers: corsHeaders
    });
  }
});
