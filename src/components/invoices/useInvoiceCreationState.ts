'use client'

import { useState, useEffect, useMemo } from 'react'
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

  // Calculate total amount
  const totalAmount = useMemo(() => {
    return editableEvents.reduce((sum, item) => sum + item.rate, 0)
  }, [editableEvents])

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
      let items: EditableEventData[]
      
      if (mode === 'edit' && existingInvoice) {
        // In edit mode, use existing invoice data and calculate rates using the invoice's studio
        items = existingInvoice.events.map(event => ({
          id: event.id,
          title: event.title || 'Untitled Event',
          rate: existingInvoice.studio ? calculateEventPayout(event, existingInvoice.studio) : 0,
          date: event.start_time ? new Date(event.start_time).toLocaleDateString() : 'No date',
          studentsStudio: event.students_studio || 0,
          studentsOnline: event.students_online || 0
        }))
      } else {
        // In create mode, calculate from selected events
        items = selectedEvents.map(event => ({
          id: event.id,
          title: event.title || 'Untitled Event',
          rate: event.studio ? calculateEventPayout(event, event.studio) : 0,
          date: event.start_time ? new Date(event.start_time).toLocaleDateString() : 'No date',
          studentsStudio: event.students_studio || 0,
          studentsOnline: event.students_online || 0
        }))
      }
      
      setEditableEvents(items)
    }
  }, [isOpen, selectedEvents, editableEvents.length, mode, existingInvoice])

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
              rate: newRate,
              studentsStudio: newStudentsStudio ?? item.studentsStudio,
              studentsOnline: newStudentsOnline ?? item.studentsOnline
            }
          : item
      )
    )
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
    
    // Status
    isReady: isOpen && editableEvents.length > 0,
    hasChanges
  }
} 