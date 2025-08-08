'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
// import { Label } from '@/components/ui/label'
// import { Input } from '@/components/ui/input'
import EventScheduleDialog from './EventScheduleDialog'
import { FormField } from '@/components/ui/form-field'
import { UnifiedDialog } from '@/components/ui/unified-dialog'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { TagLibraryItem } from '@/components/tags'
import { Plus, Calendar, Clock, Trash2, Tag } from 'lucide-react'
import { getBrowserTimezone } from '@/lib/utils'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface NewEventFormProps {
  isOpen: boolean
  onSave: (eventData: CreateEventData | (CreateEventData & { id: string })) => Promise<void>
  onCancel: () => void
  onDelete?: (eventId: string) => Promise<void>
  availableTags?: Array<{ id: string; name: string; color: string; slug: string }>
  onCreateTag?: () => void
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
  custom_tags?: string[]
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
  onDelete,
  availableTags = [],
  onCreateTag,
  isSubmitting = false,
  editEvent = null
}: NewEventFormProps) {
  
  const isEditing = !!editEvent
  
  // State for deletion confirmation dialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false)

  // Initialize form data and reset on editEvent change
  const [formData, setFormData] = useState<CreateEventData>({
    summary: '',
    description: '',
    start: {
      dateTime: '',
      timeZone: getBrowserTimezone()
    },
    end: {
      dateTime: '',
      timeZone: getBrowserTimezone()
    },
    location: '',
    custom_tags: [],
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
          timeZone: editEvent.start.timeZone || getBrowserTimezone()
        },
        end: {
          dateTime: formatDateForInput(editEvent.end.dateTime || ''),
          timeZone: editEvent.end.timeZone || getBrowserTimezone()
        },
        location: editEvent.location || '',
        custom_tags: editEvent.custom_tags || [],
        visibility: editEvent.visibility || 'public'
      })
    } else {
      // Reset to empty form for create mode
      setFormData({
        summary: '',
        description: '',
        start: {
          dateTime: '',
          timeZone: getBrowserTimezone()
        },
        end: {
          dateTime: '',
          timeZone: getBrowserTimezone()
        },
        location: '',
        custom_tags: [],
        visibility: 'public'
      })
    }
    
  }, [editEvent, isOpen])

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

  const handleTagAdd = (tagSlug: string) => {
    if (!formData.custom_tags?.includes(tagSlug)) {
      setFormData(prev => ({
        ...prev,
        custom_tags: [...(prev.custom_tags || []), tagSlug]
      }))
    }
  }

  const handleTagRemove = (tagSlug: string) => {
    setFormData(prev => ({
      ...prev,
      custom_tags: prev.custom_tags?.filter(slug => slug !== tagSlug) || []
    }))
  }

  const handleDelete = async () => {
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!isEditing || !editEvent || !onDelete) return

    try {
      await onDelete(editEvent.id)
      setIsDeleteDialogOpen(false)
    } catch (error) {
      console.error('Failed to delete event:', error)
    }
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
            timeZone: getBrowserTimezone()
          },
          end: {
            dateTime: '',
            timeZone: getBrowserTimezone()
          },
          location: '',
          custom_tags: [],
          visibility: 'public'
        })
      }
    } catch {
      // Error is handled by parent component
    }
  }

  const footerContent = (
    <>
      <div className="flex gap-2">
        {isEditing && onDelete && (
          <Button 
            variant="destructive" 
            onClick={handleDelete} 
            disabled={isSubmitting}
            className="mr-auto"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        )}
      </div>
      <div className="flex gap-2">
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
      </div>
    </>
  )

  const selectedTags = availableTags.filter(tag => formData.custom_tags?.includes(tag.slug))
  const unselectedTags = availableTags.filter(tag => !formData.custom_tags?.includes(tag.slug))

  // Transform simple tags to EventTag format for TagLibraryItem
  const transformToEventTag = (tag: { id: string; name: string; color: string; slug: string }) => ({
    id: tag.id,
    slug: tag.slug,
    name: tag.name,
    color: tag.color,
    chip: { color: tag.color },
    classType: null,
    audience: null,
    cta: null,
    priority: null,
    userId: null
  })

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
              Timezone: {getBrowserTimezone()}
            </span>
          </h3>
          
          {/* Read-only summary + Edit schedule action */}
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground space-y-1">
              <div>
                <span className="font-medium text-foreground">Start:</span>
                <span className="ml-2">
                  {formData.start.dateTime ? new Date(formData.start.dateTime).toLocaleString() : 'Not set'}
                </span>
              </div>
              <div>
                <span className="font-medium text-foreground">End:</span>
                <span className="ml-2">
                  {formData.end.dateTime ? new Date(formData.end.dateTime).toLocaleString() : 'Not set'}
                </span>
              </div>
            </div>
            <div>
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                onClick={() => setIsScheduleDialogOpen(true)}
              >
                Edit schedule
              </Button>
            </div>
          </div>
          
          {/* Date validation error */}
          {getDateValidationError() && (
            <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md p-3">
              {getDateValidationError()}
            </div>
          )}
        </div>

        {/* Enhanced Tags Section */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Tag className="w-5 h-5" />
            Tags & Categories
          </h3>
          
          {/* Selected Tags */}
          {selectedTags.length > 0 && (
            <div className="space-y-3">
              <p className="text-sm font-medium text-muted-foreground">Selected tags:</p>
              <div className="flex flex-wrap gap-2">
                {selectedTags.map(tag => (
                  <TagLibraryItem
                    key={tag.id}
                    tag={transformToEventTag(tag)}
                    variant="compact"
                    isSelected={true}
                    showRemove={true}
                    onClick={() => {}} // No action on click for selected tags
                    onRemove={() => handleTagRemove(tag.slug)}
                  />
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
                  <TagLibraryItem
                    key={tag.id}
                    tag={transformToEventTag(tag)}
                    variant="compact"
                    isSelected={false}
                    onClick={() => handleTagAdd(tag.slug)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Create New Tag */}
          {onCreateTag && (
            <div className="space-y-3">
              <Button
                type="button"
                variant="outline"
                onClick={onCreateTag}
                disabled={isSubmitting}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create New Tag
              </Button>
            </div>
          )}
        </div>

        {/* Visibility */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Privacy & Visibility</h3>
          <Select
            label="Visibility"
            options={visibilityOptions}
            value={formData.visibility || 'public'}
            onChange={(value) => handleFieldChange('visibility', value)}
            disabled={isSubmitting}
            placeholder="Select visibility..."
          />
          <p className="text-sm text-muted-foreground">
            Public events appear on your teacher profile and can be found by students. 
            Private events are only visible to you and sync to your Google Calendar.
          </p>
        </div>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your event from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* Focused Schedule Dialog */}
      <EventScheduleDialog
        isOpen={isScheduleDialogOpen}
        onClose={() => setIsScheduleDialogOpen(false)}
        startDateTimeLocal={formData.start.dateTime || ''}
        endDateTimeLocal={formData.end.dateTime || ''}
        onApply={(updatedStartLocal, updatedEndLocal) => {
          handleFieldChange('start.dateTime', updatedStartLocal)
          handleFieldChange('end.dateTime', updatedEndLocal)
          setIsScheduleDialogOpen(false)
        }}
        isSubmitting={isSubmitting}
      />
    </UnifiedDialog>
  )
} 