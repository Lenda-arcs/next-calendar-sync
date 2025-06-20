import { notFound } from 'next/navigation'
import { createServerClient } from '@/lib/supabase-server'
import { Container } from '@/components/layout/container'
import { PageSection } from '@/components/layout/page-section'
import { TeacherHero, PublicEventList } from '@/components/events'

interface PageProps {
  params: Promise<{
    'teacher-slug': string
  }>
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
            userId={profile.id || ''}
            variant={profile.event_display_variant || 'compact'}
          />
        </Container>
      </PageSection>
    </div>
  )
} 