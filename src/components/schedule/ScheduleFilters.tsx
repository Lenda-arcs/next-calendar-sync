'use client'

import React, { useState } from 'react'
import { Filter, MapPin, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useScheduleFilters } from './FilterProvider'

export function ScheduleFilters() {
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const {
    filters,
    hasActiveFilters,
    clearAllFilters
  } = useScheduleFilters()

  const whenOptions = [
    { key: 'all', label: 'Any Time' },
    { key: 'today', label: 'Today' },
    { key: 'tomorrow', label: 'Tomorrow' },
    { key: 'weekend', label: 'Weekend' },
    { key: 'week', label: 'This Week' },
    { key: 'month', label: 'This Month' },
    { key: 'monday', label: 'Mondays' },
    { key: 'tuesday', label: 'Tuesdays' },
    { key: 'wednesday', label: 'Wednesdays' },
    { key: 'thursday', label: 'Thursdays' },
    { key: 'friday', label: 'Fridays' },
    { key: 'saturday', label: 'Saturdays' },
    { key: 'sunday', label: 'Sundays' }
  ]

  return (
    <>
      {/* Mobile Filter Toggle */}
      <div className="flex items-center gap-2 sm:hidden">
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearAllFilters}
            className="text-sm"
          >
            <X className="h-4 w-4 mr-1" />
            Clear Filters
          </Button>
        )}
        <Button
          variant="outline"
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="sm:hidden"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-2 px-1.5 py-0.5 text-xs">
              {(filters.studios.length + filters.yogaStyles.length + (filters.when !== 'all' ? 1 : 0))}
            </Badge>
          )}
        </Button>
      </div>

      {/* Desktop Filters - Always Visible */}
      <div className="hidden sm:block">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Filter className="h-5 w-5" />
              Find Your Perfect Class
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <WhenFilter options={whenOptions} />
            <StudioFilter />
            <YogaStyleFilter />
          </CardContent>
        </Card>
      </div>

      {/* Mobile Filters - Collapsible */}
      {showMobileFilters && (
        <div className="sm:hidden">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-lg">
                  <Filter className="h-5 w-5" />
                  Find Your Perfect Class
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowMobileFilters(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <MobileWhenFilter options={whenOptions} />
              <MobileStudioFilter />
              <MobileYogaStyleFilter />
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}

// Desktop When Filter Component
function WhenFilter({ options }: { options: Array<{ key: string; label: string }> }) {
  const { filters, updateFilter } = useScheduleFilters()

  return (
    <div className="space-y-3">
      <h4 className="font-medium text-sm text-muted-foreground">When</h4>
      <div className="flex flex-wrap gap-2">
        {options.map(({ key, label }) => (
          <Button
            key={key}
            variant={filters.when === key ? 'default' : 'outline'}
            size="sm"
            onClick={() => updateFilter('when', key)}
          >
            {label}
          </Button>
        ))}
      </div>
    </div>
  )
}

// Desktop Studio Filter Component
function StudioFilter() {
  const { filters, filterStats, availableStudios, toggleStudio } = useScheduleFilters()

  if (availableStudios.length === 0) return null

  return (
    <div className="space-y-3">
      <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-1">
        <MapPin className="h-4 w-4" />
        Studio Location
      </h4>
      <div className="flex flex-wrap gap-2">
        {availableStudios.map(studio => (
          <Button
            key={studio}
            variant={filters.studios.includes(studio) ? 'default' : 'outline'}
            size="sm"
            onClick={() => toggleStudio(studio)}
          >
            {studio}
            {filterStats.byStudio[studio] && (
              <span className="ml-1 text-xs">({filterStats.byStudio[studio]})</span>
            )}
          </Button>
        ))}
      </div>
    </div>
  )
}

// Desktop Yoga Style Filter Component
function YogaStyleFilter() {
  const { filters, filterStats, availableYogaStyles, toggleYogaStyle } = useScheduleFilters()

  if (availableYogaStyles.length === 0) return null

  return (
    <div className="space-y-3">
      <h4 className="font-medium text-sm text-muted-foreground">Yoga Style</h4>
      <div className="flex flex-wrap gap-2">
        {availableYogaStyles.map(style => (
          <Button
            key={style}
            variant={filters.yogaStyles.includes(style) ? 'default' : 'outline'}
            size="sm"
            onClick={() => toggleYogaStyle(style)}
          >
            {style}
            {filterStats.byYogaStyle[style] && (
              <span className="ml-1 text-xs">({filterStats.byYogaStyle[style]})</span>
            )}
          </Button>
        ))}
      </div>
    </div>
  )
}

// Mobile When Filter Component
function MobileWhenFilter({ options }: { options: Array<{ key: string; label: string }> }) {
  const { filters, updateFilter } = useScheduleFilters()

  return (
    <div className="space-y-4">
      <h4 className="font-medium text-sm text-muted-foreground">When</h4>
      <div className="grid grid-cols-2 gap-2">
        {options.map(({ key, label }) => (
          <Button
            key={key}
            variant={filters.when === key ? 'default' : 'outline'}
            size="sm"
            onClick={() => updateFilter('when', key)}
            className="text-xs"
          >
            {label}
          </Button>
        ))}
      </div>
    </div>
  )
}

// Mobile Studio Filter Component
function MobileStudioFilter() {
  const { filters, filterStats, availableStudios, toggleStudio } = useScheduleFilters()

  if (availableStudios.length === 0) return null

  return (
    <div className="space-y-4">
      <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-1">
        <MapPin className="h-4 w-4" />
        Studio
      </h4>
      <div className="space-y-2">
        {availableStudios.map(studio => (
          <Button
            key={studio}
            variant={filters.studios.includes(studio) ? 'default' : 'outline'}
            size="sm"
            onClick={() => toggleStudio(studio)}
            className="w-full justify-start text-xs"
          >
            {studio}
            {filterStats.byStudio[studio] && (
              <span className="ml-auto text-xs">({filterStats.byStudio[studio]})</span>
            )}
          </Button>
        ))}
      </div>
    </div>
  )
}

// Mobile Yoga Style Filter Component
function MobileYogaStyleFilter() {
  const { filters, filterStats, availableYogaStyles, toggleYogaStyle } = useScheduleFilters()

  if (availableYogaStyles.length === 0) return null

  return (
    <div className="space-y-4">
      <h4 className="font-medium text-sm text-muted-foreground">Style</h4>
      <div className="space-y-2">
        {availableYogaStyles.map(style => (
          <Button
            key={style}
            variant={filters.yogaStyles.includes(style) ? 'default' : 'outline'}
            size="sm"
            onClick={() => toggleYogaStyle(style)}
            className="w-full justify-start text-xs"
          >
            {style}
            {filterStats.byYogaStyle[style] && (
              <span className="ml-auto text-xs">({filterStats.byYogaStyle[style]})</span>
            )}
          </Button>
        ))}
      </div>
    </div>
  )
} 