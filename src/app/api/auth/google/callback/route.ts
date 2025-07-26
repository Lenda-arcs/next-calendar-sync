import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { cookies } from 'next/headers'

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`

interface GoogleTokenResponse {
  access_token: string
  refresh_token?: string
  expires_in: number
  scope: string
  token_type: string
}

interface GoogleUserInfo {
  id: string
  email: string
  name: string
  picture?: string
}

interface GoogleCalendarItem {
  id: string
  summary: string
  primary?: boolean
  accessRole?: string
  backgroundColor?: string
}

export async function GET(request: NextRequest) {
  // Get base URL from request or environment
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || `${request.nextUrl.protocol}//${request.nextUrl.host}`
  
  try {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.redirect(`${baseUrl}/auth/sign-in?error=unauthorized`)
    }

    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')

    if (error) {
      console.error('Google OAuth error:', error)
      return NextResponse.redirect(`${baseUrl}/app/add-calendar?error=oauth_denied`)
    }

    if (!code || !state) {
      return NextResponse.redirect(`${baseUrl}/app/add-calendar?error=invalid_callback`)
    }

    // Verify state parameter
    const cookieStore = await cookies()
    const storedState = cookieStore.get('google_oauth_state')?.value
    
    if (!storedState || storedState !== state) {
      return NextResponse.redirect(`${baseUrl}/app/add-calendar?error=invalid_state`)
    }

    // Clear the state cookie
    cookieStore.delete('google_oauth_state')

    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID!,
        client_secret: GOOGLE_CLIENT_SECRET!,
        code,
        grant_type: 'authorization_code',
        redirect_uri: GOOGLE_REDIRECT_URI,
      }),
    })

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text()
      console.error('Token exchange failed:', {
        status: tokenResponse.status,
        statusText: tokenResponse.statusText,
        error: errorText
      })
      return NextResponse.redirect(`${baseUrl}/app/add-calendar?error=token_exchange_failed`)
    }

    const tokens: GoogleTokenResponse = await tokenResponse.json()

    // Get user info from Google
    
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        'Authorization': `Bearer ${tokens.access_token}`,
      },
    })

    if (!userInfoResponse.ok) {
      const errorText = await userInfoResponse.text()
      console.error('Failed to get user info:', {
        status: userInfoResponse.status,
        statusText: userInfoResponse.statusText,
        error: errorText
      })
      return NextResponse.redirect(`${baseUrl}/app/add-calendar?error=user_info_failed`)
    }

    const googleUser: GoogleUserInfo = await userInfoResponse.json()

    // Get user's calendars
    const calendarsResponse = await fetch('https://www.googleapis.com/calendar/v3/users/me/calendarList', {
      headers: {
        'Authorization': `Bearer ${tokens.access_token}`,
      },
    })

    if (!calendarsResponse.ok) {
      console.error('Failed to get calendars:', await calendarsResponse.text())
      return NextResponse.redirect(`${baseUrl}/app/add-calendar?error=calendar_fetch_failed`)
    }

    const calendarsData = await calendarsResponse.json()
    const calendarIds = calendarsData.items?.map((cal: GoogleCalendarItem) => cal.id) || []

    // Calculate token expiration
    const expiresAt = new Date(Date.now() + tokens.expires_in * 1000)

    // Store OAuth integration in database
    const { error: insertError } = await supabase
      .from('oauth_calendar_integrations')
      .upsert({
        user_id: user.id,
        provider: 'google',
        provider_user_id: googleUser.id,
        access_token: tokens.access_token, // TODO: Implement encryption
        refresh_token: tokens.refresh_token, // TODO: Implement encryption
        calendar_ids: calendarIds,
        scopes: tokens.scope.split(' '),
        expires_at: expiresAt.toISOString(),
      }, {
        onConflict: 'user_id,provider'
      })

    if (insertError) {
      console.error('Database insert error:', insertError)
      return NextResponse.redirect(`${baseUrl}/app/add-calendar?error=database_error`)
    }

    // OAuth integration successful
    // Now redirect to create the dedicated yoga calendar

    // Redirect to yoga calendar creation
    return NextResponse.redirect(`${baseUrl}/app/add-calendar?success=oauth_connected&step=create_yoga_calendar`)
  } catch (error) {
    console.error('Google OAuth callback error:', error)
    return NextResponse.redirect(`${baseUrl}/app/add-calendar?error=internal_error`)
  }
}

export async function POST(request: NextRequest) {
  // Handle OAuth callback via POST (for programmatic calls)
  return GET(request)
} 