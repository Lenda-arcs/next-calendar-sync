'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TagBadge } from '@/components/ui/tag-badge'
import { Button } from '@/components/ui/button'
import { Settings, Plus, Eye, EyeOff } from 'lucide-react'
import { Tag as TagType } from '@/lib/types'

interface QuickActionsProps {
  userTags?: TagType[]
  globalTags?: TagType[]
  onCreateTag: () => void
}

export default function QuickActions({
  userTags,
  globalTags,
  onCreateTag
}: QuickActionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={onCreateTag}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New Tag
          </Button>
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            Make All Public
          </Button>
          <Button variant="outline" size="sm">
            <EyeOff className="h-4 w-4 mr-2" />
            Make All Private
          </Button>
        </div>
        
        <div className="mt-4">
          <p className="text-sm text-muted-foreground mb-2">Available Tags:</p>
          <div className="flex flex-wrap gap-2">
            {userTags?.map(tag => (
              <TagBadge 
                key={tag.id} 
                variant="safe"
                color={tag.color}
              >
                {tag.name}
              </TagBadge>
            ))}
            {globalTags?.map(tag => (
              <TagBadge 
                key={tag.id} 
                variant="safe"
                color={tag.color}
              >
                {tag.name}
              </TagBadge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 