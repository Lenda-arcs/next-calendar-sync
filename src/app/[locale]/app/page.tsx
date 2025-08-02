import DashboardClient from '@/components/dashboard/DashboardClient'
import { generateDashboardMetadata } from '@/lib/i18n/metadata'
import { getValidLocale } from '@/lib/i18n/config'
import { getAuthenticatedUserId } from '@/lib/server-user'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: localeParam } = await params
  const locale = getValidLocale(localeParam)
  
  return generateDashboardMetadata(locale)
}

export default async function LocalizedDashboardPage() {
  // ✨ Get user ID from middleware headers - no Supabase call needed!
  // Middleware already authenticated the user and cached the ID
  const userId = await getAuthenticatedUserId()

  // ✨ Client-side data fetching for better cache integration
  // DashboardClient will handle all data fetching with TanStack Query
  return <DashboardClient userId={userId} />
} 