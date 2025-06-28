import { Container } from '@/components/layout/container'
import { PageSection } from '@/components/layout/page-section'
import { TeacherCard } from '@/components/ui/teacher-card'
import { TeacherSearch } from '@/components/features'
import { createServerClient } from '@/lib/supabase-server'

export const revalidate = 60

export default async function ScheduleIndexPage() {
  const supabase = await createServerClient()
  const { data: featured } = await supabase
    .from('users')
    .select('id, name, profile_image_url, bio, public_url')
    .eq('is_featured', true)
    .order('name', { ascending: true })
    .limit(6)

  return (
    <Container title="Browse Teachers" subtitle="Search for your favourite instructors" maxWidth="4xl">
      <div className="py-4">
        <TeacherSearch />
      </div>
      {featured && featured.length > 0 && (
        <PageSection title="Featured Teachers" spacing="large">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((t) => (
              <TeacherCard key={t.id!} teacher={t} />
            ))}
          </div>
        </PageSection>
      )}
    </Container>
  )
}
