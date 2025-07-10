'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { UnifiedDialog } from "@/components/ui/unified-dialog"
import { Badge } from "@/components/ui/badge"
import { CalendarItemCard } from "./CalendarItemCard"
import { useCalendarSelection } from "@/lib/hooks"
import { CalendarItem } from "@/lib/types"
import { toast } from "sonner"
import { Calendar, Globe, Loader2 } from "lucide-react"

interface CalendarSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (selectedCount: number) => void
  calendars?: CalendarItem[]
  syncApproach?: 'yoga_only' | 'mixed_calendar'
}

export function CalendarSelectionModal({ isOpen, onClose, onSuccess, calendars: propCalendars = [], syncApproach = 'yoga_only' }: CalendarSelectionModalProps) {
  const [saving, setSaving] = useState(false)
  const { state, actions } = useCalendarSelection({ 
    calendars: propCalendars, 
    isOpen 
  })

  const handleSave = async () => {
    try {
      setSaving(true)
      
      const selectionArray = Object.entries(state.selections).map(([calendarId, selected]) => ({
        calendarId,
        selected
      }))

      const response = await fetch('/api/calendar-selection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          selections: selectionArray,
          sync_approach: syncApproach
        })
      })

      if (!response.ok) {
        throw new Error('Failed to save calendar selection')
      }

      const data = await response.json()
      toast.success(data.message || 'Calendar selection saved successfully')
      onSuccess(data.selectedCount)
      onClose()
    } catch (error) {
      console.error('Failed to save calendar selection:', error)
      toast.error('Failed to save calendar selection')
    } finally {
      setSaving(false)
    }
  }

  const footerContent = (
    <>
      <Button variant="outline" onClick={onClose} disabled={saving}>
        Cancel
      </Button>
      <Button 
        onClick={handleSave} 
        disabled={saving || !state.hasChanges}
        className="min-w-[140px]"
      >
        {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
        {saving ? 'Saving...' : state.hasChanges ? `Save Selection (${state.selectedCount})` : 'No Changes'}
      </Button>
    </>
  )

  return (
    <UnifiedDialog
      open={isOpen}
      onOpenChange={onClose}
      size="lg"
      title={
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Select Calendars to Sync
        </div>
      }
      description="Choose which Google calendars you want to sync with your schedule. Only events from selected calendars will appear in your app."
      footer={footerContent}
    >
      {propCalendars.length === 0 ? (
        <Card variant="ghost" className="text-center py-8">
          <CardContent>
            <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">
              No calendars found. Please reconnect your Google account.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {/* Select All / None */}
          <Card variant="glass" className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="select-all"
                  checked={state.allSelected}
                  onCheckedChange={actions.toggleAll}
                />
                <label htmlFor="select-all" className="font-medium cursor-pointer">
                  {state.allSelected ? 'Deselect All' : 'Select All'}
                </label>
              </div>
              <Badge variant="secondary" className="backdrop-blur-sm">
                {state.selectedCount} of {propCalendars.length} selected
              </Badge>
            </div>
          </Card>

          {/* Calendar List */}
          <div className="space-y-3">
            {propCalendars.map((calendar) => (
              <CalendarItemCard
                key={calendar.id}
                calendar={calendar}
                isSelected={state.selections[calendar.id] || false}
                onToggle={actions.toggleSelection}
              />
            ))}
          </div>

          {/* Info */}
          <Card variant="glass" className="p-4 bg-blue-50/50 dark:bg-blue-950/30 border-blue-200/50">
            <div className="flex items-start gap-3">
              <Globe className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                  About calendar sync
                </p>
                <p className="text-blue-700 dark:text-blue-300 leading-relaxed">
                  Selected calendars will sync automatically. You can change this selection anytime. 
                  Events will be processed with your existing tag rules and studio matching.
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </UnifiedDialog>
  )
} 