'use client'

import React from 'react'
import {X} from 'lucide-react'
import {Button} from '@/components/ui/button'
import {useScheduleFilters} from '@/components'
import {useTranslation} from '@/lib/i18n/context'

export function ScheduleHeader() {
  const { filteredEvents, hasActiveFilters, clearAllFilters, isLoading, filters } = useScheduleFilters()
  const { t } = useTranslation()

  // Get the current time filter label
  const getTimeFilterLabel = () => {
    switch (filters.when) {
      case 'today':
        return t('pages.publicSchedule.schedule.filters.when.options.today')
      case 'week':
        return t('pages.publicSchedule.schedule.filters.when.options.week')
      case 'nextweek':
        return 'Next Week'
      case 'month':
        return t('pages.publicSchedule.schedule.filters.when.options.month')
      case 'nextmonth':
        return 'Next Month'
      case 'next3months':
      default:
        return 'Next 3 Months'
    }
  }

  return (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          {t('pages.publicSchedule.schedule.header.title')}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mt-1">
          {isLoading ? (
            <span className="inline-block h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></span>
          ) : hasActiveFilters ? (
            `${filteredEvents.length} classes in ${getTimeFilterLabel().toLowerCase()} (filtered)`
          ) : (
            `${filteredEvents.length} classes in ${getTimeFilterLabel().toLowerCase()}`
          )}
        </p>
      </div>
      
      {hasActiveFilters && !isLoading && (
        <div className="hidden sm:flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={clearAllFilters}
            className="text-sm"
          >
            <X className="h-4 w-4 mr-1" />
            {t('pages.publicSchedule.schedule.header.clearFilters')}
          </Button>
        </div>
      )}
    </div>
  )
} 