import { Home, Calendar, Tags, Receipt, User, Building, LucideIcon } from 'lucide-react'

export const navIconMap = {
  Home,
  Calendar,
  Tags,
  Receipt,
  User,
  Building
} as const

export type NavIconName = keyof typeof navIconMap

export function getNavIconByName(name: string): LucideIcon | undefined {
  return (navIconMap as Record<string, LucideIcon>)[name]
}


