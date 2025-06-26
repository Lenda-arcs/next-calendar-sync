'use client'

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
import { PublicProfile } from '@/lib/types'
import { useScrollIntoView, useIsMobile } from '@/lib/hooks'
import { useState } from 'react'

// Enhanced navbar component for both authenticated and non-authenticated users
function EnhancedNavbar({ 
  userEmail, 
  teacherProfile,
  isHeroInView,
  onTeacherAvatarClick
}: { 
  userEmail?: string
  teacherProfile: PublicProfile
  isHeroInView: boolean
  onTeacherAvatarClick: () => void
}) {
  const isLoggedIn = !!userEmail

  return (
    <header className="backdrop-blur-md bg-gradient-to-r from-white/80 via-white/60 to-transparent border-b border-white/40 shadow-sm sticky top-0 z-50">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          <div className="flex items-center space-x-4">
            <NavLink
              href={isLoggedIn ? "/app" : "/"}
              text="Home"
              avatarSrc="/assets/dummy_logo.png"
              avatarAlt="Logo"
              fallbackIcon={Home}
              avatarSize="sm"
              className="group mr-2"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Teacher Avatar - shows when hero is not in view */}
            {!isHeroInView && (
              <NavLink
                text={teacherProfile?.name || 'Teacher'}
                avatarSrc={teacherProfile?.profile_image_url || undefined}
                avatarAlt={teacherProfile?.name || 'Teacher'}
                fallbackIcon={User}
                avatarSize="sm"
                onClick={onTeacherAvatarClick}
                className="text-xs font-medium px-2 py-1.5 rounded-lg animate-in fade-in slide-in-from-right-2 duration-300"
              />
            )}

            {/* Logged in user elements */}
            {isLoggedIn && (
              <>
                <span className="text-xs text-foreground/60 hidden sm:block">
                  {userEmail}
                </span>
                
                <LogoutButton 
                  className="h-10 px-3 py-2 text-sm font-medium min-w-[80px]"
                  avatarSize="sm"
                />
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

// Client component wrapper for the page content
export default function TeacherScheduleClient({ 
  profile, 
  user
}: {
  profile: PublicProfile
  user: { email?: string } | null
}) {
  const { elementRef, isInView: isHeroInView, scrollToTop } = useScrollIntoView({
    threshold: 0.1,
    rootMargin: '-100px 0px 0px 0px' // Trigger when hero is 100px out of view
  })
  const isMobile = useIsMobile()
  const [forceHeroExpanded, setForceHeroExpanded] = useState(false)

  const handleTeacherAvatarClick = () => {
    // Scroll to top and expand hero on mobile
    scrollToTop()
    if (isMobile) {
      // Force expand the hero on mobile when avatar is clicked
      setForceHeroExpanded(true)
      // Reset after a short delay to allow the effect to trigger
      setTimeout(() => setForceHeroExpanded(false), 100)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Always show navbar */}
      <EnhancedNavbar 
        userEmail={user?.email || undefined}
        teacherProfile={profile}
        isHeroInView={isHeroInView}
        onTeacherAvatarClick={handleTeacherAvatarClick}
      />

      {/* Teacher Hero Section with ref */}
      <div ref={elementRef}>
        <PageSection className="py-8 sm:py-12">
          <Container>
            <TeacherHero profile={profile} forceExpanded={forceHeroExpanded} />
          </Container>
        </PageSection>
      </div>

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