'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Filter, MapPin, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Select, MultiSelect, Popover, PopoverTrigger, PopoverContent } from '@/components/ui'
import { useScheduleFilters } from './FilterProvider'

export function ScheduleFilters() {
  const [isFloatingVisible, setIsFloatingVisible] = useState(false)
  const [accordionValue, setAccordionValue] = useState<string>('')
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const accordionRef = useRef<HTMLDivElement>(null)
  const popoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  
  const {
    filters,
    hasActiveFilters,
    clearAllFilters
  } = useScheduleFilters()

  // Show/hide floating button based on accordion visibility
  useEffect(() => {
    const handleScroll = () => {
      if (!accordionRef.current) return
      
      const accordionRect = accordionRef.current.getBoundingClientRect()
      const isAccordionVisible = accordionRect.bottom > 0 && accordionRect.top < window.innerHeight
      
      // Show FAB when accordion is not visible (scrolled out of view)
      const shouldShowFAB = !isAccordionVisible
      setIsFloatingVisible(shouldShowFAB)
      
      // Auto-close accordion when FAB becomes visible
      if (shouldShowFAB && accordionValue === 'filters') {
        setAccordionValue('')
      }
    }

    const handleResize = () => {
      handleScroll() // Recalculate on resize
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleResize)

    // Check initial position
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [accordionValue])

  // Auto-close popover functionality
  const startPopoverTimeout = () => {
    if (popoverTimeoutRef.current) {
      clearTimeout(popoverTimeoutRef.current)
    }
    popoverTimeoutRef.current = setTimeout(() => {
      setIsPopoverOpen(false)
    }, 3000) // 3 seconds
  }

  const clearPopoverTimeout = () => {
    if (popoverTimeoutRef.current) {
      clearTimeout(popoverTimeoutRef.current)
      popoverTimeoutRef.current = null
    }
  }

  const handlePopoverOpenChange = (open: boolean) => {
    setIsPopoverOpen(open)
    if (open) {
      startPopoverTimeout()
    } else {
      clearPopoverTimeout()
    }
  }

  const handlePopoverMouseEnter = () => {
    clearPopoverTimeout()
  }

  const handlePopoverMouseLeave = () => {
    startPopoverTimeout()
  }

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      clearPopoverTimeout()
    }
  }, [])

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

  const getActiveFiltersCount = () => {
    return filters.studios.length + filters.yogaStyles.length + (filters.when !== 'all' ? 1 : 0)
  }

  return (
    <>
      {/* Floating Filter Popover - Show when accordion is out of view */}
      <div 
        className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ease-in-out ${
          isFloatingVisible 
            ? 'opacity-100 translate-y-0 scale-100' 
            : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
        }`}
      >
        <Popover open={isPopoverOpen} onOpenChange={handlePopoverOpenChange}>
          <PopoverTrigger asChild>
            <Button
              size="lg"
              className="rounded-full shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-3 h-auto min-w-[120px] transition-all duration-200 hover:scale-105"
            >
              <Filter className="h-5 w-5 mr-2" />
              <span className="font-medium">Filters</span>
              
              {/* Fixed space for badge to prevent layout shifts */}
              <div className="ml-2 min-w-[28px] flex justify-center">
                <Badge 
                  variant="secondary" 
                  className={`px-2 py-0.5 text-xs transition-all duration-200 ${
                    hasActiveFilters 
                      ? 'opacity-100 scale-100 animate-pulse' 
                      : 'opacity-0 scale-95 pointer-events-none'
                  }`}
                >
                  {getActiveFiltersCount() || '0'}
                </Badge>
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent 
            className="w-80 sm:w-80 w-72"
            side="top"
            align="end"
            sideOffset={10}
            onMouseEnter={handlePopoverMouseEnter}
            onMouseLeave={handlePopoverMouseLeave}
          >
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  <h4 className="font-medium leading-none">Find Your Perfect Class</h4>
                </div>
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="text-xs px-2 py-1 hover:bg-destructive/10 hover:text-destructive transition-colors"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Clear All
                  </Button>
                )}
              </div>
              <div className="grid gap-4">
                <FloatingWhenFilter options={whenOptions} />
                <FloatingStudioFilter />
                <FloatingYogaStyleFilter />
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Static Accordion Filters - Always visible, auto-closes when FAB is active */}
      <div ref={accordionRef}>
        <Card className="overflow-hidden">
          <Accordion 
            type="single" 
            collapsible 
            value={accordionValue} 
            onValueChange={setAccordionValue}
            className="w-full"
          >
            <AccordionItem value="filters" className="border-none">
              <AccordionTrigger className="px-4 py-2 hover:no-underline cursor-pointer group text-sm min-h-[40px]">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Filter className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm font-normal truncate">Find Your Perfect Class</span>
                    <div className="text-xs text-gray-400 group-hover:text-blue-500 transition-colors opacity-0 group-hover:opacity-100 hidden sm:block flex-shrink-0">
                      Click to expand
                    </div>
                    
                    {/* Fixed width container for badges to prevent layout shifts */}
                    <div className="flex items-center gap-1 min-w-[80px] justify-end">
                      <Badge 
                        variant="secondary" 
                        className={`px-1.5 py-0.5 text-xs flex-shrink-0 transition-all duration-200 ${
                          hasActiveFilters 
                            ? 'opacity-100 scale-100 animate-pulse' 
                            : 'opacity-0 scale-95 pointer-events-none'
                        }`}
                      >
                        {getActiveFiltersCount() || '0'}
                      </Badge>
                      
                      <Badge 
                        variant="outline" 
                        className={`px-1.5 py-0.5 text-xs flex-shrink-0 hidden sm:inline-flex transition-all duration-200 ${
                          isFloatingVisible 
                            ? 'opacity-60 scale-100' 
                            : 'opacity-0 scale-95 pointer-events-none'
                        }`}
                      >
                        Use floating filter below
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Fixed width container for clear button to prevent layout shifts */}
                  <div className="flex items-center ml-2 min-w-[60px] justify-end">
                    <div
                      onClick={(e) => {
                        e.stopPropagation()
                        clearAllFilters()
                      }}
                      className={`text-xs px-2 py-0.5 h-6 hover:bg-destructive/10 hover:text-destructive transition-all duration-200 cursor-pointer rounded flex items-center justify-center flex-shrink-0 ${
                        hasActiveFilters 
                          ? 'opacity-100 scale-100' 
                          : 'opacity-0 scale-95 pointer-events-none'
                      }`}
                    >
                      <X className="h-3 w-3 sm:mr-1" />
                      <span className="hidden sm:inline">Clear All</span>
                    </div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 sm:px-6 pb-6">
                <div className="space-y-6">
                  {/* Desktop Filters - Button Layout */}
                  <div className="hidden sm:block space-y-6">
                    <WhenFilter options={whenOptions} />
                    <StudioFilter />
                    <YogaStyleFilter />
                  </div>
                  
                  {/* Mobile Filters - Dropdown Layout */}
                  <div className="block sm:hidden space-y-3">
                    <MobileWhenFilter options={whenOptions} />
                    <MobileStudioFilter />
                    <MobileYogaStyleFilter />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>
      </div>


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

// Floating Popover Filter Components
function FloatingWhenFilter({ options }: { options: Array<{ key: string; label: string }> }) {
  const { filters, updateFilter } = useScheduleFilters()

  const selectOptions = options.map(({ key, label }) => ({
    value: key,
    label: label
  }))

  return (
    <Select
      label="When"
      value={filters.when}
      onChange={(value) => updateFilter('when', value)}
      options={selectOptions}
      placeholder="Any time"
    />
  )
}

function FloatingStudioFilter() {
  const { filters, filterStats, availableStudios, updateFilter } = useScheduleFilters()

  if (availableStudios.length === 0) return null

  const studioOptions = availableStudios.map(studio => ({
    value: studio,
    label: studio,
    count: filterStats.byStudio[studio]
  }))

  return (
    <MultiSelect
      label="Studio Location"
      value={filters.studios}
      onChange={(values) => updateFilter('studios', values)}
      options={studioOptions}
      placeholder="Any studio"
      displayMode="compact"
      showCounts={true}
    />
  )
}

function FloatingYogaStyleFilter() {
  const { filters, filterStats, availableYogaStyles, updateFilter } = useScheduleFilters()

  if (availableYogaStyles.length === 0) return null

  const yogaStyleOptions = availableYogaStyles.map(style => ({
    value: style,
    label: style,
    count: filterStats.byYogaStyle[style]
  }))

  return (
    <MultiSelect
      label="Yoga Style"
      value={filters.yogaStyles}
      onChange={(values) => updateFilter('yogaStyles', values)}
      options={yogaStyleOptions}
      placeholder="Any style"
      displayMode="compact"
      showCounts={true}
    />
  )
}

// Mobile Accordion Filter Components (using dropdowns like floating filters)
function MobileWhenFilter({ options }: { options: Array<{ key: string; label: string }> }) {
  const { filters, updateFilter } = useScheduleFilters()

  const selectOptions = options.map(({ key, label }) => ({
    value: key,
    label: label
  }))

  return (
    <Select
      label="When"
      value={filters.when}
      onChange={(value) => updateFilter('when', value)}
      options={selectOptions}
      placeholder="Any time"
    />
  )
}

function MobileStudioFilter() {
  const { filters, filterStats, availableStudios, updateFilter } = useScheduleFilters()

  if (availableStudios.length === 0) return null

  const studioOptions = availableStudios.map(studio => ({
    value: studio,
    label: studio,
    count: filterStats.byStudio[studio]
  }))

  return (
    <MultiSelect
      label="Studio Location"
      value={filters.studios}
      onChange={(values) => updateFilter('studios', values)}
      options={studioOptions}
      placeholder="Any studio"
      displayMode="compact"
      showCounts={true}
    />
  )
}

function MobileYogaStyleFilter() {
  const { filters, filterStats, availableYogaStyles, updateFilter } = useScheduleFilters()

  if (availableYogaStyles.length === 0) return null

  const yogaStyleOptions = availableYogaStyles.map(style => ({
    value: style,
    label: style,
    count: filterStats.byYogaStyle[style]
  }))

  return (
    <MultiSelect
      label="Yoga Style"
      value={filters.yogaStyles}
      onChange={(values) => updateFilter('yogaStyles', values)}
      options={yogaStyleOptions}
      placeholder="Any style"
      displayMode="compact"
      showCounts={true}
    />
  )
} 