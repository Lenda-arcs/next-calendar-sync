import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createSupabaseAdminClient } from "../_shared/supabaseClient.ts";
import { createCorsResponse, createOptionsResponse } from "../_shared/cors.ts";
import { matchTags, matchStudioId } from "../_shared/matching.ts";

serve(async (req) => {
  console.log("rematch-events function called");
  
  const origin = req.headers.get("origin");
  
  if (req.method === "OPTIONS") {
    return createOptionsResponse(origin);
  }

  try {
    const body = await req.json();
    console.log("Request body:", body);
    
    const { 
      user_id, 
      feed_id, 
      event_ids,
      rematch_tags = true,
      rematch_studios = true,
      batch_size = 100 
    } = body;

    console.log("Parsed parameters:", { user_id, feed_id, event_ids, rematch_tags, rematch_studios, batch_size });

    if (!user_id) {
      console.log("Missing user_id");
      return createCorsResponse({
        error: "user_id is required"
      }, 400, origin);
    }

    console.log("Creating Supabase admin client");
    const supabase = createSupabaseAdminClient();

    // Step 1: Build and execute events query
    console.log("Step 1: Building events query");
    let eventsQuery = supabase
      .from("events")
      .select("id, title, description, location, tags, studio_id")
      .eq("user_id", user_id);

    if (feed_id) {
      console.log("Adding feed_id filter:", feed_id);
      eventsQuery = eventsQuery.eq("feed_id", feed_id);
    }

    if (event_ids && event_ids.length > 0) {
      console.log("Adding event_ids filter:", event_ids.length, "events");
      eventsQuery = eventsQuery.in("id", event_ids);
    }

    console.log("Executing events query...");
    const { data: events, error: eventsError } = await eventsQuery;
    
    if (eventsError) {
      console.error("Events query error:", eventsError);
      return createCorsResponse({
        error: "Failed to fetch events",
        details: eventsError.message,
        code: eventsError.code
      }, 500, origin);
    }
    
    console.log(`Found ${events?.length || 0} events to process`);

    if (!events || events.length === 0) {
      return createCorsResponse({
        success: true,
        message: "No events found to rematch",
        total_events_processed: 0,
        updated_count: 0
      }, 200, origin);
    }

    // Step 2: Fetch tag data if needed
    let tagRules: any[] = [];
    let tagMap: Record<string, string> = {};

    if (rematch_tags) {
      try {
        console.log("Step 2: Fetching tag rules and tags...");
        const [rulesResult, tagsResult] = await Promise.all([
          supabase
            .from("tag_rules")
            .select("keyword, keywords, location_keywords, tag_id")
            .eq("user_id", user_id),
          supabase
            .from("tags")
            .select("id, slug")
        ]);

        if (rulesResult.error) {
          console.error("Tag rules query error:", rulesResult.error);
          return createCorsResponse({
            error: "Failed to fetch tag rules",
            details: rulesResult.error.message
          }, 500, origin);
        }

        if (tagsResult.error) {
          console.error("Tags query error:", tagsResult.error);
          return createCorsResponse({
            error: "Failed to fetch tags",
            details: tagsResult.error.message
          }, 500, origin);
        }

        tagRules = rulesResult.data || [];
        tagMap = Object.fromEntries((tagsResult.data || []).map(t => [t.id, t.slug]));
        console.log(`Found ${tagRules.length} tag rules and ${Object.keys(tagMap).length} tags`);
      } catch (tagError) {
        console.error("Error fetching tag data:", tagError);
        return createCorsResponse({
          error: "Failed to fetch tag data",
          details: tagError.message
        }, 500, origin);
      }
    }

    // Step 3: Fetch studio data if needed
    let studios: any[] = [];

    if (rematch_studios) {
      try {
        console.log("Step 3: Fetching studio data...");
        const { data: studiosData, error: studiosError } = await supabase
          .from("billing_entities")
          .select("id, location_match")
          .eq("user_id", user_id);

        if (studiosError) {
          console.error("Studios query error:", studiosError);
          return createCorsResponse({
            error: "Failed to fetch studios",
            details: studiosError.message
          }, 500, origin);
        }

        studios = studiosData || [];
        console.log(`Found ${studios.length} studios`);
      } catch (studioError) {
        console.error("Error fetching studio data:", studioError);
        return createCorsResponse({
          error: "Failed to fetch studio data",
          details: studioError.message
        }, 500, origin);
      }
    }

    // Step 4: Process events
    console.log("Step 4: Processing events...");
    const updatedEvents = [];
    const totalEvents = events.length;
    
    try {
      for (let i = 0; i < events.length; i += batch_size) {
        const batch = events.slice(i, i + batch_size);
        const batchUpdates = [];

        for (const event of batch) {
          const updates: Record<string, any> = {};
          let hasUpdates = false;

          // Rematch tags if requested
          if (rematch_tags && tagRules.length > 0) {
            try {
              const content = `${event.title || ""} ${event.description || ""}`.toLowerCase();
              const newTags = matchTags(content, event.location || "", tagRules, tagMap);
              
              // Only update if tags changed
              if (JSON.stringify(newTags) !== JSON.stringify(event.tags || [])) {
                updates.tags = newTags;
                hasUpdates = true;
              }
            } catch (tagMatchError) {
              console.error("Error matching tags for event:", event.id, tagMatchError);
            }
          }

          // Rematch studio if requested
          if (rematch_studios && studios.length > 0) {
            try {
              const newStudioId = matchStudioId(event.location || "", studios);
              
              // Only update if studio changed
              if (newStudioId !== event.studio_id) {
                updates.studio_id = newStudioId;
                hasUpdates = true;
              }
            } catch (studioMatchError) {
              console.error("Error matching studio for event:", event.id, studioMatchError);
            }
          }

          if (hasUpdates) {
            updates.id = event.id;
            updates.updated_at = new Date().toISOString();
            batchUpdates.push(updates);
          }
        }

        // Update this batch if there are changes
        if (batchUpdates.length > 0) {
          try {
            console.log(`Updating batch ${Math.floor(i/batch_size) + 1}: ${batchUpdates.length} events`);
            
            // Process each update individually since we're only updating specific fields
            const updatePromises = batchUpdates.map(async (update) => {
              const { id, ...fieldsToUpdate } = update;
              return supabase
                .from("events")
                .update(fieldsToUpdate)
                .eq("id", id);
            });

            const updateResults = await Promise.all(updatePromises);
            
            // Check for any errors
            const updateErrors = updateResults.filter(result => result.error);
            if (updateErrors.length > 0) {
              console.error("Batch update errors:", updateErrors);
              return createCorsResponse({
                error: "Failed to update some events",
                details: updateErrors.map(err => err.error?.message).join(", "),
                batch: Math.floor(i/batch_size) + 1
              }, 500, origin);
            }

            updatedEvents.push(...batchUpdates.map(update => update.id));
          } catch (batchError) {
            console.error("Error updating batch:", batchError);
            return createCorsResponse({
              error: "Failed to update batch",
              details: batchError.message
            }, 500, origin);
          }
        }
      }
    } catch (processingError) {
      console.error("Error processing events:", processingError);
      return createCorsResponse({
        error: "Failed to process events",
        details: processingError.message
      }, 500, origin);
    }

    console.log(`Rematch completed: ${updatedEvents.length}/${totalEvents} events updated`);

    return createCorsResponse({
      success: true,
      total_events_processed: totalEvents,
      updated_count: updatedEvents.length,
      message: `Successfully rematched ${updatedEvents.length} out of ${totalEvents} events`
    }, 200, origin);

  } catch (error) {
    console.error("Function error:", error);
    console.error("Error details:", {
      message: error?.message,
      stack: error?.stack,
      name: error?.name
    });
    
    return createCorsResponse({
      error: "Function execution failed",
      message: error?.message || "Unknown error",
      details: error?.stack || error?.toString() || "No additional details"
    }, 500, origin);
  }
}); 