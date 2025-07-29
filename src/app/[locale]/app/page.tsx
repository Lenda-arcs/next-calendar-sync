import { createServerClient } from '@/lib/supabase-server'
import DashboardClient from '@/components/dashboard/DashboardClient'
import { generateDashboardMetadata } from '@/lib/i18n/metadata'
import { getValidLocale } from '@/lib/i18n/config'
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
  const supabase = await createServerClient()

  // ✨ Middleware already handles auth protection for /app routes
  // Just get the user ID - no need for redundant auth checks or server-side data fetching
  const { data: { user: authUser } } = await supabase.auth.getUser()

  // ✨ Client-side data fetching for better cache integration
  // DashboardClient will handle all data fetching with TanStack Query
  return <DashboardClient userId={authUser!.id} />
} 