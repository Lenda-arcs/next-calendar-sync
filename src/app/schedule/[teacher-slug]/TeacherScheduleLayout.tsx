'use client'

import { PublicProfile } from '@/lib/types'
import DynamicNavbar from './components/DynamicNavbar'
import { useHeroState } from './hooks/useHeroState'
import { ScreenshotModeProvider } from '@/lib/hooks/useScreenshotMode'
import { FilterProvider } from '@/components/schedule/FilterProvider'

interface TeacherScheduleLayoutProps {
  profile: PublicProfile
  user: { email?: string; id?: string } | null
  children: React.ReactNode
  teacherSlug: string
}

export default function TeacherScheduleLayout({ 
  profile, 
  user,
  children,
  teacherSlug
}: TeacherScheduleLayoutProps) {
  const {
    elementRef,
    isCollapsed,
    isAnimating,
    isExpanding,
    shouldShowJumpingCTA,
    handleToggleHero,
    handleCloseHero
  } = useHeroState()

  return (
    <ScreenshotModeProvider>
      <FilterProvider>
        <div className="min-h-screen">
          {/* Dynamic Navbar with Integrated Hero */}
          <DynamicNavbar 
            userEmail={user?.email || undefined}
            teacherProfile={profile}
            isCollapsed={isCollapsed}
            isAnimating={isAnimating}
            isExpanding={isExpanding}
            shouldShowJumpingCTA={shouldShowJumpingCTA}
            onToggleHero={handleToggleHero}
            onCloseHero={handleCloseHero}
            currentUserId={user?.id}
            teacherSlug={teacherSlug}
          />

          {/* Invisible scroll trigger element */}
          <div ref={elementRef} className="h-1 w-full"></div>

                       {/* Main Content */}
          <main className="flex-1 pt-8 pb-16">
            {children}
          </main>
        </div>
      </FilterProvider>
    </ScreenshotModeProvider>
  )
} 