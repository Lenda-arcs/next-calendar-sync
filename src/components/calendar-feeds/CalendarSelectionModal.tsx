'use client'

import React from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { UnifiedDialog } from "@/components/ui/unified-dialog"
import { Badge } from "@/components/ui/badge"
import { CalendarItemCard } from "./CalendarItemCard"
import { useCalendarSelection } from "@/lib/hooks"
import { CalendarItem } from "@/lib/types"
import { toast } from "sonner"
import { useSaveCalendarSelection } from "@/lib/hooks/useAppQuery"
import { Calendar, Loader2, Info } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface CalendarSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (selectedCount: number) => void
  calendars?: CalendarItem[]
}

export function CalendarSelectionModal({ 
  isOpen, 
  onClose, 
  onSuccess, 
  calendars: propCalendars = [] 
}: CalendarSelectionModalProps) {
  const { state, actions } = useCalendarSelection({ 
    calendars: propCalendars, 
    isOpen 
  })

  // ✨ NEW: Use unified mutation for calendar selection
  const saveCalendarSelectionMutation = useSaveCalendarSelection()

  const handleSave = async () => {
    try {
      const selectionArray = Object.entries(state.selections).map(([calendarId, selected]) => ({
        calendarId,
        selected
      }))

      // ✨ NEW: Use unified mutation for calendar selection
      await saveCalendarSelectionMutation.mutateAsync({
        selections: selectionArray,
        syncApproach: 'yoga_only' // Always use yoga_only for legacy API compatibility
      })

      const selectedCount = Object.values(state.selections).filter(Boolean).length
      toast.success(`Successfully connected ${selectedCount} calendar${selectedCount !== 1 ? 's' : ''}`)
      onSuccess(selectedCount)
      onClose()
    } catch (error) {
      console.error('Failed to save calendar selection:', error)
      toast.error('Failed to save calendar selection. Please try again.')
    }
  }

  const selectedCount = Object.values(state.selections).filter(Boolean).length
  const hasSelections = selectedCount > 0

  return (
    <UnifiedDialog
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
      title="Connect Your Calendars"
      description="Select which calendars to sync with your yoga teaching profile"
    >
      <div className="space-y-6">
        
        {/* Legacy Notice */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Note:</strong> This is our legacy calendar connection method. 
            For new setups, we recommend using our new <strong>Dedicated Yoga Calendar</strong> approach 
            which is more reliable and easier to manage.
          </AlertDescription>
        </Alert>

        {/* Calendar List */}
        <div className="space-y-3">
          {propCalendars.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <Calendar className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">No calendars available</p>
              </CardContent>
            </Card>
          ) : (
            propCalendars.map((calendar) => (
              <CalendarItemCard
                key={calendar.id}
                calendar={calendar}
                isSelected={!!state.selections[calendar.id]}
                onToggle={actions.toggleSelection}
              />
            ))
          )}
        </div>

        {/* Selection Summary */}
        {hasSelections && (
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">
                  {selectedCount} calendar{selectedCount !== 1 ? 's' : ''} selected
                </p>
                <p className="text-sm text-muted-foreground">
                  Events will be synced to your yoga teaching profile
                </p>
              </div>
              <Badge variant="secondary">
                Yoga Events Only
              </Badge>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={saveCalendarSelectionMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!hasSelections || saveCalendarSelectionMutation.isPending}
          >
            {saveCalendarSelectionMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Connecting...
              </>
            ) : (
              `Connect ${selectedCount} Calendar${selectedCount !== 1 ? 's' : ''}`
            )}
          </Button>
        </div>
      </div>
    </UnifiedDialog>
  )
} 