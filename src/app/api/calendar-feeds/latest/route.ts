import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Get the most recent calendar feed for this user
    const { data: feed, error } = await supabase
      .from('calendar_feeds')
      .select('id')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error) {
      console.error('Error fetching latest calendar feed:', error)
      return NextResponse.json({ error: 'Failed to fetch calendar feed' }, { status: 500 })
    }

    if (!feed) {
      return NextResponse.json({ error: 'No calendar feed found' }, { status: 404 })
    }

    return NextResponse.json({ feedId: feed.id })
  } catch (error) {
    console.error('Error in latest calendar feed endpoint:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 