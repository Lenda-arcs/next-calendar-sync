'use client'

import React from 'react'
import ProfileContent from './ProfileContent'
import DataLoader from '@/components/ui/data-loader'
import { useUserProfile } from '@/lib/hooks/useAppQuery'
import { User } from '@/lib/types'

interface ProfileClientProps {
  userId: string
}

export default function ProfileClient({ userId }: ProfileClientProps) {
  // ✨ Use TanStack Query for data fetching with caching
  const { 
    data: userData, 
    isLoading, 
    error 
  } = useUserProfile(userId, { enabled: !!userId })

  const errorMessage = error?.message || null

  // If error and no data, create fallback user
  const fallbackUser: User = {
    id: userId,
    email: '', // Will be populated from auth
    name: null,
    bio: null,
    profile_image_url: null,
    public_url: null,
    timezone: null,
    instagram_url: null,
    website_url: null,
    yoga_styles: null,
    event_display_variant: null,
    theme_variant: 'default', // Add theme_variant with default
    role: 'user' as const,
    calendar_feed_count: 0,
    is_featured: null,
    created_at: null
  }

  // Use fallback if there's an error and no data
  const user = userData || (error ? fallbackUser : null)

  return (
    <DataLoader
      data={user}
      loading={isLoading}
      error={errorMessage}
      skeleton={() => (
          /*TODO: Create separte comopoentn   skeleton.tsx*/
        <div className="space-y-8 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-4">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
      )}
    >
      {(user) => <ProfileContent user={user} />}
    </DataLoader>
  )
} 