'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { useCreateYogaCalendar } from '@/lib/hooks/useAppQuery'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Container } from '@/components/layout/container'
import { InfoSection, InfoItem } from '@/components/ui/info-section'
import { CheckCircle2, Calendar, ExternalLink, Loader2 } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'
import { User } from '@supabase/supabase-js'

interface YogaCalendarOnboardingProps {
  user?: User
  success?: string
  error?: string
  message?: string
  onCalendarCreated?: () => void
}

export function YogaCalendarOnboarding({ error, message, onCalendarCreated }: YogaCalendarOnboardingProps) {
  const { t } = useTranslation()
  const [isConnecting, setIsConnecting] = useState(false)
  const [calendarCreated, setCalendarCreated] = useState(false)
  const [oauthConnected, setOauthConnected] = useState(false)
  
  // ✨ NEW: Use unified mutation for calendar creation
  const createYogaCalendarMutation = useCreateYogaCalendar()

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
    try {
      // ✨ NEW: Use unified mutation for calendar creation
      const result = await createYogaCalendarMutation.mutateAsync({
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        syncApproach: 'yoga_only'
      })

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
      toast.error(error instanceof Error ? error.message : 'Failed to create calendar')
    }
  }

  return (
    <Container 
      title={t('calendar.yogaOnboarding.setup.title')}
      subtitle={t('calendar.yogaOnboarding.setup.subtitle')}
      maxWidth="2xl"
    >
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
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-medium text-primary">1</span>
                </div>
              )}
              {t('calendar.yogaOnboarding.setup.step1.title')}
            </CardTitle>
            <CardDescription>
              {oauthConnected 
                ? t('calendar.yogaOnboarding.setup.step1.successDescription')
                : t('calendar.yogaOnboarding.setup.step1.description')
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
                    {t('calendar.yogaOnboarding.setup.step1.connecting')}
                  </>
                ) : (
                  <>
                    <Calendar className="w-4 h-4 mr-2" />
                    {t('calendar.yogaOnboarding.setup.step1.button')}
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
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                  oauthConnected ? 'bg-primary/10' : 'bg-muted'
                }`}>
                  <span className={`text-sm font-medium ${
                    oauthConnected ? 'text-primary' : 'text-muted-foreground'
                  }`}>2</span>
                </div>
              )}
              {t('calendar.yogaOnboarding.setup.step2.title')}
            </CardTitle>
            <CardDescription>
              {calendarCreated 
                ? t('calendar.yogaOnboarding.setup.step2.successDescription')
                : t('calendar.yogaOnboarding.setup.step2.description')
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {calendarCreated ? (
              <div className="space-y-3">
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    {t('calendar.yogaOnboarding.setup.step2.successMessage')}
                  </AlertDescription>
                </Alert>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <a href="https://calendar.google.com" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      {t('calendar.yogaOnboarding.setup.step2.openGoogleCalendar')}
                    </a>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href="/app">
                      {t('calendar.yogaOnboarding.setup.step2.goToDashboard')}
                    </Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                  <h4 className="font-medium text-blue-900">{t('calendar.yogaOnboarding.setup.whatWeCreate.title')}</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• {t('calendar.yogaOnboarding.setup.whatWeCreate.items.0')}</li>
                    <li>• {t('calendar.yogaOnboarding.setup.whatWeCreate.items.1')}</li>
                    <li>• {t('calendar.yogaOnboarding.setup.whatWeCreate.items.2')}</li>
                  </ul>
                </div>
                <Button 
                  onClick={handleCreateYogaCalendar}
                  disabled={!oauthConnected || createYogaCalendarMutation.isPending}
                  className="w-full"
                  size="lg"
                >
                  {createYogaCalendarMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {t('calendar.yogaOnboarding.setup.step2.creating')}
                    </>
                  ) : (
                    <>
                      <Calendar className="w-4 h-4 mr-2" />
                      {t('calendar.yogaOnboarding.setup.step2.button')}
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* How it works section */}
        <Card className="bg-gray-50 dark:bg-gray-900/50">
          <CardHeader>
            <CardTitle className="text-lg">{t('calendar.yogaOnboarding.setup.howItWorks.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <InfoSection title="">
              <InfoItem 
                label={t('calendar.yogaOnboarding.setup.howItWorks.step1.title')}
                value={t('calendar.yogaOnboarding.setup.howItWorks.step1.description')}
              />
              <InfoItem 
                label={t('calendar.yogaOnboarding.setup.howItWorks.step2.title')}
                value={t('calendar.yogaOnboarding.setup.howItWorks.step2.description')}
              />
              <InfoItem 
                label={t('calendar.yogaOnboarding.setup.howItWorks.step3.title')}
                value={t('calendar.yogaOnboarding.setup.howItWorks.step3.description')}
              />
            </InfoSection>
          </CardContent>
        </Card>
      </div>
    </Container>
  )
} 