'use client'

import { useUserProfile } from '@/lib/hooks/useAppQuery'

/**
 * Hook to get the user's timezone setting
 * Falls back to browser's timezone if user hasn't set one
 */
export function useUserTimezone(userId: string): string {
  const { data: userProfile } = useUserProfile(userId, { enabled: !!userId })
  
  // Use user's configured timezone or fall back to browser's timezone
  return userProfile?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone
} 