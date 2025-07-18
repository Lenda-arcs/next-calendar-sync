'use client'

import React, { useState } from 'react'
import { EventTag, EventDisplayVariant } from '@/lib/event-types'
import { UnifiedDialog } from '@/components/ui/unified-dialog'
import { Button } from '@/components/ui/button'
import { TagBadge } from '@/components/ui/tag-badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EventCard } from '@/components/events/EventCard'
import { EventCardVariantTabs } from '@/components/events/EventCardVariantTabs'
import { Edit, Globe, ExternalLink, Palette, Users, Star } from 'lucide-react'
import { PRIORITY_LABELS } from '@/lib/constants/tag-constants'

interface Props {
  tag: EventTag
  isOpen: boolean
  onClose: () => void
  onEdit: () => void
  canEdit: boolean
}

interface TagInfoSectionProps {
  title: string
  icon: React.ComponentType<{ className?: string }>
  children: React.ReactNode
}

const TagInfoSection: React.FC<TagInfoSectionProps> = ({ title, icon: Icon, children }) => (
  <Card variant="embedded">
    <CardHeader>
      <CardTitle className="text-base flex items-center gap-2">
        <Icon className="h-4 w-4" />
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-2">
      {children}
    </CardContent>
  </Card>
)

const InfoRow: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div>
    <span className="text-sm font-medium text-muted-foreground">{label}:</span>
    {children}
  </div>
)

export const TagViewDialog: React.FC<Props> = ({
  tag,
  isOpen,
  onClose,
  onEdit,
  canEdit,
}) => {
  const isGlobal = !tag.userId
  const [selectedVariant, setSelectedVariant] = useState<EventDisplayVariant>('compact')

  const titleContent = (
    <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-full ring-1 ring-white/50"
              style={{ backgroundColor: tag.color || '#6B7280' }}
            />
            {tag.name || 'Unnamed Tag'}
            {isGlobal && (
              <TagBadge
                variant="blue"
                className="text-xs px-2 py-0.5 flex items-center gap-1"
              >
                <Globe className="h-2.5 w-2.5" />
                Global
              </TagBadge>
            )}
    </div>
  )

  const footerContent = (
    <>
      <Button variant="secondary" onClick={onClose}>
        Close
      </Button>
      {canEdit && (
        <Button onClick={onEdit} variant="outline" className="flex items-center gap-2 backdrop-blur-md bg-white/50 border-white/40">
          <Edit className="h-4 w-4" />
          Edit Tag
        </Button>
      )}
    </>
  )

  return (
    <UnifiedDialog
      open={isOpen}
      onOpenChange={onClose}
      title={titleContent}
      description="View detailed information about this tag and see how it appears on events."
      size="xl"
      footer={footerContent}
    >
      <div className="space-y-4">
          {/* Tag Preview */}
          <Card variant="embedded" className="bg-gradient-to-r from-gray-50/80 to-blue-50/30">
            <CardHeader>
              <CardTitle className="text-lg">Tag Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* EventCard Preview */}
                <div className="flex justify-center">
                  <div className="w-full max-w-md">
                    <EventCard
                      id="preview-event"
                      title="Sample Yoga Class"
                      dateTime="2024-12-20T09:00:00Z"
                      location="Studio A"
                      imageQuery="yoga class studio"
                      tags={[tag]}
                      variant={selectedVariant}
                    />
                  </div>
                </div>
                
                {/* Variant Toggle Group */}
                <div className="flex justify-center">
                  <EventCardVariantTabs
                    value={selectedVariant}
                    onValueChange={setSelectedVariant}
                    size="sm"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* Basic Info */}
            <TagInfoSection title="Basic Info" icon={Palette}>
              <InfoRow label="Name">
                <p className="text-sm">{tag.name || 'N/A'}</p>
              </InfoRow>
              <InfoRow label="Slug">
                <p className="text-sm font-mono bg-gray-100 px-2 py-1 rounded text-xs">
                  {tag.slug || 'N/A'}
                </p>
              </InfoRow>
              <InfoRow label="Color">
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded border"
                    style={{ backgroundColor: tag.color || '#6B7280' }}
                  />
                  <span className="text-sm font-mono">
                    {tag.color || '#6B7280'}
                  </span>
                </div>
              </InfoRow>
            </TagInfoSection>

            {/* Classification */}
            <TagInfoSection title="Classification" icon={Users}>
              {tag.classType && tag.classType.length > 0 && (
                <InfoRow label="Class Type">
                  <div className="flex flex-wrap gap-1 mt-1">
                    {tag.classType.map((type, index) => (
                      <TagBadge key={index} variant="purple" className="text-xs">
                        {type}
                      </TagBadge>
                    ))}
                  </div>
                </InfoRow>
              )}
              
              {tag.audience && tag.audience.length > 0 && (
                <InfoRow label="Target Audience">
                  <div className="flex flex-wrap gap-1 mt-1">
                    {tag.audience.map((aud, index) => (
                      <TagBadge key={index} variant="blue" className="text-xs">
                        {aud}
                      </TagBadge>
                    ))}
                  </div>
                </InfoRow>
              )}

              {tag.priority && (
                <InfoRow label="Priority">
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="h-3 w-3" />
                    <span className="text-sm">
                      {PRIORITY_LABELS[tag.priority as keyof typeof PRIORITY_LABELS] || 'Unknown'}
                    </span>
                  </div>
                </InfoRow>
              )}
            </TagInfoSection>

            {/* Image & CTA */}
            {(tag.imageUrl || (tag.cta && tag.cta.label && tag.cta.url)) && (
              <TagInfoSection title="Media & Actions" icon={ExternalLink}>
                {tag.imageUrl && (
                  <InfoRow label="Image URL">
                    <p className="text-sm font-mono bg-gray-100 px-2 py-1 rounded text-xs line-clamp-2">
                      {tag.imageUrl}
                    </p>
                  </InfoRow>
                )}
                {tag.cta && tag.cta.label && tag.cta.url && (
                  <>
                    <InfoRow label="Button Label">
                      <p className="text-sm">{tag.cta.label}</p>
                    </InfoRow>
                    <InfoRow label="Button URL">
                      <p className="text-sm font-mono bg-gray-100 px-2 py-1 rounded text-xs line-clamp-2">
                        {tag.cta.url}
                      </p>
                    </InfoRow>
                  </>
                )}
              </TagInfoSection>
            )}
          </div>
        </div>
    </UnifiedDialog>
  )
} 