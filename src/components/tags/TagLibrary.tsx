'use client'

import React, { useMemo } from 'react'
import { Tag, UserRole } from '@/lib/types'
import { convertToEventTag, EventTag } from '@/lib/event-types'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import DataLoader from '@/components/ui/data-loader'
import { TagLibraryGridSkeleton } from '@/components/ui/skeleton'
import { TagLibraryGrid } from './TagLibraryGrid'
import { useTranslation } from '@/lib/i18n/context'

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
  isLoading?: boolean // Loading state from parent
  error?: string | null // Error state from parent
}

export const TagLibrary: React.FC<Props> = ({ 
  userId, 
  userRole = 'user', 
  globalTags,
  customTags,
  tagOperations,
  isLoading = false,
  error = null
}) => {
  const { t } = useTranslation()
  
  // Convert database tags to EventTags
  const globalEventTags = useMemo(() => {
    return globalTags?.map(convertToEventTag) || []
  }, [globalTags])

  const customEventTags = useMemo(() => {
    return customTags?.map(convertToEventTag) || []
  }, [customTags])

  const data = globalTags && customTags ? { globalTags: globalEventTags, customTags: customEventTags } : null

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
    <div className="space-y-8">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t('common.messages.error')}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {(operations.creating || operations.updating || operations.deleting) && (
        <Alert>
          <AlertDescription>
            {operations.creating && t('pages.manageTags.tagLibraryComponent.creating')}
            {operations.updating && t('pages.manageTags.tagLibraryComponent.updating')}
            {operations.deleting && t('pages.manageTags.tagLibraryComponent.deleting')}
          </AlertDescription>
        </Alert>
      )}

      <DataLoader
        data={data}
        loading={isLoading}
        error={error}
        skeleton={TagLibraryGridSkeleton}
        skeletonCount={1}
        empty={
          <p className="text-muted-foreground text-center">
            {t('pages.manageTags.tagLibraryComponent.noTagsFound')}
          </p>
        }
      >
        {(data) => (
          <TagLibraryGrid
            globalTags={data.globalTags}
            customTags={data.customTags}
            onTagClick={operations.onTagClick}
            onEditClick={operations.onEditClick}
            onDeleteClick={operations.onDeleteClick}
            onCreateNew={operations.onCreateNew}
            userId={userId}
            userRole={userRole}
          />
        )}
      </DataLoader>
    </div>
  )
} 