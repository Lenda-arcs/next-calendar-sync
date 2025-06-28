import { useState, useEffect, useMemo } from 'react'
import { 
  generateInvoiceNumber, 
  calculateEventPayout, 
  EventWithStudio 
} from '@/lib/invoice-utils'

interface EditableEventData {
  id: string
  title: string
  rate: number
  date: string
}

interface UseInvoiceCreationStateProps {
  isOpen: boolean
  eventIds: string[]
  events: EventWithStudio[]
}

export function useInvoiceCreationState({ 
  isOpen, 
  eventIds, 
  events 
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

  // Initialize editable events when modal opens with events
  useEffect(() => {
    if (isOpen && selectedEvents.length > 0 && editableEvents.length === 0) {
      const items: EditableEventData[] = selectedEvents.map(event => ({
        id: event.id,
        title: event.title || 'Untitled Event',
        rate: event.studio ? calculateEventPayout(event, event.studio) : 0,
        date: event.start_time ? new Date(event.start_time).toLocaleDateString() : 'No date'
      }))
      
      setEditableEvents(items)
    }
  }, [isOpen, selectedEvents, editableEvents.length])

  // Generate invoice number when modal opens
  useEffect(() => {
    if (isOpen && !invoiceNumber) {
      setInvoiceNumber(generateInvoiceNumber('INV'))
    }
  }, [isOpen, invoiceNumber])

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
  const handleEventUpdate = (eventId: string, newTitle: string, newRate: number) => {
    setEditableEvents(prev => 
      prev.map(item => 
        item.id === eventId 
          ? { ...item, title: newTitle, rate: newRate }
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
    isReady: isOpen && editableEvents.length > 0
  }
} 