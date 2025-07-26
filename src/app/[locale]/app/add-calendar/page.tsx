import { generateAddCalendarMetadata } from '@/lib/i18n/metadata'
import type { Metadata } from 'next'
import AddCalendarContent from '@/components/dashboard/add-calendar/AddCalendarContent'
import { EnhancedCalendarOnboarding, CalendarSelectionPage } from '@/components/calendar-feeds'
import { YogaCalendarOnboarding } from '@/components/calendar-feeds/YogaCalendarOnboarding'
import { createServerClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { getValidLocale } from '@/lib/i18n/config'
import { getUserCalendarFeeds } from '@/lib/calendar-feeds'
import { fetchOAuthCalendars } from '@/lib/server/oauth-calendar-service'

interface AddCalendarPageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ 
    force_onboarding?: string 
    success?: string
    error?: string
    step?: string
    message?: string
  }>
}

export async function generateMetadata({ params }: AddCalendarPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params
  const locale = getValidLocale(localeParam)
  return generateAddCalendarMetadata(locale)
}

export default async function AddCalendarPage({ params, searchParams }: AddCalendarPageProps) {
  const { locale: localeParam } = await params
  const locale = getValidLocale(localeParam)
  
  const supabase = await createServerClient()

  // Get the current user (guaranteed by middleware)
  const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !authUser) {
    // This should rarely happen due to middleware, but kept as failsafe
    const signInPath = locale === 'en' ? '/auth/sign-in' : `/${locale}/auth/sign-in`
    redirect(signInPath)
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
  const showYogaCalendarCreation = step === 'create_yoga_calendar' || isOnboarding

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

  if (showYogaCalendarCreation) {
    return (
      <div className="min-h-screen">
        <YogaCalendarOnboarding user={authUser} success={success} error={error} message={message} />
      </div>
    )
  }

  // Fallback to enhanced onboarding for existing users
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