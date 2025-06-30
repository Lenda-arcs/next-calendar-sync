'use client'

import React, { useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Event, BillingEntity } from '@/lib/types'

import { cn } from '@/lib/utils'
import { Users } from 'lucide-react'

interface EventInvoiceCardProps {
  event: Event & { studio: BillingEntity | null }
  selected: boolean
  onToggleSelect: (eventId: string) => void
  showCheckbox?: boolean
  variant?: 'default' | 'compact'
  onSetupSubstitute?: (eventId: string) => void
}

export function EventInvoiceCard({
  event,
  selected,
  onToggleSelect,
  showCheckbox = true,
  variant = 'default',
  onSetupSubstitute
}: EventInvoiceCardProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return ""
    return new Date(dateString).toLocaleDateString()
  }

  const formatTime = (dateString: string | null) => {
    if (!dateString) return ""
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  // Memoized payout calculation - only recalculates when relevant properties change
  const payout = useMemo(() => {
    if (!event.studio || !event.studio.base_rate) return 0
    
    let calculatedPayout = event.studio.base_rate
    
    // Apply penalties if configured
    if (event.studio.studio_penalty_per_student && event.students_studio !== null && event.studio.student_threshold) {
      const threshold = event.studio.student_threshold
      if (event.students_studio < threshold) {
        const missingStudents = threshold - event.students_studio
        calculatedPayout -= missingStudents * event.studio.studio_penalty_per_student
      }
    }
    
    if (event.studio.online_penalty_per_student && event.students_online) {
      calculatedPayout -= event.students_online * event.studio.online_penalty_per_student
    }
    
    // Apply maximum discount limit
    if (event.studio.max_discount) {
      const minimumPayout = event.studio.base_rate - event.studio.max_discount
      calculatedPayout = Math.max(calculatedPayout, minimumPayout)
    }
    
    return Math.max(calculatedPayout, 0)
  }, [
    event.studio,
    event.students_studio,
    event.students_online
  ])

  return (
    <Card 
      className={cn(
        "transition-all duration-150 hover:shadow-sm overflow-hidden",
        selected && "border-blue-400 bg-blue-50/30 shadow-sm",
        !selected && "border-gray-200",
        variant === 'compact' && "shadow-sm",
        showCheckbox && "cursor-pointer hover:bg-gray-50/50"
      )}
      onClick={showCheckbox ? () => onToggleSelect(event.id) : undefined}
    >
      <CardContent className={cn(
        "flex flex-col sm:flex-row sm:items-center gap-3",
        variant === 'compact' ? "p-3" : "p-4"
      )}>
        {/* Mobile: Checkbox and title row */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {showCheckbox && (
            <input
              type="checkbox"
              checked={selected}
              onChange={() => onToggleSelect(event.id)}
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
              className="h-4 w-4 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 border-gray-300 rounded flex-shrink-0"
            />
          )}
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate text-sm sm:text-base">
              {event.title || "Untitled Event"}
            </h3>
            
            {/* Date and time - always on one line for mobile */}
            <div className="text-xs sm:text-sm text-gray-600 mt-1">
              <span>{formatDate(event.start_time)}</span>
              {event.start_time && event.end_time && (
                <>
                  <span className="mx-1">•</span>
                  <span>{formatTime(event.start_time)} - {formatTime(event.end_time)}</span>
                </>
              )}
            </div>
            
            {/* Location - truncated on mobile, hidden on very small screens */}
            {event.location && (
              <div className="text-xs text-gray-500 mt-1 truncate max-w-[200px] sm:max-w-none">
                {event.location}
              </div>
            )}
            
            {/* Student counts - more compact on mobile */}
            <div className="flex items-center gap-2 mt-2">
              {event.students_studio !== null && (
                <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                  Studio: {event.students_studio}
                </span>
              )}
              {event.students_online !== null && event.students_online > 0 && (
                <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                  Online: {event.students_online}
                </span>
              )}
            </div>
          </div>
        </div>
        
        {/* Payout section - right aligned on desktop, separate row on mobile */}
        <div className="flex justify-between sm:justify-end sm:flex-col sm:text-right items-center sm:items-end flex-shrink-0 gap-2">
          <div className="text-base sm:text-lg font-bold text-gray-900">
            €{payout.toFixed(2)}
          </div>
          {event.studio && (
            <div className="text-xs text-gray-500">
              Base: €{event.studio.base_rate?.toFixed(2) || '0.00'}
            </div>
          )}
          {onSetupSubstitute && (
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onSetupSubstitute(event.id)
              }}
              className="text-xs px-2 py-1 h-6"
              title="Setup substitute teaching - invoice original teacher instead of studio"
            >
              <Users className="w-3 h-3 mr-1" />
              Substitute
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 