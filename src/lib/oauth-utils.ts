import { CalendarItem, OAuthIntegration } from '@/lib/types'

export interface RefreshTokenResponse {
  access_token: string
  expires_in: number
  refresh_token?: string
  scope?: string
  token_type: string
}

export interface GoogleCalendarResponse {
  items?: Array<{
    id: string
    summary: string
    primary?: boolean
    accessRole?: string
    backgroundColor?: string
    description?: string
  }>
}

/**
 * Refreshes an OAuth access token using the refresh token
 */
export async function refreshOAuthToken(
  refreshToken: string,
  clientId: string,
  clientSecret: string
): Promise<RefreshTokenResponse> {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  })

  if (!response.ok) {
    throw new Error(`Token refresh failed: ${response.status} ${response.statusText}`)
  }

  return await response.json()
}

/**
 * Checks if an OAuth token is expired or close to expiring
 */
export function isTokenExpired(expiresAt: string, bufferMinutes: number = 5): boolean {
  const now = new Date()
  const expires = new Date(expiresAt)
  const buffer = bufferMinutes * 60 * 1000 // Convert to milliseconds
  
  return expires.getTime() - now.getTime() <= buffer
}

/**
 * Fetches calendars from Google Calendar API
 */
export async function fetchGoogleCalendars(accessToken: string): Promise<CalendarItem[]> {
  const response = await fetch('https://www.googleapis.com/calendar/v3/users/me/calendarList', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    throw new Error(`Calendar fetch failed: ${response.status} ${response.statusText}`)
  }

  const data: GoogleCalendarResponse = await response.json()
  
  return (data.items || []).map(cal => ({
    id: cal.id,
    summary: cal.summary,
    primary: cal.primary,
    accessRole: cal.accessRole,
    backgroundColor: cal.backgroundColor,
    description: cal.description,
    selected: false // Default to not selected
  }))
}

/**
 * Gets a valid access token, refreshing if necessary
 */
export async function getValidAccessToken(
  integration: OAuthIntegration,
  clientId: string,
  clientSecret: string,
  updateCallback: (newToken: string, newExpiresAt: string) => Promise<void>
): Promise<string> {
  // Check if token needs refresh
  if (isTokenExpired(integration.expires_at) && integration.refresh_token) {
    const refreshData = await refreshOAuthToken(
      integration.refresh_token,
      clientId,
      clientSecret
    )
    
    const newExpiresAt = new Date(Date.now() + refreshData.expires_in * 1000).toISOString()
    
    // Update the token via callback
    await updateCallback(refreshData.access_token, newExpiresAt)
    
    return refreshData.access_token
  }
  
  return integration.access_token
} 