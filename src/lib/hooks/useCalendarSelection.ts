import { useState, useEffect, useMemo } from 'react'
import { CalendarItem, CalendarSelectionState } from '@/lib/types'

interface UseCalendarSelectionProps {
  calendars: CalendarItem[]
  isOpen: boolean
}

export function useCalendarSelection({ calendars, isOpen }: UseCalendarSelectionProps) {
  const [selections, setSelections] = useState<Record<string, boolean>>({})
  const [initialSelections, setInitialSelections] = useState<Record<string, boolean>>({})

  // Initialize selections when modal opens
  useEffect(() => {
    if (isOpen && calendars.length > 0) {
      const initialState: Record<string, boolean> = {}
      calendars.forEach((cal) => {
        initialState[cal.id] = cal.selected
      })
      setSelections(initialState)
      setInitialSelections(initialState)
    }
  }, [isOpen, calendars])

  // Computed values
  const state: CalendarSelectionState = useMemo(() => {
    const selectedCount = Object.values(selections).filter(Boolean).length
    const allSelected = calendars.length > 0 && calendars.every(cal => selections[cal.id])
    const hasChanges = JSON.stringify(selections) !== JSON.stringify(initialSelections)

    return {
      selections,
      initialSelections,
      hasChanges,
      selectedCount,
      allSelected
    }
  }, [selections, initialSelections, calendars])

  // Actions
  const toggleSelection = (calendarId: string) => {
    setSelections(prev => ({
      ...prev,
      [calendarId]: !prev[calendarId]
    }))
  }

  const toggleAll = () => {
    const newSelections: Record<string, boolean> = {}
    calendars.forEach(cal => {
      newSelections[cal.id] = !state.allSelected
    })
    setSelections(newSelections)
  }

  const resetSelections = () => {
    setSelections(initialSelections)
  }

  return {
    state,
    actions: {
      toggleSelection,
      toggleAll,
      resetSelections
    }
  }
} 