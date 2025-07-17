import { createServerClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { User } from '@/lib/types'
import ProfileContent from './ProfileContent'
import { generateProfileMetadata } from '@/lib/i18n/metadata'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  return generateProfileMetadata()
}

export default async function ProfilePage() {
  const supabase = await createServerClient()

  // Get the current user
  const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !authUser) {
    redirect('/auth/sign-in')
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
    const fallbackUser: User = {
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
      role: 'user',
      calendar_feed_count: 0,
      is_featured: null,
      created_at: null
    }
    
    return <ProfileContent user={fallbackUser} />
  }

  return <ProfileContent user={userData} />
} 