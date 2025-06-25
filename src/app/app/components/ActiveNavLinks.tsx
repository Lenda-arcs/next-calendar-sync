'use client'

import { NavLink } from '@/components/ui'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Calendar, Home, User, Tags, Receipt, LucideIcon } from 'lucide-react'

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
  User
}

export function ActiveNavLinks({ navigation }: ActiveNavLinksProps) {
  const pathname = usePathname()

  return (
    <nav className="hidden lg:flex space-x-2">
      {navigation.map((item) => {
        const isActive = pathname === item.href
        return (
          <NavLink
            key={item.name}
            href={item.href}
            text={item.name}
            fallbackIcon={iconMap[item.iconName]}
            showTextOnMobile={true}
            className={cn(
              isActive && "bg-white/60 text-foreground shadow-sm border border-white/60"
            )}
          />
        )
      })}
    </nav>
  )
} 