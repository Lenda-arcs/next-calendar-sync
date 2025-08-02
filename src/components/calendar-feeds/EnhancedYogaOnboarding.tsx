'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { YogaCalendarOnboarding } from './YogaCalendarOnboarding'
import { CalendarImportStep } from './CalendarImportStep'
import { useTranslation } from '@/lib/i18n/context'

interface EnhancedYogaOnboardingProps {
  success?: string
  error?: string
  message?: string
  forceImportStep?: boolean
}

export function EnhancedYogaOnboarding({ 
  success, 
  error, 
  message, 
  forceImportStep = false 
}: EnhancedYogaOnboardingProps) {
  const { t } = useTranslation()
  //TODO: USe type safe values for this state ans use enum if possible and make use of it in the component
  const [step, setStep] = useState<'create-calendar' | 'import-events'>(() => {
    // Only move to import step if explicitly forced or if calendar creation was successful
    if (forceImportStep || success === 'calendar_created') {
      return 'import-events'
    }
    return 'create-calendar'
  })

  const handleCalendarCreated = () => {
    setStep('import-events')
  }

  //TODO: see if we can unify follwing two functions into one
  const handleImportComplete = () => {
    toast.success(t('calendar.yogaOnboarding.completion.success'))
    // Redirect to dashboard
    setTimeout(() => {
      window.location.href = '/app' //TODO: use PATHS for constancy
    }, 1000)
  }

  const handleSkipImport = () => {
    toast.info(t('calendar.yogaO  nboarding.completion.skipped'))
    // Redirect to dashboard
    setTimeout(() => {
      window.location.href = '/app' //TODO: use PATHS for constancy
    }, 1000)
  }

  if (step === 'create-calendar') {
    return (
      <YogaCalendarOnboarding
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