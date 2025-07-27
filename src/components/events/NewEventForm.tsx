'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/form-field'
import { UnifiedDialog } from '@/components/ui/unified-dialog'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { X, Plus, Calendar, Clock } from 'lucide-react'

interface NewEventFormProps {
  isOpen: boolean
  onSave: (eventData: CreateEventData | (CreateEventData & { id: string })) => Promise<void>
  onCancel: () => void
  availableTags?: Array<{ id: string; name: string; color: string }>
  isSubmitting?: boolean
  editEvent?: EditEventData | null
}

export interface CreateEventData {
  summary: string
  description?: string
  start: {
    dateTime?: string
    date?: string
    timeZone?: string
  }
  end: {
    dateTime?: string
    date?: string
    timeZone?: string
  }
  location?: string
  tags?: string[]
  visibility?: 'public' | 'private'
}

export interface EditEventData extends CreateEventData {
  id: string
}

// Utility function to convert ISO date to datetime-local format
const formatDateForInput = (isoDate: string): string => {
  if (!isoDate) return ''
  
  try {
    const date = new Date(isoDate)
    // Check if date is valid
    if (isNaN(date.getTime())) return ''
    
    // Format as YYYY-MM-DDTHH:MM for datetime-local input
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    
    return `${year}-${month}-${day}T${hours}:${minutes}`
  } catch {
    return ''
  }
}

// Utility function to convert datetime-local format to ISO string
const formatDateToISO = (dateTimeLocal: string): string => {
  if (!dateTimeLocal) return ''
  
  try {
    // datetime-local gives us format: YYYY-MM-DDTHH:MM
    // We need to convert it to ISO string
    const date = new Date(dateTimeLocal)
    return date.toISOString()
  } catch {
    return ''
  }
}

