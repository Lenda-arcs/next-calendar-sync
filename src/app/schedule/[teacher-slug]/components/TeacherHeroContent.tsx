'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { LoadingOverlay } from '@/components/ui'
import TagList from '@/components/events/TagList'
import { Mail, Globe, Instagram, Clock, Share2, Download } from 'lucide-react'
import { PublicProfile } from '@/lib/types'
import { useScheduleFilters } from '@/components/schedule/FilterProvider'
import { useScheduleExport, useOwnerAuth, useOrigin } from '@/lib/hooks'
import { EXPORT_CONFIG } from '@/lib/constants/export-constants'
import { ExportPreview } from '@/components/schedule/ExportPreview'
import { ExportOptionsDialog } from '@/components/schedule/ExportOptionsDialog'
import { ShareDialog } from '@/components/schedule/ShareDialog'

interface TeacherHeroContentProps {
  teacherProfile: PublicProfile
  isAnimating: boolean
  isExpanding: boolean
  currentUserId?: string
  teacherSlug?: string
}

export default function TeacherHeroContent({ 
  teacherProfile, 
  isAnimating, 
  isExpanding, 
  currentUserId,
  teacherSlug 
}: TeacherHeroContentProps) {
  const [showExportDialog, setShowExportDialog] = useState(false)
  const [showShareDialog, setShowShareDialog] = useState(false)
  const { filteredEvents } = useScheduleFilters()
  const { isOwner } = useOwnerAuth({ currentUserId, teacherProfileId: teacherProfile?.id || undefined })
  const { handleExport, isExporting, showExportPreview, canExport } = useScheduleExport({
    teacherName: teacherProfile?.name || 'Teacher',
    events: filteredEvents
  })
  const origin = useOrigin()

  // Generate the share URL
  const shareUrl = teacherSlug ? `${origin}/schedule/${teacherSlug}` : (typeof window !== 'undefined' ? window.location.href : '')

  const handleExportClick = () => {
    setShowExportDialog(true)
  }

  const handlePngExport = () => {
    setShowExportDialog(false)
    handleExport()
  }

  const handleShareClick = () => {
    setShowShareDialog(true)
  }

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
    <>
      {/* Enhanced Mobile View */}
      <div className="md:hidden px-4">
        <div className="space-y-4">
          {/* Profile Header */}
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <div className={`
                transition-all duration-500 ease-in-out
                ${isAnimating ? 'animate-morph-out' : ''}
                ${isExpanding ? 'animate-morph-in-reverse' : ''}
              `}>
                <Avatar className="w-16 h-16 border-2 border-white/40 bg-white/50 shadow-lg">
                  <AvatarImage
                    src={teacherProfile?.profile_image_url || undefined}
                    alt={`${teacherProfile.name || "User"}'s profile picture`}
                  />
                  <AvatarFallback className="text-xl text-gray-700 font-semibold">
                    {teacherProfile?.name ? teacherProfile.name.charAt(0).toUpperCase() : '?'}
                  </AvatarFallback>
                </Avatar>
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

          {/* Mobile Contact and Action Buttons */}
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

          {/* Share and Export Actions - Mobile */}
          <div className="flex flex-col gap-2 pt-2 border-t border-white/20">
            <Button
              size="sm"
              onClick={handleShareClick}
              className="bg-white/70 hover:bg-white border-white/50 w-full"
              variant="outline"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share Schedule
            </Button>

            {isOwner && (
              <Button
                size="sm"
                onClick={handleExportClick}
                disabled={!canExport || isExporting}
                className="bg-blue-600/90 hover:bg-blue-700 text-white border-blue-600 w-full"
              >
                {isExporting ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Export Events
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Desktop View */}
      <div className="hidden md:block">
        <div className="flex items-start gap-8">
          {/* Profile Image */}
          <div className="flex-shrink-0">
            <div className={`
              transition-all duration-500 ease-in-out
              ${isAnimating && !isExpanding ? 'animate-morph-out' : ''}
              ${isExpanding ? 'animate-morph-out-fast' : ''}
            `}>
              <Avatar className="w-24 h-24 lg:w-32 lg:h-32 border-2 border-white/40 bg-white/50 shadow-lg">
                <AvatarImage
                  src={teacherProfile?.profile_image_url || undefined}
                  alt={`${teacherProfile.name || "User"}'s profile picture`}
                />
                <AvatarFallback className="text-2xl lg:text-3xl text-gray-700 font-semibold">
                  {teacherProfile?.name ? teacherProfile.name.charAt(0).toUpperCase() : '?'}
                </AvatarFallback>
              </Avatar>
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

            {/* Contact and Action Buttons */}
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

              {/* Share and Export Actions - Desktop */}
              <div className="flex items-center gap-2 ml-2 pl-2 border-l border-white/30">
                <Button
                  size="sm"
                  onClick={handleShareClick}
                  className="bg-white/70 hover:bg-white border-white/50"
                  variant="outline"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>

                {isOwner && (
                  <Button
                    size="sm"
                    onClick={handleExportClick}
                    disabled={!canExport || isExporting}
                    className="bg-blue-600/90 hover:bg-blue-700 text-white border-blue-600"
                  >
                    {isExporting ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                        Exporting...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Export preview component */}
      <ExportPreview
        isVisible={showExportPreview}
        events={filteredEvents}
        teacherName={teacherProfile?.name || 'Teacher'}
        elementId={EXPORT_CONFIG.EXPORT_ELEMENT_ID}
      />

      {/* Loading overlay */}
      <LoadingOverlay
        isVisible={isExporting}
        message={EXPORT_CONFIG.EXPORT_MESSAGES.EXPORTING}
      />

      {/* Export Options Dialog */}
      <ExportOptionsDialog
        isOpen={showExportDialog}
        onOpenChange={setShowExportDialog}
        onPngExport={handlePngExport}
        isExporting={isExporting}
        events={filteredEvents}
      />

      {/* Share Dialog */}
      <ShareDialog
        isOpen={showShareDialog}
        onOpenChange={setShowShareDialog}
        url={shareUrl}
        title={`${teacherProfile?.name || 'Teacher'}'s Yoga Schedule`}
        description={`Check out ${teacherProfile?.name || 'Teacher'}'s upcoming yoga classes and join for a session!`}
      />

      {/* Custom CSS for morphing animation */}
      <style jsx>{`
        @keyframes morph-out {
          0% {
            transform: scale(1) translateX(0) translateY(0);
            opacity: 1;
          }
          100% {
            transform: scale(0.5) translateX(-100px) translateY(-25px);
            opacity: 0.4;
          }
        }

        .animate-morph-out {
          animation: morph-out 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .animate-morph-in-reverse {
          animation: morph-in-reverse 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes morph-in-reverse {
          0% {
            transform: scale(0.5) translateX(-100px) translateY(-25px);
            opacity: 0.4;
          }
          100% {
            transform: scale(1) translateX(0) translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  )
} 