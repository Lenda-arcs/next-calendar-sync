import { NextRequest, NextResponse } from 'next/server'
import { markInvitationAsUsed } from '@/lib/server/invitation-service'

/**
 * POST /api/invitations/mark-used - Mark an invitation as used
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, userId } = body
    
    if (!token || !userId) {
      return NextResponse.json({ 
        success: false,
        error: 'Token and userId are required' 
      }, { status: 400 })
    }
    
    const result = await markInvitationAsUsed(token, userId)
    
    if (result.success) {
      return NextResponse.json({ 
        success: true,
        message: 'Invitation marked as used successfully'
      })
    } else {
      return NextResponse.json({ 
        success: false,
        error: result.error || 'Failed to mark invitation as used'
      }, { status: 400 })
    }
    
  } catch (error) {
    console.error('Error in POST /api/invitations/mark-used:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}