'use client'

import { useState } from 'react'
import { User } from '@supabase/supabase-js'
import { toast } from 'sonner'
import { YogaCalendarOnboarding } from './YogaCalendarOnboarding'
import { CalendarImportStep } from './CalendarImportStep'

interface EnhancedYogaOnboardingProps {
  user: User
  success?: string
  error?: string
  message?: string
  forceImportStep?: boolean
}

type OnboardingStep = 'create-calendar' | 'import-events'

export function EnhancedYogaOnboarding({ 
  user, 
  success, 
  error, 
  message, 
  forceImportStep = false 
}: EnhancedYogaOnboardingProps) {
  const [step, setStep] = useState<OnboardingStep>(() => {
    // If forceImportStep is true, go directly to import (for existing users)
    if (forceImportStep) {
      return 'import-events'
    }
    // If calendar creation is already successful, move to import
    if (success === 'calendar_created') {
      return 'import-events'
    }
    return 'create-calendar'
  })



  const handleCalendarCreated = () => {
    setStep('import-events')
  }

  const handleImportComplete = () => {
    toast.success('Calendar imported successfully!')
    // Redirect to dashboard
    setTimeout(() => {
      window.location.href = '/app'
    }, 1000)
  }

  const handleSkipImport = () => {
    toast.info('Skipping calendar import.')
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
        onCalendarCreated={handleCalendarCreated}
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

  return null
} 