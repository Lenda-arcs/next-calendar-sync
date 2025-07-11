'use client'

import React from 'react'
import { EventTag } from '@/lib/event-types'
import { UserRole } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Edit, Trash2, Globe, Plus } from 'lucide-react'


interface Props {
  globalTags: EventTag[]
  customTags: EventTag[]
  onTagClick: (tag: EventTag) => void
  onEditClick: (tag: EventTag) => void
  onDeleteClick: (tagId: string) => void
  onCreateNew: () => void
  userId: string
  userRole?: UserRole // User role for determining edit permissions
}

interface TagLibraryItemProps {
  tag: EventTag
  isGlobal: boolean
  onClick: (tag: EventTag) => void
  onEdit: (tag: EventTag) => void
  onDelete: (tagId: string) => void
  canEdit: boolean
}

const TagLibraryItem: React.FC<TagLibraryItemProps> = ({
  tag,
  isGlobal,
  onClick,
  onEdit,
  onDelete,
  canEdit,
}) => {
  return (
    <div
      className="p-4 rounded-lg cursor-pointer backdrop-blur-sm bg-white/50 border border-white/40 hover:bg-white/60 hover:border-white/50 hover:shadow-md transition-all duration-200"
      onClick={() => onClick(tag)}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Tag info section */}
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div
            className="w-4 h-4 rounded-full flex-shrink-0 mt-0.5"
            style={{ backgroundColor: tag.color || '#6B7280' }}
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium text-foreground truncate">
                {tag.name || 'Unnamed Tag'}
              </span>
              {isGlobal && (
                <Globe className="h-3 w-3 text-muted-foreground flex-shrink-0" />
              )}
            </div>
            {(tag.classType && tag.classType.length > 0) && (
              <p className="text-xs text-muted-foreground">
                {tag.classType.slice(0, 3).join(', ')}
                {tag.classType.length > 3 && ` +${tag.classType.length - 3} more`}
              </p>
            )}
            {tag.audience && tag.audience.length > 0 && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {tag.audience.join(', ')}
              </p>
            )}
          </div>
        </div>

        {/* Action buttons */}
        {canEdit && (
          <div className="flex gap-1 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground h-7 w-7 p-0"
              onClick={(e) => {
                e.stopPropagation()
                onEdit(tag)
              }}
            >
              <Edit className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-destructive h-7 w-7 p-0"
              onClick={(e) => {
                e.stopPropagation()
                onDelete(tag.id)
              }}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}



export const TagLibraryGrid: React.FC<Props> = ({
  globalTags,
  customTags,
  onTagClick,
  onEditClick,
  onDeleteClick,
  onCreateNew,
  userId,
  userRole = 'user',
}) => {
  return (
    <Card variant="default">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-foreground">Tag Library</CardTitle>
          <Button
            onClick={onCreateNew}
            variant="secondary"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Tag
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Global Tags Section */}
        {globalTags.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Global Tags
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {globalTags.map((tag) => (
                <TagLibraryItem
                  key={tag.id}
                  tag={tag}
                  isGlobal={true}
                  onClick={onTagClick}
                  onEdit={onEditClick}
                  onDelete={onDeleteClick}
                  canEdit={
                    // Admin can edit any tag
                    userRole === 'admin' ||
                    // User can edit their own tags (but global tags are typically admin-only)
                    tag.userId === userId
                  }
                />
              ))}
            </div>
          </div>
        )}

        {/* Custom Tags Section */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">Your Custom Tags</h3>
          {customTags.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {customTags.map((tag) => (
                <TagLibraryItem
                  key={tag.id}
                  tag={tag}
                  isGlobal={false}
                  onClick={onTagClick}
                  onEdit={onEditClick}
                  onDelete={onDeleteClick}
                  canEdit={
                    // Admin can edit any tag
                    userRole === 'admin' ||
                    // User can edit their own custom tags
                    tag.userId === userId
                  }
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Plus className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
              <p className="text-sm">No custom tags yet</p>
              <p className="text-xs text-muted-foreground mt-1">
                Create your first custom tag to get started
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 