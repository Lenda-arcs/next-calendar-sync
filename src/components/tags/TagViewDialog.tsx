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
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
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
      description="View details and preview how this tag appears on event cards."
      size="xl"
      footer={footerContent}
    >
      <div className="space-y-4">
          {/* Tag Preview (collapsible card – header always visible) */}
          <Accordion type="single" collapsible>
            <AccordionItem value="preview">
              <Card variant="default" className="p-0">
                <CardHeader className="py-2">
                  <AccordionTrigger className="w-full px-1 text-left no-underline">
                    <div className="flex items-center justify-between w-full">
                      <span className="text-base font-medium">Live Preview</span>
                      <span className="text-xs text-muted-foreground mr-2">Click to expand</span>
                    </div>
                  </AccordionTrigger>
                </CardHeader>
                <AccordionContent>
                  <CardContent>
                    <div className="flex items-center justify-between pb-2">
                      <CardTitle className="text-base">Preview</CardTitle>
                      <EventCardVariantTabs
                        value={selectedVariant}
                        onValueChange={setSelectedVariant}
                        size="sm"
                      />
                    </div>
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
                  </CardContent>
                </AccordionContent>
              </Card>
            </AccordionItem>
          </Accordion>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* Basic Info */}
            <TagInfoSection title="Basic Info" icon={Palette}>
              <InfoRow label="Name">
                <p className="text-sm">{tag.name || 'N/A'}</p>
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
                  <InfoRow label="Image">
                    <div className="mt-1">
                      {/* Thumbnail preview instead of raw URL */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={tag.imageUrl}
                        alt={`${tag.name || 'Tag'} image`}
                        className="h-16 w-28 object-cover rounded-md border"
                      />
                    </div>
                  </InfoRow>
                )}
                {tag.cta && tag.cta.label && tag.cta.url && (
                  <>
                    <InfoRow label="Button">
                      <div className="flex flex-col gap-1">
                        <Button
                          size="sm"
                          variant="default"
                          asChild
                          style={{
                            backgroundColor: tag.color || '#6B7280',
                            borderColor: tag.color || '#6B7280',
                            color: '#FFFFFF',
                          }}
                          className="shadow-sm h-7 text-xs px-2 rounded-xl w-fit"
                          aria-label={`${tag.cta.label} — opens in new tab`}
                        >
                          <a href={tag.cta.url} target="_blank" rel="noopener noreferrer">
                            {tag.cta.label}
                          </a>
                        </Button>
                        <a
                          href={tag.cta.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-muted-foreground underline break-all"
                        >
                          {tag.cta.url}
                        </a>
                      </div>
                    </InfoRow>
                    <div className="text-xs text-muted-foreground">
                      Higher priority tags are preferred when multiple tags define CTAs. On cards with multiple tag images, the CTA can change with the active image.
                    </div>
                  </>
                )}
              </TagInfoSection>
            )}
          </div>
        </div>
    </UnifiedDialog>
  )
} 