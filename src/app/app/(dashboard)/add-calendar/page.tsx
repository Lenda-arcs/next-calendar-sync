import { Container } from '@/components/layout/container'
import { AddCalendarForm, EnhancedCalendarOnboarding, CalendarSelectionPage } from '@/components/calendar-feeds'
import { createServerClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { getUserCalendarFeeds } from '@/lib/calendar-feeds'
import { fetchOAuthCalendars } from '@/lib/server/oauth-calendar-service'

export default async function AddCalendarPage({
  searchParams
}: {
  searchParams: Promise<{ 
    force_onboarding?: string 
    success?: string
    error?: string
    step?: string
    message?: string
  }>
}) {
  const supabase = await createServerClient()

  // Get the current user
  const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !authUser) {
    redirect('/auth/sign-in')
  }

  // Fetch user profile and existing calendar feeds
  const [
    { data: userData },
    existingFeeds,
    resolvedSearchParams
  ] = await Promise.all([
    supabase.from('users').select('*').eq('id', authUser.id).single(),
    getUserCalendarFeeds({ supabase, userId: authUser.id }).catch(() => []),
    searchParams
  ])

  const user = userData || null
  const feeds = existingFeeds || []
  const forceOnboarding = resolvedSearchParams.force_onboarding === 'true'
  const success = resolvedSearchParams.success
  const error = resolvedSearchParams.error
  const step = resolvedSearchParams.step
  const message = resolvedSearchParams.message
  const isOnboarding = feeds.length === 0 || forceOnboarding
  
  // Check if user has OAuth integration but no calendar feeds yet
  const { data: oauthIntegration } = await supabase
    .from('oauth_calendar_integrations')
    .select('*')
    .eq('user_id', authUser.id)
    .single()
  
  const hasOAuthButNoFeeds = oauthIntegration && feeds.length === 0
  const showCalendarSelection = step === 'select_calendars' || hasOAuthButNoFeeds

  // Fetch available calendars if showing calendar selection
  const { calendars: availableCalendars } = showCalendarSelection 
    ? await fetchOAuthCalendars(authUser.id)
    : { calendars: [] }

  if (showCalendarSelection) {
    return (
      <div className="min-h-screen">
        <CalendarSelectionPage user={user} success={success} error={error} availableCalendars={availableCalendars} />
      </div>
    )
  }

  if (isOnboarding) {
    return (
      <div className="min-h-screen">
        <EnhancedCalendarOnboarding user={user} success={success} error={error} message={message} />
      </div>
    )
  }

  return (
    <Container
      title="Add Calendar Feed"
      subtitle="Connect another calendar to sync more events to your schedule."
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
                Calendar Connected Successfully!
              </h3>
              <p className="mt-1 text-sm text-green-700">
                Your Google Calendar has been connected. Your events will now sync automatically.
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
                Connection Failed
              </h3>
              <p className="mt-1 text-sm text-red-700">
                {error === 'oauth_denied' && 'You denied access to your calendar.'}
                {error === 'invalid_callback' && 'Invalid OAuth callback. Please try again.'}
                {error === 'invalid_state' && 'Security validation failed. Please try again.'}
                {error === 'token_exchange_failed' && 'Failed to exchange authorization code.'}
                {error === 'user_info_failed' && 'Failed to get user information.'}
                {error === 'calendar_fetch_failed' && 'Failed to fetch calendar list.'}
                {error === 'database_error' && 'Failed to save connection. Please try again.'}
                {error === 'internal_error' && 'An unexpected error occurred. Please try again.'}
                {!['oauth_denied', 'invalid_callback', 'invalid_state', 'token_exchange_failed', 'user_info_failed', 'calendar_fetch_failed', 'database_error', 'internal_error'].includes(error) && 'An error occurred. Please try again.'}
              </p>
            </div>
          </div>
        </div>
      )}
      
      <AddCalendarForm user={user} />
    </Container>
  )
} 