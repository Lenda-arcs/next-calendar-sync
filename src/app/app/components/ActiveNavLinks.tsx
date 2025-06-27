'use client'

import { NavLink } from '@/components/ui'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useNavLoading } from '@/lib/hooks'
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
  const { setLoading, getLoadingProps } = useNavLoading('progress') // Using subtle progress cursor

  return (
    <nav className="hidden lg:flex space-x-2">
      {navigation.map((item) => {
        const isActive = pathname === item.href
        const IconComponent = iconMap[item.iconName]
        const loadingProps = getLoadingProps(item.href, IconComponent)
        
        return (
          <div key={item.name} onClick={() => setLoading(item.href)}>
            <NavLink
              href={item.href}
              text={item.name}
              fallbackIcon={loadingProps.icon}
              showTextOnMobile={true}
              animateIcon={loadingProps.animateIcon}
              className={cn(
                "transition-all duration-200",
                isActive && "bg-white/60 text-foreground shadow-sm border border-white/60",
                loadingProps.className
              )}
            />
          </div>
        )
      })}
    </nav>
  )
} 