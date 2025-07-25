import { generateProfileMetadata } from '@/lib/i18n/metadata'
import type { Metadata } from 'next'
import ProfileContent from '../../../app/(dashboard)/profile/ProfileContent'
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

  // Fetch user profile data
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('id', authUser.id)
    .single()

  if (userError || !userData) {
    console.error('Error fetching user data:', userError)
    // Fallback to auth user data if profile doesn't exist yet
    const fallbackUser = {
      id: authUser.id,
      email: authUser.email || '',
      name: null,
      bio: null,
      profile_image_url: null,
      public_url: null,
      timezone: null,
      instagram_url: null,
      website_url: null,
      yoga_styles: null,
      event_display_variant: null,
      role: 'user' as const,
      calendar_feed_count: 0,
      is_featured: null,
      created_at: null
    }
    
    return <ProfileContent user={fallbackUser} />
  }

  return <ProfileContent user={userData} />
} 