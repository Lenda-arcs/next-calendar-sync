import { Container } from '@/components/layout/container'
import { ProfileForm } from '@/components/auth'
import { createServerClient } from '@/lib/supabase-server'
import { PATHS } from '@/lib/paths'
import { redirect } from 'next/navigation'
import { User } from '@/lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Shield, Eye, UserCog } from 'lucide-react'

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
    
    return (
      <Container
        title="Profile Settings"
        subtitle="Manage your account settings and public profile information."
      >
        <div className="space-y-8">
          <ProfileForm user={fallbackUser} />
          
          {/* Account Settings */}
          <Card variant="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-serif">
                <UserCog className="h-5 w-5" />
                Account Settings
              </CardTitle>
              <CardDescription>
                Manage your account preferences and security settings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" asChild>
                  <Link href={PATHS.APP.DASHBOARD}>
                    <Eye className="mr-2 h-4 w-4" />
                    View Dashboard
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href={PATHS.AUTH.SIGNOUT}>
                    <Shield className="mr-2 h-4 w-4" />
                    Sign Out
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>
    )
  }

  return (
    <Container
      title="Profile Settings"
      subtitle="Manage your account settings and public profile information."
    >
      <div className="space-y-8">
        <ProfileForm user={userData} />
        
        {/* Account Settings */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-serif">
              <UserCog className="h-5 w-5" />
              Account Settings
            </CardTitle>
            <CardDescription>
              Manage your account preferences and security settings.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="outline" asChild>
                <Link href={PATHS.APP.DASHBOARD}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Dashboard
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href={PATHS.AUTH.SIGNOUT}>
                  <Shield className="mr-2 h-4 w-4" />
                  Sign Out
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  )
} 