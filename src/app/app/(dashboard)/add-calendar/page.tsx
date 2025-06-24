import { Container } from '@/components/layout/container'
import { AddCalendarForm } from '@/components/calendar-feeds/AddCalendarForm'
import { CalendarOnboarding } from '@/components/calendar-feeds/CalendarOnboarding'
import { createServerClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { getUserCalendarFeeds } from '@/lib/calendar-feeds'

export default async function AddCalendarPage() {
  const supabase = await createServerClient()

  // Get the current user
  const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !authUser) {
    redirect('/auth/sign-in')
  }

  // Fetch user profile and existing calendar feeds
  const [
    { data: userData },
    existingFeeds
  ] = await Promise.all([
    supabase.from('users').select('*').eq('id', authUser.id).single(),
    getUserCalendarFeeds({ supabase, userId: authUser.id }).catch(() => [])
  ])

  const user = userData || null
  const feeds = existingFeeds || []
  const isOnboarding = feeds.length === 0

  if (isOnboarding) {
    return (
      <div className="min-h-screen">
        <CalendarOnboarding user={user} />
      </div>
    )
  }

  return (
    <Container
      title="Add Calendar Feed"
      subtitle="Connect another calendar to sync more events to your schedule."
    >
      <AddCalendarForm user={user} />
    </Container>
  )
} 