import { Container } from '@/components/layout/container'
import { createServerClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { ManageTagsClient } from './ManageTagsClient'

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
      <ManageTagsClient userId={user.id} />
    </Container>
  )
} 