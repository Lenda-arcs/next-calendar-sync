'use client'

import { LogoutButton } from '@/components/auth'
import { LoadingNavLink, CompactLanguageSelector } from '@/components/ui'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Home, User, X } from 'lucide-react'
import { PublicProfile } from '@/lib/types'
import TeacherHeroContent from './TeacherHeroContent'
import dummyLogo from '@/assets/dummy_logo.png'
import { useTranslation } from '@/lib/i18n/context'

interface DynamicNavbarProps {
  userEmail?: string
  teacherProfile: PublicProfile
  isCollapsed: boolean
  isAnimating: boolean
  isExpanding: boolean
  shouldShowJumpingCTA: boolean
  onToggleHero: () => void
  onCloseHero: () => void
  currentUserId?: string
  teacherSlug?: string
}

export default function DynamicNavbar({ 
  userEmail, 
  teacherProfile,
  isCollapsed,
  isAnimating,
  isExpanding,
  shouldShowJumpingCTA,
  onToggleHero,
  onCloseHero,
  currentUserId,
  teacherSlug
}: DynamicNavbarProps) {
  const isLoggedIn = !!userEmail
  const { t } = useTranslation()

  return (
    <header className={`
      sticky top-0 z-50 transition-all duration-700 ease-in-out
      ${isCollapsed 
        ? 'bg-transparent border-transparent shadow-none' 
        : 'backdrop-blur-md bg-gradient-to-r from-white/80 via-white/60 to-transparent border-b border-white/40 shadow-sm'
      }
      ${isCollapsed ? 'py-0' : 'py-4 md:py-8'}
    `}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Full Navigation Bar - Visible when expanded */}
        <div className={`
          flex justify-between items-center h-14 transition-all duration-700 ease-in-out
          ${isCollapsed ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}
        `}>
          <div className="flex items-center space-x-4">
            <LoadingNavLink
              href={isLoggedIn ? "/app" : "/"}
              text={t('pages.publicSchedule.navbar.home')}
              avatarSrc={dummyLogo.src}
              avatarAlt="Logo"
              icon={Home}
              className="group mr-2"
            />
          </div>
          
          <div className="flex items-center space-x-4">
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

            {/* Language Selector */}
            <CompactLanguageSelector />
          </div>
        </div>

        {/* Minimal Floating Profile Trigger - Visible when collapsed */}
        {(isCollapsed || isExpanding) && (
          <div className={`
            fixed top-4 right-4 z-[60] transition-all duration-700 ease-in-out
            ${isCollapsed && !isExpanding 
              ? 'opacity-100 translate-y-0 scale-100' 
              : 'opacity-0 translate-y-2 scale-95 pointer-events-none'
            }
          `}>
            <button
              onClick={onToggleHero}
              className={`
                flex items-center gap-3 px-4 py-2 rounded-full
                backdrop-blur-xl bg-white/90 border border-white/50 shadow-lg
                hover:bg-white/95 hover:shadow-xl hover:scale-105
                transition-all duration-300 ease-out
                ${shouldShowJumpingCTA ? 'animate-jump' : ''}
              `}
            >
              <div className={`
                transition-all duration-500 ease-in-out
                ${isAnimating ? 'md:animate-morph-in' : ''}
                ${isExpanding ? 'md:animate-morph-out-reverse' : ''}
                ${shouldShowJumpingCTA ? 'animate-jump' : ''}
              `}>
                <Avatar className="w-8 h-8 border border-white/40 bg-white/50 shadow-sm">
                  <AvatarImage
                    src={teacherProfile?.profile_image_url || undefined}
                    alt={`${teacherProfile.name || "Teacher"}'s profile picture`}
                  />
                  <AvatarFallback className="bg-white/50">
                    <User className="h-4 w-4 text-gray-600" />
                  </AvatarFallback>
                </Avatar>
              </div>
              <span className={`
                text-xs font-medium text-gray-900 
                ${shouldShowJumpingCTA ? 'animate-jump' : ''}
              `}>
                {teacherProfile?.name || 'Teacher'}
              </span>
            </button>
          </div>
        )}

        {/* Expandable Hero Content - Hidden when collapsed */}
        <div className={`
          overflow-hidden transition-all duration-500 ease-in-out
          ${isCollapsed && !isExpanding ? 'max-h-0 opacity-0' : 'max-h-[800px] opacity-100'}
        `}>
          <div className="py-6 relative">
            {/* Close Button - Top Right */}
            <button
              onClick={onCloseHero}
              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/70 hover:bg-white/90 border border-white/50 flex items-center justify-center shadow-sm transition-colors duration-200 z-10"
              aria-label={t('pages.publicSchedule.navbar.closeProfile')}
            >
              <X className="h-4 w-4 text-gray-600" />
            </button>

            {/* Hero Content */}
            <TeacherHeroContent 
              teacherProfile={teacherProfile} 
              isAnimating={isAnimating}
              isExpanding={isExpanding}
              currentUserId={currentUserId}
              teacherSlug={teacherSlug}
            />
          </div>
        </div>
      </div>

      {/* Custom CSS for morphing animation */}
      <style jsx>{`
        /* Jumping animation for CTA */
        @keyframes jump {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        .animate-jump {
          animation: jump 0.6s ease-in-out infinite;
        }

        /* Floating profile trigger animations */
        @keyframes slide-in-from-top-right {
          0% {
            transform: translateX(100%) translateY(-100%) scale(0.8);
            opacity: 0;
          }
          100% {
            transform: translateX(0) translateY(0) scale(1);
            opacity: 1;
          }
        }

        @keyframes slide-out-to-top-right {
          0% {
            transform: translateX(0) translateY(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateX(50%) translateY(-50%) scale(0.8);
            opacity: 0;
          }
        }

        .animate-slide-in-floating {
          animation: slide-in-from-top-right 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .animate-slide-out-floating {
          animation: slide-out-to-top-right 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        /* Reduced mobile animations - only apply morph animations on medium screens and up */
        @keyframes morph-in {
          0% {
            transform: scale(1.1) translateX(-20px) translateY(10px);
            opacity: 0.8;
          }
          100% {
            transform: scale(1) translateX(0) translateY(0);
            opacity: 1;
          }
        }

        @media (min-width: 768px) {
          @keyframes morph-in {
            0% {
              transform: scale(1.8) translateX(-140px) translateY(20px);
              opacity: 0.6;
            }
            100% {
              transform: scale(1) translateX(0) translateY(0);
              opacity: 1;
            }
          }
        }

        @keyframes morph-out {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(0.3) translateY(-100px);
            opacity: 0.4;
          }
        }

        .md\\:animate-morph-in {
          animation: morph-in 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .md\\:animate-morph-out-reverse {
          animation: morph-out-reverse 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes morph-out-reverse {
          0% {
            transform: scale(1) translateX(0) translateY(0);
            opacity: 1;
          }
          100% {
            transform: scale(1.1) translateX(-20px) translateY(10px);
            opacity: 0.1;
          }
        }

        @media (min-width: 768px) {
          @keyframes morph-out-reverse {
            0% {
              transform: scale(1) translateX(0) translateY(0);
              opacity: 1;
            }
            100% {
              transform: scale(1.8) translateX(-140px) translateY(20px);
              opacity: 0.05;
            }
          }
        }

        .animate-morph-out {
          animation: morph-out 0.5s ease-in;
        }

        .animate-morph-out-fast {
          animation: morph-out-fast 0.15s ease-in forwards;
        }

        @keyframes morph-out-fast {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(0.3) translateY(-100px);
            opacity: 0;
          }
        }
      `}</style>
    </header>
  )
} 