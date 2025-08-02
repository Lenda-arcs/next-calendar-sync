import { generateManageEventsMetadata } from '@/lib/i18n/metadata'
import type { Metadata } from 'next'
import { ManageEventsClient } from '@/components/dashboard/manage-events/ManageEventsClient'
import { getAuthenticatedUserId } from '@/lib/server-user'
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
  
  // ✨ Get user ID from middleware headers - no Supabase call needed!
  const userId = await getAuthenticatedUserId()
  
  // Note: Auth is handled by middleware, user should exist
  return <ManageEventsClient userId={userId} />
} 