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

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const supabase = await createServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/app/sign-in')
  }

  // Get user profile
  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('id', session.user.id)
    .single()

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Glassmorphic Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col p-4">
        <div className="flex flex-col flex-grow backdrop-blur-md bg-white/50 border border-white/40 shadow-xl rounded-2xl overflow-hidden">
          {/* Logo Section */}
          <div className="flex items-center flex-shrink-0 px-6 py-6 border-b border-white/30">
            <Calendar className="h-8 w-8 text-primary mr-3" />
            <h1 className="text-xl font-bold font-serif text-foreground tracking-tight">
              Calendar Sync
            </h1>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'group flex items-center px-4 py-3 text-sm font-medium font-sans rounded-xl transition-all duration-300',
                    'text-foreground/80 hover:text-foreground hover:bg-white/40 hover:shadow-lg hover:backdrop-blur-lg'
                  )}
                >
                  <Icon className="mr-3 h-5 w-5 flex-shrink-0 transition-transform group-hover:scale-110" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
          
          {/* User Profile Section */}
          <div className="flex-shrink-0 p-4 border-t border-white/30">
            <div className="flex items-center p-3 rounded-xl backdrop-blur-sm bg-white/30">
              <div className="flex-shrink-0">
                {user?.profile_image_url ? (
                  <img
                    className="h-10 w-10 rounded-full ring-2 ring-white/40"
                    src={user.profile_image_url}
                    alt={user.name || 'User'}
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                )}
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium font-sans text-foreground">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs font-sans text-foreground/60">
                  {user?.email || session.user.email}
                </p>
              </div>
            </div>
            
            <form action="/api/auth/signout" method="post" className="mt-3">
              <Button type="submit" variant="glass" size="sm" className="w-full justify-start">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Mobile header with glassmorphism */}
        <div className="md:hidden">
          <div className="flex items-center justify-between backdrop-blur-md bg-white/60 border-b border-white/40 shadow-lg px-4 py-3">
            <div className="flex items-center">
              <Calendar className="h-6 w-6 text-primary mr-2" />
              <h1 className="text-lg font-semibold font-serif text-foreground tracking-tight">
                Calendar Sync
              </h1>
            </div>
            <Button variant="glass" size="sm">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
} 