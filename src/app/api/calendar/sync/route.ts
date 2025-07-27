import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'

export async function POST() {
  try {
    const supabase = await createServerClient()
    
    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get the user's calendar feed
    const { data: feed, error: feedError } = await supabase
      .from('calendar_feeds')
      .select('id')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (feedError || !feed) {
      return NextResponse.json({ error: 'No calendar feed found for user' }, { status: 404 })
    }

    // Call the Supabase sync-feed function
    const syncResponse = await supabase.functions.invoke('sync-feed', {
      body: {
        feed_id: feed.id,
        mode: 'default',
        window_days: 90
      }
    })

    if (syncResponse.error) {
      console.error('Sync function error:', syncResponse.error)
      return NextResponse.json({ 
        error: 'Failed to sync calendar', 
        details: syncResponse.error 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Calendar sync triggered successfully',
      feedId: feed.id
    })
  } catch (error) {
    console.error('Calendar sync API error:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
} 