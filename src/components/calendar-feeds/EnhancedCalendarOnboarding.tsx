'use client'

import { useState, useEffect } from 'react'
import { Container } from '@/components/layout/container'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Calendar, CheckCircle, ArrowRight, AlertCircle } from 'lucide-react'
import { OAuthCalendarConnection } from './OAuthCalendarConnection'
import { AddCalendarForm } from './AddCalendarForm'
import { EmailInvitationSystem } from './EmailInvitationSystem'
import { OnboardingWizard } from './OnboardingWizard'
import { CalendarCreationWizard } from './CalendarCreationWizard'
import { ICloudSetupGuide } from './iCloudSetupGuide'
import { CalendarPatternSetup } from './CalendarPatternSetup'
import { type User } from '@/lib/types'

interface EnhancedCalendarOnboardingProps {
  user: User | null
  success?: string
  error?: string
  message?: string
}

type UserSegment = {
  calendarProvider: 'google' | 'apple' | 'none'
  syncApproach: 'yoga_only' | 'mixed_calendar'
}

type OnboardingPath = {
  id: string
  method: 'oauth' | 'manual' | 'creation' | 'migration'
}

export function EnhancedCalendarOnboarding({ user, success, error, message }: EnhancedCalendarOnboardingProps) {
  const [currentStep, setCurrentStep] = useState<'wizard' | 'connect' | 'pattern' | 'success'>('wizard')
  const [userSegment, setUserSegment] = useState<UserSegment | null>(null)
  const [selectedPath, setSelectedPath] = useState<OnboardingPath | null>(null)
  const [currentCalendarFeedId, setCurrentCalendarFeedId] = useState<string | null>(null)

  const isEmailConfirmed = success === 'email_confirmed'

  // Check URL for pattern setup trigger
  const shouldShowPatternSetup = typeof window !== 'undefined' && 
    new URLSearchParams(window.location.search).get('show_pattern_setup') === 'true'

  // Handle pattern setup from URL parameter
  useEffect(() => {
    if (shouldShowPatternSetup && user?.id) {
      const storedSegment = localStorage.getItem('onboarding_user_segment')
      if (storedSegment) {
        try {
          const segment = JSON.parse(storedSegment)
          setUserSegment(segment)
          setCurrentStep('pattern')
          
          // Fetch latest calendar feed
          fetch(`/api/calendar-feeds/latest?userId=${user.id}`)
            .then(response => response.json())
            .then(data => {
              setCurrentCalendarFeedId(data.feedId)
            })
            .catch(error => {
              console.error('Failed to fetch latest calendar feed:', error)
            })
        } catch (error) {
          console.error('Failed to parse stored user segment:', error)
        }
      }
    }
  }, [shouldShowPatternSetup, user?.id])

  const handlePathSelected = (path: OnboardingPath, segment: UserSegment) => {
    setSelectedPath(path)
    setUserSegment(segment)
    setCurrentStep('connect')
    
    // Store onboarding state for OAuth flow
    localStorage.setItem('onboarding_user_segment', JSON.stringify(segment))
    localStorage.setItem('onboarding_selected_path', JSON.stringify(path))
  }

  const handleConnectionSuccess = async () => {
    // Check if pattern setup is needed for mixed calendar users
    if (userSegment?.syncApproach === 'mixed_calendar' && user?.id) {
      try {
        const response = await fetch(`/api/calendar-feeds/latest?userId=${user.id}`)
        if (response.ok) {
          const { feedId } = await response.json()
          setCurrentCalendarFeedId(feedId)
          setCurrentStep('pattern')
          return
        }
      } catch (error) {
        console.error('Failed to get latest calendar feed:', error)
      }
    }
    
    setCurrentStep('success')
  }

  const handlePatternSetupComplete = () => {
    setCurrentStep('success')
    
    // Clean up localStorage
    localStorage.removeItem('onboarding_user_segment')
    localStorage.removeItem('onboarding_selected_path')
    localStorage.removeItem('oauth_from_onboarding')
  }

  const handleBackToWizard = () => {
    setCurrentStep('wizard')
    setSelectedPath(null)
    setUserSegment(null)
  }

  // Success screen
  if (currentStep === 'success') {
    return (
      <Container className="py-12">
        <div className="max-w-xl mx-auto text-center space-y-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold">Setup Complete!</h1>
            <p className="text-muted-foreground">
              Your calendar is now connected and ready to sync
            </p>
          </div>

          <Card>
            <CardContent className="py-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-green-600" />
                  <span>Your events will sync automatically</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Smart categorization enabled</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Schedule ready to share</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild className="flex-1">
              <a href="/app">
                <ArrowRight className="mr-2 h-4 w-4" />
                Go to Dashboard
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/app/profile">
                Complete Profile
              </a>
            </Button>
          </div>
        </div>
      </Container>
    )
  }

  // Pattern setup screen
  if (currentStep === 'pattern' && currentCalendarFeedId && user?.id) {
    return (
      <Container 
        title="Set Up Calendar Filtering"
        subtitle="Configure which events to sync from your mixed calendar"
        className="py-12"
      >
        <CalendarPatternSetup 
          userId={user.id}
          calendarFeedId={currentCalendarFeedId}
          onComplete={handlePatternSetupComplete}
          onSkip={handlePatternSetupComplete}
        />
      </Container>
    )
  }

  // Connection screen
  if (currentStep === 'connect' && selectedPath && userSegment) {
    return (
      <Container className="py-12">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-semibold">
              {selectedPath.method === 'oauth' ? 'Connect Your Calendar' : 
               selectedPath.method === 'creation' ? 'Create Your Calendar' : 
               'Add Calendar Feed'}
            </h1>
            <p className="text-muted-foreground">
              {userSegment.calendarProvider === 'google' ? 'Quick OAuth connection with Google Calendar' :
               userSegment.calendarProvider === 'apple' ? 'Step-by-step iCloud calendar setup' :
               'We\'ll help you create your first digital calendar'}
            </p>
          </div>

          <div className="space-y-4">
            {/* Calendar Creation Wizard */}
            {selectedPath.method === 'creation' && (
              <CalendarCreationWizard 
                onCalendarCreated={handleConnectionSuccess}
                onCancel={handleBackToWizard}
              />
            )}

            {/* iCloud Setup Guide */}
            {selectedPath.id === 'apple-guided' && (
              <ICloudSetupGuide 
                onSetupComplete={handleConnectionSuccess}
                onCancel={handleBackToWizard}
              />
            )}

            {/* OAuth Connection */}
            {selectedPath.method === 'oauth' && (
              <OAuthCalendarConnection 
                user={user}
                onError={(error) => console.error('OAuth error:', error)}
              />
            )}

            {/* Manual Calendar Feed */}
            {selectedPath.method === 'manual' && selectedPath.id !== 'apple-guided' && (
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="font-medium mb-2">Manual Calendar Feed</h3>
                  <p className="text-sm text-muted-foreground">
                    Connect using your calendar&apos;s .ics feed URL
                  </p>
                </div>
                <AddCalendarForm user={user} onSuccess={handleConnectionSuccess} />
              </div>
            )}

            {/* Email Invitation System */}
            {selectedPath.method === 'manual' && (
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="font-medium mb-2">Email Invitation</h3>
                  <p className="text-sm text-muted-foreground">
                    Generate a unique email to invite to your calendar
                  </p>
                </div>
                <EmailInvitationSystem user={user} />
              </div>
            )}
          </div>

          <div className="flex justify-center">
            <Button variant="outline" onClick={handleBackToWizard}>
              Back to Setup Options
            </Button>
          </div>
        </div>
      </Container>
    )
  }

  // Wizard screen (default)
  return (
    <Container className="py-12">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Messages */}
        {isEmailConfirmed && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Email confirmed!</strong> {message && `${message} `}
              Now let&apos;s connect your calendar to get started.
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Connection failed:</strong> {' '}
              {error === 'oauth_denied' && 'You denied access to your calendar. Please try again.'}
              {error === 'invalid_callback' && 'Invalid OAuth callback. Please try again.'}
              {error === 'invalid_state' && 'Security validation failed. Please try again.'}
              {error === 'token_exchange_failed' && 'Failed to exchange authorization code.'}
              {error === 'user_info_failed' && 'Failed to get user information.'}
              {error === 'calendar_fetch_failed' && 'Failed to fetch calendar list.'}
              {error === 'database_error' && 'Failed to save connection. Please try again.'}
              {error === 'internal_error' && 'An unexpected error occurred. Please try again.'}
              {!['oauth_denied', 'invalid_callback', 'invalid_state', 'token_exchange_failed', 'user_info_failed', 'calendar_fetch_failed', 'database_error', 'internal_error'].includes(error) && 'Please try again.'}
            </AlertDescription>
          </Alert>
        )}

        {/* Welcome Section */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Welcome to Your Yoga Schedule</h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Let&apos;s connect your calendar and create a beautiful, shareable schedule that your students will love.
          </p>
        </div>

        {/* Features Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center space-y-2">
            <Calendar className="h-8 w-8 mx-auto text-primary" />
            <h3 className="font-medium">Sync Calendar</h3>
            <p className="text-sm text-muted-foreground">
              Connect your existing calendar feeds
            </p>
          </div>
          <div className="text-center space-y-2">
            <CheckCircle className="h-8 w-8 mx-auto text-primary" />
            <h3 className="font-medium">Smart Organization</h3>
            <p className="text-sm text-muted-foreground">
              Automatically categorize your classes
            </p>
          </div>
          <div className="text-center space-y-2">
            <ArrowRight className="h-8 w-8 mx-auto text-primary" />
            <h3 className="font-medium">Share Schedule</h3>
            <p className="text-sm text-muted-foreground">
              Beautiful schedule for your students
            </p>
          </div>
        </div>

        {/* Onboarding Wizard */}
        <OnboardingWizard onPathSelected={handlePathSelected} />
      </div>
    </Container>
  )
} 