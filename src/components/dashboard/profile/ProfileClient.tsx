'use client'

import React from 'react'
import ProfileContent from './ProfileContent'
import { ProfileSkeleton } from './ProfileSkeleton'
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
    contact_email: null, // New field
    timezone: null,
    instagram_url: null,
    website_url: null,
    spotify_url: null, // New field
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
      skeleton={() => <ProfileSkeleton />}
    >
      {(user) => <ProfileContent user={user} />}
    </DataLoader>
  )
} 