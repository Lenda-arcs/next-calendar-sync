import { Container } from '@/components/layout/container'
import { 
  ScheduleFilters,
  FilteredEventList, 
  ScheduleHeader 
} from '@/components/schedule'
import { createServerClient } from '@/lib/supabase-server'

interface PageProps {
  params: Promise<{
    'teacher-slug': string
  }>
}

export default async function PublicSchedulePage({ params }: PageProps) {
  // Resolve params to get the teacher slug
  const resolvedParams = await params
  const teacherSlug = resolvedParams['teacher-slug']

  // Create supabase client to fetch profile data for the content
  const supabase = await createServerClient()
  
  // Fetch profile data for the schedule content
  const { data: profile } = await supabase
    .from('public_profiles')
    .select('*')
    .eq('public_url', teacherSlug)
    .single()

  return (
    <Container>
      <div className="space-y-6">
        {/* Header with Filter Statistics */}
        <ScheduleHeader />
        
        {/* Filter Components */}
        <ScheduleFilters />

        {/* Filtered Events List */}
        <FilteredEventList
          userId={profile?.id || ''}
          variant={profile?.event_display_variant || 'compact'}
          className="filtered-events"
        />


      </div>
    </Container>
  )
} 