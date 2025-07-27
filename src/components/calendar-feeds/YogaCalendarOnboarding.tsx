'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle2, Calendar, ExternalLink, Loader2 } from 'lucide-react'
import { User } from '@supabase/supabase-js'
import Link from 'next/link'

interface YogaCalendarOnboardingProps {
  user: User
  success?: string
  error?: string
  message?: string
  onCalendarCreated?: () => void
}

export function YogaCalendarOnboarding({ success, error, message, onCalendarCreated }: YogaCalendarOnboardingProps) {
  const [isConnecting, setIsConnecting] = useState(false)
  const [isCreatingCalendar, setIsCreatingCalendar] = useState(false)
  const [calendarCreated, setCalendarCreated] = useState(false)
  const [oauthConnected, setOauthConnected] = useState(!!success)

  const handleGoogleConnect = async () => {
    setIsConnecting(true)
    try {
      window.location.href = '/api/auth/google/calendar'
    } catch (error) {
      console.error('OAuth connection error:', error)
      setIsConnecting(false)
    }
  }

  const handleCreateYogaCalendar = async () => {
    setIsCreatingCalendar(true)
    try {
      const response = await fetch('/api/calendar/create-yoga-calendar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          sync_approach: 'yoga_only'
        }),
      })

      const result = await response.json()

      if (result.success) {
        setCalendarCreated(true)
        setOauthConnected(true)
        // Notify parent component that calendar was created
        if (onCalendarCreated) {
          setTimeout(() => {
            onCalendarCreated()
          }, 1000)
        } else {
          // Fallback: redirect to dashboard if no callback provided
          setTimeout(() => {
            window.location.href = '/app'
          }, 2000)
        }
      } else {
        throw new Error(result.error || 'Failed to create calendar')
      }
    } catch (error) {
      console.error('Calendar creation error:', error)
      alert(error instanceof Error ? error.message : 'Failed to create calendar')
    } finally {
      setIsCreatingCalendar(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Set Up Your Yoga Calendar</h1>
        <p className="text-muted-foreground">
          We&apos;ll create a dedicated calendar in your Google account for managing your yoga classes.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {message && (
        <Alert>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        {/* Step 1: Connect Google Account */}
        <Card className={oauthConnected ? 'border-green-200 bg-green-50' : ''}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {oauthConnected ? (
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              ) : (
                <span className="w-5 h-5 bg-blue-600 text-white rounded-full text-xs flex items-center justify-center">
                  1
                </span>
              )}
              Connect Google Calendar
            </CardTitle>
            <CardDescription>
              {oauthConnected 
                ? 'Google Calendar connected successfully!'
                : 'Connect your Google account to enable calendar sync'
              }
            </CardDescription>
          </CardHeader>
          {!oauthConnected && (
            <CardContent>
              <Button 
                onClick={handleGoogleConnect}
                disabled={isConnecting}
                className="w-full"
                size="lg"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Calendar className="w-4 h-4 mr-2" />
                    Connect Google Calendar
                  </>
                )}
              </Button>
            </CardContent>
          )}
        </Card>

        {/* Step 2: Create Yoga Calendar */}
        <Card className={calendarCreated ? 'border-green-200 bg-green-50' : ''}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {calendarCreated ? (
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              ) : (
                <span className={`w-5 h-5 rounded-full text-xs flex items-center justify-center ${
                  oauthConnected ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  2
                </span>
              )}
              Create Your Yoga Calendar
            </CardTitle>
                         <CardDescription>
               {calendarCreated 
                 ? 'Your dedicated yoga calendar has been created!'
                 : 'We&apos;ll create a new calendar specifically for your yoga classes'
               }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {calendarCreated ? (
              <div className="space-y-3">
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                                     <AlertDescription className="text-green-800">
                     Your yoga calendar is ready! You can now create and manage events directly in Google Calendar, 
                     and they&apos;ll automatically appear on your public profile.
                   </AlertDescription>
                </Alert>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <a href="https://calendar.google.com" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Open Google Calendar
                    </a>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href="/app">
                      Go to Dashboard
                    </Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                                 <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                   <h4 className="font-medium text-blue-900">What we&apos;ll create:</h4>
                   <ul className="text-sm text-blue-800 space-y-1">
                     <li>• A new calendar called &quot;My Yoga Schedule (synced with lenna.yoga)&quot;</li>
                     <li>• Automatic two-way sync between Google Calendar and your profile</li>
                     <li>• Events you create will appear on your public schedule</li>
                   </ul>
                 </div>
                <Button 
                  onClick={handleCreateYogaCalendar}
                  disabled={!oauthConnected || isCreatingCalendar}
                  className="w-full"
                  size="lg"
                >
                  {isCreatingCalendar ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating Calendar...
                    </>
                  ) : (
                    <>
                      <Calendar className="w-4 h-4 mr-2" />
                      Create Yoga Calendar
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* How it works section */}
      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle className="text-lg">How It Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-3">
            <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs flex items-center justify-center font-medium">
              1
            </div>
            <div>
              <p className="font-medium">Create events in Google Calendar</p>
              <p className="text-sm text-muted-foreground">Use your phone, web, or any calendar app</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs flex items-center justify-center font-medium">
              2
            </div>
            <div>
              <p className="font-medium">Events sync automatically</p>
              <p className="text-sm text-muted-foreground">Changes appear on your lenna.yoga profile within minutes</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs flex items-center justify-center font-medium">
              3
            </div>
            <div>
              <p className="font-medium">Students discover your classes</p>
              <p className="text-sm text-muted-foreground">Your schedule is visible on your public teacher profile</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 