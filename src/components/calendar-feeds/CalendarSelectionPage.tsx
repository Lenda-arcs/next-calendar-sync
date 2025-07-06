'use client'

import { useState, useEffect, useCallback } from 'react'
import { CalendarSelectionModal } from './CalendarSelectionModal'
import { Container } from '@/components/layout/container'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, CheckCircle, Settings, X, Globe } from 'lucide-react'
import { CalendarItem } from '@/lib/types'
import { toast } from 'sonner'

interface CalendarSelectionPageProps {
  user: { id: string; name?: string | null } | null
  success?: string
  error?: string
  availableCalendars?: CalendarItem[]
}

export function CalendarSelectionPage({ success, error, availableCalendars = [] }: CalendarSelectionPageProps) {
  const [showModal, setShowModal] = useState(false)
  const [selectedCount, setSelectedCount] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)

  const handleSelectCalendars = useCallback(async () => {
    if (availableCalendars.length > 0) {
      setShowModal(true)
    } else {
      toast.error('No calendars available. Please try refreshing the page.')
    }
  }, [availableCalendars])

  useEffect(() => {
    // Always show calendars if we have them and we're on the calendar selection page
    if (availableCalendars.length > 0) {
      handleSelectCalendars()
    } else if (success === 'oauth_connected') {
      handleSelectCalendars()
    }
  }, [success, availableCalendars, handleSelectCalendars])

  const handleSuccess = (count: number) => {
    setSelectedCount(count)
    setIsCompleted(true)
    toast.success(`Successfully connected ${count} calendar${count !== 1 ? 's' : ''}!`)
  }

  const handleContinue = () => {
    window.location.href = '/app'
  }

  const handleManageCalendars = async () => {
    await handleSelectCalendars()
  }

  if (isCompleted) {
    return (
      <Container
        title="Calendar Setup Complete"
        subtitle="Your calendars are now connected and ready to sync"
      >
        <div className="max-w-2xl mx-auto">
          <Card variant="elevated" className="overflow-hidden">
            <CardHeader centered className="pb-6">
              <div className="mx-auto mb-6 w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <CardTitle className="text-3xl bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Setup Complete!
              </CardTitle>
              <CardDescription className="text-lg mt-2">
                {selectedCount} calendar{selectedCount !== 1 ? 's' : ''} connected successfully
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Card variant="glass" className="p-4 bg-green-50/50 dark:bg-green-950/30 border-green-200/50">
                <h4 className="font-semibold text-green-900 dark:text-green-100 mb-3 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  What happens next?
                </h4>
                <ul className="text-sm text-green-700 dark:text-green-300 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0"></span>
                    Your events will sync automatically every 30 minutes
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0"></span>
                    Events will be matched to your tags and studios
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0"></span>
                    You can manage your calendar connections anytime
                  </li>
                </ul>
              </Card>
              
                          <div className="flex gap-3">
              <Button onClick={handleContinue} className="flex-1 h-12">
                Continue to Dashboard
              </Button>
              <Button variant="outline" onClick={handleManageCalendars} className="h-12">
                <Settings className="h-4 w-4 mr-2" />
                Manage Calendars
              </Button>
            </div>
            </CardContent>
          </Card>
        </div>
        
              <CalendarSelectionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={handleSuccess}
        calendars={availableCalendars}
      />
      </Container>
    )
  }

  return (
    <Container
      title="Select Your Calendars"
      subtitle="Choose which Google calendars you want to sync with your schedule"
    >
      <div className="max-w-2xl mx-auto">
        {error && (
          <Card variant="glass" className="mb-6 p-4 bg-red-50/50 dark:bg-red-950/30 border-red-200/50">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <X className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-red-900 dark:text-red-100">
                  Connection Issue
                </h3>
                <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                  There was an issue connecting your calendars. Please try again.
                </p>
              </div>
            </div>
          </Card>
        )}

        <Card variant="elevated" className="overflow-hidden">
          <CardHeader centered className="pb-6">
            <div className="mx-auto mb-6 w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm">
              <Calendar className="h-10 w-10 text-blue-600" />
            </div>
            <CardTitle className="text-3xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Google Calendar Connected
            </CardTitle>
            <CardDescription className="text-lg mt-2">
              Great! Now select which calendars you want to sync with your schedule.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Card variant="glass" className="p-4 bg-blue-50/50 dark:bg-blue-950/30 border-blue-200/50">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Why select calendars?
              </h4>
              <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></span>
                  Only events from selected calendars will appear in your app
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></span>
                  You can choose to sync only work calendars or personal calendars
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></span>
                  You can change your selection anytime
                </li>
              </ul>
            </Card>
            

            
            <Button 
              onClick={handleSelectCalendars} 
              className="w-full h-12 text-lg font-medium"
              size="lg"
            >
              <Calendar className="h-5 w-5 mr-2" />
              Select Calendars
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <CalendarSelectionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={handleSuccess}
        calendars={availableCalendars}
      />
    </Container>
  )
} 