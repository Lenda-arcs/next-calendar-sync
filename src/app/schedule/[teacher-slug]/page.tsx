import { notFound } from 'next/navigation'
import { createServerClient } from '@/lib/supabase-server'
import { Container } from '@/components/layout/container'
import { PageSection } from '@/components/layout/page-section'
import { TeacherHero } from '@/components/events'
import { 
  FilterProvider, 
  ScheduleFilters, 
  FilteredEventList, 
  ScheduleHeader 
} from '@/components/schedule'
import Link from 'next/link'
import Image from 'next/image'
import { LogoutButton } from '@/components/auth'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Home, User } from 'lucide-react'
import { User as UserType } from '@/lib/types'

interface PageProps {
  params: Promise<{
    'teacher-slug': string
  }>
}

// Minimal navbar component for authenticated users
function MinimalNavbar({ 
  userEmail, 
  userProfile 
}: { 
  userEmail: string
  userProfile: UserType | null
}) {
  const profileImage = userProfile?.profile_image_url

  return (
    <header className="backdrop-blur-md bg-gradient-to-r from-white/80 via-white/60 to-transparent border-b border-white/40 shadow-sm sticky top-0 z-50">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-12">
          <div className="flex items-center space-x-4">
            <Link href="/app" className="flex items-center group mr-2">
              <Image 
                src="/assets/dummy_logo.png" 
                alt="SyncIt Logo" 
                width={20} 
                height={20} 
                className="transition-transform group-hover:scale-110"
              />
              <span className="ml-2 text-sm font-bold font-serif text-foreground tracking-tight bg-gradient-to-r from-[#9C5DA3] via-[#765388] via-[#AF7D8A] to-[#4B3C4F] bg-clip-text text-transparent">
                SyncIt
              </span>
            </Link>
            <Link 
              href="/app" 
              className="flex items-center px-3 py-1.5 text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-white/40 rounded-lg transition-all duration-200"
            >
              <Home className="h-4 w-4 mr-2" />
              Dashboard
            </Link>
          </div>
          
          <div className="flex items-center space-x-3">
            <span className="text-xs text-foreground/60 hidden sm:block">
              {userEmail}
            </span>
            
            {/* Profile Link with Avatar */}
            <Link
              href="/app/profile"
              className="flex items-center px-2 py-1.5 text-xs font-medium text-foreground/80 hover:text-foreground hover:bg-white/40 rounded-lg transition-all duration-200 space-x-2"
            >
              <Avatar className="h-5 w-5">
                <AvatarImage 
                  src={profileImage || undefined} 
                  alt={userProfile?.name || userEmail} 
                />
                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur-sm border border-white/30 text-xs">
                  <User className="h-2.5 w-2.5 text-primary" />
                </AvatarFallback>
              </Avatar>
              <span className="hidden sm:inline">Profile</span>
            </Link>
            
            <LogoutButton 
              variant="ghost" 
              size="sm" 
              showText={false}
              className="h-8 w-8 p-0"
            />
          </div>
        </div>
      </div>
    </header>
  )
}

export default async function PublicSchedulePage({ params }: PageProps) {
  // Resolve params
  const resolvedParams = await params
  const teacherSlug = resolvedParams['teacher-slug']

  // Create supabase client
  const supabase = await createServerClient()

  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch user profile from database if authenticated
  let userProfile = null
  if (user) {
    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()
    userProfile = profile
  }

  // Fetch profile data (server-side)
  const { data: profile, error: profileError } = await supabase
    .from('public_profiles')
    .select('*')
    .eq('public_url', teacherSlug)
    .single()

  if (profileError || !profile) {
    notFound()
  }

  return (
    <div className="min-h-screen">
      {/* Show minimal navbar if user is logged in */}
      {user && <MinimalNavbar userEmail={user.email || ''} userProfile={userProfile} />}

      {/* Teacher Hero Section */}
      <PageSection className="py-8 sm:py-12">
        <Container maxWidth="4xl">
          <TeacherHero profile={profile} />
        </Container>
      </PageSection>

      {/* Filter & Events Section */}
      <PageSection className="py-8 sm:py-12">
        <Container maxWidth="4xl">
          <FilterProvider>
            <div className="space-y-6">
              {/* Header with Filter Statistics */}
              <ScheduleHeader />
              
              {/* Filter Components */}
              <ScheduleFilters />

              {/* Filtered Events List */}
              <FilteredEventList
                userId={profile.id || ''}
                variant={profile.event_display_variant || 'compact'}
                className="filtered-events"
              />
            </div>
          </FilterProvider>
        </Container>
      </PageSection>
    </div>
  )
} 