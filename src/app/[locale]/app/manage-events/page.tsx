import { generateManageEventsMetadata } from '@/lib/i18n/metadata'
import type { Metadata } from 'next'
import { ManageEventsClient } from '../../../app/(dashboard)/manage-events/ManageEventsClient'
import { createServerClient } from '@/lib/supabase-server'
import { getValidLocale } from '@/lib/i18n/config'

interface ManageEventsPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: ManageEventsPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params
  const locale = getValidLocale(localeParam)
  return generateManageEventsMetadata(locale)
}

export default async function ManageEventsPage({ params }: ManageEventsPageProps) {
  const { locale: localeParam } = await params
  getValidLocale(localeParam) // Validate locale
  
  const supabase = await createServerClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  // Note: Auth is handled by middleware, user should exist
  return <ManageEventsClient userId={user!.id} />
} 