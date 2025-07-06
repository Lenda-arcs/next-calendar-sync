import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { 
  createCalendarInvitation, 
  getCalendarInvitations, 
  getActiveCalendarInvitations 
} from '@/lib/server/calendar-invitation-service'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get query parameter to determine if we want all or just active invitations
    const { searchParams } = new URL(request.url)
    const activeOnly = searchParams.get('active') === 'true'

    const result = activeOnly 
      ? await getActiveCalendarInvitations(user.id)
      : await getCalendarInvitations(user.id)

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({
      invitations: result.invitations,
      count: result.invitations.length
    })
  } catch (error) {
    console.error('Error in GET /api/calendar-invitations:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse request body
    const body = await request.json()
    const { expiry_hours, base_domain } = body

    // Validate expiry_hours if provided
    if (expiry_hours !== undefined) {
      if (typeof expiry_hours !== 'number' || expiry_hours < 1 || expiry_hours > 168) {
        return NextResponse.json({ 
          error: 'Invalid expiry_hours. Must be between 1 and 168 hours.' 
        }, { status: 400 })
      }
    }

    // Validate base_domain if provided
    if (base_domain !== undefined) {
      if (typeof base_domain !== 'string' || base_domain.length < 3) {
        return NextResponse.json({ 
          error: 'Invalid base_domain. Must be a valid domain string.' 
        }, { status: 400 })
      }
    }

    // Create calendar invitation
    const result = await createCalendarInvitation(user.id, {
      expiry_hours,
      base_domain
    })

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      invitation: result.invitation,
      message: 'Calendar invitation created successfully'
    })
  } catch (error) {
    console.error('Error in POST /api/calendar-invitations:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 