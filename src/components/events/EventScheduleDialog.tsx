'use client'

import React from 'react'
import { UnifiedDialog } from '@/components/ui/unified-dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Calendar } from '@/components/ui/calendar'

interface EventScheduleDialogProps {
  isOpen: boolean
  onClose: () => void
  startDateTimeLocal: string // datetime-local format: YYYY-MM-DDTHH:MM
  endDateTimeLocal: string   // datetime-local format: YYYY-MM-DDTHH:MM
  onApply: (updatedStartLocal: string, updatedEndLocal: string) => void
  isSubmitting?: boolean
}

// Convert Date to datetime-local string (YYYY-MM-DDTHH:MM)
const toLocalInput = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

export function EventScheduleDialog({
  isOpen,
  onClose,
  startDateTimeLocal,
  endDateTimeLocal,
  onApply,
  isSubmitting = false,
}: EventScheduleDialogProps) {
  const [startLocal, setStartLocal] = React.useState<string>(startDateTimeLocal)
  const [endLocal, setEndLocal] = React.useState<string>(endDateTimeLocal)

  React.useEffect(() => {
    if (isOpen) {
      setStartLocal(startDateTimeLocal)
      setEndLocal(endDateTimeLocal)
    }
  }, [isOpen, startDateTimeLocal, endDateTimeLocal])

  const startDate = React.useMemo(() => (startLocal ? new Date(startLocal) : new Date()), [startLocal])
  const endDate = React.useMemo(
    () => (endLocal ? new Date(endLocal) : new Date(startDate.getTime() + 60 * 60000)),
    [endLocal, startDate]
  )

  const applyDuration = (minutes: number) => {
    const newEnd = new Date(startDate.getTime() + minutes * 60000)
    setEndLocal(toLocalInput(newEnd))
  }

  const handleApply = React.useCallback(() => onApply(startLocal, endLocal), [onApply, startLocal, endLocal])

  const footer = (
    <div className="flex w-full items-center justify-end gap-2">
      <Button onClick={handleApply} disabled={isSubmitting} className="min-w-[120px]">
        Save
      </Button>
    </div>
  )

  return (
    <UnifiedDialog
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
      title="Edit Schedule"
      description="Pick the start date and time, then choose a duration."
      size="md"
      footer={footer}
    >
      <div className="space-y-4 md:space-y-6 pb-2">
        {/* Time selector (shown first on mobile for visibility) */}
        <div className="space-y-2 order-1 md:order-2">
          <Label htmlFor="start-time" className="text-sm">Start time</Label>
          <Input
            id="start-time"
            type="time"
            step="60"
            disabled={isSubmitting}
            value={(() => {
              const hh = String(startDate.getHours()).padStart(2, '0')
              const mm = String(startDate.getMinutes()).padStart(2, '0')
              return `${hh}:${mm}`
            })()}
            onChange={(e) => {
              const [hh, mm] = e.target.value.split(':').map((v) => parseInt(v, 10))
              const updated = new Date(startDate)
              updated.setHours(hh || 0, mm || 0, 0, 0)
              setStartLocal(toLocalInput(updated))
            }}
            className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden"
          />
        </div>

        {/* Duration pills */}
        <div className="space-y-2 order-2 md:order-3">
          <Label className="text-sm">Duration</Label>
          <div className="flex flex-wrap gap-2">
            {[60, 75, 90, 120].map((minutes) => (
              <Button
                key={minutes}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => applyDuration(minutes)}
              >
                {minutes === 120 ? '2 hours' : `${minutes} min`}
              </Button>
            ))}
          </div>
        </div>

        {/* Date selector (moved below on mobile) */}
        <div className="space-y-2 order-3 md:order-1">
          <Label className="block text-sm font-medium">Date</Label>
          <Calendar
            mode="single"
            captionLayout="dropdown"
            numberOfMonths={1}
            selected={startDate}
            onSelect={(date) => {
              if (!date) return
              const updated = new Date(startDate)
              updated.setFullYear(date.getFullYear(), date.getMonth(), date.getDate())
              setStartLocal(toLocalInput(updated))
              // Keep end duration relative if end is before start
              if (new Date(endLocal) <= updated) {
                const defaultEnd = new Date(updated.getTime() + 60 * 60000)
                setEndLocal(toLocalInput(defaultEnd))
              }
            }}
          />
        </div>

        {/* Summary */}
        <div className="text-sm text-muted-foreground order-4">
          <div>Start: {startDate.toLocaleString()}</div>
          <div>End: {endDate.toLocaleString()}</div>
        </div>
      </div>
    </UnifiedDialog>
  )
}

export default EventScheduleDialog


