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
import { LogoutButton } from '@/components/auth'
import { NavLink } from '@/components/ui'
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
            <NavLink
              href="/app"
              text="Home"
              avatarSrc="/assets/dummy_logo.png"
              avatarAlt="Logo"
              fallbackIcon={Home}
              avatarSize="sm"
              className="group mr-2"
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <span className="text-xs text-foreground/60 hidden sm:block">
              {userEmail}
            </span>
            
            {/* Profile Link with Avatar */}
            <NavLink
              href="/app/profile"
              text="Profile"
              avatarSrc={profileImage || undefined}
              avatarAlt={userProfile?.name || userEmail}
              fallbackIcon={User}
              avatarSize="sm"
              className="text-xs font-medium px-2 py-1.5 rounded-lg"
            />
            
            <LogoutButton 
              className="h-8 w-8 p-0"
              avatarSize="sm"
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
        <Container>
          <TeacherHero profile={profile} />
        </Container>
      </PageSection>

      {/* Filter & Events Section */}
      <PageSection className="py-8 sm:py-12">
        <Container>
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