import { createServerClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('redirect_to') ?? '/app'
  const error = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')

  // Handle OAuth errors
  if (error) {
    console.error('Auth callback error:', error, errorDescription)
    return NextResponse.redirect(`${origin}/auth/sign-in?error=auth_callback_error&message=${encodeURIComponent(errorDescription || 'Authentication failed')}`)
  }

  if (code) {
    const supabase = await createServerClient()
    
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!exchangeError && data.user) {
      // Successful email confirmation or OAuth completion
      console.log('Auth callback successful for user:', data.user.email)
      
      // Check if this is a new user (email confirmation) vs existing user login
      // For new users, the email confirmation timestamp should be very recent
      const emailConfirmedAt = data.user.email_confirmed_at ? new Date(data.user.email_confirmed_at) : null
      const isNewUser = emailConfirmedAt && 
                       emailConfirmedAt.getTime() > Date.now() - 120000 // Within last 2 minutes
      
      console.log('Email confirmation debug:', {
        userId: data.user.id,
        email: data.user.email,
        emailConfirmedAt: emailConfirmedAt?.toISOString(),
        isNewUser,
        redirectTo: next
      })
      
      if (isNewUser) {
        // New user - redirect to onboarding with success message
        const redirectUrl = new URL(next, origin)
        redirectUrl.searchParams.set('success', 'email_confirmed')
        return NextResponse.redirect(redirectUrl.toString())
      } else {
        // Check if this was an OAuth flow from onboarding (for calendar selection)
        if (next.includes('step=select_calendars')) {
          // This is OAuth callback - redirect to calendar selection as normal
          return NextResponse.redirect(`${origin}${next}`)
        } else {
          // Regular OAuth or other flow - redirect normally
      return NextResponse.redirect(`${origin}${next}`)
        }
      }
    }
    
    // Log the error for debugging
    console.error('Failed to exchange code for session:', exchangeError)
    return NextResponse.redirect(`${origin}/auth/sign-in?error=auth_callback_error&message=${encodeURIComponent('Failed to confirm email')}`)
  }

  // No code provided
  return NextResponse.redirect(`${origin}/auth/sign-in?error=auth_callback_error&message=${encodeURIComponent('No confirmation code provided')}`)
} 