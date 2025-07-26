import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { createGoogleCalendarService } from '@/lib/google-calendar-service'
import { getValidAccessToken } from '@/lib/oauth-utils'

interface CreateEventRequest {
  summary: string
  description?: string
  start: {
    dateTime?: string
    date?: string
    timeZone?: string
  }
  end: {
    dateTime?: string
    date?: string
    timeZone?: string
  }
  location?: string
  tags?: string[]
  visibility?: 'public' | 'private'
}

interface UpdateEventRequest extends Partial<CreateEventRequest> {
  eventId: string
}

// POST: Create a new event
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const eventData: CreateEventRequest = await request.json()

    // Validate required fields
    if (!eventData.summary || !eventData.start || !eventData.end) {
      return NextResponse.json({ 
        error: 'Missing required fields: summary, start, end' 
      }, { status: 400 })
    }

    // Get OAuth integration and calendar feed
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

    // Get user's calendar feed (should be the dedicated yoga calendar)
    const { data: calendarFeed, error: feedError } = await supabase
      .from('calendar_feeds')
      .select('*')
      .eq('user_id', user.id)
      .like('calendar_name', 'oauth:google:%')
      .single()

    if (feedError || !calendarFeed) {
      return NextResponse.json({ 
        error: 'Calendar feed not found. Please set up your yoga calendar first.' 
      }, { status: 404 })
    }

    // Extract calendar ID from calendar_name format: "oauth:google:calendarId:displayName"
    const calendarId = calendarFeed.calendar_name?.split(':')[2]
    if (!calendarId) {
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

    // Get valid access token
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

    // Create Google Calendar service
    const calendarService = await createGoogleCalendarService(accessToken)

    // Create event in Google Calendar
    const googleEvent = await calendarService.createEvent({
      calendarId,
      summary: eventData.summary,
      description: eventData.description,
      start: eventData.start,
      end: eventData.end,
      location: eventData.location,
      extendedProperties: {
        private: {
          'lenna.yoga.created': 'true',
          'lenna.yoga.tags': JSON.stringify(eventData.tags || []),
          'lenna.yoga.visibility': eventData.visibility || 'public'
        }
      }
    })

    // Create corresponding event in our database
    const { data: dbEvent, error: dbError } = await supabase
      .from('events')
      .insert({
        user_id: user.id,
        feed_id: calendarFeed.id,
        title: eventData.summary,
        description: eventData.description,
        start_time: eventData.start.dateTime || eventData.start.date,
        end_time: eventData.end.dateTime || eventData.end.date,
        location: eventData.location,
        tags: eventData.tags,
        visibility: eventData.visibility || 'public',
        uid: googleEvent.id,
        recurrence_id: googleEvent.id || '',
        status: 'confirmed',
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database event creation error:', dbError)
      // Try to clean up the Google Calendar event
      try {
        await calendarService.deleteEvent(calendarId, googleEvent.id!)
      } catch (cleanupError) {
        console.error('Failed to cleanup Google Calendar event:', cleanupError)
      }
      return NextResponse.json({ error: 'Failed to save event' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true,
      event: dbEvent,
      googleEventId: googleEvent.id,
      message: 'Event created successfully'
    })

  } catch (error) {
    console.error('Create event error:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Internal server error' 
    }, { status: 500 })
  }
}

