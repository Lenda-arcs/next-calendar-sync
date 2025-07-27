'use client'

import { Container } from '@/components/layout/container'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Calendar, ArrowRight, AlertTriangle } from 'lucide-react'
import { type User } from '@/lib/types'

// ⚠️ DEPRECATION NOTICE ⚠️
// This component is LEGACY and should not be used for new implementations.
// Use EnhancedYogaOnboarding instead for the modern dedicated yoga calendar approach.
// This component will be removed in a future update.

interface EnhancedCalendarOnboardingProps {
  user: User
  success?: string
  error?: string
  message?: string
}

export function EnhancedCalendarOnboarding({ user, success, error, message }: EnhancedCalendarOnboardingProps) {
  const handleRedirectToNewOnboarding = () => {
    window.location.href = '/app/add-calendar?step=create_yoga_calendar'
  }

  return (
    <Container>
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Deprecation Notice */}
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Legacy Component:</strong> This onboarding flow has been deprecated. 
            Please use our new dedicated yoga calendar setup instead.
          </AlertDescription>
        </Alert>

        {/* Success/Error Messages */}
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert>
            <Calendar className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {message && (
          <Alert>
            <Calendar className="h-4 w-4" />
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        {/* Redirect Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Upgrade to New Calendar Setup
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                We&apos;ve improved our calendar integration! The new setup process is:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside ml-4">
                <li>Faster and more reliable</li>
                <li>Creates a dedicated yoga calendar in your Google account</li>
                <li>Allows importing events from existing calendars</li>
                <li>Better sync and event management</li>
              </ul>
            </div>
            
            <Button 
              className="w-full" 
              onClick={handleRedirectToNewOnboarding}
            >
              Use New Calendar Setup
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        {/* User Info */}
        <Card className="border-muted">
          <CardContent className="pt-6">
            <div className="text-center text-sm text-muted-foreground">
              <p>Setting up calendar for: <strong>{user.email}</strong></p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  )
} 