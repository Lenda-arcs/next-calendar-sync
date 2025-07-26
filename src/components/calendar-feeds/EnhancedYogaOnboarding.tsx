'use client'

import { useState } from 'react'
import { User } from '@supabase/supabase-js'
import { YogaCalendarOnboarding } from './YogaCalendarOnboarding'
import { CalendarImportStep } from './CalendarImportStep'

interface EnhancedYogaOnboardingProps {
  user: User
  success?: string
  error?: string
  message?: string
}

type OnboardingStep = 'create-calendar' | 'import-events' | 'complete'

export function EnhancedYogaOnboarding({ user, success, error, message }: EnhancedYogaOnboardingProps) {
  const [step, setStep] = useState<OnboardingStep>(() => {
    // If calendar creation is already successful, move to import
    if (success === 'calendar_created') {
      return 'import-events'
    }
    return 'create-calendar'
  })



  const handleImportComplete = () => {
    setStep('complete')
    // Redirect to dashboard
    setTimeout(() => {
      window.location.href = '/app'
    }, 1000)
  }

  const handleSkipImport = () => {
    setStep('complete')
    // Redirect to dashboard
    setTimeout(() => {
      window.location.href = '/app'
    }, 1000)
  }

  if (step === 'create-calendar') {
    return (
      <YogaCalendarOnboarding
        user={user}
        success={success}
        error={error}
        message={message}
      />
    )
  }

  if (step === 'import-events') {
    return (
      <CalendarImportStep
        onComplete={handleImportComplete}
        onSkip={handleSkipImport}
      />
    )
  }

  if (step === 'complete') {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">🎉 You&apos;re All Set!</h1>
          <p className="text-muted-foreground">
            Your yoga calendar is ready. Redirecting to your dashboard...
          </p>
        </div>
      </div>
    )
  }

  return null
} 