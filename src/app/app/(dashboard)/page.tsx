import { createServerClient } from '@/lib/supabase-server'
import { Container } from '@/components/layout/container'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Calendar, Users, Clock, BarChart3, Plus } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Get user statistics
  const userId = session?.user.id
  if (!userId) {
    return <div>Authentication required</div>
  }

  const [
    { count: eventsCount },
    { count: feedsCount },
    { count: tagsCount }
  ] = await Promise.all([
    supabase.from('events').select('*', { count: 'exact', head: true }).eq('user_id', userId),
    supabase.from('calendar_feeds').select('*', { count: 'exact', head: true }).eq('user_id', userId),
    supabase.from('tags').select('*', { count: 'exact', head: true }).eq('user_id', userId)
  ])

  return (
    <div className="p-6">
      <Container>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Welcome back! Here&apos;s an overview of your calendar sync.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Total Events
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {eventsCount || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Calendar Feeds
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {feedsCount || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Tags
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {tagsCount || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <BarChart3 className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    This Month
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    --
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Get started with managing your calendar and events.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button asChild className="w-full justify-start">
                  <Link href="/app/manage-events">
                    <Calendar className="mr-2 h-4 w-4" />
                    Manage Events
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/app/manage-tags">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Tags
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/app/profile">
                    <Users className="mr-2 h-4 w-4" />
                    Update Profile
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your latest calendar sync activities.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Clock className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>No recent activity to show</p>
                <p className="text-sm">Activities will appear here once you start syncing.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>
    </div>
  )
} 