export function NewEventForm({ 
  isOpen, 
  onSave, 
  onCancel, 
  availableTags = [],
  isSubmitting = false,
  editEvent = null
}: NewEventFormProps) {
  
  const isEditing = !!editEvent
  
  // Form state
  const [formData, setFormData] = useState<CreateEventData>({
    summary: '',
    description: '',
    start: {
      dateTime: '',
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
    },
    end: {
      dateTime: '',
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
    },
    location: '',
    tags: [],
    visibility: 'public'
  })

  // Load edit data when editEvent changes
  useEffect(() => {
    if (editEvent) {
      setFormData({
        summary: editEvent.summary,
        description: editEvent.description || '',
        start: {
          dateTime: formatDateForInput(editEvent.start.dateTime || ''),
          timeZone: editEvent.start.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        end: {
          dateTime: formatDateForInput(editEvent.end.dateTime || ''),
          timeZone: editEvent.end.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        location: editEvent.location || '',
        tags: editEvent.tags || [],
        visibility: editEvent.visibility || 'public'
      })
    } else {
      // Reset to empty form for create mode
      setFormData({
        summary: '',
        description: '',
        start: {
          dateTime: '',
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        end: {
          dateTime: '',
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        location: '',
        tags: [],
        visibility: 'public'
      })
    }
  }, [editEvent])

  // Additional validation for date logic
  const isDateValid = () => {
    if (!formData.start.dateTime || !formData.end.dateTime) return true // Let required validation handle empty fields
    
    const startDate = new Date(formData.start.dateTime)
    const endDate = new Date(formData.end.dateTime)
    
    return startDate < endDate
  }

  const getDateValidationError = () => {
    if (!formData.start.dateTime || !formData.end.dateTime) return ''
    if (!isDateValid()) return 'End time must be after start time'
    return ''
  }

  // Form validation
  const isValid = formData.summary.trim() && formData.start.dateTime && formData.end.dateTime && isDateValid()

  const handleFieldChange = (field: string, value: string) => {
    if (field.startsWith('start.') || field.startsWith('end.')) {
      const [section, subField] = field.split('.')
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section as 'start' | 'end'],
          [subField]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const handleTagAdd = (tagId: string) => {
    if (!formData.tags?.includes(tagId)) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagId]
      }))
    }
  }

  const handleTagRemove = (tagId: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(id => id !== tagId) || []
    }))
  }

  const handleSubmit = async () => {
    if (!isValid) return
    
    try {
      // Convert datetime-local values to ISO strings for API
      const submissionData = {
        ...formData,
        start: {
          ...formData.start,
          dateTime: formatDateToISO(formData.start.dateTime || '')
        },
        end: {
          ...formData.end,
          dateTime: formatDateToISO(formData.end.dateTime || '')
        }
      }

      if (isEditing && editEvent) {
        // For edit mode, include the event ID
        await onSave({ ...submissionData, id: editEvent.id })
      } else {
        // For create mode
        await onSave(submissionData)
      }
      
      // Don't reset form if editing, parent will close modal
      if (!isEditing) {
        setFormData({
          summary: '',
          description: '',
          start: {
            dateTime: '',
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
          },
          end: {
            dateTime: '',
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
          },
          location: '',
          tags: [],
          visibility: 'public'
        })
      }
    } catch {
      // Error is handled by parent component
    }
  }

  const footerContent = (
    <>
      <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
        Cancel
      </Button>
      <Button 
        onClick={handleSubmit}
        disabled={!isValid || isSubmitting}
        className="min-w-[120px]"
      >
        {isSubmitting ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Event' : 'Create Event')}
      </Button>
    </>
  )

  const selectedTags = availableTags.filter(tag => formData.tags?.includes(tag.id))
  const unselectedTags = availableTags.filter(tag => !formData.tags?.includes(tag.id))

  // Visibility options for the Select component
  const visibilityOptions = [
    { value: 'public', label: 'Public - Visible on your profile' },
    { value: 'private', label: 'Private - Hidden from public view' }
  ]

  return (
    <UnifiedDialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onCancel()
      }}
      title={isEditing ? 'Edit Event' : 'Create New Event'}
      description={isEditing 
        ? 'Update your yoga class details. Changes will sync to Google Calendar.'
        : 'Create a new yoga class that will sync to your Google Calendar and appear on your public profile.'
      }
      size="xl"
      footer={footerContent}
    >
      <div className="space-y-8">
        {/* Basic Information */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Event Details
          </h3>

          <div className="space-y-4">
            <FormField
              label="Event Title"
              required
              type="text"
              value={formData.summary}
              onChange={(e) => handleFieldChange('summary', e.target.value)}
              placeholder="e.g. Hatha Yoga for Beginners"
              disabled={isSubmitting}
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Description
              </label>
              <Textarea
                value={formData.description || ''}
                onChange={(e) => handleFieldChange('description', e.target.value)}
                placeholder="Add class details, level, what to bring..."
                rows={3}
                disabled={isSubmitting}
                className="resize-none"
              />
            </div>

            <FormField
              label="Location"
              type="text"
              value={formData.location || ''}
              onChange={(e) => handleFieldChange('location', e.target.value)}
              placeholder="e.g. Yoga Studio, Online, or Address"
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Date & Time */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Schedule
            <span className="text-sm font-normal text-muted-foreground ml-auto">
              Timezone: {Intl.DateTimeFormat().resolvedOptions().timeZone}
            </span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <FormField
                label="Start Date & Time"
                required
                type="datetime-local"
                value={formData.start.dateTime}
                onChange={(e) => handleFieldChange('start.dateTime', e.target.value)}
                disabled={isSubmitting}
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground">
                When does your class begin?
              </p>
            </div>

            <div className="space-y-2">
              <FormField
                label="End Date & Time"
                required
                type="datetime-local"
                value={formData.end.dateTime}
                onChange={(e) => handleFieldChange('end.dateTime', e.target.value)}
                disabled={isSubmitting}
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground">
                When does your class end?
              </p>
            </div>
          </div>

          {/* Quick duration buttons */}
          {formData.start.dateTime && (
            <div className="space-y-3">
              <p className="text-sm font-medium text-muted-foreground">Quick duration:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: '60 min', minutes: 60 },
                  { label: '75 min', minutes: 75 },
                  { label: '90 min', minutes: 90 },
                  { label: '2 hours', minutes: 120 }
                ].map(({ label, minutes }) => (
                  <Button
                    key={minutes}
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isSubmitting}
                    onClick={() => {
                      if (formData.start.dateTime) {
                        const startDate = new Date(formData.start.dateTime)
                        const endDate = new Date(startDate.getTime() + minutes * 60000)
                        const endDateTimeLocal = formatDateForInput(endDate.toISOString())
                        handleFieldChange('end.dateTime', endDateTimeLocal)
                      }
                    }}
                    className="text-xs"
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>
          )}
          
          {/* Date validation error */}
          {getDateValidationError() && (
            <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md p-3">
              {getDateValidationError()}
            </div>
          )}
        </div>

        {/* Tags */}
        {availableTags.length > 0 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Tags & Categories</h3>
            
            {/* Selected Tags */}
            {selectedTags.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm font-medium text-muted-foreground">Selected tags:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedTags.map(tag => (
                    <Badge
                      key={tag.id}
                      variant="default"
                      style={{ backgroundColor: tag.color }}
                      className="flex items-center gap-1 text-white"
                    >
                      {tag.name}
                      <button
                        type="button"
                        onClick={() => handleTagRemove(tag.id)}
                        disabled={isSubmitting}
                        className="ml-1 hover:bg-white/20 rounded-full p-0.5 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Available Tags */}
            {unselectedTags.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm font-medium text-muted-foreground">Add tags:</p>
                <div className="flex flex-wrap gap-2">
                  {unselectedTags.map(tag => (
                    <Badge
                      key={tag.id}
                      variant="outline"
                      className="cursor-pointer hover:bg-accent hover:text-accent-foreground flex items-center gap-1 transition-colors"
                      onClick={() => handleTagAdd(tag.id)}
                    >
                      <Plus className="w-3 h-3" />
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Visibility */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Privacy</h3>
          <Select
            label="Visibility"
            options={visibilityOptions}
            value={formData.visibility || 'public'}
            onChange={(value) => handleFieldChange('visibility', value)}
            disabled={isSubmitting}
            placeholder="Select visibility..."
          />
        </div>
      </div>
    </UnifiedDialog>
  )
} 