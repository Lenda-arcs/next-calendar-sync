import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createSupabaseAdminClient } from "../_shared/supabaseClient.ts";
import { createCorsResponse, createOptionsResponse } from "../_shared/cors.ts";
import { matchTags, matchStudioId } from "../_shared/matching.ts";

serve(async (req) => {
  const origin = req.headers.get("origin");
  
  if (req.method === "OPTIONS") {
    return createOptionsResponse(origin);
  }

  try {
    const body = await req.json();
    
    const { 
      user_id, 
      feed_id, 
      event_ids,
      rematch_tags = true,
      rematch_studios = true,
      batch_size = 100 
    } = body;

    if (!user_id) {
      return createCorsResponse({
        error: "user_id is required"
      }, 400, origin);
    }

    const supabase = createSupabaseAdminClient();

    // Step 1: Build and execute events query
    let eventsQuery = supabase
      .from("events")
      .select("id, title, description, location, tags, studio_id, invoice_type, substitute_notes")
      .eq("user_id", user_id);

    if (feed_id) {
      eventsQuery = eventsQuery.eq("feed_id", feed_id);
    }

    if (event_ids && event_ids.length > 0) {
      eventsQuery = eventsQuery.in("id", event_ids);
    }

    const { data: events, error: eventsError } = await eventsQuery;
    
    if (eventsError) {
      return createCorsResponse({
        error: "Failed to fetch events",
        details: eventsError.message,
        code: eventsError.code
      }, 500, origin);
    }

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
          return createCorsResponse({
            error: "Failed to fetch tag rules",
            details: rulesResult.error.message
          }, 500, origin);
        }

        if (tagsResult.error) {
          return createCorsResponse({
            error: "Failed to fetch tags",
            details: tagsResult.error.message
          }, 500, origin);
        }

        tagRules = rulesResult.data || [];
        tagMap = Object.fromEntries((tagsResult.data || []).map(t => [t.id, t.slug]));
      } catch (tagError) {
        return createCorsResponse({
          error: "Failed to fetch tag data",
          details: tagError.message
        }, 500, origin);
      }
    }

    // Step 3: Fetch studio data and teacher IDs if needed
    let studios: any[] = [];
    let teacherEntityIds: Set<string> = new Set();

    if (rematch_studios) {
      try {
        const { data: billingEntities, error: entitiesError } = await supabase
          .from("billing_entities")
          .select("id, location_match, entity_type")
          .eq("user_id", user_id);

        if (entitiesError) {
          return createCorsResponse({
            error: "Failed to fetch billing entities",
            details: entitiesError.message
          }, 500, origin);
        }

        // Separate studios from teachers using the new entity_type field
        studios = (billingEntities || []).filter(entity => entity.entity_type === "studio");
        teacherEntityIds = new Set(
          (billingEntities || [])
            .filter(entity => entity.entity_type === "teacher")
            .map(entity => entity.id)
        );
        
      } catch (studioError) {
        return createCorsResponse({
          error: "Failed to fetch billing entity data",
          details: studioError.message
        }, 500, origin);
      }
    }

    // Step 4: Process events
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
              // Skip tag matching error
            }
          }

          // Rematch studio if requested, but preserve manual teacher assignments
          if (rematch_studios && studios.length > 0) {
            try {
              // Skip studio rematch for events manually assigned to teachers
              const isManualTeacherAssignment = 
                event.invoice_type === 'teacher_invoice' || 
                (event.studio_id && teacherEntityIds.has(event.studio_id)) ||
                (event.substitute_notes && event.substitute_notes.trim().length > 0);

              if (isManualTeacherAssignment) {
                // Skip rematch for manually assigned teacher events
              } else {
                const newStudioId = matchStudioId(event.location || "", studios);
                
                // Only update if studio changed
                if (newStudioId !== event.studio_id) {
                  updates.studio_id = newStudioId;
                  hasUpdates = true;
                }
              }
            } catch (studioMatchError) {
              // Skip studio matching error
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