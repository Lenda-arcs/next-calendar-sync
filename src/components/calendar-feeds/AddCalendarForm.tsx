'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Alert } from '@/components/ui/alert'
import { Calendar, AlertCircle, Check, ExternalLink, RefreshCw, CheckCircle } from 'lucide-react'
import { useCreateCalendarFeed } from '@/lib/hooks/useCalendarFeeds'
import { type User } from '@/lib/types'
import { type CalendarFeedInsert } from '@/lib/calendar-feeds'

interface AddCalendarFormProps {
  user: User | null
  onSuccess?: () => void
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

export function AddCalendarForm({ user, onSuccess }: AddCalendarFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    calendarUrl: '',
    calendarName: '',
    timezone: user?.timezone || 'UTC',
  })
  const [successMessage, setSuccessMessage] = useState('')
  const [syncStatus, setSyncStatus] = useState<{
    isCreating: boolean;
    isAutoSyncing: boolean;
    syncResult?: { success: boolean; count: number };
  }>({
    isCreating: false,
    isAutoSyncing: false,
  })
  const [showInstructions, setShowInstructions] = useState(false)
  
  const createFeedMutation = useCreateCalendarFeed()

  // Function to convert webcal:// URLs to https://
  const convertWebcalToHttps = (url: string): string => {
    if (url.startsWith('webcal://')) {
      return url.replace('webcal://', 'https://')
    }
    return url
  }

  // Update sync status based on mutation state
  useEffect(() => {
    if (createFeedMutation.isLoading) {
      setSyncStatus(prev => ({ ...prev, isCreating: true, isAutoSyncing: false }))
    } else if (createFeedMutation.data) {
      const { syncResult } = createFeedMutation.data
      setSyncStatus({
        isCreating: false,
        isAutoSyncing: false,
        syncResult
      })
    }
  }, [createFeedMutation.isLoading, createFeedMutation.data])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.id) return

    // Convert webcal URLs to https URLs automatically
    const processedUrl = convertWebcalToHttps(formData.calendarUrl)

    // Get sync approach from localStorage if available
    let syncApproach = 'yoga_only'
    const storedSegment = localStorage.getItem('onboarding_user_segment')
    if (storedSegment) {
      try {
        const userSegment = JSON.parse(storedSegment)
        syncApproach = userSegment.syncApproach || 'yoga_only'
      } catch (error) {
        console.error('Failed to parse stored user segment:', error)
      }
    }

    const feedData: CalendarFeedInsert = {
      user_id: user.id,
      feed_url: processedUrl,
      calendar_name: formData.calendarName,
      sync_approach: syncApproach,
    } as CalendarFeedInsert & { sync_approach: string }

    try {
      setSyncStatus({ isCreating: true, isAutoSyncing: false })
      
      const result = await createFeedMutation.mutateAsync(feedData)
      
      if (result.syncResult.success) {
        setSuccessMessage(
          `Calendar feed added and synced successfully! ${result.syncResult.count} events were imported.`
        )
      } else {
        setSuccessMessage(
          'Calendar feed added successfully! However, the initial sync failed. You can manually sync it from your dashboard.'
        )
      }
      
      // Call onSuccess callback if provided, otherwise redirect to dashboard
      if (onSuccess) {
        setTimeout(() => {
          onSuccess()
        }, 2000)
      } else {
        setTimeout(() => {
          router.push('/app')
        }, 3000)
      }
    } catch (error) {
      console.error('Error adding calendar feed:', error)
      setSyncStatus({ isCreating: false, isAutoSyncing: false })
    }
  }

  const getLoadingMessage = () => {
    if (syncStatus.isCreating) {
      return 'Adding calendar feed and syncing events...'
    }
    return 'Add Calendar Feed'
  }

  const getSuccessIcon = () => {
    if (syncStatus.syncResult?.success) {
      return <CheckCircle className="h-4 w-4" />
    }
    return <Check className="h-4 w-4" />
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Success Message */}
      {successMessage && (
        <Alert>
          {getSuccessIcon()}
          <div>{successMessage}</div>
        </Alert>
      )}

      {/* Sync Progress */}
      {syncStatus.isCreating && (
        <Alert>
          <RefreshCw className="h-4 w-4 animate-spin" />
          <div>
            <strong>Creating and syncing your calendar...</strong>
            <p className="text-sm text-muted-foreground mt-1">
              This may take a few moments as we import your events.
            </p>
          </div>
        </Alert>
      )}

      {/* Sync Results */}
      {syncStatus.syncResult && !successMessage && (
        <Alert variant={syncStatus.syncResult.success ? "default" : "destructive"}>
          {syncStatus.syncResult.success ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <div>
            {syncStatus.syncResult.success ? (
              <>
                <strong>Feed created and synced!</strong>
                <p className="text-sm text-muted-foreground mt-1">
                  {syncStatus.syncResult.count} events were imported successfully.
                </p>
              </>
            ) : (
              <>
                <strong>Feed created, but sync failed</strong>
                <p className="text-sm text-muted-foreground mt-1">
                  You can manually sync from your dashboard.
                </p>
              </>
            )}
          </div>
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
                disabled={syncStatus.isCreating}
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
                disabled={syncStatus.isCreating}
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
              disabled={syncStatus.isCreating}
            />

            <Button 
              type="submit" 
              className="w-full" 
              disabled={syncStatus.isCreating}
            >
              {syncStatus.isCreating ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  {getLoadingMessage()}
                </>
              ) : (
                'Add Calendar Feed'
              )}
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
                  <li>Copy the webcal:// URL (we&apos;ll automatically convert it to https://)</li>
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