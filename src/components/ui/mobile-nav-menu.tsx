'use client'

import { LoadingNavLink, Popover, PopoverTrigger, PopoverContent } from '@/components/ui'
import { Menu, Calendar, Home, User, Tags, Receipt, LucideIcon } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'

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
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  // Check if any navigation item is currently active
  const hasActiveItem = navigation.some(item => pathname === item.href)

  useEffect(() => {
    const handleScroll = () => {
      if (isOpen) {
        setIsOpen(false)
      }
    }

    const handleResize = () => {
      if (isOpen) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      window.addEventListener('scroll', handleScroll, { passive: true })
      window.addEventListener('resize', handleResize)
    }

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [isOpen])

  // Close popup when pathname changes (navigation occurs)
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <div className="lg:hidden">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button className={cn(
            "flex items-center px-3 py-2 text-sm font-medium font-sans text-foreground/80 hover:text-foreground hover:bg-white/30 rounded-xl backdrop-blur-sm transition-all duration-300 hover:shadow-lg space-x-2",
            hasActiveItem && "bg-white/60 text-foreground shadow-sm border border-white/60"
          )}>
            <div className="h-6 w-6 bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center">
              <Menu className="h-3 w-3 text-primary" />
            </div>
            <span className="hidden md:inline">Menu</span>
          </button>
        </PopoverTrigger>
        <PopoverContent 
          side="bottom"
          align="start" 
          className="w-48 backdrop-blur-xl bg-white/80 border-white/50 shadow-xl"
        >
          <div className="space-y-1">
            {navigation.map((item) => {
              const IconComponent = iconMap[item.iconName]
              
              return (
                <LoadingNavLink
                  key={item.name}
                  href={item.href}
                  text={item.name}
                  icon={IconComponent}
                  showTextOnMobile={true}
                  className="w-full justify-start px-2 py-1.5 text-sm"
                  activeClassName="bg-white/90 text-foreground font-semibold shadow-md border-l-2 border-l-primary border border-white/80 backdrop-blur-sm"
                />
              )
            })}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
} 