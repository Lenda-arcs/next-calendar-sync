'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { UnifiedDialog } from '@/components/ui/unified-dialog'
import { useSupabaseMutation, useSupabaseQuery } from '@/lib/hooks/useQueryWithSupabase'
import { setupSubstituteEvent, setupSubstituteEventWithExistingEntity, InvoiceRecipient, getTeacherBillingEntities } from '@/lib/invoice-utils'
import { Event } from '@/lib/types'
import { toast } from 'sonner'
import { UserIcon, UserCheckIcon, Plus } from 'lucide-react'
import { Select } from '@/components/ui/select'
import BillingEntityFormModal from '@/components/billing/BillingEntityFormModal'
import type { BillingEntity, RecipientInfo } from '@/lib/types'

interface SubstituteEventModalProps {
  isOpen: boolean
  onClose: () => void
  event: Event | null
  events?: Event[]
  onSuccess?: () => void
}

type RecipientMode = 'existing' | 'new'

export function SubstituteEventModal({
  isOpen,
  onClose,
  event,
  events = [],
  onSuccess
}: SubstituteEventModalProps) {
  const [recipientMode, setRecipientMode] = useState<RecipientMode>('existing')
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('')
  const [showBillingEntityFormModal, setShowBillingEntityFormModal] = useState(false)
  const [formData, setFormData] = useState({
    // Common
    substituteNotes: ''
  })

  // Determine if we're in batch mode or single event mode
  const isBatchMode = events.length > 0
  const targetEvents = isBatchMode ? events : (event ? [event] : [])

  // Get first event's user ID to fetch teacher billing entities
  const userId = targetEvents[0]?.user_id

  // Get original studio's location_match for copying to new teacher entity
  const originalStudioId = targetEvents[0]?.studio_id
  
  // Fetch existing teacher billing entities
  const { data: teacherEntities, isLoading: entitiesLoading } = useSupabaseQuery(
    ['teacher-billing-entities', userId || 'none'],
    async () => {
      if (!userId) return []
      return await getTeacherBillingEntities(userId as string)
    },
    { enabled: !!userId && isOpen }
  )

  // Fetch original studio info to get location_match
  const { data: originalStudio } = useSupabaseQuery(
    ['original-studio', originalStudioId || 'none'],
    async () => {
      if (!originalStudioId) return null
      const { createClient } = await import('@/lib/supabase')
      const supabase = createClient()
      const { data, error } = await supabase
        .from('billing_entities')
        .select('*')
        .eq('id', originalStudioId)
        .single()
      
      if (error) throw error
      return data
    },
    { enabled: !!originalStudioId && isOpen && recipientMode === 'new' }
  )

  const setupMutation = useSupabaseMutation(
    async (supabase, data: { existingEntityId?: string; recipient?: InvoiceRecipient; notes: string }) => {
      if (targetEvents.length === 0) throw new Error('No events selected')
      
      if (data.existingEntityId) {
        // Use existing teacher entity
        const promises = targetEvents.map(evt => 
          setupSubstituteEventWithExistingEntity(evt.id, data.existingEntityId!, data.notes)
        )
        return await Promise.all(promises)
      } else if (data.recipient) {
        // Create new teacher entity
        if (!data.recipient.type) {
          throw new Error('Recipient type is undefined')
        }
        
        const promises = targetEvents.map(evt => 
          setupSubstituteEvent(evt.id, data.recipient!, data.notes)
        )
        return await Promise.all(promises)
      } else {
        throw new Error('Either existingEntityId or recipient must be provided')
      }
    },
    {
      onSuccess: () => {
      const eventCount = targetEvents.length
      toast.success(
        eventCount === 1 ? 'Teacher billing entity configured' : `${eventCount} events configured for teacher billing`, 
        {
          description: eventCount === 1 
            ? 'This event will now be billed to the teacher instead of the studio.'
            : `These ${eventCount} events will now be billed to teachers instead of studios.`,
        }
      )
      onSuccess?.()
      handleClose()
    },
    onError: (error) => {
      console.error('Failed to configure teacher billing:', error)
      toast.error('Failed to configure teacher billing', {
        description: 'There was an error setting up the teacher billing. Please try again.',
      })
      }
    }
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (recipientMode === 'existing') {
      if (!selectedTeacherId.trim()) {
        toast.error('Please select a teacher from the list')
        return
      }
      
      const selectedEntity = teacherEntities?.find(t => t.id === selectedTeacherId)
      if (!selectedEntity) {
        toast.error('Selected teacher entity not found')
        return
      }

      // Use existing teacher entity directly
      await setupMutation.mutateAsync({
        existingEntityId: selectedTeacherId,
        notes: formData.substituteNotes.trim()
      })
    } else {
              // New teacher - open BillingEntityFormModal
        setShowBillingEntityFormModal(true)
      return
    }
  }

  const handleClose = () => {
    setFormData({
      substituteNotes: ''
    })
    setRecipientMode('existing')
    setSelectedTeacherId('')
    setShowBillingEntityFormModal(false)
    onClose()
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleNewTeacherCreated = async (newTeacher: BillingEntity) => {
    // Close the modal first
    setShowBillingEntityFormModal(false)
    
    // Directly use the new teacher entity for the events
    await setupMutation.mutateAsync({
      existingEntityId: newTeacher.id,
      notes: formData.substituteNotes.trim()
    })
  }

  const isFormValid = () => {
    return recipientMode === 'existing' ? selectedTeacherId.trim() !== '' : true
  }

  // Filter and prepare teacher options for the select with location info
  const teacherOptions = teacherEntities?.map(entity => {
    const recipientInfo = entity.recipient_info as RecipientInfo | null
    const name = recipientInfo?.name || entity.entity_name
    
    return {
      value: entity.id,
      label: name,
      count: undefined,
      isPreferred: false
    }
  })
  // Sort alphabetically
  .sort((a, b) => a.label.localeCompare(b.label)) || []

  const footer = (
    <div className="flex justify-end space-x-3">
      <Button
        variant="outline"
        onClick={handleClose}
        disabled={setupMutation.isPending}
      >
        Cancel
      </Button>
      <Button
        onClick={handleSubmit}
        disabled={setupMutation.isPending || !isFormValid()}
      >
        {setupMutation.isPending ? 'Setting up...' : 
          isBatchMode ? `Change ${targetEvents.length} Events to Teacher Billing` : 'Change to Teacher Billing'}
      </Button>
    </div>
  )

  return (
    <UnifiedDialog
      open={isOpen}
      onOpenChange={handleClose}
      title={isBatchMode ? `Change to Teacher Billing (${targetEvents.length} events)` : 'Change to Teacher Billing'}
      description={
        isBatchMode 
          ? `Change the billing entity for ${targetEvents.length} selected events from studio to teacher.`
          : `Change the billing entity for &quot;${event?.title || 'this event'}&quot; from studio to teacher.`
      }
      size="lg"
      footer={footer}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Source Studio Information */}
        {originalStudio && (
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 text-gray-800 mb-2">
              <span className="font-medium">Converting from Studio:</span>
            </div>
            <div className="text-sm text-gray-600">
              <strong>{originalStudio.entity_name}</strong>
              {originalStudio.location_match && originalStudio.location_match.length > 0 && (
                <span className="text-gray-500 ml-2">
                  (matches: {originalStudio.location_match.join(', ')})
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Rate calculations will continue to use this studio&apos;s rates. The teacher profile is for payment recipient information only.
            </p>
          </div>
        )}

        {/* Teacher Selection Mode */}
        <div className="space-y-3">
          <Label className="text-base font-medium">Choose Teacher</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRecipientMode('existing')}
              className={`p-4 border-2 rounded-lg text-left transition-colors ${
                recipientMode === 'existing'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <UserCheckIcon className="w-5 h-5 text-green-600" />
                <span className="font-medium">Existing Teacher</span>
              </div>
              <p className="text-sm text-gray-600">
                Choose from your saved teacher contacts
              </p>
            </button>

            <button
              type="button"
              onClick={() => setRecipientMode('new')}
              className={`p-4 border-2 rounded-lg text-left transition-colors ${
                recipientMode === 'new'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <Plus className="w-5 h-5 text-blue-600" />
                <span className="font-medium">New Teacher</span>
              </div>
              <p className="text-sm text-gray-600">
                Add a new teacher contact
              </p>
            </button>
          </div>
        </div>

        {/* Show selected events in batch mode */}
        {isBatchMode && (
          <div className="space-y-3">
            <Label className="text-base font-medium">Selected Events ({targetEvents.length})</Label>
            <div className="max-h-40 overflow-y-auto border rounded-lg p-3 bg-gray-50">
              {targetEvents.map((evt) => (
                <div key={evt.id} className="flex justify-between items-center py-1 text-sm">
                  <span className="font-medium truncate flex-1 mr-2">
                    {evt.title || 'Untitled Event'}
                  </span>
                  <span className="text-gray-500 text-xs flex-shrink-0">
                    {evt.start_time ? new Date(evt.start_time).toLocaleDateString() : 'No date'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Existing Teacher Selection */}
        {recipientMode === 'existing' && (
          <div className="space-y-4 p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 text-green-800">
              <UserIcon className="w-4 h-4" />
              <span className="font-medium">Select Teacher</span>
            </div>
            
            {entitiesLoading ? (
              <div className="text-sm text-gray-600">Loading teachers...</div>
            ) : teacherOptions.length > 0 ? (
              <Select
                options={teacherOptions}
                value={selectedTeacherId}
                onChange={setSelectedTeacherId}
                placeholder="Choose a teacher..."
                disabled={setupMutation.isPending}
              />
            ) : (
              <div className="text-sm text-gray-600">
                No saved teacher contacts found. Use &quot;New Teacher&quot; to add one.
              </div>
            )}
          </div>
        )}

        {/* New Teacher Button */}
        {recipientMode === 'new' && (
          <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 text-blue-800">
              <Plus className="w-4 h-4" />
              <span className="font-medium">Create New Teacher Profile</span>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">
              Click the button below to create a new teacher billing profile with all necessary details.
            </p>
            
            <Button
              type="button"
              onClick={() => setShowBillingEntityFormModal(true)}
              className="w-full"
              disabled={setupMutation.isPending}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Teacher Profile
            </Button>
          </div>
        )}

        {/* Notes */}
        <div>
          <Label htmlFor="substituteNotes">Notes</Label>
          <Textarea
            id="substituteNotes"
            value={formData.substituteNotes}
            onChange={(e) => handleInputChange('substituteNotes', e.target.value)}
            placeholder="Add any notes about this billing change..."
            rows={3}
            disabled={setupMutation.isPending}
          />
        </div>

        {/* Error Display */}
        {setupMutation.error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">
              {setupMutation.error.message}
            </p>
          </div>
        )}
      </form>

      {/* BillingEntityFormModal for creating new teacher profiles */}
      <BillingEntityFormModal
        isOpen={showBillingEntityFormModal}
        onClose={() => setShowBillingEntityFormModal(false)}
        user={{ id: userId ?? '', email: null }}
        defaultEntityType="teacher"
        createTeacherForStudio={originalStudio as BillingEntity | null}
        onStudioCreated={handleNewTeacherCreated}
      />
    </UnifiedDialog>
  )
} 