// PUT: Update an existing event
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const updateData: UpdateEventRequest = await request.json()

    if (!updateData.eventId) {
      return NextResponse.json({ 
        error: 'Missing required field: eventId' 
      }, { status: 400 })
    }

    // Get the existing event from our database
    const { data: existingEvent, error: eventError } = await supabase
      .from('events')
      .select('*')
      .eq('id', updateData.eventId)
      .eq('user_id', user.id)
      .single()

    if (eventError || !existingEvent) {
      return NextResponse.json({ 
        error: 'Event not found' 
      }, { status: 404 })
    }

    // Get OAuth integration and calendar info
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

    const { data: calendarFeed, error: feedError } = await supabase
      .from('calendar_feeds')
      .select('*')
      .eq('id', existingEvent.feed_id)
      .single()

    if (feedError || !calendarFeed) {
      return NextResponse.json({ 
        error: 'Calendar feed not found' 
      }, { status: 404 })
    }

    const calendarId = calendarFeed.calendar_name?.split(':')[2]
    if (!calendarId) {
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

    // Get valid access token
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

    // Create Google Calendar service
    const calendarService = await createGoogleCalendarService(accessToken)

    // Prepare update data for Google Calendar
    const googleUpdateData: {
      summary?: string
      description?: string
      start?: { dateTime?: string; date?: string; timeZone?: string }
      end?: { dateTime?: string; date?: string; timeZone?: string }
      location?: string
      extendedProperties?: { private?: Record<string, string> }
    } = {}
    
    if (updateData.summary) googleUpdateData.summary = updateData.summary
    if (updateData.description !== undefined) googleUpdateData.description = updateData.description
    if (updateData.start) googleUpdateData.start = updateData.start
    if (updateData.end) googleUpdateData.end = updateData.end
    if (updateData.location !== undefined) googleUpdateData.location = updateData.location
    
    if (updateData.tags || updateData.visibility) {
      googleUpdateData.extendedProperties = {
        private: {
          'lenna.yoga.created': 'true',
          'lenna.yoga.tags': JSON.stringify(updateData.tags || existingEvent.tags || []),
          'lenna.yoga.visibility': updateData.visibility || existingEvent.visibility || 'public'
        }
      }
    }

    // Update event in Google Calendar
    const googleEvent = await calendarService.updateEvent(
      calendarId, 
      existingEvent.uid!, 
      googleUpdateData
    )

    // Prepare update data for our database
    const dbUpdateData: {
      updated_at: string
      title?: string
      description?: string
      start_time?: string
      end_time?: string
      location?: string
      tags?: string[]
      visibility?: string
    } = { updated_at: new Date().toISOString() }
    
    if (updateData.summary) dbUpdateData.title = updateData.summary
    if (updateData.description !== undefined) dbUpdateData.description = updateData.description
    if (updateData.start) dbUpdateData.start_time = updateData.start.dateTime || updateData.start.date
    if (updateData.end) dbUpdateData.end_time = updateData.end.dateTime || updateData.end.date
    if (updateData.location !== undefined) dbUpdateData.location = updateData.location
    if (updateData.tags) dbUpdateData.tags = updateData.tags
    if (updateData.visibility) dbUpdateData.visibility = updateData.visibility

    // Update event in our database
    const { data: updatedEvent, error: updateError } = await supabase
      .from('events')
      .update(dbUpdateData)
      .eq('id', updateData.eventId)
      .eq('user_id', user.id)
      .select()
      .single()

    if (updateError) {
      console.error('Database event update error:', updateError)
      return NextResponse.json({ error: 'Failed to update event' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true,
      event: updatedEvent,
      googleEventId: googleEvent.id,
      message: 'Event updated successfully'
    })

  } catch (error) {
    console.error('Update event error:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Internal server error' 
    }, { status: 500 })
  }
} 

// DELETE: Delete an event
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const url = new URL(request.url)
    const eventId = url.searchParams.get('eventId')

    if (!eventId) {
      return NextResponse.json({ 
        error: 'Missing required parameter: eventId' 
      }, { status: 400 })
    }

    // Get the existing event from our database
    const { data: existingEvent, error: eventError } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .eq('user_id', user.id)
      .single()

    if (eventError || !existingEvent) {
      return NextResponse.json({ 
        error: 'Event not found' 
      }, { status: 404 })
    }

    // Get OAuth integration and calendar info
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

    const { data: calendarFeed, error: feedError } = await supabase
      .from('calendar_feeds')
      .select('*')
      .eq('id', existingEvent.feed_id)
      .single()

    if (feedError || !calendarFeed) {
      return NextResponse.json({ 
        error: 'Calendar feed not found' 
      }, { status: 404 })
    }

    const calendarId = calendarFeed.calendar_name?.split(':')[2]
    if (!calendarId) {
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

    // Get valid access token
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

    // Create Google Calendar service
    const calendarService = await createGoogleCalendarService(accessToken)

    // Delete event from Google Calendar
    if (existingEvent.uid) {
      try {
        await calendarService.deleteEvent(calendarId, existingEvent.uid)
      } catch (googleError) {
        console.error('Failed to delete event from Google Calendar:', googleError)
        // Continue with database deletion even if Google Calendar deletion fails
      }
    }

    // Delete event from our database
    const { error: deleteError } = await supabase
      .from('events')
      .delete()
      .eq('id', eventId)
      .eq('user_id', user.id)

    if (deleteError) {
      console.error('Database event deletion error:', deleteError)
      return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true,
      message: 'Event deleted successfully'
    })

  } catch (error) {
    console.error('Delete event error:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Internal server error' 
    }, { status: 500 })
  }
} 