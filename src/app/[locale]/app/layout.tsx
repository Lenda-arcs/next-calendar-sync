import { createServerClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { LogoutButton } from '@/components/auth'
import { MobileNavMenu, CompactLanguageSelector } from '@/components/ui'
import { PATHS, getLocalizedPath } from '@/lib/paths'
import { 
  Calendar, 
  Tags, 
  Receipt,
  Building,
  Shield
} from 'lucide-react'
import { ActiveProfileLink } from '@/components/navigation/ActiveProfileLink'
import { ActiveNavLinks } from '@/components/navigation/ActiveNavLinks'
import { ActiveHomeLink } from '@/components/navigation/ActiveHomeLink'
import { getValidLocale, getTranslations, createTranslator } from '@/lib/i18n/config'

interface AppLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function LocalizedAppLayout({ children, params }: AppLayoutProps) {
  const { locale: localeParam } = await params
  const locale = getValidLocale(localeParam)
  
  // Load translations server-side
  const translations = await getTranslations(locale)
  const t = createTranslator(translations)
  
  const supabase = await createServerClient()

  const { data: { user } } = await supabase.auth.getUser()

  // Note: Auth is handled by middleware, so user should always exist here
  if (!user) {
    // This should rarely happen due to middleware, but kept as failsafe
    const signInPath = locale === 'en' ? '/auth/sign-in' : `/${locale}/auth/sign-in`
    redirect(signInPath)
  }

  // Use the centralized getLocalizedPath function

  // Get translated navigation labels
  const manageEventsLabel = t('common.nav.manageEvents')
  const manageTagsLabel = t('common.nav.manageTags')
  const invoicesLabel = t('common.nav.invoices')
  const studiosLabel = t('common.nav.studios')

  // Base navigation items available to all users (now with localized paths)
  const baseNavigation = [
    { name: manageEventsLabel, href: getLocalizedPath(PATHS.APP.MANAGE_EVENTS, locale), icon: Calendar, iconName: 'Calendar' },
    { name: manageTagsLabel, href: getLocalizedPath(PATHS.APP.MANAGE_TAGS, locale), icon: Tags, iconName: 'Tags' },
    { name: invoicesLabel, href: getLocalizedPath(PATHS.APP.MANAGE_INVOICES, locale), icon: Receipt, iconName: 'Receipt' },
  ]

  // Admin-only navigation items (now with localized paths)
  const adminNavigation = [
    { name: studiosLabel, href: getLocalizedPath(PATHS.APP.STUDIOS, locale), icon: Building, iconName: 'Building' },
    { name: 'Admin Dashboard', href: getLocalizedPath(PATHS.APP.ADMIN, locale), icon: Shield, iconName: 'Shield' },
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
            <ActiveNavLinks navigation={desktopNavigation} userId={user.id} />

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