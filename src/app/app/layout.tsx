import { createServerClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { 
  Calendar, 
  Home, 
  User, 
  Tags, 
  Receipt, 
  LogOut,
  Menu
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/app', icon: Home },
  { name: 'Profile', href: '/app/profile', icon: User },
  { name: 'Manage Events', href: '/app/manage-events', icon: Calendar },
  { name: 'Manage Tags', href: '/app/manage-tags', icon: Tags },
  { name: 'Invoices', href: '/app/manage-invoices', icon: Receipt },
]

interface AppLayoutProps {
  children: React.ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {children}
    </div>
  )
} 