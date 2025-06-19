import { createServerClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { LogoutButton } from '@/components/auth'
import { 
  Calendar, 
  Home, 
  User, 
  Tags, 
  Receipt
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

export default async function AppLayout({ children }: AppLayoutProps) {
  const supabase = await createServerClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/sign-in')
  }

  return (
    <div className="min-h-screen">
      {/* Navigation Header with Glassmorphism */}
      <header className="backdrop-blur-md bg-white/60 border-b border-white/40 shadow-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/app" className="flex items-center group">
                <Calendar className="h-8 w-8 text-primary transition-transform group-hover:scale-110" />
                <span className="ml-2 text-xl font-bold font-serif text-foreground tracking-tight">
                  Calendar Sync
                </span>
              </Link>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center px-4 py-2 text-sm font-medium font-sans text-foreground/80 hover:text-foreground hover:bg-white/30 rounded-xl backdrop-blur-sm transition-all duration-300 hover:shadow-lg"
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <span className="text-sm font-sans text-foreground/70 hidden sm:block">
                {user.email}
              </span>
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
} 