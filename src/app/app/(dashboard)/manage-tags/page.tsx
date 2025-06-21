import { TagLibrary } from '@/components/events/TagLibrary'
import { TagRuleManager } from '@/components/events/TagRuleManager'
import { Container } from '@/components/layout/container'
import { PageSection } from '@/components/layout/page-section'
import { createServerClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'

export default async function ManageTagsPage() {
  const supabase = await createServerClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/sign-in')
  }

  return (
    <Container maxWidth="4xl">
      <PageSection
        title="Tag Rules"
        subtitle="Automatically tag your calendar events using keywords"
        spacing="large"
      >
        <TagRuleManager userId={user.id} />
      </PageSection>

      <PageSection
        title="Tag Library"
        subtitle="Manage your tags and see how they look on events"
        spacing="large"
      >
        <TagLibrary userId={user.id} />
      </PageSection>
    </Container>
  )
} 