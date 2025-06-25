import { TagLibrary } from '@/components/events/TagLibrary'
import { TagRuleManager } from '@/components/events/TagRuleManager'
import { Container } from '@/components/layout/container'
import { createServerClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'

export default async function ManageTagsPage() {
  const supabase = await createServerClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/sign-in')
  }

  return (
    <Container
      title="Tag Management"
      subtitle="Organize your calendar events with smart tagging. Set up automatic rules to tag events based on keywords, and manage your tag library to keep everything organized."
    >
      <div className="space-y-12">
        <TagRuleManager userId={user.id} />
        <TagLibrary userId={user.id} />
      </div>
    </Container>
  )
} 