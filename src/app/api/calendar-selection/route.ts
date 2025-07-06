import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'

interface GoogleCalendarItem {
  id: string
  summary: string
  primary?: boolean
  accessRole?: string
  backgroundColor?: string
  description?: string
}

interface CalendarSelection {
  calendarId: string
  selected: boolean
}

// GET: Fetch available calendars from OAuth integration
export async function GET() {
  try {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get OAuth integration for this user
    const { data: oauthIntegration, error: oauthError } = await supabase
      .from('oauth_calendar_integrations')
      .select('*')
      .eq('user_id', user.id)
      .eq('provider', 'google')
      .single()

    if (oauthError || !oauthIntegration) {
      return NextResponse.json({ error: 'OAuth integration not found' }, { status: 404 })
    }

    // Check if token needs refresh
    const now = new Date()
    const expiresAt = new Date(oauthIntegration.expires_at || 0)
    let accessToken = oauthIntegration.access_token

    if (expiresAt <= now && oauthIntegration.refresh_token) {
      // Refresh the token
      const refreshResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: process.env.GOOGLE_CLIENT_ID!,
          client_secret: process.env.GOOGLE_CLIENT_SECRET!,
          refresh_token: oauthIntegration.refresh_token,
          grant_type: 'refresh_token',
        }),
      })

      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json()
        accessToken = refreshData.access_token

        // Update the stored token
        await supabase
          .from('oauth_calendar_integrations')
          .update({
            access_token: refreshData.access_token,
            expires_at: new Date(Date.now() + refreshData.expires_in * 1000).toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('id', oauthIntegration.id)
      }
    }

    // Fetch calendars from Google Calendar API
    const calendarsResponse = await fetch('https://www.googleapis.com/calendar/v3/users/me/calendarList', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    })

    if (!calendarsResponse.ok) {
      console.error('Failed to fetch calendars:', await calendarsResponse.text())
      return NextResponse.json({ error: 'Failed to fetch calendars' }, { status: 500 })
    }

    const calendarsData = await calendarsResponse.json()
    const calendars = calendarsData.items || []

    // Get currently selected calendars (existing calendar_feeds)
    const { data: existingFeeds } = await supabase
      .from('calendar_feeds')
      .select('calendar_name')
      .eq('user_id', user.id)
      .is('feed_url', null)
      .like('calendar_name', 'oauth:google:%')

    const selectedCalendarIds = existingFeeds?.map(feed => {
      const parts = feed.calendar_name?.split(':')
      return parts?.[2] // Extract calendar ID from "oauth:google:calendarId:displayName"
    }).filter(Boolean) || []

    // Return calendars with selection status
    const calendarsWithSelection = calendars.map((cal: GoogleCalendarItem) => ({
      id: cal.id,
      summary: cal.summary,
      primary: cal.primary,
      accessRole: cal.accessRole,
      backgroundColor: cal.backgroundColor,
      description: cal.description,
      selected: selectedCalendarIds.includes(cal.id)
    }))

    return NextResponse.json({ calendars: calendarsWithSelection })
  } catch (error) {
    console.error('Calendar selection GET error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

// POST: Save calendar selection
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { selections }: { selections: CalendarSelection[] } = await request.json()

    if (!selections || !Array.isArray(selections)) {
      return NextResponse.json({ error: 'Invalid selections' }, { status: 400 })
    }

    // Get OAuth integration to fetch calendar details
    const { data: oauthIntegration, error: oauthError } = await supabase
      .from('oauth_calendar_integrations')
      .select('*')
      .eq('user_id', user.id)
      .eq('provider', 'google')
      .single()

    if (oauthError || !oauthIntegration) {
      return NextResponse.json({ error: 'OAuth integration not found' }, { status: 404 })
    }

    // Fetch current calendar details from Google to get names
    let accessToken = oauthIntegration.access_token

    // Check if token needs refresh
    const now = new Date()
    const expiresAt = new Date(oauthIntegration.expires_at || 0)

    if (expiresAt <= now && oauthIntegration.refresh_token) {
      const refreshResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: process.env.GOOGLE_CLIENT_ID!,
          client_secret: process.env.GOOGLE_CLIENT_SECRET!,
          refresh_token: oauthIntegration.refresh_token,
          grant_type: 'refresh_token',
        }),
      })

      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json()
        accessToken = refreshData.access_token
      }
    }

    const calendarsResponse = await fetch('https://www.googleapis.com/calendar/v3/users/me/calendarList', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    })

    if (!calendarsResponse.ok) {
      return NextResponse.json({ error: 'Failed to fetch calendar details' }, { status: 500 })
    }

    const calendarsData = await calendarsResponse.json()
    const calendars = calendarsData.items || []
    const calendarMap = Object.fromEntries(calendars.map((cal: GoogleCalendarItem) => [cal.id, cal]))

    // Remove all existing OAuth calendar feeds for this user
    await supabase
      .from('calendar_feeds')
      .delete()
      .eq('user_id', user.id)
      .is('feed_url', null)
      .like('calendar_name', 'oauth:google:%')

    // Create calendar_feeds entries for selected calendars
    const selectedCalendars = selections.filter(sel => sel.selected)
    
    if (selectedCalendars.length > 0) {
      const calendarFeeds = selectedCalendars.map(sel => {
        const calendar = calendarMap[sel.calendarId]
        return {
          user_id: user.id,
          calendar_name: `oauth:google:${sel.calendarId}:${calendar?.summary || 'Unknown Calendar'}`,
          feed_url: null, // OAuth feeds don't have feed_url
        }
      })

      const { error: feedsError } = await supabase
        .from('calendar_feeds')
        .insert(calendarFeeds)

      if (feedsError) {
        console.error('Calendar feeds insert error:', feedsError)
        return NextResponse.json({ error: 'Failed to save calendar selection' }, { status: 500 })
      }
    }

    return NextResponse.json({ 
      success: true, 
      selectedCount: selectedCalendars.length,
      message: `Successfully selected ${selectedCalendars.length} calendar${selectedCalendars.length !== 1 ? 's' : ''} for sync`
    })
  } catch (error) {
    console.error('Calendar selection POST error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
} 