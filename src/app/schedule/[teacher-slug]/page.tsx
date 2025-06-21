import { notFound } from 'next/navigation'
import { createServerClient } from '@/lib/supabase-server'
import { Container } from '@/components/layout/container'
import { PageSection } from '@/components/layout/page-section'
import { TeacherHero } from '@/components/events'
import { 
  FilterProvider, 
  ScheduleFilters, 
  FilteredEventList, 
  ScheduleHeader 
} from '@/components/schedule'

interface PageProps {
  params: Promise<{
    'teacher-slug': string
  }>
}

export default async function PublicSchedulePage({ params }: PageProps) {
  // Resolve params
  const resolvedParams = await params
  const teacherSlug = resolvedParams['teacher-slug']

  // Fetch profile data (server-side)
  const supabase = await createServerClient()
  const { data: profile, error: profileError } = await supabase
    .from('public_profiles')
    .select('*')
    .eq('public_url', teacherSlug)
    .single()

  if (profileError || !profile) {
    notFound()
  }

  return (
    <div className="min-h-screen">
      {/* Teacher Hero Section */}
      <PageSection className="py-8 sm:py-12">
        <Container maxWidth="4xl">
          <TeacherHero profile={profile} />
        </Container>
      </PageSection>

      {/* Filter & Events Section */}
      <PageSection className="py-8 sm:py-12">
        <Container maxWidth="4xl">
          <FilterProvider>
            <div className="space-y-6">
              {/* Header with Filter Statistics */}
              <ScheduleHeader />
              
              {/* Filter Components */}
              <ScheduleFilters />

              {/* Filtered Events List */}
              <FilteredEventList
                userId={profile.id || ''}
                variant={profile.event_display_variant || 'compact'}
                className="filtered-events"
              />
            </div>
          </FilterProvider>
        </Container>
      </PageSection>
    </div>
  )
} 