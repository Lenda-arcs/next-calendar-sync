'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert } from '@/components/ui/alert'

import { 
  Calendar, 
  Shield, 
  Zap, 
  AlertCircle, 
  CheckCircle, 
  ExternalLink,
  RefreshCw,
  Clock
} from 'lucide-react'
import { oauthCalendarService, OAUTH_PROVIDERS, type OAuthProvider } from '@/lib/oauth-calendar'
import { type User } from '@/lib/types'

interface OAuthCalendarConnectionProps {
  user: User | null
  onSuccess?: () => void
  onError?: (error: string) => void
}

export function OAuthCalendarConnection({ user, onError }: OAuthCalendarConnectionProps) {
  const [isConnecting, setIsConnecting] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [successMessage] = useState<string | null>(null)

  const handleOAuthConnect = async (provider: keyof typeof OAUTH_PROVIDERS) => {
    if (!user?.id) {
      setError('Please log in to connect your calendar')
      return
    }

    try {
      setIsConnecting(provider)
      setError(null)
      
      // Initiate OAuth flow
      await oauthCalendarService.initiateOAuthFlow(provider)
      
      // Note: The user will be redirected to the OAuth provider,
      // so we won't reach this point unless there's an error
      
    } catch (err) {
      console.error('OAuth connection error:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect calendar'
      setError(errorMessage)
      onError?.(errorMessage)
    } finally {
      setIsConnecting(null)
    }
  }

  const renderOAuthProvider = (provider: OAuthProvider) => (
    <Card key={provider.id} variant="outlined" className="transition-all hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg font-bold"
              style={{ backgroundColor: provider.color }}
            >
              {provider.icon}
            </div>
            <div>
              <CardTitle className="text-lg">{provider.name}</CardTitle>
              <CardDescription>
                One-click secure connection
              </CardDescription>
            </div>
          </div>
          <Badge variant="secondary" className="text-xs">
            Recommended
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          {/* Benefits */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Zap className="h-4 w-4 text-green-600" />
              <span>Instant sync</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4 text-blue-600" />
              <span>Secure OAuth connection</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4 text-purple-600" />
              <span>Real-time updates</span>
            </div>
          </div>

          {/* Connect Button */}
          <Button 
            onClick={() => handleOAuthConnect(provider.id)}
            disabled={isConnecting !== null}
            className="w-full"
            style={{ backgroundColor: provider.color }}
          >
            {isConnecting === provider.id ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <ExternalLink className="mr-2 h-4 w-4" />
                Connect {provider.name}
              </>
            )}
          </Button>

          {/* Privacy Note */}
          <p className="text-xs text-muted-foreground text-center">
            We only access your calendar events, not personal information
          </p>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {successMessage && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <div>{successMessage}</div>
        </Alert>
      )}

      {/* Error Message */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <div>
            <strong>Connection Error:</strong> {error}
          </div>
        </Alert>
      )}

      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold font-serif">Connect Your Calendar</h2>
        <p className="text-muted-foreground">
          Choose your calendar provider for the best experience
        </p>
      </div>

      {/* OAuth Providers */}
      <div className="grid gap-4 md:grid-cols-2">
        {Object.values(OAUTH_PROVIDERS).map(renderOAuthProvider)}
      </div>

      {/* Benefits Section */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle className="text-center font-serif">Why Connect with OAuth?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                <Zap className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-semibold">Instant Setup</h4>
              <p className="text-sm text-muted-foreground">
                No need to find calendar URLs or settings
              </p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-semibold">More Secure</h4>
              <p className="text-sm text-muted-foreground">
                Industry-standard OAuth encryption
              </p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 mx-auto bg-purple-100 rounded-full flex items-center justify-center">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-semibold">Real-time Sync</h4>
              <p className="text-sm text-muted-foreground">
                Changes appear instantly in your schedule
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Help Section */}
      <div className="text-center space-y-2">
        <p className="text-sm text-muted-foreground">
          Don&apos;t see your calendar provider? 
        </p>
        <Button variant="outline" size="sm">
          <Calendar className="mr-2 h-4 w-4" />
          Use Manual Feed URL Instead
        </Button>
      </div>
    </div>
  )
} 