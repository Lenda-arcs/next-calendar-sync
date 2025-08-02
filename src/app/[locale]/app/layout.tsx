import { createServerClient } from '@/lib/supabase-server'
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
import { ThemeProvider } from '@/components/providers'
import { themeUtils } from '@/lib/design-system'

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

  // ✨ Middleware already handles auth protection for /app routes
  // Just get the user ID - no need for redundant auth checks
  const { data: { user } } = await supabase.auth.getUser()
  
  // TypeScript assertion: middleware guarantees user exists for /app routes
  if (!user) throw new Error('User should exist - middleware handles auth')

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

  // ✨ Single user profile fetch - get all needed data at once
  const { data: userProfile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  const userRole = userProfile?.role || 'user'
  const profileImage = userProfile?.profile_image_url

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

  // Generate server-side theme CSS to prevent flicker
  const themeVariant = (userProfile?.theme_variant as 'default' | 'ocean' | 'sunset') || 'default'
  const serverThemeCSS = themeVariant !== 'default' ? themeUtils.generateThemeCSS(themeVariant) : null

  return (
    <>
      {/* Inject server-side theme CSS to prevent flicker */}
      {serverThemeCSS && (
        <style dangerouslySetInnerHTML={{ __html: serverThemeCSS }} />
      )}
      <ThemeProvider defaultVariant={themeVariant}>
      <div className="min-h-screen">
        {/* Navigation Header with Glassmorphism */}
        <header className="backdrop-blur-md bg-gradient-to-r from-white/70 via-white/50 to-transparent border-b border-white/40 shadow-xl sticky top-0 z-50">
          <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <div className="flex items-center">
                <ActiveHomeLink userId={user.id} />
              </div>

              {/* Navigation */}
              <ActiveNavLinks navigation={desktopNavigation} userId={user.id} />

              {/* User Menu */}
              <div className="flex items-center space-x-4">
                {/* Mobile Navigation Menu */}
                <MobileNavMenu navigation={mobileNavigation} />

                {/* Language Selector */}
                <CompactLanguageSelector />


                
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
    </ThemeProvider>
    </>
  )
} 