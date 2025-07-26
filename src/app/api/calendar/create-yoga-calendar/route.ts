import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { createGoogleCalendarService, generateYogaCalendarName } from '@/lib/google-calendar-service'
import { getValidAccessToken } from '@/lib/oauth-utils'

interface CreateYogaCalendarRequest {
  timeZone?: string
  sync_approach?: string
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { timeZone, sync_approach }: CreateYogaCalendarRequest = await request.json()

    // Get OAuth integration for this user
    const { data: oauthIntegration, error: oauthError } = await supabase
      .from('oauth_calendar_integrations')
      .select('*')
      .eq('user_id', user.id)
      .eq('provider', 'google')
      .single()

    if (oauthError || !oauthIntegration) {
      return NextResponse.json({ 
        error: 'OAuth integration not found. Please connect your Google account first.' 
      }, { status: 404 })
    }

    // Get environment variables
    const clientId = process.env.GOOGLE_CLIENT_ID
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET

    if (!clientId || !clientSecret) {
      return NextResponse.json({ error: 'OAuth configuration missing' }, { status: 500 })
    }

    // Get valid access token (refreshing if needed)
    const accessToken = await getValidAccessToken(
      {
        access_token: oauthIntegration.access_token,
        refresh_token: oauthIntegration.refresh_token,
        expires_at: oauthIntegration.expires_at,
      },
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

    // Get user profile to personalize calendar name
    const { data: userProfile } = await supabase
      .from('users')
      .select('name')
      .eq('id', user.id)
      .single()

    // Create Google Calendar service
    const calendarService = await createGoogleCalendarService(accessToken)

    // Generate calendar name and description
    const calendarName = generateYogaCalendarName(userProfile?.name || undefined)
    const calendarDescription = "This calendar is automatically synced with lenna.yoga for managing your yoga class schedule. Edit events here and they will appear on your public profile."

    // Check if a yoga calendar already exists
    const existingCalendars = await calendarService.getCalendars()
    const existingYogaCalendar = existingCalendars.find(cal => 
      cal.summary.includes("(synced with lenna.yoga)")
    )

    let yogaCalendar
    if (existingYogaCalendar) {
      yogaCalendar = existingYogaCalendar
      console.log(`Using existing yoga calendar: ${yogaCalendar.id}`)
    } else {
      // Create new yoga calendar
      yogaCalendar = await calendarService.createCalendar({
        name: calendarName,
        description: calendarDescription,
        timeZone: timeZone || 'UTC',
      })
      console.log(`Created new yoga calendar: ${yogaCalendar.id}`)
    }

    // Remove existing calendar feeds for this user (clean slate)
    await supabase
      .from('calendar_feeds')
      .delete()
      .eq('user_id', user.id)

    // Create calendar feed entry for the yoga calendar
    const { error: feedError } = await supabase
      .from('calendar_feeds')
      .insert({
        user_id: user.id,
        calendar_name: `oauth:google:${yogaCalendar.id}:${yogaCalendar.summary}`,
        feed_url: null, // OAuth feeds don't have feed_url
        sync_approach: sync_approach || 'yoga_only',
        created_at: new Date().toISOString(),
      })

    if (feedError) {
      console.error('Calendar feed insert error:', feedError)
      return NextResponse.json({ error: 'Failed to save calendar configuration' }, { status: 500 })
    }

    // Update OAuth integration with the yoga calendar ID
    const updatedCalendarIds = [yogaCalendar.id]
    await supabase
      .from('oauth_calendar_integrations')
      .update({
        calendar_ids: updatedCalendarIds,
        updated_at: new Date().toISOString(),
      })
      .eq('id', oauthIntegration.id)

    return NextResponse.json({ 
      success: true,
      calendar: {
        id: yogaCalendar.id,
        name: yogaCalendar.summary,
        description: yogaCalendar.description,
        created: !existingYogaCalendar
      },
      message: existingYogaCalendar 
        ? 'Connected to your existing yoga calendar'
        : 'Created new dedicated yoga calendar'
    })

  } catch (error) {
    console.error('Create yoga calendar error:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Internal server error' 
    }, { status: 500 })
  }
} 