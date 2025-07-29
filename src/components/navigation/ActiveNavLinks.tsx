'use client'

import { LoadingNavLink } from '@/components/ui'
import { Calendar, Home, User, Tags, Receipt, Building, LucideIcon } from 'lucide-react'
import { useSmartPreload } from '@/lib/hooks/useSmartPreload'

interface NavigationItem {
  name: string
  href: string
  iconName: string
}

interface ActiveNavLinksProps {
  navigation: NavigationItem[]
  userId?: string // ✨ Added for smart preloading
}

// Icon mapping to resolve serialization issue
const iconMap: Record<string, LucideIcon> = {
  Home,
  Calendar,
  Tags,
  Receipt,
  User,
  Building
}

export function ActiveNavLinks({ navigation, userId }: ActiveNavLinksProps) {
  // ✨ Smart preloading for instant navigation
  const {
    preloadUserEvents,
    preloadInvoices,
    preloadUserTags,
    preloadDashboard,
    preloadProfile
  } = useSmartPreload()

  // Map navigation paths to preload functions
  const getPreloadFunction = (href: string) => {
    if (!userId) return undefined
    
    if (href.includes('manage-events')) {
      return () => preloadUserEvents(userId)
    }
    if (href.includes('manage-tags')) {
      return () => preloadUserTags(userId)
    }
    if (href.includes('manage-invoices')) {
      return () => preloadInvoices(userId)
    }
    if (href.includes('/app') && !href.includes('manage-') && !href.includes('admin') && !href.includes('profile') && !href.includes('studios')) {
      // Dashboard home page (/app)
      return () => preloadDashboard(userId)
    }
    if (href.includes('profile')) {
      return () => preloadProfile(userId)
    }
    // Note: No preload for admin - it's not in useSmartPreload
    // Note: Studios page doesn't need preloading for now
    return undefined
  }

  return (
    <nav className="hidden lg:flex space-x-2">
      {navigation.map((item) => {
        const IconComponent = iconMap[item.iconName]
        const preloadFn = getPreloadFunction(item.href)
        
        return (
          <div
            key={item.name}
            onMouseEnter={preloadFn}
            onFocus={preloadFn}
          >
            <LoadingNavLink
              href={item.href}
              text={item.name}
              icon={IconComponent}
              showTextOnMobile={true}
            />
          </div>
        )
      })}
    </nav>
  )
} 