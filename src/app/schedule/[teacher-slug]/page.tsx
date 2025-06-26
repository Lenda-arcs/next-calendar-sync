import { notFound } from 'next/navigation'
import { createServerClient } from '@/lib/supabase-server'
import TeacherScheduleClient from './TeacherScheduleClient'

interface PageProps {
  params: Promise<{
    'teacher-slug': string
  }>
}

export default async function PublicSchedulePage({ params }: PageProps) {
  // Resolve params
  const resolvedParams = await params
  const teacherSlug = resolvedParams['teacher-slug']

  // Create supabase client
  const supabase = await createServerClient()

  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser()

  // Note: User profile fetching removed as it's no longer needed for this page

  // Fetch profile data (server-side)
  const { data: profile, error: profileError } = await supabase
    .from('public_profiles')
    .select('*')
    .eq('public_url', teacherSlug)
    .single()

  if (profileError || !profile) {
    notFound()
  }

  return (
    <TeacherScheduleClient 
      profile={profile}
      user={user}
    />
  )
} 