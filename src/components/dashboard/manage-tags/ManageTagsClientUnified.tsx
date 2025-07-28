'use client'

import React from 'react'
import { useAllTags, useUserRole } from '@/lib/hooks/useAppQuery'
import { queryKeys } from '@/lib/query-keys'
import { TagLibrary } from '@/components/tags/TagLibrary'
import { TagRuleManager } from '@/components/tags/TagRuleManager'
import { UserRole } from '@/lib/types'

interface Props {
  userId: string
}

/**
 * NEW UNIFIED VERSION of ManageTagsClient
 * 
 * Compare this with the original ManageTagsClient.tsx to see:
 * 1. Cleaner, more consistent API
 * 2. Automatic caching with TanStack Query
 * 3. Better error handling and loading states
 * 4. Unified invalidation strategy
 * 5. Type safety throughout
 */
export function ManageTagsClientUnified({ userId }: Props) {

  // ✨ NEW: Clean, consistent query hooks
  const { 
    data: tagData, 
    isLoading: tagsLoading, 
    error: tagsError 
  } = useAllTags(userId, { enabled: !!userId })

  const { 
    data: userRole, 
    isLoading: roleLoading, 
    error: roleError 
  } = useUserRole(userId, { enabled: !!userId })

  // Note: Manual invalidation can be added later when needed
  // For now, the components handle their own data fetching and updates

  // Derived state (same as before)
  const allTags = tagData?.allTags || []
  const userTags = tagData?.userTags || []
  const globalTags = tagData?.globalTags || []
  const resolvedUserRole = (userRole || 'user') as UserRole
  const isLoading = tagsLoading || roleLoading
  const error = tagsError || roleError

  // Show loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded animate-pulse" />
        <div className="h-64 bg-gray-200 rounded animate-pulse" />
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-red-800 font-semibold">Error loading tags</h3>
        <p className="text-red-600 text-sm mt-1">{error.message}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Tag Library - pass data as optional props where supported */}
      <TagLibrary
        userId={userId}
        userRole={resolvedUserRole}
        globalTags={globalTags}
        customTags={userTags}
      />

      {/* Tag Rules Manager - simplified */}
      <TagRuleManager
        userId={userId}
      />

      {/* ✨ NEW: Development info showing the unified approach */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="text-blue-800 font-semibold mb-2">🚀 Unified Data Fetching Demo</h4>
          <div className="text-blue-700 text-sm space-y-1">
            <p>• <strong>Tags:</strong> {allTags.length} total ({userTags.length} user + {globalTags.length} global)</p>
            <p>• <strong>User Role:</strong> {resolvedUserRole}</p>
            <p>• <strong>Cache Keys:</strong></p>
            <ul className="ml-4 space-y-1 font-mono text-xs">
              <li>tags: {JSON.stringify(queryKeys.tags.allForUser(userId))}</li>
              <li>role: {JSON.stringify(queryKeys.users.role(userId))}</li>
            </ul>
            <p className="mt-2 text-xs">
              ✅ This component uses the new unified data fetching system!<br/>
              🔍 Check the React Query Devtools to see caching in action.
            </p>
          </div>
        </div>
      )}
    </div>
  )
} 