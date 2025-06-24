'use client'

import { Container } from '@/components/layout/container'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// Button not needed in simplified version
import { Calendar, Tags, Globe } from 'lucide-react'
import { AddCalendarForm } from './AddCalendarForm'
import { type User } from '@/lib/types'

interface CalendarOnboardingProps {
  user: User | null
}

export function CalendarOnboarding({ user }: CalendarOnboardingProps) {
  return (
    <div className="min-h-screen">
      <Container 
        title="Welcome to Your Yoga Schedule"
        subtitle="Connect your calendar to start building a beautiful, shareable schedule that your students will love."
      >
        <div className="py-8 space-y-8">
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
                  <Tags className="h-8 w-8 mx-auto text-primary mb-2" />
                  <h3 className="font-semibold mb-1">Smart Tags</h3>
                  <p className="text-sm text-muted-foreground">
                    Automatically categorize your classes
                  </p>
                </div>
                <div className="text-center">
                  <Globe className="h-8 w-8 mx-auto text-primary mb-2" />
                  <h3 className="font-semibold mb-1">Public Schedule</h3>
                  <p className="text-sm text-muted-foreground">
                    Share your schedule with students
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Getting Started */}
          <Card variant="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-serif text-center justify-center">
                
                Step 1: Connect Your First Calendar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center mb-8">
                Start by connecting your main calendar where you schedule your yoga classes. 
                We support Google Calendar, Apple iCloud, Outlook, and any calendar that provides an .ics feed.
              </p>
              
              <AddCalendarForm user={user} />
            </CardContent>
          </Card>

          {/* What's Next */}
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