import { NextRequest, NextResponse } from 'next/server'
import { markInvitationAsUsed } from '@/lib/server/invitation-service'

/**
 * POST /api/invitations/mark-used - Mark an invitation as used after successful registration
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, userId } = body
    
    if (!token || !userId) {
      return NextResponse.json({ 
        error: 'Token and userId are required' 
      }, { status: 400 })
    }
    
    const result = await markInvitationAsUsed(token, userId)
    
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }
    
    return NextResponse.json({ success: true })
    
  } catch (error) {
    console.error('Error in POST /api/invitations/mark-used:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 