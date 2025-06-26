'use client'

import { PublicProfile } from '@/lib/types'
import DynamicNavbar from './components/DynamicNavbar'
import { useHeroState } from './hooks/useHeroState'
import { ScreenshotModeProvider } from '@/lib/hooks/useScreenshotMode'

interface TeacherScheduleLayoutProps {
  profile: PublicProfile
  user: { email?: string } | null
  children: React.ReactNode
}

export default function TeacherScheduleLayout({ 
  profile, 
  user,
  children
}: TeacherScheduleLayoutProps) {
  const {
    elementRef,
    isCollapsed,
    isAnimating,
    isExpanding,
    handleToggleHero,
    handleCloseHero
  } = useHeroState()

  return (
    <ScreenshotModeProvider>
      <div className="min-h-screen">
        {/* Dynamic Navbar with Integrated Hero */}
        <DynamicNavbar 
          userEmail={user?.email || undefined}
          teacherProfile={profile}
          isCollapsed={isCollapsed}
          isAnimating={isAnimating}
          isExpanding={isExpanding}
          onToggleHero={handleToggleHero}
          onCloseHero={handleCloseHero}
        />

        {/* Invisible scroll trigger element */}
        <div ref={elementRef} className="h-1 w-full"></div>

                     {/* Main Content */}
        <main className="flex-1 pt-8 pb-16">
          {children}
        </main>
      </div>
    </ScreenshotModeProvider>
  )
} 