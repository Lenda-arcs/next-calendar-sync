import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServerClient()
    const { id: feedId } = await params
    
    // Get the calendar feed to verify user ownership
    const { data: feed, error: feedError } = await supabase
      .from('calendar_feeds')
      .select('user_id')
      .eq('id', feedId)
      .single()

    if (feedError || !feed) {
      return NextResponse.json({ error: 'Calendar feed not found' }, { status: 404 })
    }

    // Get recent events from this calendar feed for pattern analysis
    // Fetch events from the last 30 days and next 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const thirtyDaysFromNow = new Date()
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)

    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('title, location, description, start_time, end_time')
      .eq('feed_id', feedId)
      .gte('start_time', thirtyDaysAgo.toISOString())
      .lte('start_time', thirtyDaysFromNow.toISOString())
      .order('start_time', { ascending: false })
      .limit(100) // Limit to avoid too much data

    if (eventsError) {
      console.error('Error fetching calendar events:', eventsError)
      return NextResponse.json({ error: 'Failed to fetch calendar events' }, { status: 500 })
    }

    // Transform events to match the expected format
    const calendarEvents = events.map(event => ({
      title: event.title || '',
      location: event.location || '',
      description: event.description || '',
      start_time: event.start_time,
      end_time: event.end_time
    }))

    return NextResponse.json({ events: calendarEvents })
  } catch (error) {
    console.error('Error in calendar events endpoint:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 