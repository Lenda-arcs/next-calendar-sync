import { Container } from '@/components/layout/container'
import { ProfileForm } from '@/components/auth'
import { createServerClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { User } from '@/lib/types'

export default async function ProfilePage() {
  const supabase = await createServerClient()

  // Get the current user
  const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !authUser) {
    redirect('/auth/sign-in')
  }

  // Fetch user profile data from the users table
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
      calendar_feed_count: 0
    }
    
    return (
      <div className="p-6">
        <Container>
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4 font-serif">
              Profile Settings
            </h1>
            <p className="text-foreground/70 text-lg">
              Manage your account settings and public profile information.
            </p>
          </div>

          <ProfileForm user={fallbackUser} />
        </Container>
      </div>
    )
  }

  return (
    <div className="p-6">
      <Container>
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 font-serif">
            Profile Settings
          </h1>
          <p className="text-foreground/70 text-lg">
            Manage your account settings and public profile information.
          </p>
        </div>

        <ProfileForm user={userData} />
      </Container>
    </div>
  )
} 