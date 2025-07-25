'use client'

import { Container } from '@/components/layout/container'
import { AddCalendarForm } from '@/components/calendar-feeds'
import { useTranslationNamespace } from '@/lib/i18n/context'
import { type User } from '@/lib/types'

interface AddCalendarContentProps {
  user: User | null
  success?: string
  error?: string
}

export default function AddCalendarContent({ user, success, error }: AddCalendarContentProps) {
  const { t } = useTranslationNamespace('calendar')

  const getErrorMessage = (errorCode: string) => {
    const knownErrors = [
      'oauth_denied', 'invalid_callback', 'invalid_state', 'token_exchange_failed',
      'user_info_failed', 'calendar_fetch_failed', 'database_error', 'internal_error'
    ]
    
    if (knownErrors.includes(errorCode)) {
      return t(`addCalendar.errors.${errorCode}`)
    }
    return t('addCalendar.errors.generic')
  }

  return (
    <Container
      title={t('addCalendar.title')}
      subtitle={t('addCalendar.subtitle')}
    >
      {success === 'connected' && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">
                {t('addCalendar.successTitle')}
              </h3>
              <p className="mt-1 text-sm text-green-700">
                {t('addCalendar.successDescription')}
              </p>
            </div>
          </div>
        </div>
      )}
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                {t('addCalendar.errorTitle')}
              </h3>
              <p className="mt-1 text-sm text-red-700">
                {getErrorMessage(error)}
              </p>
            </div>
          </div>
        </div>
      )}
      
      <AddCalendarForm user={user} />
    </Container>
  )
} 