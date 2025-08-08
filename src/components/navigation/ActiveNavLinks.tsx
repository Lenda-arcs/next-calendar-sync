'use client'

import { LoadingNavLink } from '@/components/ui'
import { LucideIcon } from 'lucide-react'
import { useNavPreloadMap } from '@/lib/hooks/useNavPreloadMap'
import { navIconMap } from './navIcons'

interface NavigationItem {
  name: string
  href: string
  iconName: string
}

interface ActiveNavLinksProps {
  navigation: NavigationItem[]
  userId?: string // ✨ Added for smart preloading
}

// Shared icon map
const iconMap: Record<string, LucideIcon> = navIconMap as Record<string, LucideIcon>

export function ActiveNavLinks({ navigation, userId }: ActiveNavLinksProps) {
  // ✨ Smart preloading for instant navigation
  const { getPreloadFunction } = useNavPreloadMap(userId)

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