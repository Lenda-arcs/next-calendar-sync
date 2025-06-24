'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Event, Studio } from '@/lib/types'
import { calculateEventPayout } from '@/lib/invoice-utils'
import { cn } from '@/lib/utils'

interface EventInvoiceCardProps {
  event: Event & { studio: Studio | null }
  selected: boolean
  onToggleSelect: (eventId: string) => void
  showCheckbox?: boolean
  variant?: 'default' | 'compact'
}

export function EventInvoiceCard({
  event,
  selected,
  onToggleSelect,
  showCheckbox = true,
  variant = 'default'
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

  const payout = event.studio ? calculateEventPayout(event, event.studio) : 0

  return (
    <Card 
      className={cn(
        "transition-all duration-200",
        selected && "ring-2 ring-blue-500 bg-blue-50/50",
        variant === 'compact' && "py-3"
      )}
      interactive={showCheckbox}
      onClick={showCheckbox ? () => onToggleSelect(event.id) : undefined}
    >
      <CardContent className={cn(
        "flex items-center justify-between",
        variant === 'compact' ? "p-4" : "p-6"
      )}>
        <div className="flex items-center space-x-4 flex-1">
          {showCheckbox && (
            <input
              type="checkbox"
              checked={selected}
              onChange={() => onToggleSelect(event.id)}
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          )}
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 truncate">
                  {event.title || "Untitled Event"}
                </h3>
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-sm text-gray-600 mt-1">
                  <div className="flex items-center space-x-1">
                    <span>{formatDate(event.start_time)}</span>
                    {event.start_time && event.end_time && (
                      <>
                        <span>•</span>
                        <span>{formatTime(event.start_time)} - {formatTime(event.end_time)}</span>
                      </>
                    )}
                  </div>
                  {event.location && (
                    <>
                      <span className="hidden sm:inline">•</span>
                      <span className="truncate">{event.location}</span>
                    </>
                  )}
                </div>
                
                {/* Student counts */}
                <div className="flex items-center space-x-3 mt-2">
                  {event.students_studio !== null && (
                    <Badge variant="outline" className="text-xs">
                      Studio: {event.students_studio}
                    </Badge>
                  )}
                  {event.students_online !== null && event.students_online > 0 && (
                    <Badge variant="outline" className="text-xs">
                      Online: {event.students_online}
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="text-right ml-4">
                <div className="text-lg font-bold text-gray-900">
                  €{payout.toFixed(2)}
                </div>
                {event.studio && (
                  <div className="text-xs text-gray-500">
                    Base: €{event.studio.base_rate?.toFixed(2) || '0.00'}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 