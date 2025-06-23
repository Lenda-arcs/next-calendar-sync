import { createServerClient } from '@/lib/supabase-server'
import { Container } from '@/components/layout/container'
import { PageSection } from '@/components/layout/page-section'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CopyLinkButton } from '@/components/ui/copy-link-button'
import { PrivateEventList } from '@/components/events'
import { CalendarFeedsProfileSection } from '@/components/calendar-feeds'
import { getUserCalendarFeeds } from '@/lib/calendar-feeds'
import { PATHS } from '@/lib/paths'
import Link from 'next/link'
import { Calendar, Eye, Tags, Receipt, Link as LinkIcon } from 'lucide-react'

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
  const shareLabel = hasCustomUrl
    ? "Your public schedule:"
    : "Your public schedule (customize in profile):"

  return (
    <div className="min-h-screen">
      <Container 
        title={`Welcome, ${user?.name || 'Friend'}`}
        subtitle="Manage your yoga class schedule and profile"
        maxWidth="4xl"
      >
        {/* Your Upcoming Classes Section */}
        <PageSection>
          <Card variant="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-serif">
                <Calendar className="h-5 w-5" />
                Your Upcoming Classes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {hasFeeds ? (
                <div>
                  <PrivateEventList
                    userId={userId}
                    eventCount={3}
                  />
                  <div className="mt-6 text-right">
                    <Link 
                      href={PATHS.APP.MANAGE_EVENTS}
                      className="text-sm text-primary hover:text-primary/80 hover:underline font-medium"
                    >
                      View all events →
                    </Link>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground text-sm py-4">
                  Connect your calendar to see your upcoming classes here.
                </p>
              )}
            </CardContent>
          </Card>
        </PageSection>

        {/* Calendar Actions Section */}
        <PageSection title="Calendar Actions">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 
             {/* Public Schedule */}
             {publicPath && (
               <Card variant="outlined">
                 <CardHeader>
                   <CardTitle className="text-lg">Public Schedule</CardTitle>
                   <CardDescription>
                     See how your schedule appears to your students.
                   </CardDescription>
                 </CardHeader>
                 <CardContent>
                   <div className="flex items-center gap-2">
                     <CopyLinkButton
                       url={publicPath}
                       showLabel={false}
                       label={shareLabel}
                       buttonText="Share"
                     />
                     <Button 
                       variant="secondary" 
                       asChild 
                       className="flex-1"
                     >
                       <Link href={publicPath}>
                         <Eye className="mr-2 h-4 w-4" />
                         View Public Page
                       </Link>
                     </Button>
                   </div>
                 </CardContent>
               </Card>
             )}
 
             {/* Manage Events */}
             <Card variant="outlined">
               <CardHeader>
                 <CardTitle className="text-lg">View Your Events</CardTitle>
                 <CardDescription>
                   Review and manage all your imported calendar events.
                 </CardDescription>
               </CardHeader>
               <CardContent>
                 <Button 
                   variant="default" 
                   asChild 
                   className="w-full"
                 >
                   <Link href={PATHS.APP.MANAGE_EVENTS}>
                     <Calendar className="mr-2 h-4 w-4" />
                     Manage Events
                   </Link>
                 </Button>
               </CardContent>
             </Card>
 
             {/* Tag Rules */}
             <Card variant="outlined">
               <CardHeader>
                 <CardTitle className="text-lg">Tag Rules</CardTitle>
                 <CardDescription>
                   Automatically tag your events using keywords.
                 </CardDescription>
               </CardHeader>
               <CardContent>
                 <Button 
                   variant="default" 
                   asChild 
                   className="w-full"
                 >
                   <Link href={PATHS.APP.MANAGE_TAGS}>
                     <Tags className="mr-2 h-4 w-4" />
                     Manage Tag Rules
                   </Link>
                 </Button>
               </CardContent>
             </Card>
 
             {/* Invoice Management */}
             <Card variant="outlined">
               <CardHeader>
                 <CardTitle className="text-lg">Invoice Management</CardTitle>
                 <CardDescription>
                   Create studio profiles and generate invoices.
                 </CardDescription>
               </CardHeader>
               <CardContent>
                 <Button 
                   variant="default" 
                   asChild 
                   className="w-full"
                 >
                   <Link href={PATHS.APP.MANAGE_INVOICES}>
                     <Receipt className="mr-2 h-4 w-4" />
                     Manage Invoices
                   </Link>
                 </Button>
               </CardContent>
             </Card>
 
             {/* Profile Setup (if no public URL) */}
             {!hasCustomUrl && (
               <Card variant="outlined">
                <CardHeader>
                  <CardTitle className="text-lg">Setup Profile</CardTitle>
                  <CardDescription>
                    Complete your profile to enable your public schedule.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    variant="outline" 
                    asChild 
                    className="w-full"
                  >
                                       <Link href={PATHS.APP.PROFILE}>
                     <LinkIcon className="mr-2 h-4 w-4" />
                     Complete Profile
                   </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* Calendar Integration */}
          <div className="mt-6">
            <CalendarFeedsProfileSection feeds={feeds} />
          </div>
        </PageSection>
      </Container>
    </div>
  )
} 