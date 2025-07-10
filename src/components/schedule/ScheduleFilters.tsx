'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Filter, MapPin, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Select, MultiSelect } from '@/components/ui'
import { useScheduleFilters } from './FilterProvider'

export function ScheduleFilters() {
  const [isFloatingVisible, setIsFloatingVisible] = useState(false)
  const [accordionValue, setAccordionValue] = useState<string>('')
  const [preventAutoClose, setPreventAutoClose] = useState(false)
  const accordionRef = useRef<HTMLDivElement>(null)
  
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
      
      // Auto-close accordion when FAB becomes visible (but not if it was just opened via FAB)
      if (shouldShowFAB && accordionValue === 'filters' && !preventAutoClose) {
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
  }, [accordionValue, preventAutoClose])



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

  const handleFABClick = () => {
    // Prevent auto-close when opening via FAB
    setPreventAutoClose(true)
    
    // Open the accordion first for immediate feedback
    setAccordionValue('filters')
    
    // Then scroll all the way to the top of the page
    setTimeout(() => {
      window.scrollTo({ 
        top: 0, 
        behavior: 'smooth' 
      })
      // Clear the prevent flag after scrolling is complete
      setTimeout(() => {
        setPreventAutoClose(false)
      }, 500)
    }, 150)
  }

  return (
    <>
      {/* Floating Filter Button - Show when accordion is out of view */}
      <div 
        className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ease-in-out ${
          isFloatingVisible 
            ? 'opacity-100 translate-y-0 scale-100' 
            : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
        }`}
      >
        <Button
          size="lg"
          onClick={handleFABClick}
          className="rounded-full shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground px-3 sm:px-4 py-3 h-auto min-w-[48px] sm:min-w-[120px] transition-all duration-200 hover:scale-105"
        >
          <Filter className="h-5 w-5 sm:mr-2" />
          <span className="font-medium hidden sm:inline">Filters</span>
          
          {/* Compact badge positioned closer to icon - only show when there are active filters */}
          {hasActiveFilters && (
            <div className="ml-0.5 sm:ml-1 min-w-[20px] flex justify-center">
              <Badge 
                variant="secondary" 
                className="px-1 py-0 text-[10px] leading-4 min-w-[16px] h-4 flex items-center justify-center transition-all duration-200 animate-pulse"
              >
                {getActiveFiltersCount()}
              </Badge>
            </div>
          )}
        </Button>
      </div>

      {/* Static Accordion Filters - Always visible, auto-closes when FAB is active */}
      <div ref={accordionRef}>
        <Card className="overflow-hidden transition-all duration-300 ease-in-out">
                      <Accordion 
              type="single" 
              collapsible 
              value={accordionValue} 
              onValueChange={(value) => {
                setAccordionValue(value)
                // Clear prevent flag when manually closing accordion
                if (value === '') {
                  setPreventAutoClose(false)
                }
              }}
              className="w-full"
            >
            <AccordionItem value="filters" className="border-none">
              <AccordionTrigger className="px-2 sm:px-4 py-2 hover:no-underline cursor-pointer group text-sm min-h-[40px]">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-1 sm:gap-2 flex-1 min-w-0">
                    <Filter className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm font-normal truncate">Find Your Perfect Class</span>
                    <div className="text-xs text-gray-400 group-hover:text-blue-500 transition-colors opacity-0 group-hover:opacity-100 hidden sm:block flex-shrink-0">
                      Click to expand
                    </div>
                    
                    {/* Responsive badge container - smaller on mobile */}
                    <div className="flex items-center gap-1 min-w-[32px] sm:min-w-[80px] justify-end">
                      {hasActiveFilters && (
                        <Badge 
                          variant="secondary" 
                          className="px-1.5 py-0.5 text-xs flex-shrink-0 transition-all duration-200 opacity-100 scale-100 animate-pulse"
                        >
                          {getActiveFiltersCount()}
                        </Badge>
                      )}
                      
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
                  
                  {/* Responsive clear button container - smaller on mobile */}
                  <div className="flex items-center ml-1 sm:ml-2 min-w-[24px] sm:min-w-[60px] justify-end">
                    <div
                      onClick={(e) => {
                        e.stopPropagation()
                        clearAllFilters()
                      }}
                      className={`text-xs px-1 sm:px-2 py-0.5 h-6 hover:bg-destructive/10 hover:text-destructive transition-all duration-200 cursor-pointer rounded flex items-center justify-center flex-shrink-0 ${
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