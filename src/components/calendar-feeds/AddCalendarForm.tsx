'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Alert } from '@/components/ui/alert'
import { Calendar, AlertCircle, Check, ExternalLink } from 'lucide-react'
import { useCreateCalendarFeed } from '@/lib/hooks/useCalendarFeeds'
import { type User } from '@/lib/types'
import { type CalendarFeedInsert } from '@/lib/calendar-feeds'

interface AddCalendarFormProps {
  user: User | null
}

const TIMEZONE_OPTIONS = [
  { value: 'UTC', label: 'UTC' },
  { value: 'Europe/Berlin', label: 'Europe/Berlin' },
  { value: 'Europe/Vienna', label: 'Europe/Vienna' },
  { value: 'Europe/London', label: 'Europe/London' },
  { value: 'America/New_York', label: 'America/New_York (EST)' },
  { value: 'America/Los_Angeles', label: 'America/Los_Angeles (PST)' },
  { value: 'America/Chicago', label: 'America/Chicago (CST)' },
  { value: 'Asia/Tokyo', label: 'Asia/Tokyo' },
  { value: 'Asia/Singapore', label: 'Asia/Singapore' },
  { value: 'Asia/Kolkata', label: 'Asia/Kolkata' },
  { value: 'Australia/Sydney', label: 'Australia/Sydney' },
]

export function AddCalendarForm({ user }: AddCalendarFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    calendarUrl: '',
    calendarName: '',
    timezone: user?.timezone || 'UTC',
  })
  const [successMessage, setSuccessMessage] = useState('')
  const [showInstructions, setShowInstructions] = useState(false)
  
  const createFeedMutation = useCreateCalendarFeed()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.id) return

    const feedData: CalendarFeedInsert = {
      user_id: user.id,
      feed_url: formData.calendarUrl,
      calendar_name: formData.calendarName,
    }

    try {
      await createFeedMutation.mutateAsync(feedData)
      setSuccessMessage('Calendar feed added successfully! Your events are being synced.')
      
      // Redirect to dashboard after success
      setTimeout(() => {
        router.push('/app')
      }, 2000)
    } catch (error) {
      console.error('Error adding calendar feed:', error)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Success Message */}
      {successMessage && (
        <Alert>
          <Check className="h-4 w-4" />
          <div>{successMessage}</div>
        </Alert>
      )}

      {/* Error Message */}
      {createFeedMutation.error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <div>
            <strong>Error:</strong> {createFeedMutation.error.message}
          </div>
        </Alert>
      )}

      {/* Main Form */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-serif">
            <Calendar className="h-5 w-5" />
            Add Calendar Feed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="calendarName">Calendar Name *</Label>
              <Input
                id="calendarName"
                placeholder="e.g., My Yoga Classes, Studio Calendar"
                value={formData.calendarName}
                onChange={(e) => setFormData(prev => ({ ...prev, calendarName: e.target.value }))}
                required
              />
              <p className="text-xs text-muted-foreground">
                Give your calendar feed a descriptive name
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="calendarUrl">Calendar Feed URL (.ics) *</Label>
              <Input
                id="calendarUrl"
                type="url"
                placeholder="https://calendar.google.com/calendar/ical/..."
                value={formData.calendarUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, calendarUrl: e.target.value }))}
                required
              />
              <p className="text-xs text-muted-foreground">
                This should be the public .ics feed URL from your calendar provider
              </p>
            </div>

            <Select
              label="Timezone"
              value={formData.timezone}
              onChange={(value: string) => setFormData(prev => ({ ...prev, timezone: value }))}
              options={TIMEZONE_OPTIONS}
              placeholder="Select timezone"
            />

            <Button 
              type="submit" 
              className="w-full" 
              disabled={createFeedMutation.isLoading}
            >
              {createFeedMutation.isLoading ? 'Adding Calendar...' : 'Add Calendar Feed'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Help Section */}
      <Card variant="outlined">
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Need help getting your calendar feed URL?
            </p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowInstructions(!showInstructions)}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              {showInstructions ? 'Hide' : 'Show'} Instructions
            </Button>
          </div>

          {showInstructions && (
            <div className="mt-6 space-y-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Google Calendar:</h4>
                <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                  <li>Open Google Calendar in your browser</li>
                  <li>Click on Settings (gear icon) → Settings</li>
                  <li>Select your calendar from the left sidebar</li>
                  <li>Scroll to Integrate calendar section</li>
                  <li>Copy the Public URL to this calendar (ends with .ics)</li>
                </ol>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Apple iCloud Calendar:</h4>
                <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                  <li>Go to iCloud.com and sign in</li>
                  <li>Open Calendar</li>
                  <li>Click the share icon next to your calendar name</li>
                  <li>Enable Public Calendar</li>
                  <li>Copy the webcal:// URL and change it to https://</li>
                </ol>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Outlook/Office 365:</h4>
                <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                  <li>Open Outlook Calendar online</li>
                  <li>Right-click your calendar and select Sharing and permissions</li>
                  <li>Set permissions to Can view all details</li>
                  <li>Copy the ICS link provided</li>
                </ol>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 