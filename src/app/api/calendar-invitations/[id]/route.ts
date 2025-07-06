import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { 
  getCalendarInvitation, 
  updateCalendarInvitationStatus, 
  cancelCalendarInvitation 
} from '@/lib/server/calendar-invitation-service'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServerClient()
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    if (!id) {
      return NextResponse.json({ error: 'Invitation ID is required' }, { status: 400 })
    }

    const result = await getCalendarInvitation(user.id, id)

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 404 })
    }

    return NextResponse.json({
      invitation: result.invitation
    })
  } catch (error) {
    console.error('Error in GET /api/calendar-invitations/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServerClient()
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    if (!id) {
      return NextResponse.json({ error: 'Invitation ID is required' }, { status: 400 })
    }

    // Parse request body
    const body = await request.json()
    const { status, metadata } = body

    // Validate status
    const validStatuses = ['pending', 'accepted', 'expired', 'cancelled']
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json({ 
        error: 'Invalid status. Must be one of: ' + validStatuses.join(', ') 
      }, { status: 400 })
    }

    // Update invitation status
    const result = await updateCalendarInvitationStatus(user.id, id, status, metadata)

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Calendar invitation updated successfully'
    })
  } catch (error) {
    console.error('Error in PUT /api/calendar-invitations/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServerClient()
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    if (!id) {
      return NextResponse.json({ error: 'Invitation ID is required' }, { status: 400 })
    }

    // Cancel the invitation
    const result = await cancelCalendarInvitation(user.id, id)

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Calendar invitation cancelled successfully'
    })
  } catch (error) {
    console.error('Error in DELETE /api/calendar-invitations/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 