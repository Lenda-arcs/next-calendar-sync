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
): Promise<CalendarFeed> {
  const { data, error } = await supabase
    .from("calendar_feeds")
    .insert(feed)
    .select()
    .single()

  if (error) throw error
  
  // TODO: Implement syncCalendarFeed function
  // await syncCalendarFeed(data.id)
  
  return data
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
): Promise<void> {
  // TODO: Implement calendar feed sync logic
  // For now, just update the last_synced_at timestamp
  const { error } = await supabase
    .from("calendar_feeds")
    .update({ last_synced_at: new Date().toISOString() })
    .eq("id", id)

  if (error) throw error
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