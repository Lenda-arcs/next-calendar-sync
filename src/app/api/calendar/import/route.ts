import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { createCalendarImportService } from '@/lib/calendar-import-service'
import { ICSParser } from '@/lib/ics-parser'

// GET: Get available calendars for import
export async function GET() {
  try {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get OAuth integration
    const { data: oauthIntegration, error: oauthError } = await supabase
      .from('oauth_calendar_integrations')
      .select('*')
      .eq('user_id', user.id)
      .eq('provider', 'google')
      .single()

    if (oauthError || !oauthIntegration) {
      return NextResponse.json({ 
        error: 'Google Calendar integration not found' 
      }, { status: 404 })
    }

    // Get yoga calendar ID from calendar feeds
    const { data: calendarFeed, error: feedError } = await supabase
      .from('calendar_feeds')
      .select('*')
      .eq('user_id', user.id)
      .like('calendar_name', 'oauth:google:%')
      .single()

    if (feedError || !calendarFeed) {
      return NextResponse.json({ 
        error: 'Yoga calendar not found. Please set up your calendar first.' 
      }, { status: 404 })
    }

    const yogaCalendarId = calendarFeed.calendar_name?.split(':')[2]
    if (!yogaCalendarId) {
      return NextResponse.json({ 
        error: 'Invalid calendar configuration' 
      }, { status: 500 })
    }

    // Get environment variables
    const clientId = process.env.GOOGLE_CLIENT_ID
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET

    if (!clientId || !clientSecret) {
      return NextResponse.json({ error: 'OAuth configuration missing' }, { status: 500 })
    }

    // Create import service
    const importService = await createCalendarImportService(
      {
        access_token: oauthIntegration.access_token,
        refresh_token: oauthIntegration.refresh_token,
        expires_at: oauthIntegration.expires_at,
      },
      yogaCalendarId,
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

    // Get available calendars
    const calendars = await importService.getAvailableCalendars()

    return NextResponse.json({ 
      success: true,
      calendars,
      yogaCalendarId
    })

  } catch (error) {
    console.error('Get import calendars error:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Internal server error' 
    }, { status: 500 })
  }
}

// POST: Preview or import events
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { action, source, sourceCalendarId, icsContent, events } = body

    if (!action || !source) {
      return NextResponse.json({ 
        error: 'Missing required fields: action, source' 
      }, { status: 400 })
    }

    // Get OAuth integration and yoga calendar
    const [oauthResult, feedResult] = await Promise.all([
      supabase
        .from('oauth_calendar_integrations')
        .select('*')
        .eq('user_id', user.id)
        .eq('provider', 'google')
        .single(),
      supabase
        .from('calendar_feeds')
        .select('*')
        .eq('user_id', user.id)
        .like('calendar_name', 'oauth:google:%')
        .single()
    ])

    const { data: oauthIntegration, error: oauthError } = oauthResult
    const { data: calendarFeed, error: feedError } = feedResult

    if (oauthError || !oauthIntegration) {
      return NextResponse.json({ 
        error: 'Google Calendar integration not found' 
      }, { status: 404 })
    }

    if (feedError || !calendarFeed) {
      return NextResponse.json({ 
        error: 'Yoga calendar not found' 
      }, { status: 404 })
    }

    const yogaCalendarId = calendarFeed.calendar_name?.split(':')[2]
    if (!yogaCalendarId) {
      return NextResponse.json({ 
        error: 'Invalid calendar configuration' 
      }, { status: 500 })
    }

    const clientId = process.env.GOOGLE_CLIENT_ID
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET

    if (!clientId || !clientSecret) {
      return NextResponse.json({ error: 'OAuth configuration missing' }, { status: 500 })
    }

    if (action === 'preview') {
      // Preview events for selection
      if (source === 'google') {
        if (!sourceCalendarId) {
          return NextResponse.json({ 
            error: 'Missing sourceCalendarId for Google import' 
          }, { status: 400 })
        }

        const importService = await createCalendarImportService(
          {
            access_token: oauthIntegration.access_token,
            refresh_token: oauthIntegration.refresh_token,
            expires_at: oauthIntegration.expires_at,
          },
          yogaCalendarId,
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

        const previewResult = await importService.fetchEventsForPreview(sourceCalendarId)
        
        return NextResponse.json({
          success: true,
          preview: previewResult
        })

      } else if (source === 'ics') {
        if (!icsContent) {
          return NextResponse.json({ 
            error: 'Missing icsContent for ICS import' 
          }, { status: 400 })
        }

        const parseResult = ICSParser.parseICSContent(icsContent)
        if (parseResult.errors.length > 0) {
          return NextResponse.json({ 
            error: 'ICS parsing failed',
            errors: parseResult.errors
          }, { status: 400 })
        }

        const previewResult = ICSParser.convertToImportableEvents(parseResult)
        
        return NextResponse.json({
          success: true,
          preview: previewResult
        })
      }

    } else if (action === 'import') {
      // Import selected events
      if (!events || !Array.isArray(events)) {
        return NextResponse.json({ 
          error: 'Missing events array for import' 
        }, { status: 400 })
      }

      const importService = await createCalendarImportService(
        {
          access_token: oauthIntegration.access_token,
          refresh_token: oauthIntegration.refresh_token,
          expires_at: oauthIntegration.expires_at,
        },
        yogaCalendarId,
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

      const importResult = await importService.importSelectedEvents(events, user.id)

      return NextResponse.json({
        success: importResult.success,
        imported: importResult.importedCount,
        skipped: importResult.skippedCount,
        errors: importResult.errors,
        eventIds: importResult.importedEventIds
      })
    }

    return NextResponse.json({ 
      error: 'Invalid action. Use "preview" or "import"' 
    }, { status: 400 })

  } catch (error) {
    console.error('Calendar import error:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Internal server error' 
    }, { status: 500 })
  }
} 