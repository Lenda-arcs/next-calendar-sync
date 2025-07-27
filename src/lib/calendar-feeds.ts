import { createBrowserClient } from '@supabase/ssr'
import { Database, Tables, TablesInsert } from '@/../database-generated.types'

export type CalendarFeed = Tables<'calendar_feeds'>
export type CalendarFeedInsert = TablesInsert<'calendar_feeds'>

export interface SupabaseClientUtil {
  supabase: ReturnType<typeof createBrowserClient<Database>>
  userId: string
}

export async function getUserCalendarFeeds({
  supabase,
  userId,
}: SupabaseClientUtil): Promise<CalendarFeed[]> {
  if (!userId) throw new Error("No User id")
  
  const { data, error } = await supabase
    .from("calendar_feeds")
    .select("*")
    .eq("user_id", userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function createCalendarFeed(
  supabase: ReturnType<typeof createBrowserClient<Database>>,
  feed: CalendarFeedInsert,
): Promise<{ feed: CalendarFeed; syncResult: { success: boolean; count: number } }> {
  const { data, error } = await supabase
    .from("calendar_feeds")
    .insert(feed)
    .select()
    .single()

  if (error) throw error
  
  // Automatically sync the newly created feed
  console.log(`Auto-syncing newly created feed: ${data.id}`)
  try {
    const syncResult = await syncCalendarFeed(supabase, data.id)
    console.log(`Feed ${data.id} synced successfully: ${syncResult.count} events`)
    return { feed: data, syncResult }
  } catch (syncError) {
    console.warn(`Failed to auto-sync feed ${data.id}:`, syncError)
    // Return the feed even if sync fails - user can manually sync later
    return { feed: data, syncResult: { success: false, count: 0 } }
  }
}

export async function deleteCalendarFeed(
  supabase: ReturnType<typeof createBrowserClient<Database>>,
  id: string,
): Promise<void> {
  const { error } = await supabase
    .from("calendar_feeds")
    .delete()
    .eq("id", id)

  if (error) throw error
}

export async function syncCalendarFeed(
  supabase: ReturnType<typeof createBrowserClient<Database>>,
  id: string,
  mode: 'default' | 'historical' = 'default'
): Promise<{ success: boolean; count: number }> {
  try {
    const { data, error } = await supabase.functions.invoke('sync-feed', {
      body: { 
        feed_id: id,
        mode: mode
      }
    })

    if (error) {
      console.error(`Failed to sync feed ${id}:`, error)
      throw new Error(`Failed to sync feed: ${error.message}`)
    }

    const result = data as { success: boolean; count: number }
    return result
  } catch (err) {
    console.error(`Failed to sync feed ${id}:`, err)
    throw err
  }
}

export async function syncAllUserCalendarFeeds(
  supabase: ReturnType<typeof createBrowserClient<Database>>,
  userId: string,
): Promise<{ successfulSyncs: number; totalFeeds: number; totalEvents: number }> {
  // First, fetch all calendar feeds for the user
  const { data: feeds, error: feedsError } = await supabase
    .from('calendar_feeds')
    .select('id')
    .eq('user_id', userId)

  if (feedsError) {
    throw new Error(`Failed to fetch user feeds: ${feedsError.message}`)
  }

  if (!feeds || feeds.length === 0) {
    console.log('No calendar feeds found for user')
    return { successfulSyncs: 0, totalFeeds: 0, totalEvents: 0 }
  }

  console.log(`Found ${feeds.length} calendar feeds to sync`)

  // Sync each feed individually
  const syncPromises = feeds.map(async (feed) => {
    try {
      return await syncCalendarFeed(supabase, feed.id)
    } catch (err) {
      console.error(`Failed to sync feed ${feed.id}:`, err)
      return { success: false, count: 0 }
    }
  })

  // Wait for all syncs to complete
  const results = await Promise.all(syncPromises)
  const successfulSyncs = results.filter(result => result.success).length
  const totalEvents = results.reduce((sum, result) => sum + result.count, 0)

  console.log(`Sync completed: ${successfulSyncs}/${feeds.length} feeds synced, ${totalEvents} total events`)
  
  return {
    successfulSyncs,
    totalFeeds: feeds.length,
    totalEvents
  }
}

export function formatDate(date: string | null): string {
  if (!date) return "Never"
  
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }
  
  return new Date(date).toLocaleString("en-US", options)
} 

/**
 * Extracts user-friendly calendar name from technical calendar_name field
 */
export function getFriendlyCalendarName(calendarName: string | null): string {
  if (!calendarName) {
    return 'Yoga Calendar'
  }
  
  // If it's an OAuth format (oauth:google:id:name), extract just the name part
  if (calendarName.startsWith('oauth:google:')) {
    const parts = calendarName.split(':')
    if (parts.length >= 4) {
      // Join everything after the third colon in case the name itself contains colons
      return parts.slice(3).join(':') || 'Yoga Calendar'
    }
  }
  
  // For legacy feeds, return the calendar_name as-is
  return calendarName
}

/**
 * Fetch studio information for events that have studio_ids
 * Falls back to location strings when studio data isn't accessible (e.g., RLS policies)
 */
export async function getStudiosForEvents(supabase: ReturnType<typeof createBrowserClient<Database>>, events: Array<{ studio_id: string | null; location?: string | null }>): Promise<Array<{
  id: string
  name: string
  address?: string
}>> {
  try {
    // Get unique studio IDs from events (these are actually billing_entity IDs)
    const billingEntityIds = [...new Set(
      events
        .map(event => event.studio_id)
        .filter((id): id is string => id !== null)
    )]

    if (billingEntityIds.length === 0) {
      // Fallback: create studio info from location strings
      return createStudioInfoFromLocations(events)
    }

    try {
      // Try to get billing entities to find the actual studio IDs
      const { data: billingEntities, error: billingError } = await supabase
        .from('billing_entities')
        .select('id, studio_id')
        .in('id', billingEntityIds)
        .eq('entity_type', 'studio')

      if (billingError) {
        console.warn('Cannot access billing entities (likely RLS policy), falling back to location strings:', billingError.message)
        return createStudioInfoFromLocations(events)
      }

      // Get unique actual studio IDs
      const actualStudioIds = [...new Set(
        (billingEntities || [])
          .map(be => be.studio_id)
          .filter((id): id is string => id !== null)
      )]

      if (actualStudioIds.length === 0) {
        return createStudioInfoFromLocations(events)
      }

      // Now fetch the actual studios for clean names and addresses
      const { data: studios, error: studiosError } = await supabase
        .from('studios')
        .select('id, name, address')
        .in('id', actualStudioIds)

      if (studiosError) {
        console.warn('Cannot access studios (likely RLS policy), falling back to location strings:', studiosError.message)
        return createStudioInfoFromLocations(events)
      }

      // Create a mapping from billing_entity_id to studio data
      const billingToStudioMap = new Map<string, { id: string; name: string; address?: string }>()
      
      billingEntities.forEach(be => {
        if (be.studio_id) {
          const studio = studios?.find(s => s.id === be.studio_id)
          if (studio) {
            billingToStudioMap.set(be.id, {
              id: be.id, // Use billing entity ID as the filter ID
              name: studio.name,
              address: studio.address || undefined
            })
          }
        }
      })

      const studioData = Array.from(billingToStudioMap.values())
      
      // If we got some studio data, return it; otherwise fallback to locations
      return studioData.length > 0 ? studioData : createStudioInfoFromLocations(events)

    } catch (error) {
      console.warn('Error accessing studio data, falling back to location strings:', error)
      return createStudioInfoFromLocations(events)
    }
  } catch (error) {
    console.error('Error fetching studios:', error)
    return []
  }
}

/**
 * Fallback function to create studio info from location strings
 */
function createStudioInfoFromLocations(events: Array<{ studio_id: string | null; location?: string | null }>): Array<{
  id: string
  name: string
  address?: string
}> {
  const locationMap = new Map<string, { id: string; name: string; address?: string }>()
  
  events.forEach(event => {
    if (event.location && event.studio_id) {
      locationMap.set(event.studio_id, {
        id: event.studio_id,
        name: event.location, // Use location as the display name
        address: undefined
      })
    }
  })
  
  return Array.from(locationMap.values())
} 