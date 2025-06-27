import { createServerClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { LogoutButton } from '@/components/auth'
import { MobileNavMenu } from '@/components/ui'
import { PATHS } from '@/lib/paths'
import { 
  Calendar, 
  Tags, 
  Receipt
} from 'lucide-react'
import { ActiveProfileLink } from './components/ActiveProfileLink'
import { ActiveNavLinks } from './components/ActiveNavLinks'
import { ActiveHomeLink } from './components/ActiveHomeLink'

const navigation = [
  // { name: 'Dashboard', href: PATHS.APP.DASHBOARD, icon: Home, iconName: 'Home' },
  { name: 'Manage Events', href: PATHS.APP.MANAGE_EVENTS, icon: Calendar, iconName: 'Calendar' },
  { name: 'Manage Tags', href: PATHS.APP.MANAGE_TAGS, icon: Tags, iconName: 'Tags' },
  { name: 'Invoices', href: PATHS.APP.MANAGE_INVOICES, icon: Receipt, iconName: 'Receipt' },
]

// For mobile navigation (only icon names)
const mobileNavigation = navigation.map(({ name, href, iconName }) => ({
  name,
  href,
  iconName
}))

// For desktop navigation (only icon names to avoid serialization issues)
const desktopNavigation = navigation.map(({ name, href, iconName }) => ({
  name,
  href,
  iconName
}))

interface AppLayoutProps {
  children: React.ReactNode
}

export default async function AppLayout({ children }: AppLayoutProps) {
  const supabase = await createServerClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Redirect to sign-in if no user is found
  if (!user) {
    redirect('/auth/sign-in')
  }

  // Fetch user profile from database
  let userProfile = null
  if (user) {
    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()
    userProfile = profile
  }

  // User is guaranteed to exist at this point due to auth check above
  const profileImage = userProfile?.profile_image_url

  return (
    <div className="min-h-screen">
      {/* Navigation Header with Glassmorphism */}
      <header className="backdrop-blur-md bg-gradient-to-r from-white/70 via-white/50 to-transparent border-b border-white/40 shadow-xl sticky top-0 z-50">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <ActiveHomeLink />
            </div>

            {/* Navigation */}
            <ActiveNavLinks navigation={desktopNavigation} />

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              {/* Mobile Navigation Menu */}
              <MobileNavMenu navigation={mobileNavigation} />

              {/* Desktop User Info */}
              <span className="text-sm font-sans text-foreground/70 hidden sm:block">
                {user.email}
              </span>
              
              {/* Profile Link with Avatar */}
              <ActiveProfileLink 
                profileImage={profileImage}
                userProfile={userProfile}
                user={user}
              />
              
              <LogoutButton className="sm:hidden" />
              <LogoutButton className="hidden sm:flex" showTextOnMobile={true} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-8 pb-16">
        {children}
      </main>
    </div>
  )
} 