'use client'

import { Button } from '@/components/ui/button'
import TagList from '@/components/events/TagList'
import { Mail, Globe, Instagram, Clock } from 'lucide-react'
import { PublicProfile } from '@/lib/types'

interface TeacherHeroContentProps {
  teacherProfile: PublicProfile
  isAnimating: boolean
  isExpanding: boolean
}

export default function TeacherHeroContent({ teacherProfile, isAnimating, isExpanding }: TeacherHeroContentProps) {
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
                w-16 h-16 rounded-full border-2 border-white/40 bg-white/50 
                flex items-center justify-center text-xl overflow-hidden shadow-lg
                transition-all duration-500 ease-in-out
                ${isAnimating ? 'animate-morph-out' : ''}
                ${isExpanding ? 'animate-morph-in-reverse' : ''}
              `}>
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

      {/* Enhanced Desktop View */}
      <div className="hidden md:block">
        <div className="flex items-start gap-8">
          {/* Profile Image */}
          <div className="flex-shrink-0">
            <div className={`
              w-24 h-24 lg:w-32 lg:h-32 rounded-full border-2 border-white/40 bg-white/50 
              flex items-center justify-center text-2xl lg:text-3xl overflow-hidden shadow-lg
              transition-all duration-500 ease-in-out
              ${isAnimating && !isExpanding ? 'animate-morph-out' : ''}
              ${isExpanding ? 'animate-morph-out-fast' : ''}
            `}>
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
                <span className="text-gray-500">?</span>
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