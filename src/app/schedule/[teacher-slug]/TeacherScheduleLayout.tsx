'use client'

import { PublicProfile } from '@/lib/types'
import DynamicNavbar from './components/DynamicNavbar'
import { useHeroState } from './hooks/useHeroState'

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
    handleToggleHero,
    handleCloseHero
  } = useHeroState()

  return (
    <div className="min-h-screen">
      {/* Dynamic Navbar with Integrated Hero */}
      <DynamicNavbar 
        userEmail={user?.email || undefined}
        teacherProfile={profile}
        isCollapsed={isCollapsed}
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
  )
} 