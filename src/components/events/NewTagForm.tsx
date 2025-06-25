'use client'

import React from 'react'
import { EventTag } from '@/lib/event-types'
import { UnifiedDialog } from '@/components/ui/unified-dialog'
import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/form-field'
import { Card, CardContent } from '@/components/ui/card'
import { Select } from '@/components/ui/select'
import { ColorPicker } from './ColorPicker'
import { useTagForm } from '@/lib/hooks/useTagForm'
import { AUDIENCE_OPTIONS, PRIORITY_OPTIONS } from '@/lib/constants/tag-constants'

interface Props {
  isOpen: boolean
  isEditing: boolean
  initialTag: EventTag | null
  onSave: (tag: EventTag) => void
  onCancel: () => void
  userId: string
}

export const NewTagForm: React.FC<Props> = ({
  isOpen,
  isEditing,
  initialTag,
  onSave,
  onCancel,
  userId,
}) => {
  const {
    formData,
    updateField,
    updateCta,
    updateClassType,
    buildEventTag,
    isValid,
  } = useTagForm({ initialTag, isEditing, userId })

  const handleSubmit = () => {
    if (!isValid) return
    const tagData = buildEventTag()
    onSave(tagData)
  }

  if (!isOpen) return null

  const footerContent = (
    <>
      <Button type="button" variant="secondary" onClick={onCancel}>
        Cancel
      </Button>
      <Button 
        type="button" 
        disabled={!isValid}
        onClick={handleSubmit}
      >
        {isEditing ? 'Update Tag' : 'Create Tag'}
      </Button>
    </>
  )

  return (
    <UnifiedDialog
      open={isOpen}
      onOpenChange={onCancel}
      title={isEditing ? 'Edit Tag' : 'Create New Tag'}
      description={isEditing 
        ? 'Update the tag information and settings below.' 
        : 'Create a new tag to enrich your events with custom styling and metadata.'
      }
      size="lg"
      footer={footerContent}
    >
      <div className="space-y-6">
          {/* Tag Name */}
          <FormField
            id="tagName"
            label="Tag Name"
            type="text"
            value={formData.name}
            onChange={(e) => updateField('name', e.target.value)}
            placeholder="e.g. Vinyasa Flow"
            required
          />

          {/* Color Selection */}
          <ColorPicker
            selectedColor={formData.color}
            onColorChange={(color) => updateField('color', color)}
          />

          {/* Class Type */}
          <FormField
            id="classType"
            label="Class Type"
            type="text"
            value={formData.classType.join(', ')}
            onChange={(e) => updateClassType(e.target.value)}
            placeholder="e.g. Vinyasa, Flow (comma-separated)"
          />

          {/* Audience */}
          <Select
            id="audience"
            label="Target Audience"
            options={AUDIENCE_OPTIONS.map(audience => ({
              value: audience,
              label: audience
            }))}
            value={formData.audience?.[0] || ''}
            onChange={(value) => updateField('audience', value ? [value] : null)}
            placeholder="Select target audience..."
          />

          {/* Priority */}
          <Select
            id="priority"
            label="Priority"
            options={PRIORITY_OPTIONS.map(option => ({
              value: option.value.toString(),
              label: option.label
            }))}
            value={formData.priority?.toString() || ''}
            onChange={(value) => updateField('priority', value ? parseInt(value) : null)}
            placeholder="Select priority..."
          />

          {/* Call to Action */}
          <Card variant="embedded">
            <CardContent className="pt-4">
              <label className="text-sm font-medium mb-3 block text-foreground">
                Call to Action (Optional)
              </label>
              <div className="space-y-3">
                <FormField
                  id="ctaLabel"
                  label="Button Label"
                  type="text"
                  value={formData.cta?.label || ''}
                  onChange={(e) => updateCta('label', e.target.value)}
                  placeholder="e.g. Book Now"
                  labelClassName="text-xs"
                />
                <FormField
                  id="ctaUrl"
                  label="Button URL"
                  type="url"
                  value={formData.cta?.url || ''}
                  onChange={(e) => updateCta('url', e.target.value)}
                  placeholder="e.g. https://example.com/book"
                  labelClassName="text-xs"
                />
              </div>
            </CardContent>
          </Card>

          {/* Image URL */}
          <FormField
            id="imageUrl"
            label="Image URL (Optional)"
            type="url"
            value={formData.imageUrl || ''}
            onChange={(e) => updateField('imageUrl', e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
      </div>
    </UnifiedDialog>
  )
} 