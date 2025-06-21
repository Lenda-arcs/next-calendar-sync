'use client'

import React, { useState, useEffect } from 'react'
import { EventTag } from '@/lib/event-types'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/form-field'
import { Card, CardContent } from '@/components/ui/card'
import { Select } from '@/components/ui/select'

interface Props {
  isOpen: boolean
  isEditing: boolean
  initialTag: EventTag | null
  onSave: (tag: EventTag) => void
  onCancel: () => void
  userId: string
}

const colorOptions = [
  '#8B5CF6', // Violet (Primary yoga color)
  '#EC4899', // Pink (Restorative/gentle)
  '#10B981', // Emerald (All levels/balance)
  '#F59E0B', // Amber (Energy/morning)
  '#06B6D4', // Cyan (Calm/beginner)
  '#EF4444', // Red (Power/advanced)
  '#F97316', // Orange (Strength/intermediate)
  '#6B7280', // Gray (Neutral/general)
  '#84CC16', // Lime (Fresh/renewal)
  '#14B8A6', // Teal (Meditation/mindfulness)
  '#A855F7', // Purple (Spiritual/deep practice)
  '#EAB308', // Yellow (Joy/sunshine)
]

const audienceOptions = [
  'All Levels',
  'Beginner Friendly',
  'Intermediate',
  'Advanced',
]

const priorityOptions = [
  { value: 1, label: 'High' },
  { value: 2, label: 'Medium' },
  { value: 3, label: 'Low' },
]

export const NewTagForm: React.FC<Props> = ({
  isOpen,
  isEditing,
  initialTag,
  onSave,
  onCancel,
  userId,
}) => {
  const [formData, setFormData] = useState<Partial<EventTag>>({
    name: '',
    color: colorOptions[0],
    classType: [],
    audience: null,
    cta: null,
    priority: null,
    imageUrl: null,
  })

  // Update form data when initialTag changes
  useEffect(() => {
    if (initialTag && isEditing) {
      setFormData({
        id: initialTag.id,
        name: initialTag.name,
        slug: initialTag.slug,
        color: initialTag.color,
        classType: initialTag.classType,
        audience: initialTag.audience,
        cta: initialTag.cta,
        priority: initialTag.priority,
        imageUrl: initialTag.imageUrl,
        userId: initialTag.userId,
      })
    } else if (!isEditing) {
      setFormData({
        name: '',
        color: colorOptions[0],
        classType: [],
        audience: null,
        cta: null,
        priority: null,
        imageUrl: null,
      })
    }
  }, [initialTag, isEditing])

  const handleSubmit = () => {
    if (!formData.name?.trim()) return

    // Generate slug from name
    const slug = formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

    const tagData: EventTag = {
      id: formData.id || '',
      slug,
      name: formData.name.trim(),
      color: formData.color || colorOptions[0],
      classType: formData.classType || [],
      audience: formData.audience,
      cta: formData.cta?.label && formData.cta?.url ? formData.cta : null,
      priority: formData.priority,
      imageUrl: formData.imageUrl,
      userId: isEditing ? formData.userId : userId,
      chip: {
        color: formData.color || colorOptions[0]
      }
    }

    onSave(tagData)
  }

  const handleCtaChange = (field: 'label' | 'url', value: string) => {
    setFormData(prev => ({
      ...prev,
      cta: {
        label: field === 'label' ? value : prev.cta?.label || '',
        url: field === 'url' ? value : prev.cta?.url || '',
      }
    }))
  }

  const handleClassTypeChange = (value: string) => {
    if (!value.trim()) {
      setFormData(prev => ({ ...prev, classType: [] }))
      return
    }
    
    const types = value.split(',').map(s => s.trim()).filter(Boolean)
    setFormData(prev => ({ ...prev, classType: types }))
  }

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col backdrop-blur-md border-white/40 shadow-xl">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>
            {isEditing ? 'Edit Tag' : 'Create New Tag'}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Update the tag information and settings below.' 
              : 'Create a new tag to enrich your events with custom styling and metadata.'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6 py-4 px-1">
          {/* Tag Name */}
          <FormField
            id="tagName"
            label="Tag Name"
            type="text"
            value={formData.name || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="e.g. Vinyasa Flow"
            required
          />

          {/* Color Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Color</label>
            <div className="flex flex-wrap gap-3 p-1">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, color }))}
                  className={`w-10 h-10 rounded-xl transition-all duration-200 hover:scale-110 backdrop-blur-md border-2 shadow-lg ${
                    formData.color === color
                      ? 'ring-2 ring-offset-2 ring-ring border-white/80 shadow-xl scale-105'
                      : 'border-white/50 hover:border-white/70 hover:shadow-xl'
                  }`}
                  style={{ backgroundColor: color }}
                  aria-label={`Select color ${color}`}
                />
              ))}
            </div>
          </div>

          {/* Class Type */}
          <FormField
            id="classType"
            label="Class Type"
            type="text"
            value={formData.classType?.join(', ') || ''}
            onChange={(e) => handleClassTypeChange(e.target.value)}
            placeholder="e.g. Vinyasa, Flow (comma-separated)"
          />

          {/* Audience */}
          <div className="space-y-2">
            <Select
              id="audience"
              label="Target Audience"
              options={audienceOptions.map(audience => ({
                value: audience,
                label: audience
              }))}
              value={formData.audience?.[0] || ''}
              onChange={(value) => setFormData(prev => ({ 
                ...prev, 
                audience: value ? [value] : null 
              }))}
                             placeholder="Select target audience..."
            />
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Select
              id="priority"
              label="Priority"
              options={priorityOptions.map(option => ({
                value: option.value.toString(),
                label: option.label
              }))}
              value={formData.priority?.toString() || ''}
              onChange={(value) => setFormData(prev => ({ 
                ...prev, 
                priority: value ? parseInt(value) : null 
              }))}
                             placeholder="Select priority..."
            />
          </div>

          {/* Call to Action */}
          <Card variant="embedded">
            <CardContent className="pt-4">
              <label className="text-sm font-medium mb-3 block text-foreground">Call to Action (Optional)</label>
              <div className="space-y-3">
                <FormField
                  id="ctaLabel"
                  label="Button Label"
                  type="text"
                  value={formData.cta?.label || ''}
                  onChange={(e) => handleCtaChange('label', e.target.value)}
                  placeholder="e.g. Book Now"
                  labelClassName="text-xs"
                />
                <FormField
                  id="ctaUrl"
                  label="Button URL"
                  type="url"
                  value={formData.cta?.url || ''}
                  onChange={(e) => handleCtaChange('url', e.target.value)}
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
            onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
            placeholder="https://example.com/image.jpg"
          />

        </div>

        <DialogFooter className="flex-shrink-0 border-t pt-4 mt-4">
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button 
            type="button" 
            variant="glass" 
            disabled={!formData.name?.trim()}
            onClick={handleSubmit}
          >
            {isEditing ? 'Update Tag' : 'Create Tag'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 