import { notFound } from 'next/navigation'
import { createServerClient } from '@/lib/supabase-server'
import { getValidLocale } from '@/lib/i18n/config'
import { generateYogaInstructorStructuredData } from '@/lib/i18n/metadata'
import { StructuredData } from '@/components/seo/StructuredData'
import TeacherScheduleLayout from './TeacherScheduleLayout'

interface LayoutProps {
  children: React.ReactNode
  params: Promise<{
    locale: string
    'teacher-slug': string
  }>
}

export default async function Layout({ children, params }: LayoutProps) {
  // Resolve params
  const resolvedParams = await params
  const locale = getValidLocale(resolvedParams.locale) // Validate locale
  const teacherSlug = resolvedParams['teacher-slug']

  // Create supabase client
  const supabase = await createServerClient()

  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch profile data (server-side)
  const { data: profile, error: profileError } = await supabase
    .from('public_profiles')
    .select('*')
    .eq('public_url', teacherSlug)
    .single()

  if (profileError || !profile) {
    notFound()
  }

  // Generate structured data for SEO
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
    <>
      {/* Add structured data for SEO */}
      <StructuredData data={structuredData} />
      
      <TeacherScheduleLayout 
        profile={profile} 
        user={user}
        teacherSlug={teacherSlug}
      >
        {children}
      </TeacherScheduleLayout>
    </>
  )
} 