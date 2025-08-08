'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { 
  generateInvoiceNumber, 
  generateGermanCompliantInvoiceNumber,
  calculateEventPayout, 
  EventWithStudio,
  InvoiceWithDetails,
  getUserInvoiceSettings
} from '@/lib/invoice-utils'

interface EditableEventData {
  id: string
  title: string
  rate: number
  date: string
  studentsStudio: number
  studentsOnline: number
  // If user overrides the calculated rate, store it here
  overrideRate?: number | null
}

interface UseInvoiceCreationStateProps {
  isOpen: boolean
  userId: string
  eventIds: string[]
  events: EventWithStudio[]
  mode?: 'create' | 'edit'
  existingInvoice?: InvoiceWithDetails
}

export function useInvoiceCreationState({ 
  isOpen, 
  userId,
  eventIds, 
  events, 
  mode, 
  existingInvoice 
}: UseInvoiceCreationStateProps) {
  const [invoiceNumber, setInvoiceNumber] = useState('')
  const [notes, setNotes] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)
  const [editableEvents, setEditableEvents] = useState<EditableEventData[]>([])

  // Memoize selected events to prevent unnecessary recalculations
  const selectedEvents = useMemo(() => {
    if (!eventIds.length || !events.length) return []
    return events.filter(event => eventIds.includes(event.id))
  }, [events, eventIds])

  // Quick lookup by id
  const selectedEventById = useMemo(() => {
    const map = new Map<string, EventWithStudio>()
    selectedEvents.forEach(e => map.set(e.id, e))
    return map
  }, [selectedEvents])

  // Helper to compute current rate for an item based on counts and studio config,
  // unless the user provided an overrideRate.
  const computeItemRate = useCallback((item: EditableEventData): number => {
    if (item.overrideRate != null) return item.overrideRate
    const baseEvent = selectedEventById.get(item.id)
    const rateSource = existingInvoice?.studio || baseEvent?.studio
    if (!rateSource) return 0
    // Build a minimal event object with only the properties used by the calculator
    // Build a compatible object using the original event as base to satisfy typing
    const base = selectedEventById.get(item.id)
    const mergedEvent = base
      ? ({
          ...base,
          students_studio: item.studentsStudio,
          students_online: item.studentsOnline,
        } as EventWithStudio)
      : ({ students_studio: item.studentsStudio, students_online: item.studentsOnline } as unknown as EventWithStudio)
    return calculateEventPayout(mergedEvent as EventWithStudio, rateSource)
  }, [existingInvoice?.studio, selectedEventById])

  // Calculate total amount using computed rates
  const totalAmount = useMemo(() => {
    return editableEvents.reduce((sum, item) => sum + computeItemRate(item), 0)
  }, [editableEvents, computeItemRate])

  // Detect if there are any changes (for edit mode)
  const hasChanges = useMemo(() => {
    if (mode !== 'edit' || !existingInvoice) return false
    
    // Check if invoice number changed
    if (invoiceNumber !== existingInvoice.invoice_number) return true
    
    // Check if notes changed
    if (notes !== (existingInvoice.notes || '')) return true
    
    // Check if any event data changed
    const originalEvents = existingInvoice.events
    if (editableEvents.length !== originalEvents.length) return true
    
    for (let i = 0; i < editableEvents.length; i++) {
      const editable = editableEvents[i]
      const original = originalEvents[i]
      
      if (!original) return true
      
      // Check title, student counts
      if (editable.title !== (original.title || 'Untitled Event')) return true
      if (editable.studentsStudio !== (original.students_studio || 0)) return true
      if (editable.studentsOnline !== (original.students_online || 0)) return true
      
      // Check if rate changed (this would indicate student count changes affected the rate)
      const originalRate = existingInvoice.studio ? calculateEventPayout(original, existingInvoice.studio) : 0
      if (Math.abs(editable.rate - originalRate) > 0.01) return true
    }
    
    return false
  }, [mode, existingInvoice, invoiceNumber, notes, editableEvents])

  // Initialize editable events when modal opens with events
  useEffect(() => {
    if (isOpen && selectedEvents.length > 0 && editableEvents.length === 0) {
      // For both create and edit, derive from selectedEvents (in edit, caller injects studio on events)
      // Prefer invoice.studio as the authoritative rate source when available
      const items: EditableEventData[] = selectedEvents.map(event => {
        const rateSource = existingInvoice?.studio || event.studio
        const initialRate = rateSource
          ? calculateEventPayout(
              ({
                ...event,
                students_studio: event.students_studio || 0,
                students_online: event.students_online || 0,
              } as unknown as EventWithStudio),
              rateSource
            )
          : 0
        return {
          id: event.id,
          title: event.title || 'Untitled Event',
          rate: initialRate,
          date: event.start_time ? new Date(event.start_time).toLocaleDateString() : 'No date',
          studentsStudio: event.students_studio || 0,
          studentsOnline: event.students_online || 0,
          overrideRate: null,
        }
      })

      setEditableEvents(items)
    }
  }, [isOpen, selectedEvents, editableEvents.length, existingInvoice?.studio])

  // Generate invoice number when modal opens
  useEffect(() => {
    if (isOpen && !invoiceNumber) {
      if (mode === 'edit' && existingInvoice?.invoice_number) {
        // In edit mode, use existing invoice number
        setInvoiceNumber(existingInvoice.invoice_number)
      } else {
        // In create mode, generate new German-compliant invoice number
        const generateNumber = async () => {
          try {
            // Get user's invoice settings to get their preferred prefix
            const userSettings = await getUserInvoiceSettings(userId)
            const userPrefix = userSettings?.invoice_number_prefix || ''
            
            // Get studio name for entity abbreviation
            const studioName = selectedEvents[0]?.studio?.entity_name || 'INV'
            
            const newInvoiceNumber = await generateGermanCompliantInvoiceNumber(
              userId, 
              studioName,  // Pass studio name for entity abbreviation
              userPrefix
            )
            setInvoiceNumber(newInvoiceNumber)
          } catch (error) {
            console.error('Error generating German-compliant invoice number:', error)
            // Fallback to old method
            setInvoiceNumber(generateInvoiceNumber('INV'))
          }
        }
        
        generateNumber()
      }
    }
  }, [isOpen, invoiceNumber, mode, existingInvoice, userId, selectedEvents])

  // Initialize notes from existing invoice in edit mode
  useEffect(() => {
    if (isOpen && mode === 'edit' && existingInvoice?.notes && !notes) {
      setNotes(existingInvoice.notes)
    }
  }, [isOpen, mode, existingInvoice, notes])

  // Reset all state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setShowSuccess(false)
      setNotes('')
      setInvoiceNumber('')
      setEditableEvents([])
    }
  }, [isOpen])

  // Handle event updates
  const handleEventUpdate = (eventId: string, newTitle: string, newRate: number, newStudentsStudio?: number, newStudentsOnline?: number) => {
    setEditableEvents(prev => 
      prev.map(item => 
        item.id === eventId 
          ? { 
              ...item, 
              title: newTitle, 
              // store manual override while also keeping local display rate
              rate: newRate,
              overrideRate: newRate,
              studentsStudio: newStudentsStudio ?? item.studentsStudio,
              studentsOnline: newStudentsOnline ?? item.studentsOnline
            }
          : item
      )
    )
  }

  // Remove an event from the invoice being edited/created
  const removeEvent = (eventId: string) => {
    setEditableEvents(prev => prev.filter(item => item.id !== eventId))
  }

  return {
    // State
    invoiceNumber,
    setInvoiceNumber,
    notes,
    setNotes,
    showSuccess,
    setShowSuccess,
    editableEvents,
    selectedEvents,
    totalAmount,
    
    // Handlers
    handleEventUpdate,
    computeItemRate,
    removeEvent,
    
    // Status
    isReady: isOpen && editableEvents.length > 0,
    hasChanges
  }
} 