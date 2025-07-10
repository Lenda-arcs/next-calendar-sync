import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const { sync_approach } = await request.json()

    // Validate sync_approach
    if (!sync_approach || !['yoga_only', 'mixed_calendar'].includes(sync_approach)) {
      return NextResponse.json({ 
        error: 'Invalid sync_approach. Must be "yoga_only" or "mixed_calendar"' 
      }, { status: 400 })
    }

    // Check if the calendar feed exists and belongs to the user
    const { data: existingFeed, error: fetchError } = await supabase
      .from('calendar_feeds')
      .select('id, user_id, sync_approach')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (fetchError || !existingFeed) {
      return NextResponse.json({ error: 'Calendar feed not found' }, { status: 404 })
    }

    // Update the sync approach
    const { data: updatedFeed, error: updateError } = await supabase
      .from('calendar_feeds')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .update({ sync_approach } as any) // Type assertion for new field not yet in generated types
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating calendar feed sync approach:', updateError)
      return NextResponse.json({ error: 'Failed to update sync approach' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      feed: updatedFeed,
      message: `Sync approach updated to ${sync_approach === 'yoga_only' ? 'yoga classes only' : 'mixed calendar with filtering'}`
    })
  } catch (error) {
    console.error('Error in PATCH /api/calendar-feeds/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 