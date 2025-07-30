'use client'

import React, { useMemo } from 'react'
import { Tag, UserRole } from '@/lib/types'
import { convertToEventTag, EventTag } from '@/lib/event-types'

import { TagLibraryGrid } from './TagLibraryGrid'

interface TagOperations {
  onTagClick: (tag: EventTag) => void
  onEditClick: (tag: EventTag) => void
  onDeleteClick: (tagId: string) => void
  onCreateNew: () => void
  creating: boolean
  updating: boolean
  deleting: boolean
}

interface Props {
  userId: string
  userRole?: UserRole // User role for determining edit permissions
  globalTags: Tag[] // Required - passed from parent
  customTags: Tag[] // Required - passed from parent
  tagOperations?: TagOperations // Accept tag operations as props
}

export const TagLibrary: React.FC<Props> = ({ 
  userId, 
  userRole = 'user', 
  globalTags,
  customTags,
  tagOperations
}) => {
  // Convert database tags to EventTags
  const globalEventTags = useMemo(() => {
    return globalTags?.map(convertToEventTag) || []
  }, [globalTags])

  const customEventTags = useMemo(() => {
    return customTags?.map(convertToEventTag) || []
  }, [customTags])

  // If no tag operations provided, create default handlers (fallback)
  const defaultTagOperations: TagOperations = {
    onTagClick: () => {},
    onEditClick: () => {},
    onDeleteClick: () => {},
    onCreateNew: () => {},
    creating: false,
    updating: false,
    deleting: false,
  }

  const operations = tagOperations || defaultTagOperations



  return (
    <TagLibraryGrid
      globalTags={globalEventTags}
      customTags={customEventTags}
      onTagClick={operations.onTagClick}
      onEditClick={operations.onEditClick}
      onDeleteClick={operations.onDeleteClick}
      onCreateNew={operations.onCreateNew}
      userId={userId}
      userRole={userRole}
    />
  )
} 