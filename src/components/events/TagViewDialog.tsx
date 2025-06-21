'use client'

import React from 'react'
import { EventTag } from '@/lib/event-types'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EventCard } from './EventCard'
import { Edit, Globe, ExternalLink, Palette, Users, Star } from 'lucide-react'

interface Props {
  tag: EventTag
  isOpen: boolean
  onClose: () => void
  onEdit: () => void
  canEdit: boolean
}

export const TagViewDialog: React.FC<Props> = ({
  tag,
  isOpen,
  onClose,
  onEdit,
  canEdit,
}) => {
  const isGlobal = !tag.userId

  const priorityLabels = {
    1: 'High',
    2: 'Medium',
    3: 'Low',
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col backdrop-blur-md bg-white/95 border border-white/40 shadow-xl">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-full ring-1 ring-white/50"
              style={{ backgroundColor: tag.color || '#6B7280' }}
            />
            {tag.name || 'Unnamed Tag'}
            {isGlobal && (
              <Badge
                variant="secondary"
                className="bg-blue-100/80 text-blue-700 text-xs px-2 py-0.5 flex items-center gap-1"
              >
                <Globe className="h-2.5 w-2.5" />
                Global
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            View detailed information about this tag and see how it appears on events.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6 py-4">
          {/* Tag Preview using Real EventCard */}
          <Card variant="embedded" className="bg-gradient-to-r from-gray-50/80 to-blue-50/30">
            <CardHeader>
              <CardTitle className="text-lg">Tag Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <EventCard
                id="preview-event"
                title="Sample Yoga Class"
                dateTime="2024-12-20T09:00:00Z"
                location="Studio A"
                imageQuery="yoga class studio"
                tags={[tag]}
                variant="minimal"
                forceMobile={false}
              />
            </CardContent>
          </Card>

          {/* Tag Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Basic Info */}
            <Card variant="embedded">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  Basic Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Name:</span>
                  <p className="text-sm">{tag.name || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Slug:</span>
                  <p className="text-sm font-mono bg-gray-100 px-2 py-1 rounded text-xs">
                    {tag.slug || 'N/A'}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Color:</span>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded border"
                      style={{ backgroundColor: tag.color || '#6B7280' }}
                    />
                    <span className="text-sm font-mono">
                      {tag.color || '#6B7280'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Classification */}
            <Card variant="embedded">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Classification
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {tag.classType && tag.classType.length > 0 && (
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Class Type:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {tag.classType.map((type, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {tag.audience && tag.audience.length > 0 && (
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Target Audience:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {tag.audience.map((aud, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {aud}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {tag.priority && (
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Priority:</span>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="h-3 w-3" />
                      <span className="text-sm">
                        {priorityLabels[tag.priority as keyof typeof priorityLabels] || 'Unknown'}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Call to Action */}
          {tag.cta && tag.cta.label && tag.cta.url && (
            <Card variant="embedded">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Call to Action
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">{tag.cta.label}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {tag.cta.url}
                    </p>
                  </div>
                  <Button size="sm" asChild>
                    <a
                      href={tag.cta.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1"
                    >
                      Preview
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Image */}
          {tag.imageUrl && (
            <Card variant="embedded">
              <CardHeader>
                <CardTitle className="text-base">Tag Image</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={tag.imageUrl}
                    alt={`Image for ${tag.name}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                      e.currentTarget.nextElementSibling?.classList.remove('hidden')
                    }}
                  />
                  <div className="hidden w-full h-full flex items-center justify-center text-muted-foreground">
                    <p className="text-sm">Failed to load image</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter className="flex-shrink-0 border-t pt-4 mt-4">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          {canEdit && (
            <Button onClick={onEdit} variant="glass" className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Edit Tag
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 