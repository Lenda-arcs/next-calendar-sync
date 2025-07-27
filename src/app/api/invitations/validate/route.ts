import { NextRequest, NextResponse } from 'next/server'
import { validateInvitation } from '@/lib/server/invitation-service'

/**
 * GET /api/invitations/validate?token=... - Validate an invitation token
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')
    
    if (!token) {
      return NextResponse.json({ 
        valid: false, 
        error: 'Token is required' 
      }, { status: 400 })
    }
    
    const result = await validateInvitation(token)
    
    return NextResponse.json(result)
    
  } catch (error) {
    console.error('Error in GET /api/invitations/validate:', error)
    return NextResponse.json(
      { 
        valid: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    )
  }
} 