'use client'

import { NavLink, Popover, PopoverTrigger, PopoverContent } from '@/components/ui'
import { Menu, Calendar, Home, User, Tags, Receipt, LucideIcon } from 'lucide-react'

interface NavigationItem {
  name: string
  href: string
  iconName: string
}

interface MobileNavMenuProps {
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

export function MobileNavMenu({ navigation }: MobileNavMenuProps) {
  return (
    <div className="lg:hidden">
      <Popover>
        <PopoverTrigger asChild>
          <button className="flex items-center px-3 py-2 text-sm font-medium font-sans text-foreground/80 hover:text-foreground hover:bg-white/30 rounded-xl backdrop-blur-sm transition-all duration-300 hover:shadow-lg space-x-2">
            <div className="h-6 w-6 bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center">
              <Menu className="h-3 w-3 text-primary" />
            </div>
            <span className="hidden md:inline">Menu</span>
          </button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-48">
          <div className="space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                href={item.href}
                text={item.name}
                fallbackIcon={iconMap[item.iconName]}
                showTextOnMobile={true}
                className="w-full justify-start px-2 py-1.5 text-sm"
              />
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
} 