import { notFound } from 'next/navigation'
import { createServerClient } from '@/lib/supabase-server'
import TeacherScheduleLayout from './TeacherScheduleLayout'

interface LayoutProps {
  children: React.ReactNode
  params: Promise<{
    'teacher-slug': string
  }>
}

export default async function Layout({ children, params }: LayoutProps) {
  // Resolve params
  const resolvedParams = await params
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

  return (
    <TeacherScheduleLayout 
      profile={profile}
      user={user}
      teacherSlug={teacherSlug}
    >
      {children}
    </TeacherScheduleLayout>
  )
} 