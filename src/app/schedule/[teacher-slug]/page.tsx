import { notFound } from 'next/navigation'
import { createServerClient } from '@/lib/supabase-server'
import { Container } from '@/components/layout/container'
import { PageSection } from '@/components/layout/page-section'
import { TeacherHero, PublicEventList } from '@/components/events'
import { Tag, PublicEvent } from '@/lib/types'
import { convertToEventTag } from '@/lib/event-types'
import type { EventTag } from '@/lib/event-types'

interface PageProps {
  params: {
    'teacher-slug': string
  }
}

// Enhanced PublicEvent with matched tags
interface EnhancedPublicEvent extends PublicEvent {
  matchedTags: EventTag[]
}

export default async function PublicSchedulePage({ params }: PageProps) {
  const supabase = await createServerClient()
  const resolvedParams = await params
  const teacherSlug = resolvedParams['teacher-slug']

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
  const { data: events, error: eventsError } = await supabase
    .from('public_events')
    .select('*')
    .eq('user_id', profile.id || '')
    .gte('start_time', new Date().toISOString())
    .order('start_time', { ascending: true })
    .limit(50)

  if (eventsError) {
    console.error('Error fetching events:', eventsError)
  }

  // Fetch all tags for this user (both user-specific and global tags)
  const [userTagsResult, globalTagsResult] = await Promise.all([
    supabase
      .from('tags')
      .select('*')
      .eq('user_id', profile.id || ''),
    supabase
      .from('tags')
      .select('*')
      .is('user_id', null)
  ])

  const userTags = userTagsResult.data || []
  const globalTags = globalTagsResult.data || []
  const allTags = [...userTags, ...globalTags]

  // Create a map for quick tag lookups
  const tagMap = new Map<string, Tag>()
  allTags.forEach(tag => {
    if (tag.name) {
      tagMap.set(tag.name.toLowerCase(), tag)
    }
  })

  // Enhance events with matched tags
  const enhancedEvents: EnhancedPublicEvent[] = (events || []).map(event => {
    const matchedTags: EventTag[] = []
    
    if (event.tags) {
      event.tags.forEach(tagName => {
        const tag = tagMap.get(tagName.toLowerCase())
        if (tag) {
          matchedTags.push(convertToEventTag(tag))
        }
      })
    }

    return {
      ...event,
      matchedTags
    }
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Teacher Hero Section */}
      <PageSection className="py-8 sm:py-12">
        <Container maxWidth="4xl">
          <TeacherHero profile={profile} />
        </Container>
      </PageSection>

      {/* Events List Section */}
      <PageSection className="py-8 sm:py-12 bg-gray-50/50 dark:bg-slate-900/50">
        <Container maxWidth="4xl">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Upcoming Classes
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Join {profile.name || 'our teacher'} for these upcoming yoga sessions.
            </p>
          </div>
          
          <PublicEventList
            events={enhancedEvents}
            variant={profile.event_display_variant || 'compact'}
          />
        </Container>
      </PageSection>
    </div>
  )
} 