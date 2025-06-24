import { createServerClient } from '@/lib/supabase-server'
// import { redirect } from 'next/navigation' // Temporarily disabled for development
import { LogoutButton } from '@/components/auth'
import { NavLink, MobileNavMenu } from '@/components/ui'
import { PATHS } from '@/lib/paths'
import { 
  Calendar, 
  Home, 
  User, 
  Tags, 
  Receipt
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: PATHS.APP.DASHBOARD, icon: Home, iconName: 'Home' },
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

interface AppLayoutProps {
  children: React.ReactNode
}

export default async function AppLayout({ children }: AppLayoutProps) {
  const supabase = await createServerClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Temporarily disable auth check for development
  // if (!user) {
  //   redirect('/auth/sign-in')
  // }

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

  // Mock user for development
  const mockUser = user || { email: 'dev@example.com' }
  const profileImage = userProfile?.profile_image_url

  return (
    <div className="min-h-screen">
      {/* Navigation Header with Glassmorphism */}
      <header className="backdrop-blur-md bg-gradient-to-r from-white/70 via-white/50 to-transparent border-b border-white/40 shadow-xl sticky top-0 z-50">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <NavLink
                href={PATHS.APP.DASHBOARD}
                text="Home"
                avatarSrc="/assets/dummy_logo.png"
                avatarAlt="Logo"
                fallbackIcon={Home}
                className="group"
              />
            </div>

            {/* Navigation */}
            <nav className="hidden lg:flex space-x-2">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  href={item.href}
                  text={item.name}
                  fallbackIcon={item.icon}
                  showTextOnMobile={true}
                />
              ))}
            </nav>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              {/* Mobile Navigation Menu */}
              <MobileNavMenu navigation={mobileNavigation} />

              {/* Desktop User Info */}
              <span className="text-sm font-sans text-foreground/70 hidden sm:block">
                {mockUser.email}
              </span>
              
              {/* Profile Link with Avatar */}
              <NavLink
                href={PATHS.APP.PROFILE}
                text="Profile"
                avatarSrc={profileImage || undefined}
                avatarAlt={userProfile?.name || mockUser.email}
                fallbackIcon={User}
              />
              
              <LogoutButton className="sm:hidden" />
              <LogoutButton className="hidden sm:flex" showTextOnMobile={true} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
} 