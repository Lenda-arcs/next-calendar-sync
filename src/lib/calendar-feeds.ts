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
): Promise<{ success: boolean; count: number }> {
  try {
    const { data, error } = await supabase.functions.invoke('sync-feed', {
      body: { 
        feed_id: id,
        mode: 'default'
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