'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { LoadingOverlay } from '@/components/ui'
import TagList from '@/components/tags/TagList'
import { Mail, Globe, Instagram, Clock, Share2, Download, Music } from 'lucide-react'
import { PublicProfile } from '@/lib/types'
import { useScheduleFilters } from '@/components/schedule/FilterProvider'
import { useScheduleExport, useOwnerAuth, useOrigin } from '@/lib/hooks'
import { EXPORT_CONFIG } from '@/lib/constants/export-constants'
import { ExportPreview } from '@/components/schedule/ExportPreview'
import { ExportOptionsDialog } from '@/components/schedule/ExportOptionsDialog'
import { ShareDialog } from '@/components/schedule/ShareDialog'
import { useTranslation } from '@/lib/i18n/context'
import { PATHS } from '@/lib/paths'

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
  const { t } = useTranslation()

  // Generate the share URL
  const shareUrl = teacherSlug ? `${origin}${PATHS.DYNAMIC.TEACHER_SCHEDULE(teacherSlug)}` : (typeof window !== 'undefined' ? window.location.href : '')

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
    if (!profile?.name) return t('pages.publicSchedule.hero.defaultBioNoName')
    return t('pages.publicSchedule.hero.defaultBio', { name: profile.name })
  }

  // Get the contact email for the teacher
  const getContactEmail = (profile: PublicProfile) => {
    // The email field now automatically shows contact_email if present, otherwise default email
    if (profile?.email) {
      return profile.email
    }
    
    // Fallback to placeholder if no email available
    if (profile?.public_url) {
      return `${profile.public_url}@yogateacher.com`
    }
    if (profile?.name) {
      return `${profile.name.toLowerCase().replace(/\s+/g, '.')}@yogateacher.com`
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
                <p className="text-sm text-gray-600">{t('pages.publicSchedule.hero.yogaTeacher')}</p>
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
                label={t('pages.publicSchedule.hero.specialties')}
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
                href={`mailto:${getContactEmail(teacherProfile)}`}
                className="flex items-center justify-center gap-2"
              >
                <Mail className="h-4 w-4" />
                {t('pages.publicSchedule.hero.email')}
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
                  {t('pages.publicSchedule.hero.instagram')}
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
                  {t('pages.publicSchedule.hero.website')}
                </a>
              </Button>
            )}

            {teacherProfile?.spotify_url && (
              <Button
                size="sm"
                variant="outline"
                className="bg-white/70 hover:bg-white border-white/50 flex-1 min-w-[120px]"
                asChild
              >
                <a
                  href={teacherProfile.spotify_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2"
                >
                  <Music className="h-4 w-4" />
                  Spotify
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
              {t('pages.publicSchedule.hero.shareSchedule')}
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
                    {t('pages.publicSchedule.hero.exporting')}
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    {t('pages.publicSchedule.hero.exportEvents')}
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
                  {t('pages.publicSchedule.hero.yogaTeacher')}
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
                  label={t('pages.publicSchedule.hero.specialties')}
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
                  href={`mailto:${getContactEmail(teacherProfile)}`}
                  className="flex items-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  {t('pages.publicSchedule.hero.email')}
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
                    {t('pages.publicSchedule.hero.instagram')}
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
                    {t('pages.publicSchedule.hero.website')}
                  </a>
                </Button>
              )}

              {teacherProfile?.spotify_url && (
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-white/70 hover:bg-white border-white/50"
                  asChild
                >
                  <a
                    href={teacherProfile.spotify_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <Music className="h-4 w-4" />
                    Spotify
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
                  {t('pages.publicSchedule.hero.share')}
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
                        {t('pages.publicSchedule.hero.exporting')}
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        {t('pages.publicSchedule.hero.export')}
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
        title={teacherProfile?.name 
          ? t('pages.publicSchedule.hero.shareTitle', { name: teacherProfile.name })
          : t('pages.publicSchedule.hero.shareDefaultTitle')
        }
        description={teacherProfile?.name 
          ? t('pages.publicSchedule.hero.shareDescription', { name: teacherProfile.name })
          : t('pages.publicSchedule.hero.shareDefaultDescription')
        }
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