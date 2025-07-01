'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { PublicProfile } from '@/lib/types'
import { Button } from '@/components/ui/button'

import TagList from './TagList'
import { 
  Mail, 
  Globe, 
  Instagram, 
  MessageCircle, 
  Info, 
  X,
  MapPin,
  Clock
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface TeacherHeroProps {
  profile: PublicProfile
  className?: string
  forceExpanded?: boolean
}

const TeacherHero: React.FC<TeacherHeroProps> = ({
  profile,
  className = '',
  forceExpanded = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(forceExpanded)

  // Update expanded state when forceExpanded changes
  React.useEffect(() => {
    if (forceExpanded) {
      setIsExpanded(true)
    }
  }, [forceExpanded])

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

  // Compact Mobile View Component - No Card Background
  const CompactView = () => (
    <div className="backdrop-blur-sm bg-white/30 border-b border-white/40 py-4">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          {/* Compact Profile Image */}
          <div className="flex-shrink-0">
            <div className="w-16 h-16 rounded-full border-2 border-white/40 bg-white/50 flex items-center justify-center text-xl overflow-hidden shadow-lg">
              {profile?.profile_image_url ? (
                <Image
                  src={profile.profile_image_url}
                  alt={`${profile.name || "User"}'s profile picture`}
                  fill
                  className="object-cover"
                />
              ) : profile?.name ? (
                <span className="text-gray-700 font-semibold">
                  {profile.name.charAt(0).toUpperCase()}
                </span>
              ) : (
                <span className="text-gray-500 text-sm">?</span>
              )}
            </div>
          </div>

          {/* Compact Info */}
          <div className="flex-1 min-w-0">
            <h1 className="text-xl text-gray-900 font-normal mb-1 truncate">
              {profile?.name || 'User'}
            </h1>
            <p className="text-sm text-gray-600 mb-2">Yoga Teacher</p>

            {/* Quick Contact */}
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0"
                asChild
              >
                <a
                  href={`mailto:${getContactEmail(profile?.name || null, profile?.public_url || null)}`}
                  aria-label="Email"
                >
                  <Mail className="h-4 w-4" />
                </a>
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0"
                onClick={() => setIsExpanded(true)}
                aria-label="More Info"
              >
                <Info className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  // Full Desktop/Expanded View Component - No Card Background
  const FullView = () => (
    <div className="backdrop-blur-sm bg-white/20 border-b border-white/30 py-8 md:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile Close Button */}
        {isExpanded && (
          <div className="md:hidden mb-4 flex justify-end">
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 bg-white/50 hover:bg-white/70"
              onClick={() => setIsExpanded(false)}
              aria-label="Close Profile"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 text-center md:text-left">
          {/* Profile Image */}
          <div className="flex-shrink-0">
            <div className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-full border-2 border-white/40 bg-white/50 flex items-center justify-center text-4xl md:text-5xl lg:text-6xl overflow-hidden shadow-lg">
              {profile?.profile_image_url ? (
                <Image
                  src={profile.profile_image_url}
                  alt={`${profile.name || "User"}'s profile picture`}
                  fill
                  className="object-cover"
                />
              ) : profile?.name ? (
                <span className="text-gray-700 font-semibold">
                  {profile.name.charAt(0).toUpperCase()}
                </span>
              ) : (
                <span className="text-gray-500 text-lg">?</span>
              )}
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1 min-w-0">
            {/* Name and Title */}
            <div className="mb-6">
              <h1 className="text-3xl md:text-4xl lg:text-5xl text-gray-900 font-normal mb-2">
                {profile?.name || 'User'}
              </h1>
              <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                <span className="text-lg text-gray-600 font-light">
                  Yoga Teacher
                </span>
                {profile?.timezone && (
                  <>
                    <span className="w-1.5 h-1.5 bg-gray-600 rounded-full"></span>
                    <span className="text-sm text-gray-600 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {profile.timezone}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <p className="text-gray-600 text-base md:text-lg leading-relaxed max-w-2xl">
                {getDescription(profile)}
              </p>
            </div>

            {/* Yoga Styles */}
            {profile?.yoga_styles && profile.yoga_styles.length > 0 && (
              <div className="mb-6">
                <TagList
                  label="Specialties"
                  tags={profile.yoga_styles}
                  variant="purple"
                  layout="inline"
                  showLabel={true}
                  maxTags={4}
                />
              </div>
            )}

            {/* Contact Section */}
            <div className="border-t border-white/30 pt-6">
              <h3 className="text-lg text-gray-900 font-medium mb-4 text-center md:text-left">
                Get in Touch
              </h3>

              <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-white/70 hover:bg-white border-white/50"
                  asChild
                >
                  <a
                    href={`mailto:${getContactEmail(profile?.name || null, profile?.public_url || null)}`}
                    className="flex items-center gap-2"
                  >
                    <Mail className="h-4 w-4" />
                    Email
                  </a>
                </Button>

                {/* Social Links */}
                <div className="flex items-center gap-3">
                  {profile?.instagram_url && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-white/70 hover:bg-white border-white/50"
                      asChild
                    >
                      <a
                        href={profile.instagram_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                        aria-label="Instagram"
                      >
                        <Instagram className="h-4 w-4" />
                        Instagram
                      </a>
                    </Button>
                  )}

                  {profile?.website_url && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-white/70 hover:bg-white border-white/50"
                      asChild
                    >
                      <a
                        href={profile.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                        aria-label="Website"
                      >
                        <Globe className="h-4 w-4" />
                        Website
                      </a>
                    </Button>
                  )}

                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-white/70 hover:bg-white border-white/50"
                    asChild
                  >
                    <a
                      href={`https://wa.me/1234567890`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                      aria-label="WhatsApp"
                    >
                      <MessageCircle className="h-4 w-4" />
                      WhatsApp
                    </a>
                  </Button>
                </div>
              </div>

              {/* Quick Contact Info */}
              <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-4 text-xs text-gray-600">
                <span className="flex items-center gap-2">
                  <MapPin className="h-3 w-3" />
                  <span>Studio & Online Classes</span>
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="h-3 w-3" />
                  <span>Usually responds within 24h</span>
                </span>
                <span className="flex items-center gap-2">
                  <Globe className="h-3 w-3" />
                  <span>English & Deutsch</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className={cn('w-full', className)}>
      {/* Mobile: Show compact or expanded based on state */}
      <div className="md:hidden">
        {isExpanded ? <FullView /> : <CompactView />}
      </div>

      {/* Desktop: Always show full view */}
      <div className="hidden md:block">
        <FullView />
      </div>
    </div>
  )
}

export default TeacherHero 