import { generateProfileMetadata } from '@/lib/i18n/metadata'
import type { Metadata } from 'next'
import ProfileClient from '@/components/dashboard/profile/ProfileClient'
import { getAuthenticatedUserId } from '@/lib/server-user'
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
  // ✨ Get user ID from middleware headers - no Supabase call needed!
  // Middleware already authenticated the user and cached the ID
  const userId = await getAuthenticatedUserId()

  // ✨ Client-side data fetching for better cache integration
  // Just pass the userId - let ProfileClient handle data fetching with TanStack Query
  return <ProfileClient userId={userId} />
} 