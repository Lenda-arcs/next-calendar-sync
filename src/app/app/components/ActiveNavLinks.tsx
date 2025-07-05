'use client'

import { LoadingNavLink } from '@/components/ui'
import { Calendar, Home, User, Tags, Receipt, Building, LucideIcon } from 'lucide-react'

interface NavigationItem {
  name: string
  href: string
  iconName: string
}

interface ActiveNavLinksProps {
  navigation: NavigationItem[]
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

export function ActiveNavLinks({ navigation }: ActiveNavLinksProps) {
  return (
    <nav className="hidden lg:flex space-x-2">
      {navigation.map((item) => {
        const IconComponent = iconMap[item.iconName]
        
        return (
          <LoadingNavLink
            key={item.name}
            href={item.href}
            text={item.name}
            icon={IconComponent}
            showTextOnMobile={true}
          />
        )
      })}
    </nav>
  )
} 