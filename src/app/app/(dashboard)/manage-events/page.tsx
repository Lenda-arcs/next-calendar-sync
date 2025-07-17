import { generateManageEventsMetadata } from '@/lib/i18n/metadata'
import type { Metadata } from 'next'
import { ManageEventsClient } from './ManageEventsClient'
import { createServerClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'

export async function generateMetadata(): Promise<Metadata> {
  return generateManageEventsMetadata()
}

export default async function ManageEventsPage() {
  const supabase = await createServerClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/sign-in')
  }

  return <ManageEventsClient userId={user.id} />
} 