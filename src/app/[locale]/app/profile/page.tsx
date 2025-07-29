import { generateProfileMetadata } from '@/lib/i18n/metadata'
import type { Metadata } from 'next'
import ProfileClient from '@/components/dashboard/profile/ProfileClient'
import { createServerClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { getValidLocale } from '@/lib/i18n/config'


interface ProfilePageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const { locale: localeParam } = await params
  const locale = getValidLocale(localeParam)
  return generateProfileMetadata(locale)
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { locale: localeParam } = await params
  const locale = getValidLocale(localeParam)
  
  const supabase = await createServerClient()

  // Get the current user (guaranteed by middleware)
  const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !authUser) {
    // This should rarely happen due to middleware, but kept as failsafe
    const signInPath = locale === 'en' ? '/auth/sign-in' : `/${locale}/auth/sign-in`
    redirect(signInPath)
  }

  // ✨ NEW: Client-side data fetching for better cache integration
  // Just pass the userId - let ProfileClient handle data fetching with TanStack Query
  return <ProfileClient userId={authUser.id} />
} 