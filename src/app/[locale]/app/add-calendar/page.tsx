import { generateAddCalendarMetadata } from '@/lib/i18n/metadata'
import type { Metadata } from 'next'
// Removed legacy components - now only using EnhancedYogaOnboarding
import { EnhancedYogaOnboarding } from '@/components/calendar-feeds/EnhancedYogaOnboarding'
import { createServerClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { getValidLocale } from '@/lib/i18n/config'
import { getUserCalendarFeeds } from '@/lib/calendar-feeds'
// Removed fetchOAuthCalendars - no longer needed for simplified flow

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

  //TODO: Check if this is still needed, as auth should be handled by middleware
  if (authError || !authUser) {
    // This should rarely happen due to middleware, but kept as failsafe
    const signInPath = locale === 'en' ? '/auth/sign-in' : `/${locale}/auth/sign-in`
    redirect(signInPath)
  }

  // Fetch user profile and existing calendar feeds
  const [existingFeeds, resolvedSearchParams] = await Promise.all([
    getUserCalendarFeeds({ supabase, userId: authUser.id }).catch(() => []),
    searchParams
  ])

  const feeds = existingFeeds || []
  const forceOnboarding = resolvedSearchParams.force_onboarding === 'true'
  const success = resolvedSearchParams.success
  const error = resolvedSearchParams.error
  const step = resolvedSearchParams.step
  const message = resolvedSearchParams.message
  const isOnboarding = feeds.length === 0 || forceOnboarding
  
  // Removed OAuth integration check - simplified to only check calendar feeds
  
  // Always show the new yoga onboarding flow for calendar setup
  const needsCalendarSetup = feeds.length === 0 || isOnboarding || step === 'create_yoga_calendar'

  return (
    <div className="min-h-screen">
      <EnhancedYogaOnboarding 
        user={authUser} 
        success={success} 
        error={error} 
        message={message}
        forceImportStep={!needsCalendarSetup}
      />
    </div>
  )
} 