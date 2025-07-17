import { EnhancedCalendarOnboarding, CalendarSelectionPage } from '@/components/calendar-feeds'
import { createServerClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { getUserCalendarFeeds } from '@/lib/calendar-feeds'
import { fetchOAuthCalendars } from '@/lib/server/oauth-calendar-service'
import AddCalendarContent from './AddCalendarContent'
import { generateAddCalendarMetadata } from '@/lib/i18n/metadata'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  return generateAddCalendarMetadata()
}

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
    <AddCalendarContent
      user={user}
      success={success}
      error={error}
    />
  )
} 