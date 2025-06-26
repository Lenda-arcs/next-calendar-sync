'use client'

import { Container } from '@/components/layout/container'
import { PageSection } from '@/components/layout/page-section'
import { 
  FilterProvider, 
  ScheduleFilters, 
  FilteredEventList, 
  ScheduleHeader 
} from '@/components/schedule'
import { LogoutButton } from '@/components/auth'
import { NavLink } from '@/components/ui'
import { Button } from '@/components/ui/button'
import TagList from '@/components/events/TagList'
import { Home, User, Mail, Globe, Instagram, Clock, X } from 'lucide-react'
import { PublicProfile } from '@/lib/types'
import { useScrollIntoView } from '@/lib/hooks'
import { useState } from 'react'
import React from 'react'

// Dynamic navbar with integrated hero that collapses on scroll
function DynamicNavbarWithHero({ 
  userEmail, 
  teacherProfile,
  isCollapsed,
  onToggleHero,
  onCloseHero
}: { 
  userEmail?: string
  teacherProfile: PublicProfile
  isCollapsed: boolean
  onToggleHero: () => void
  onCloseHero: () => void
}) {
  const isLoggedIn = !!userEmail

  // Generate description
  const getDescription = (profile: PublicProfile) => {
    if (profile?.bio && profile.bio.trim()) {
      return profile.bio
    }
    if (!profile?.name) return 'Welcome to my schedule'
    return `Join ${profile.name} for yoga classes and mindful movement. Check out my upcoming sessions and book your spot.`
  }

  // Generate contact email placeholder
  const getContactEmail = (name: string | null, publicUrl: string | null) => {
    if (publicUrl) {
      return `${publicUrl}@yogateacher.com`
    }
    if (name) {
      return `${name.toLowerCase().replace(/\s+/g, '.')}@yogateacher.com`
    }
    return 'contact@yogateacher.com'
  }

  return (
    <header className={`
      backdrop-blur-md bg-gradient-to-r from-white/80 via-white/60 to-transparent 
      border-b border-white/40 shadow-sm sticky top-0 z-50 
      transition-all duration-500 ease-in-out
      ${isCollapsed ? 'py-0' : 'py-4 md:py-8'}
    `}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Navigation Bar - Always Visible */}
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
            {/* Collapsed Teacher Avatar - shows when collapsed */}
            {isCollapsed && (
              <div className="flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full border border-white/40 bg-white/50 flex items-center justify-center overflow-hidden shadow-sm">
                    {teacherProfile?.profile_image_url ? (
                      <img
                        src={teacherProfile.profile_image_url}
                        alt={`${teacherProfile.name || "Teacher"}'s profile picture`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="h-4 w-4 text-gray-600" />
                    )}
                  </div>
                  <button
                    onClick={onToggleHero}
                    className="text-sm font-medium text-gray-900 hover:text-gray-700 transition-colors duration-200"
                  >
                    {teacherProfile?.name || 'Teacher'}
                  </button>
                </div>
              </div>
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

        {/* Expandable Hero Content - Hidden when collapsed */}
        <div className={`
          overflow-hidden transition-all duration-500 ease-in-out
          ${isCollapsed ? 'max-h-0 opacity-0' : 'max-h-[800px] opacity-100'}
        `}>
          <div className="py-6 relative">
            {/* Close Button - Top Right */}
            <button
              onClick={onCloseHero}
              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/70 hover:bg-white/90 border border-white/50 flex items-center justify-center shadow-sm transition-colors duration-200 z-10"
              aria-label="Close profile"
            >
              <X className="h-4 w-4 text-gray-600" />
            </button>

            {/* Enhanced Mobile View */}
            <div className="md:hidden">
              <div className="space-y-4">
                {/* Profile Header */}
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-full border-2 border-white/40 bg-white/50 flex items-center justify-center text-xl overflow-hidden shadow-lg">
                      {teacherProfile?.profile_image_url ? (
                        <img
                          src={teacherProfile.profile_image_url}
                          alt={`${teacherProfile.name || "User"}'s profile picture`}
                          className="w-full h-full object-cover"
                        />
                      ) : teacherProfile?.name ? (
                        <span className="text-gray-700 font-semibold">
                          {teacherProfile.name.charAt(0).toUpperCase()}
                        </span>
                      ) : (
                        <span className="text-gray-500 text-sm">?</span>
                      )}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h1 className="text-xl text-gray-900 font-normal mb-1 truncate">
                      {teacherProfile?.name || 'User'}
                    </h1>
                    <div className="flex items-center gap-2 mb-2">
                      <p className="text-sm text-gray-600">Yoga Teacher</p>
                      {teacherProfile?.timezone && (
                        <>
                          <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                          <span className="text-xs text-gray-600 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {teacherProfile.timezone}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {getDescription(teacherProfile)}
                  </p>
                </div>

                {/* Yoga Styles */}
                {teacherProfile?.yoga_styles && teacherProfile.yoga_styles.length > 0 && (
                  <div>
                    <TagList
                      label="Specialties"
                      tags={teacherProfile.yoga_styles}
                      variant="purple"
                      layout="inline"
                      showLabel={false}
                      maxTags={3}
                    />
                  </div>
                )}

                {/* Mobile Contact Buttons */}
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-white/70 hover:bg-white border-white/50 flex-1 min-w-[120px]"
                    asChild
                  >
                    <a
                      href={`mailto:${getContactEmail(teacherProfile?.name || null, teacherProfile?.public_url || null)}`}
                      className="flex items-center justify-center gap-2"
                    >
                      <Mail className="h-4 w-4" />
                      Email
                    </a>
                  </Button>

                  {teacherProfile?.instagram_url && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-white/70 hover:bg-white border-white/50 flex-1 min-w-[120px]"
                      asChild
                    >
                      <a
                        href={teacherProfile.instagram_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2"
                      >
                        <Instagram className="h-4 w-4" />
                        Instagram
                      </a>
                    </Button>
                  )}

                  {teacherProfile?.website_url && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-white/70 hover:bg-white border-white/50 flex-1 min-w-[120px]"
                      asChild
                    >
                      <a
                        href={teacherProfile.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2"
                      >
                        <Globe className="h-4 w-4" />
                        Website
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Desktop Full View */}
            <div className="hidden md:block">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8 text-center md:text-left">
                {/* Profile Image */}
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full border-2 border-white/40 bg-white/50 flex items-center justify-center text-3xl lg:text-4xl overflow-hidden shadow-lg">
                    {teacherProfile?.profile_image_url ? (
                      <img
                        src={teacherProfile.profile_image_url}
                        alt={`${teacherProfile.name || "User"}'s profile picture`}
                        className="w-full h-full object-cover"
                      />
                    ) : teacherProfile?.name ? (
                      <span className="text-gray-700 font-semibold">
                        {teacherProfile.name.charAt(0).toUpperCase()}
                      </span>
                    ) : (
                      <span className="text-gray-500 text-lg">?</span>
                    )}
                  </div>
                </div>

                {/* Profile Info */}
                <div className="flex-1 min-w-0">
                  {/* Name and Title */}
                  <div className="mb-4">
                    <h1 className="text-2xl md:text-3xl lg:text-4xl text-gray-900 font-normal mb-2">
                      {teacherProfile?.name || 'User'}
                    </h1>
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                      <span className="text-base text-gray-600 font-light">
                        Yoga Teacher
                      </span>
                      {teacherProfile?.timezone && (
                        <>
                          <span className="w-1.5 h-1.5 bg-gray-600 rounded-full"></span>
                          <span className="text-sm text-gray-600 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {teacherProfile.timezone}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-4">
                    <p className="text-gray-600 text-sm md:text-base leading-relaxed max-w-2xl">
                      {getDescription(teacherProfile)}
                    </p>
                  </div>

                  {/* Yoga Styles */}
                  {teacherProfile?.yoga_styles && teacherProfile.yoga_styles.length > 0 && (
                    <div className="mb-4">
                      <TagList
                        label="Specialties"
                        tags={teacherProfile.yoga_styles}
                        variant="purple"
                        layout="inline"
                        showLabel={true}
                        maxTags={4}
                      />
                    </div>
                  )}

                  {/* Contact Buttons */}
                  <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3">
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-white/70 hover:bg-white border-white/50"
                      asChild
                    >
                      <a
                        href={`mailto:${getContactEmail(teacherProfile?.name || null, teacherProfile?.public_url || null)}`}
                        className="flex items-center gap-2"
                      >
                        <Mail className="h-4 w-4" />
                        Email
                      </a>
                    </Button>

                    {teacherProfile?.instagram_url && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-white/70 hover:bg-white border-white/50"
                        asChild
                      >
                        <a
                          href={teacherProfile.instagram_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2"
                        >
                          <Instagram className="h-4 w-4" />
                          Instagram
                        </a>
                      </Button>
                    )}

                    {teacherProfile?.website_url && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-white/70 hover:bg-white border-white/50"
                        asChild
                      >
                        <a
                          href={teacherProfile.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2"
                        >
                          <Globe className="h-4 w-4" />
                          Website
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
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
  const [isManuallyExpanded, setIsManuallyExpanded] = useState(false)
  const [isManuallyClosed, setIsManuallyClosed] = useState(false)
  
  const { elementRef, isInView } = useScrollIntoView({
    threshold: 0.8, // High threshold - collapse when mostly out of view
    rootMargin: '-80px 0px 0px 0px' // Account for navbar
  })

  // Reset manual states when scrolling back into view
  React.useEffect(() => {
    if (isInView) {
      setIsManuallyClosed(false)
      setIsManuallyExpanded(false)
    }
  }, [isInView])

  // Close manual expansion when scrolling out of view
  React.useEffect(() => {
    if (!isInView && isManuallyExpanded) {
      // Add a small delay to prevent immediate closure
      const timer = setTimeout(() => {
        setIsManuallyExpanded(false)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [isInView, isManuallyExpanded])

  // Hero is collapsed when:
  // 1. Manually closed (overrides everything)
  // 2. Scrolled out of view AND not manually expanded
  const isCollapsed = isManuallyClosed || (!isInView && !isManuallyExpanded)

  const handleToggleHero = () => {
    if (isCollapsed) {
      // Expanding: clear manual close and set manual expand
      setIsManuallyClosed(false)
      setIsManuallyExpanded(true)
    } else {
      // Collapsing: set manual close
      setIsManuallyClosed(true)
      setIsManuallyExpanded(false)
    }
  }

  const handleCloseHero = () => {
    setIsManuallyClosed(true)
    setIsManuallyExpanded(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50/30 to-gray-100/20">
      {/* Dynamic Navbar with Integrated Hero */}
      <DynamicNavbarWithHero 
        userEmail={user?.email || undefined}
        teacherProfile={profile}
        isCollapsed={isCollapsed}
        onToggleHero={handleToggleHero}
        onCloseHero={handleCloseHero}
      />

      {/* Invisible scroll trigger element */}
      <div ref={elementRef} className="h-1 w-full"></div>

      {/* Filter & Events Section */}
      <div className="bg-white/50 backdrop-blur-sm">
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
    </div>
  )
} 