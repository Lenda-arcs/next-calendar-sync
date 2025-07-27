'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { YogaCalendarOnboarding } from './YogaCalendarOnboarding'
import { CalendarImportStep } from './CalendarImportStep'
import { useTranslation } from '@/lib/i18n/context'
import { User } from '@supabase/supabase-js'

interface EnhancedYogaOnboardingProps {
  user?: User
  success?: string
  error?: string
  message?: string
  forceImportStep?: boolean
}

export function EnhancedYogaOnboarding({ 
  user, 
  success, 
  error, 
  message, 
  forceImportStep = false 
}: EnhancedYogaOnboardingProps) {
  const { t } = useTranslation()
  const [step, setStep] = useState<'create-calendar' | 'import-events'>(() => {
    // If there's a success message, assume calendar is already created and force import step
    if (success || forceImportStep) {
      return 'import-events'
    }
    return 'create-calendar'
  })

  const handleCalendarCreated = () => {
    setStep('import-events')
  }

  const handleImportComplete = () => {
    toast.success(t('calendar.yogaOnboarding.completion.success'))
    // Redirect to dashboard
    setTimeout(() => {
      window.location.href = '/app'
    }, 1000)
  }

  const handleSkipImport = () => {
    toast.info(t('calendar.yogaOnboarding.completion.skipped'))
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