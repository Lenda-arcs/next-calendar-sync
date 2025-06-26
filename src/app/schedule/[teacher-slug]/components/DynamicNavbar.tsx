'use client'

import { LogoutButton } from '@/components/auth'
import { NavLink } from '@/components/ui'
import { Home, User, X } from 'lucide-react'
import { PublicProfile } from '@/lib/types'
import TeacherHeroContent from './TeacherHeroContent'

interface DynamicNavbarProps {
  userEmail?: string
  teacherProfile: PublicProfile
  isCollapsed: boolean
  isAnimating: boolean
  isExpanding: boolean
  onToggleHero: () => void
  onCloseHero: () => void
}

export default function DynamicNavbar({ 
  userEmail, 
  teacherProfile,
  isCollapsed,
  isAnimating,
  isExpanding,
  onToggleHero,
  onCloseHero
}: DynamicNavbarProps) {
  const isLoggedIn = !!userEmail

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
            {/* Collapsed Teacher Avatar - shows when collapsed or expanding */}
            {(isCollapsed || isExpanding) && (
              <div className="flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex items-center gap-2">
                  <div className={`
                    w-8 h-8 rounded-full border border-white/40 bg-white/50 
                    flex items-center justify-center overflow-hidden shadow-sm
                    transition-all duration-500 ease-in-out
                    ${isAnimating ? 'animate-morph-in' : ''}
                    ${isExpanding ? 'animate-morph-out-reverse' : ''}
                  `}>
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
          ${isCollapsed && !isExpanding ? 'max-h-0 opacity-0' : 'max-h-[800px] opacity-100'}
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

            {/* Hero Content */}
            <TeacherHeroContent 
              teacherProfile={teacherProfile} 
              isAnimating={isAnimating}
              isExpanding={isExpanding}
            />
          </div>
        </div>
      </div>

      {/* Custom CSS for morphing animation */}
      <style jsx>{`
        @keyframes morph-in {
          0% {
            transform: scale(1.8) translateX(-60px) translateY(20px);
            opacity: 0.6;
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

        .animate-morph-in {
          animation: morph-in 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .animate-morph-out-reverse {
          animation: morph-out-reverse 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes morph-out-reverse {
          0% {
            transform: scale(1) translateX(0) translateY(0);
            opacity: 1;
          }
          100% {
            transform: scale(1.8) translateX(-60px) translateY(20px);
            opacity: 0.4;
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
              opacity: 0.4;
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