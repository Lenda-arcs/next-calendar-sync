import { createServerClient } from '@/lib/supabase-server'
import { getUserCalendarFeeds } from '@/lib/calendar-feeds'
import DashboardContent from './DashboardContent'

export default async function DashboardPage() {
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
      `/schedule/${user.public_url}`
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