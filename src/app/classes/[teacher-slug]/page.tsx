import { Container } from '@/components/layout/container'
import { 
  ScheduleFilters,
  FilteredEventList, 
  ScheduleHeader 
} from '@/components/schedule'
import { createServerClient } from '@/lib/supabase-server'
import { generateTeacherScheduleMetadata, generateYogaInstructorStructuredData } from '@/lib/i18n/metadata'
import { StructuredData } from '@/components/seo/StructuredData'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{
    'teacher-slug': string
  }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
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
    undefined, 
    undefined, 
    profile?.profile_image_url
  )
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

  // Generate structured data for the teacher
  const teacherName = profile?.name || 'Yoga Teacher'
  const teacherBio = profile?.bio || undefined
  const teacherSpecialties = profile?.yoga_styles || undefined
  
  const instructorStructuredData = generateYogaInstructorStructuredData(
    teacherName,
    teacherSlug,
    teacherBio,
    undefined, // location not available in profile
    teacherSpecialties,
    undefined, // use default language
    profile?.profile_image_url
  )

  return (
    <Container>
      {/* Add structured data for SEO */}
      <StructuredData data={instructorStructuredData} />
      
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