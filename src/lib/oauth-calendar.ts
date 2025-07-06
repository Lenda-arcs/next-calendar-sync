import { createClient } from '@/lib/supabase'

export interface OAuthProvider {
  id: 'google' | 'outlook' | 'apple' | 'yahoo'
  name: string
  icon: string
  color: string
  authUrl: string
  scopes: string[]
}

export interface OAuthTokens {
  access_token: string
  refresh_token?: string
  expires_at?: Date
  scope?: string
}

export interface CalendarData {
  id: string
  name: string
  description?: string
  primary?: boolean
  accessRole?: string
  backgroundColor?: string
}

export interface OAuthIntegration {
  id: string
  user_id: string
  provider: string
  provider_user_id: string
  calendar_ids: string[]
  scopes: string[]
  expires_at: string | null
  created_at: string | null
  updated_at: string | null
}

// OAuth provider configurations
export const OAUTH_PROVIDERS: Record<string, OAuthProvider> = {
  google: {
    id: 'google',
    name: 'Google Calendar',
    icon: '🔵',
    color: '#4285f4',
    authUrl: '/api/auth/google/calendar',
    scopes: ['https://www.googleapis.com/auth/calendar.readonly']
  },
  outlook: {
    id: 'outlook',
    name: 'Outlook Calendar',
    icon: '🔷',
    color: '#0078d4',
    authUrl: '/api/auth/outlook/calendar',
    scopes: ['https://graph.microsoft.com/calendars.read']
  }
}

export class OAuthCalendarService {
  private supabase = createClient()

  /**
   * Initiate OAuth flow for a provider
   */
  async initiateOAuthFlow(provider: keyof typeof OAUTH_PROVIDERS): Promise<void> {
    const providerConfig = OAUTH_PROVIDERS[provider]
    if (!providerConfig) {
      throw new Error(`Unsupported provider: ${provider}`)
    }

    // Store the current URL for redirect after OAuth
    const currentUrl = window.location.href
    localStorage.setItem('oauth_redirect_url', currentUrl)

    // Redirect to OAuth endpoint
    window.location.href = providerConfig.authUrl
  }

  /**
   * Handle OAuth callback and store tokens
   */
  async handleOAuthCallback(
    provider: keyof typeof OAUTH_PROVIDERS,
    code: string,
    state?: string
  ): Promise<OAuthIntegration> {
    const response = await fetch(`/api/auth/${provider}/callback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, state }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`OAuth callback failed: ${error}`)
    }

    const integration = await response.json()
    
    // Clear redirect URL
    localStorage.removeItem('oauth_redirect_url')
    
    return integration
  }

  /**
   * Get user's OAuth integrations
   */
  async getOAuthIntegrations(): Promise<OAuthIntegration[]> {
    const { data, error } = await this.supabase
      .from('oauth_calendar_integrations')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching OAuth integrations:', error)
      throw error
    }

    return data || []
  }

  /**
   * Delete an OAuth integration
   */
  async deleteOAuthIntegration(integrationId: string): Promise<void> {
    const { error } = await this.supabase
      .from('oauth_calendar_integrations')
      .delete()
      .eq('id', integrationId)

    if (error) {
      console.error('Error deleting OAuth integration:', error)
      throw error
    }
  }

  /**
   * Refresh OAuth tokens for an integration
   */
  async refreshTokens(integrationId: string): Promise<OAuthIntegration> {
    const response = await fetch(`/api/auth/refresh-tokens`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ integrationId }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Token refresh failed: ${error}`)
    }

    return await response.json()
  }

  /**
   * Get calendars for an OAuth integration
   */
  async getCalendars(integrationId: string): Promise<CalendarData[]> {
    const response = await fetch(`/api/calendars/${integrationId}`)
    
    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to fetch calendars: ${error}`)
    }

    return await response.json()
  }

  /**
   * Sync calendars from an OAuth integration
   */
  async syncOAuthCalendars(integrationId: string, calendarIds: string[]): Promise<{
    success: boolean
    count: number
    errors?: string[]
  }> {
    const response = await fetch(`/api/sync/oauth-calendars`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ integrationId, calendarIds }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Calendar sync failed: ${error}`)
    }

    return await response.json()
  }

  /**
   * Check if tokens are expired and refresh if needed
   */
  async ensureValidTokens(integration: OAuthIntegration): Promise<OAuthIntegration> {
    if (!integration.expires_at) {
      return integration
    }

    const expiresAt = new Date(integration.expires_at)
    const now = new Date()
    
    // Refresh if tokens expire within 5 minutes
    if (expiresAt.getTime() - now.getTime() < 5 * 60 * 1000) {
      return await this.refreshTokens(integration.id)
    }

    return integration
  }
}

// Create singleton instance
export const oauthCalendarService = new OAuthCalendarService()

// Utility functions
export function getProviderIcon(provider: string): string {
  return OAUTH_PROVIDERS[provider]?.icon || '📅'
}

export function getProviderColor(provider: string): string {
  return OAUTH_PROVIDERS[provider]?.color || '#6b7280'
}

export function getProviderName(provider: string): string {
  return OAUTH_PROVIDERS[provider]?.name || provider
} 