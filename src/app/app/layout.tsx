import { createServerClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { LogoutButton } from '@/components/auth'
import { MobileNavMenu, CompactLanguageSelector } from '@/components/ui'
import { PATHS } from '@/lib/paths'
import { 
  Calendar, 
  Tags, 
  Receipt,
  Building
} from 'lucide-react'
import { ActiveProfileLink } from './components/ActiveProfileLink'
import { ActiveNavLinks } from './components/ActiveNavLinks'
import { ActiveHomeLink } from './components/ActiveHomeLink'
import { cookies } from 'next/headers'
import { getServerTranslation } from '@/lib/i18n/server'
import { Language, SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '@/lib/i18n/types'

// Helper function to get current language from cookies
async function getCurrentLanguage(): Promise<Language> {
  try {
    const cookieStore = await cookies()
    const languageCookie = cookieStore.get('language')?.value
    
    if (languageCookie && SUPPORTED_LANGUAGES.includes(languageCookie as Language)) {
      return languageCookie as Language
    }
  } catch (error) {
    console.log('Could not access cookies for language detection:', error)
  }
  
  return DEFAULT_LANGUAGE
}

interface AppLayoutProps {
  children: React.ReactNode
}

export default async function AppLayout({ children }: AppLayoutProps) {
  const supabase = await createServerClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/sign-in')
  }

  // Get current language for translations
  const language = await getCurrentLanguage()

  // Get translated navigation labels
  const [
    manageEventsLabel,
    manageTagsLabel,
    invoicesLabel,
    studiosLabel
  ] = await Promise.all([
    getServerTranslation(language, 'common.nav.manageEvents'),
    getServerTranslation(language, 'common.nav.manageTags'),
    getServerTranslation(language, 'common.nav.invoices'),
    getServerTranslation(language, 'common.nav.studios')
  ])

  // Base navigation items available to all users (now with translations)
  const baseNavigation = [
    { name: manageEventsLabel, href: PATHS.APP.MANAGE_EVENTS, icon: Calendar, iconName: 'Calendar' },
    { name: manageTagsLabel, href: PATHS.APP.MANAGE_TAGS, icon: Tags, iconName: 'Tags' },
    { name: invoicesLabel, href: PATHS.APP.MANAGE_INVOICES, icon: Receipt, iconName: 'Receipt' },
  ]

  // Admin-only navigation items (now with translations)
  const adminNavigation = [
    { name: studiosLabel, href: PATHS.APP.STUDIOS, icon: Building, iconName: 'Building' },
  ]

  // Get user role from the database
  const { data: userData } = await supabase
    .from('users')
    .select('role, profile_image_url')
    .eq('id', user.id)
    .single()

  const userRole = userData?.role || 'user'
  const profileImage = userData?.profile_image_url

  // Create navigation based on user role
  const navigation = userRole === 'admin' || userRole === 'moderator' 
    ? [...baseNavigation, ...adminNavigation]
    : baseNavigation

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

  // Get user profile for additional context
  const { data: userProfile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

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

              {/* Language Selector */}
              <CompactLanguageSelector />

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