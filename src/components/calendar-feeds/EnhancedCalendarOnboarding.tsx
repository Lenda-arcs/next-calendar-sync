'use client'

import { useState } from 'react'
import { Container } from '@/components/layout/container'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Calendar, Zap, Settings, ArrowRight, CheckCircle } from 'lucide-react'
import { OAuthCalendarConnection } from './OAuthCalendarConnection'
import { AddCalendarForm } from './AddCalendarForm'
import { type User } from '@/lib/types'

interface EnhancedCalendarOnboardingProps {
  user: User | null
  success?: string
  error?: string
}

export function EnhancedCalendarOnboarding({ user, success, error }: EnhancedCalendarOnboardingProps) {
  const [activeTab, setActiveTab] = useState<'oauth' | 'manual'>('oauth')
  const [connectionSuccess, setConnectionSuccess] = useState(success === 'connected')

  const handleOAuthSuccess = () => {
    setConnectionSuccess(true)
  }

  const handleOAuthError = (error: string) => {
    console.error('OAuth error:', error)
    // Could show a toast notification here
  }

  if (connectionSuccess) {
    return (
      <div className="min-h-screen">
        <Container>
          <div className="py-16 max-w-2xl mx-auto">
            <Card variant="elevated" className="overflow-hidden">
              <CardHeader centered className="pb-6">
                <div className="mx-auto mb-6 w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-200 rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <CardTitle className="text-3xl bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Welcome to Your Yoga Schedule!
                </CardTitle>
                <CardDescription className="text-lg mt-4 max-w-xl">
                  Your calendar is now connected and syncing. Let&apos;s set up your profile and start 
                  building your beautiful, shareable schedule.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 text-center">
                <Card variant="glass" className="p-4 bg-green-50/50 dark:bg-green-950/30 border-green-200/50">
                  <p className="text-sm text-green-700 dark:text-green-300 flex items-center justify-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Your events are now syncing automatically
                  </p>
                </Card>
                
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button size="lg" asChild className="h-12">
                    <a href="/app">
                      <ArrowRight className="mr-2 h-4 w-4" />
                      Go to Dashboard
                    </a>
                  </Button>
                  <Button variant="outline" size="lg" asChild className="h-12">
                    <a href="/app/profile">
                      Complete Profile
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </Container>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Container 
        title="Welcome to Your Yoga Schedule"
        subtitle="Connect your calendar to start building a beautiful, shareable schedule that your students will love."
      >
        <div className="py-8 space-y-8">
          {/* Error Message */}
          {error && (
            <Card variant="glass" className="p-4 bg-red-50/50 dark:bg-red-950/30 border-red-200/50">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="h-5 w-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-red-900 dark:text-red-100">
                    Connection Failed
                  </h3>
                  <p className="mt-1 text-sm text-red-700 dark:text-red-300 leading-relaxed">
                    {error === 'oauth_denied' && 'You denied access to your calendar. Please try again if you\'d like to connect.'}
                    {error === 'invalid_callback' && 'Invalid OAuth callback. Please try again.'}
                    {error === 'invalid_state' && 'Security validation failed. Please try again.'}
                    {error === 'token_exchange_failed' && 'Failed to exchange authorization code.'}
                    {error === 'user_info_failed' && 'Failed to get user information.'}
                    {error === 'calendar_fetch_failed' && 'Failed to fetch calendar list.'}
                    {error === 'database_error' && 'Failed to save connection. Please try again.'}
                    {error === 'internal_error' && 'An unexpected error occurred. Please try again.'}
                    {!['oauth_denied', 'invalid_callback', 'invalid_state', 'token_exchange_failed', 'user_info_failed', 'calendar_fetch_failed', 'database_error', 'internal_error'].includes(error) && 'An error occurred while connecting your calendar. Please try again.'}
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Welcome Section */}
          <Card variant="glass">
            <CardContent className="text-center py-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 max-w-2xl mx-auto">
                <div className="text-center">
                  <Calendar className="h-8 w-8 mx-auto text-primary mb-2" />
                  <h3 className="font-semibold mb-1">Sync Calendar</h3>
                  <p className="text-sm text-muted-foreground">
                    Connect your existing calendar feeds
                  </p>
                </div>
                <div className="text-center">
                  <Zap className="h-8 w-8 mx-auto text-primary mb-2" />
                  <h3 className="font-semibold mb-1">Smart Automation</h3>
                  <p className="text-sm text-muted-foreground">
                    Automatically categorize and organize your classes
                  </p>
                </div>
                <div className="text-center">
                  <Settings className="h-8 w-8 mx-auto text-primary mb-2" />
                  <h3 className="font-semibold mb-1">Professional Setup</h3>
                  <p className="text-sm text-muted-foreground">
                    Create a beautiful schedule your students will love
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Connection Options */}
          <Card variant="glass">
            <CardHeader>
              <CardTitle className="text-center font-serif">
                Step 1: Connect Your Calendar
              </CardTitle>
              <CardDescription className="text-center">
                Choose the connection method that works best for you
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'oauth' | 'manual')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="oauth" className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Quick Connect
                    <Badge variant="secondary" className="text-xs">
                      Recommended
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="manual" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Manual Setup
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="oauth" className="mt-6">
                  <OAuthCalendarConnection 
                    user={user}
                    onSuccess={handleOAuthSuccess}
                    onError={handleOAuthError}
                  />
                </TabsContent>
                
                <TabsContent value="manual" className="mt-6">
                  <div className="space-y-4">
                    <div className="text-center space-y-2">
                      <h3 className="text-lg font-semibold">Manual Calendar Feed Setup</h3>
                      <p className="text-sm text-muted-foreground">
                        Connect using your calendar&apos;s .ics feed URL
                      </p>
                    </div>
                    <AddCalendarForm user={user} />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* What's Next Section */}
          <Card variant="outlined">
            <CardContent className="py-8">
              <h3 className="text-xl font-semibold mb-4 text-center font-serif">
                What happens next?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">After connecting your calendar:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Your events will start syncing automatically</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Set up smart tags to categorize your classes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Complete your profile for a professional look</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold">Then you can:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      <span>Share your public schedule link</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      <span>Embed it on your website or social media</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      <span>Let students discover and book your classes</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>
    </div>
  )
} 