import { createServerClient } from '@/lib/supabase-server'
// import { redirect } from 'next/navigation' // Temporarily disabled for development
import Link from 'next/link'
import Image from 'next/image'
import { LogoutButton } from '@/components/auth'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { 
  Calendar, 
  Home, 
  User, 
  Tags, 
  Receipt
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/app', icon: Home },
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

  // Temporarily disable auth check for development
  // if (!user) {
  //   redirect('/auth/sign-in')
  // }

  // Fetch user profile from database
  let userProfile = null
  if (user) {
    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()
    userProfile = profile
  }

  // Mock user for development
  const mockUser = user || { email: 'dev@example.com' }
  const profileImage = userProfile?.profile_image_url

  return (
    <div className="min-h-screen">
      {/* Navigation Header with Glassmorphism */}
      <header className="backdrop-blur-md bg-gradient-to-r from-white/70 via-white/50 to-transparent border-b border-white/40 shadow-xl sticky top-0 z-50">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/app" className="flex items-center group">
                <Image 
                  src="/assets/dummy_logo.png" 
                  alt="SyncIt Logo" 
                  width={32} 
                  height={32} 
                  className="transition-transform group-hover:scale-110"
                />
                <span className="ml-3 text-2xl font-bold font-serif text-foreground tracking-tight bg-gradient-to-r from-[#9C5DA3] via-[#765388] via-[#AF7D8A] to-[#4B3C4F] bg-clip-text text-transparent hover:from-[#4B3C4F] hover:via-[#AF7D8A] hover:via-[#765388] hover:to-[#9C5DA3] transition-all duration-300">
                  SyncIt
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
              {/* User Info */}
              <span className="text-sm font-sans text-foreground/70 hidden sm:block">
                {mockUser.email}
              </span>
              
              {/* Profile Link with Avatar */}
              <Link
                href="/app/profile"
                className="flex items-center px-3 py-2 text-sm font-medium font-sans text-foreground/80 hover:text-foreground hover:bg-white/30 rounded-xl backdrop-blur-sm transition-all duration-300 hover:shadow-lg space-x-2"
              >
                <Avatar className="h-6 w-6">
                  <AvatarImage 
                    src={profileImage || undefined} 
                    alt={userProfile?.name || mockUser.email} 
                  />
                  <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur-sm border border-white/30 text-xs">
                    <User className="h-3 w-3 text-primary" />
                  </AvatarFallback>
                </Avatar>
                <span className="hidden md:inline">Profile</span>
              </Link>
              
              <LogoutButton showText={false} className="sm:hidden" />
              <LogoutButton className="hidden sm:flex" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
} 