'use client'

import React from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useScheduleFilters } from './FilterProvider'

export function ScheduleHeader() {
  const { filteredEvents, totalEvents, hasActiveFilters, clearAllFilters } = useScheduleFilters()

  return (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Upcoming Classes
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mt-1">
          {filteredEvents.length} of {totalEvents} classes
          {hasActiveFilters && ' (filtered)'}
        </p>
      </div>
      
      {hasActiveFilters && (
        <div className="hidden sm:flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={clearAllFilters}
            className="text-sm"
          >
            <X className="h-4 w-4 mr-1" />
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  )
} 