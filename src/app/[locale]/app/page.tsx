import { createServerClient } from '@/lib/supabase-server'
import { getUserCalendarFeeds } from '@/lib/calendar-feeds'
import DashboardContent from '../../app/(dashboard)/DashboardContent'
import { generateDashboardMetadata } from '@/lib/i18n/metadata'
import { getValidLocale } from '@/lib/i18n/config'
import { PATHS } from '@/lib/paths'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: localeParam } = await params
  const locale = getValidLocale(localeParam)
  
  return generateDashboardMetadata(locale)
}

export default async function LocalizedDashboardPage() {
  const supabase = await createServerClient()

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser()

  // Get user data
  const userId = authUser?.id
  if (!userId) {
    return <div>Authentication required</div>
  }

  // Fetch user profile and statistics
  const [
    { data: userData },
    { count: feedsCount },
    calendarFeeds
  ] = await Promise.all([
    supabase.from('users').select('*').eq('id', userId).single(),
    supabase.from('calendar_feeds').select('*', { count: 'exact', head: true }).eq('user_id', userId),
    getUserCalendarFeeds({ supabase, userId }).catch(() => [])
  ])

  const user = userData || null
  const userFeedCount = feedsCount || 0
  const hasFeeds = userFeedCount > 0
  const feeds = calendarFeeds || []

  // Generate public schedule URL
  const publicPath = user?.public_url ?
    PATHS.DYNAMIC.TEACHER_SCHEDULE(user.public_url)
    : null
  const hasCustomUrl = !!user?.public_url

  return (
    <DashboardContent
      user={user}
      userId={userId}
      hasFeeds={hasFeeds}
      feeds={feeds}
      publicPath={publicPath}
      hasCustomUrl={hasCustomUrl}
    />
  )
} 