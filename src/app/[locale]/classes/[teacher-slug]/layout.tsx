import { notFound } from 'next/navigation'
import { createServerClient } from '@/lib/supabase-server'
import { getValidLocale } from '@/lib/i18n/config'
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
  getValidLocale(resolvedParams.locale) // Validate locale
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