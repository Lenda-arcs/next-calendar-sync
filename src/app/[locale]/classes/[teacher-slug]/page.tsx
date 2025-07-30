import { Container } from '@/components/layout/container'
import { 
  ScheduleFilters,
  FilteredEventList, 
  ScheduleHeader 
} from '@/components/schedule'
import { createServerClient } from '@/lib/supabase-server'
import { generateTeacherScheduleMetadata } from '@/lib/i18n/metadata'
import { getValidLocale } from '@/lib/i18n/config'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{
    locale: string
    'teacher-slug': string
  }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  const locale = getValidLocale(resolvedParams.locale)
  const teacherSlug = resolvedParams['teacher-slug']
  
  // Create supabase client to fetch profile data for metadata
  const supabase = await createServerClient()
  
  // Fetch profile data for metadata generation
  const { data: profile } = await supabase
    .from('public_profiles')
    .select('*')
    .eq('public_url', teacherSlug)
    .single()

  const teacherName = profile?.name || 'Yoga Teacher'
  return generateTeacherScheduleMetadata(
    teacherName,
    teacherSlug,
    locale,
    undefined,
    profile?.profile_image_url
  )
}

export default async function TeacherSchedulePage({ params }: PageProps) {
  const resolvedParams = await params
  const teacherSlug = resolvedParams['teacher-slug']

  // Create supabase client
  const supabase = await createServerClient()

  // Fetch profile data (this will be cached by the browser/Next.js as it's the same query as in layout)
  const { data: profile } = await supabase
    .from('public_profiles')
    .select('*')
    .eq('public_url', teacherSlug)
    .single()

  if (!profile) {
    return null // Layout will handle 404
  }

  return (
    <Container>
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
    </Container>
  )
} 