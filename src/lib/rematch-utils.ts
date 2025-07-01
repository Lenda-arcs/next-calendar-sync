import { createBrowserClient } from '@supabase/ssr'

export interface RematchEventsParams {
  user_id: string
  feed_id?: string
  event_ids?: string[]
  rematch_tags?: boolean
  rematch_studios?: boolean
  batch_size?: number
}

export interface RematchEventsResult {
  success: boolean
  total_events_processed: number
  updated_count: number
  message: string
}

/**
 * Re-match existing events with studios and tags without re-fetching calendar data
 * This is much faster than a full sync when you only need to update matching logic
 * 
 * Important: Studio rematch only affects events assigned to actual studios,
 * preserving manual teacher billing assignments made via SubstituteEventModal
 */
export async function rematchEvents(params: RematchEventsParams): Promise<RematchEventsResult> {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  try {
    const { data, error } = await supabase.functions.invoke('rematch-events', {
      body: params
    })

    if (error) {
      console.error('Failed to rematch events:', error)
      throw new Error(`Failed to rematch events: ${error.message}`)
    }

    return data as RematchEventsResult
  } catch (error) {
    console.error('Error calling rematch-events function:', error)
    throw error
  }
}

/**
 * Rematch tags for all events of a user (after tag rule changes)
 * Note: This only updates tags and preserves manual studio/teacher billing settings
 */
export async function rematchUserTags(userId: string): Promise<RematchEventsResult> {
  return rematchEvents({
    user_id: userId,
    rematch_tags: true,
    rematch_studios: false
  })
}

/**
 * Rematch studios for all events of a user (after studio location pattern changes)
 * Note: This only matches to actual studios, preserving manual teacher billing settings
 */
export async function rematchUserStudios(userId: string): Promise<RematchEventsResult> {
  return rematchEvents({
    user_id: userId,
    rematch_tags: false,
    rematch_studios: true
  })
}

/**
 * Rematch both tags and studios for specific events
 */
export async function rematchSpecificEvents(
  userId: string, 
  eventIds: string[]
): Promise<RematchEventsResult> {
  return rematchEvents({
    user_id: userId,
    event_ids: eventIds,
    rematch_tags: true,
    rematch_studios: true
  })
}

/**
 * Rematch all events for a specific calendar feed
 */
export async function rematchFeedEvents(
  userId: string, 
  feedId: string
): Promise<RematchEventsResult> {
  return rematchEvents({
    user_id: userId,
    feed_id: feedId,
    rematch_tags: true,
    rematch_studios: true
  })
} 