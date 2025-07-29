import { Container } from '@/components/layout/container'
import { 
  ScheduleFilters,
  FilteredEventList, 
  ScheduleHeader 
} from '@/components/schedule'
import { createServerClient } from '@/lib/supabase-server'
import { generateTeacherScheduleMetadata, generateYogaInstructorStructuredData } from '@/lib/i18n/metadata'
import { StructuredData } from '@/components/seo/StructuredData'
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
  const locale = getValidLocale(resolvedParams.locale)
  const teacherSlug = resolvedParams['teacher-slug']

  // Create supabase client
  const supabase = await createServerClient()

  // Fetch profile data
  //TODO: are both public_profiles fetches in generateMetadata and here necessary?
  const { data: profile } = await supabase
    .from('public_profiles')
    .select('*')
    .eq('public_url', teacherSlug)
    .single()

  if (!profile) {
    return null // Layout will handle 404
  }

  // Generate structured data for SEO
  //TODO: shouldn't we do this in the layout.tsx instead?
  const structuredData = generateYogaInstructorStructuredData(
    profile.name || 'Yoga Teacher',
    teacherSlug,
    profile.bio || undefined,
    undefined,
    profile.yoga_styles || undefined,
    locale,
    profile.profile_image_url
  )

  return (
    <Container>
      {/* Add structured data for SEO */}
      <StructuredData data={structuredData} />
      
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