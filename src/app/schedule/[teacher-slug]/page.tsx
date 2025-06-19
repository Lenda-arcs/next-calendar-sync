import { notFound } from 'next/navigation'
import { createServerClient } from '@/lib/supabase-server'
import { Container } from '@/components/layout/container'
import { PageSection } from '@/components/layout/page-section'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, MapPin, Clock, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { PublicEvent } from '@/lib/types'

interface PageProps {
  params: {
    'teacher-slug': string
  }
}

export default async function PublicSchedulePage({ params }: PageProps) {
  const supabase = await createServerClient()
  const teacherSlug = params['teacher-slug']

  // Fetch teacher profile
  const { data: profile, error: profileError } = await supabase
    .from('public_profiles')
    .select('*')
    .eq('public_url', teacherSlug)
    .single()

  if (profileError || !profile) {
    notFound()
  }

  // Fetch upcoming events for this teacher
  const { data: events } = await supabase
    .from('public_events')
    .select('*')
    .eq('user_id', profile.id!)
    .gte('start_time', new Date().toISOString())
    .order('start_time', { ascending: true })
    .limit(20)

  const upcomingEvents = events || []

  return (
    <main className="flex flex-col min-h-screen">
      {/* Header */}
      <PageSection className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
        <Container>
          <div className="text-center max-w-4xl mx-auto">
            {profile.profile_image_url && (
              <div className="w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden bg-gray-200">
                <img 
                  src={profile.profile_image_url} 
                  alt={profile.name || 'Profile'} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
              {profile.name || 'Teacher'}
            </h1>
            {profile.bio && (
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
                {profile.bio}
              </p>
            )}
            {profile.yoga_styles && profile.yoga_styles.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center mb-6">
                {profile.yoga_styles.map((style) => (
                  <Badge key={style} variant="secondary">
                    {style}
                  </Badge>
                ))}
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {profile.website_url && (
                <Button asChild variant="outline">
                  <Link href={profile.website_url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Website
                  </Link>
                </Button>
              )}
              {profile.instagram_url && (
                <Button asChild variant="outline">
                  <Link href={profile.instagram_url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Instagram
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </Container>
      </PageSection>

      {/* Schedule Section */}
      <PageSection>
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              Upcoming Schedule
            </h2>
            
            {upcomingEvents.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-300">
                    No upcoming events scheduled at the moment.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {upcomingEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </div>
        </Container>
      </PageSection>
    </main>
  )
}

function EventCard({ event }: { event: PublicEvent }) {
  const startTime = event.start_time ? new Date(event.start_time) : null
  const endTime = event.end_time ? new Date(event.end_time) : null

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        {event.image_url && (
          <div className="w-full h-48 mb-4 rounded-lg overflow-hidden bg-gray-200">
            <img 
              src={event.image_url} 
              alt={event.title || 'Event'} 
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <CardTitle className="text-xl">{event.title || 'Untitled Event'}</CardTitle>
        {event.description && (
          <CardDescription>{event.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {startTime && (
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
              <Clock className="w-4 h-4 mr-2" />
              <span>
                {startTime.toLocaleDateString()} • {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                {endTime && ` - ${endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
              </span>
            </div>
          )}
          
          {event.location && (
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
              <MapPin className="w-4 h-4 mr-2" />
              <span>{event.location}</span>
            </div>
          )}
          
          {event.tags && event.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {event.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          
          {event.booking_url && (
            <div className="pt-3">
              <Button asChild className="w-full">
                <Link href={event.booking_url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Book Now
                </Link>
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 