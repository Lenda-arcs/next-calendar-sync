'use client'

import React from 'react'
import DashboardContent from './DashboardContent'
import DataLoader from '@/components/ui/data-loader'
import { useUserProfile, useCalendarFeeds } from '@/lib/hooks/useAppQuery'
import { PATHS } from '@/lib/paths'

interface DashboardClientProps {
  userId: string
}

export default function DashboardClient({ userId }: DashboardClientProps) {
  // ✨ Use TanStack Query for data fetching with caching
  const { 
    data: user, 
    isLoading: userLoading, 
    error: userError 
  } = useUserProfile(userId, { enabled: !!userId })

  const { 
    data: calendarFeeds, 
    isLoading: feedsLoading, 
    error: feedsError 
  } = useCalendarFeeds(userId, { enabled: !!userId })

  // Combine loading states
  const isLoading = userLoading || feedsLoading
  const error = userError || feedsError
  const errorMessage = error?.message || null

  // Calculate derived data (no need for separate count query)
  const feeds = calendarFeeds || []
  const userFeedCount = feeds.length
  const hasFeeds = userFeedCount > 0

  // Generate public schedule URL
  const publicPath = user?.public_url ?
    PATHS.DYNAMIC.TEACHER_SCHEDULE(user.public_url)
    : null
  const hasCustomUrl = !!user?.public_url

  // Prepare dashboard data
  const dashboardData = user ? {
    user,
    userId,
    hasFeeds,
    feeds,
    publicPath,
    hasCustomUrl
  } : null

  return (
    <DataLoader
      data={dashboardData}
      loading={isLoading}
      error={errorMessage}
      skeleton={() => (
        <div className="space-y-8 animate-pulse">
          {/* Header skeleton */}
          <div className="flex items-center justify-between">
            <div className="h-8 bg-gray-200 rounded w-64"></div>
            <div className="h-10 bg-gray-200 rounded w-32"></div>
          </div>
          
          {/* Stats cards skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          
          {/* Content sections skeleton */}
          <div className="space-y-6">
            <div className="h-64 bg-gray-200 rounded-lg"></div>
            <div className="h-48 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      )}
    >
      {(data) => (
        <DashboardContent 
          user={data.user}
          userId={data.userId}
          hasFeeds={data.hasFeeds}
          feeds={data.feeds}
          publicPath={data.publicPath}
          hasCustomUrl={data.hasCustomUrl}
        />
      )}
    </DataLoader>
  )
} 