import { generateProfileMetadata } from '@/lib/i18n/metadata'
import type { Metadata } from 'next'
import ProfileClient from '@/components/dashboard/profile/ProfileClient'
import { createServerClient } from '@/lib/supabase-server'
import { getValidLocale } from '@/lib/i18n/config'


interface ProfilePageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const { locale: localeParam } = await params
  const locale = getValidLocale(localeParam)
  return generateProfileMetadata(locale)
}

export default async function ProfilePage() {
  const supabase = await createServerClient()

  // ✨ Middleware already handles auth protection for /app routes
  // Just get the user ID - no need for redundant auth checks
  const { data: { user: authUser } } = await supabase.auth.getUser()

  // ✨ Client-side data fetching for better cache integration
  // Just pass the userId - let ProfileClient handle data fetching with TanStack Query
  return <ProfileClient userId={authUser!.id} />
} 