import { createServerClient } from '@/lib/supabase-server'
import { CalendarItem, OAuthIntegration } from '@/lib/types'
import { getValidAccessToken, fetchGoogleCalendars } from '@/lib/oauth-utils'

export interface FetchOAuthCalendarsResult {
  calendars: CalendarItem[]
  error?: string
}

/**
 * Fetches available calendars for a user's OAuth integration
 */
export async function fetchOAuthCalendars(userId: string): Promise<FetchOAuthCalendarsResult> {
  try {
    const supabase = await createServerClient()
    
    // Get OAuth integration
    const { data: oauthIntegration, error: oauthError } = await supabase
      .from('oauth_calendar_integrations')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (oauthError || !oauthIntegration) {
      return { calendars: [], error: 'OAuth integration not found' }
    }

    // Get environment variables
    const clientId = process.env.GOOGLE_CLIENT_ID
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET

    if (!clientId || !clientSecret) {
      return { calendars: [], error: 'OAuth configuration missing' }
    }

    // Get valid access token (refreshing if needed)
    const accessToken = await getValidAccessToken(
      oauthIntegration as OAuthIntegration,
      clientId,
      clientSecret,
      async (newToken: string, newExpiresAt: string) => {
        await supabase
          .from('oauth_calendar_integrations')
          .update({
            access_token: newToken,
            expires_at: newExpiresAt,
            updated_at: new Date().toISOString(),
          })
          .eq('id', oauthIntegration.id)
      }
    )

    // Fetch calendars from Google
    const calendars = await fetchGoogleCalendars(accessToken)

    // Get currently selected calendars
    const { data: existingFeeds } = await supabase
      .from('calendar_feeds')
      .select('calendar_name')
      .eq('user_id', userId)
      .is('feed_url', null)
      .like('calendar_name', 'oauth:google:%')

    const selectedCalendarIds = existingFeeds?.map((feed: { calendar_name: string | null }) => {
      const parts = feed.calendar_name?.split(':')
      return parts?.[2] // Extract calendar ID from "oauth:google:calendarId:displayName"
    }).filter(Boolean) || []

    // Mark selected calendars
    const calendarsWithSelection = calendars.map(cal => ({
      ...cal,
      selected: selectedCalendarIds.includes(cal.id)
    }))

    return { calendars: calendarsWithSelection }
  } catch (error) {
    console.error('Failed to fetch OAuth calendars:', error)
    return { 
      calendars: [], 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }
  }
} 