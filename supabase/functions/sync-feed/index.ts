// supabase/functions/sync-feed/index.ts
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import ical from "npm:ical";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { extractStudentCounts, matchStudioId } from "./enrichInstance.ts";
import { getCorsHeaders, extractCalendarName, ensureUTCString, generateRecurrenceInstances, matchTags, fetchExistingEvents, deleteStaleEvents } from "./helpers.ts";
serve(async (req)=>{
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
    const supabase = createClient(Deno.env.get("SUPABASE_URL"), Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"));
    const { data: feed, error: feedError } = await supabase.from("calendar_feeds").select("id, feed_url, user_id").eq("id", feed_id).single();
    if (feedError || !feed) return new Response("Feed not found", {
      status: 404,
      headers: corsHeaders
    });
    const { data: rules } = await supabase.from("tag_rules").select("keyword, keywords, location_keywords, tag_id").eq("user_id", feed.user_id);
    const { data: tags } = await supabase.from("tags").select("id, slug");
    const tagMap = Object.fromEntries((tags || []).map((t)=>[
        t.id,
        t.slug
      ]));
    const icsRes = await fetch(feed.feed_url);
    const icsText = await icsRes.text();
    const calendarName = extractCalendarName(icsText);
    const parsed = ical.parseICS(icsText);
    const nowUTC = new Date();
    const shouldSkip = isHistorical ? (end)=>end > nowUTC // skip future events
     : (end)=>end <= nowUTC;
    //TODO: Maybe outsource this to a separate function
    const { data: studios } = await supabase.from("studios").select("id, location_match").eq("user_id", feed.user_id);
    const enrichedEvents = [];
    for (const entry of Object.values(parsed)){
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
      for (const instance of instances){
        const instanceEndTimeUTC = new Date(ensureUTCString(instance.end));
        if (shouldSkip(instanceEndTimeUTC)) continue;
        const { data: existingEvent } = await supabase.from("events").select("*").eq("user_id", feed.user_id).eq("uid", uid).eq("recurrence_id", instance.recurrence_id || null).maybeSingle();
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
          visibility: existingEvent?.visibility || "public",
          image_url: existingEvent?.image_url || null,
          custom_tags: existingEvent?.custom_tags || [],
          tags: eventTags || [],
          status: instance.status || "CONFIRMED",
          studio_id: existingEvent?.studio_id || matchStudioId(instance.location, studios),
          students_studio: existingEvent?.students_studio || studentsStudio,
          students_online: existingEvent?.students_online || studentsOnline
        });
      }
    }
    const windowStart = isHistorical ? new Date(nowUTC.getTime() - daysToSync * 24 * 60 * 60 * 1000) : nowUTC;
    const windowEnd = isHistorical ? nowUTC : new Date(nowUTC.getTime() + daysToSync * 24 * 60 * 60 * 1000);
    const { data: existingEvents } = await fetchExistingEvents(supabase, feed.user_id, feed.id, windowStart, windowEnd);
    await deleteStaleEvents(supabase, enrichedEvents, existingEvents);
    const { error: upsertError } = await supabase.from("events").upsert(enrichedEvents, {
      onConflict: [
        "user_id",
        "uid",
        "recurrence_id"
      ]
    });
    if (upsertError) throw upsertError;
    await supabase.from("calendar_feeds").update({
      last_synced_at: nowUTC.toISOString(),
      calendar_name: calendarName || null
    }).eq("id", feed_id);
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
