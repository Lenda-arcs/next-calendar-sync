'use client'

import React, {useEffect, useRef, useState} from 'react'
import {Filter, MapPin} from 'lucide-react'
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from '@/components/ui/accordion'
import {MultiSelect, Select, Badge, Button, Card, Skeleton} from '@/components/ui'
import {useScheduleFilters} from '@/components'
import {useTranslation} from '@/lib/i18n/context'

export function ScheduleFilters() {
  const [isFloatingVisible, setIsFloatingVisible] = useState(false)
  const [accordionValue, setAccordionValue] = useState<string>('')
  const [preventAutoClose, setPreventAutoClose] = useState(false)
  const accordionRef = useRef<HTMLDivElement>(null)
  
  const {
    filters,
    hasActiveFilters,
    availableStudioInfo,
  } = useScheduleFilters()

  const { t } = useTranslation()

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
    { key: 'today', label: t('pages.publicSchedule.schedule.filters.when.options.today') },
    { key: 'week', label: t('pages.publicSchedule.schedule.filters.when.options.week') },
    { key: 'nextweek', label: 'Next Week' },
    { key: 'month', label: t('pages.publicSchedule.schedule.filters.when.options.month') },
    { key: 'nextmonth', label: 'Next Month' },
    { key: 'next3months', label: 'Next 3 Months' }
  ]

  const getActiveFiltersCount = () => {
    return filters.studios.length + filters.yogaStyles.length + (filters.when !== 'next3months' ? 1 : 0)
  }

  const getActiveFiltersSummary = () => {
    const activeFilters = []
    
    // When filter - always show if not default
    if (filters.when !== 'next3months') {
      const whenOption = whenOptions.find(opt => opt.key === filters.when)
      if (whenOption) {
        activeFilters.push(whenOption.label)
      }
    }
    
    // Studio filters
    if (filters.studios.length > 0 && availableStudioInfo) {
      const studioNames = filters.studios
        .map(studioId => availableStudioInfo.find(s => s.id === studioId)?.name)
        .filter(Boolean)
      if (studioNames.length > 0) {
        activeFilters.push(studioNames.join(', '))
      }
    }
    
    // Yoga style filters
    if (filters.yogaStyles.length > 0) {
      activeFilters.push(filters.yogaStyles.join(', '))
    }
    
    return activeFilters
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
      {/* Floating Action Button - Mobile */}
      {isFloatingVisible && (
        <div className="fixed bottom-6 right-6 z-50 md:hidden">
          <Button
            size="lg"
            onClick={handleFABClick}
            className="h-14 w-14 rounded-full shadow-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 ease-in-out transform hover:scale-105"
          >
            <Filter className="h-5 w-5" />
            {hasActiveFilters && (
              <Badge variant="secondary" className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                {getActiveFiltersCount()}
              </Badge>
            )}
          </Button>
        </div>
      )}

      {/* Desktop Filters Bar & Mobile Accordion */}
      <div ref={accordionRef}>
        {/* Desktop: Always visible filters bar */}
        <div className="hidden md:block">
          <Card className="p-6">
            <div className="space-y-4">
              {/* When Filter */}
              <WhenFilter options={whenOptions} />
              
              {/* Location and Style Filters */}
              <div className="flex flex-wrap items-start gap-6">
                {/* Studio Filter */}
                <StudioFilter />
                
                {/* Yoga Style Filter */}
                <YogaStyleFilter />
              </div>
            </div>
          </Card>
        </div>

        {/* Mobile: Collapsible accordion with active filters preview */}
        <div className="md:hidden">
          <Card className="p-3">
            <Accordion 
              type="single" 
              collapsible 
              value={accordionValue} 
              onValueChange={setAccordionValue}
            >
              <AccordionItem value="filters" className="border-none">
                <AccordionTrigger className="text-base font-medium px-3 py-0 hover:no-underline">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Filter className="h-4 w-4 flex-shrink-0" />
                    <span className="flex-shrink-0">{t('common.actions.filter')}</span>
                    {hasActiveFilters && (
                      <Badge variant="secondary" className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs flex-shrink-0">
                        {getActiveFiltersCount()}
                      </Badge>
                    )}
                  </div>
                  {/* Show active filters summary when collapsed */}
                  {accordionValue !== 'filters' && hasActiveFilters && (
                    <div className="flex-1 text-right min-w-0 ml-2">
                      <div className="text-xs text-muted-foreground truncate">
                        {getActiveFiltersSummary().slice(0, 2).join(' • ')}
                        {getActiveFiltersSummary().length > 2 && '...'}
                      </div>
                    </div>
                  )}
                </AccordionTrigger>
                <AccordionContent className="pt-3">
                  <div className="space-y-3">
                    {/* Mobile Filters */}
                    <MobileWhenFilter options={whenOptions} />
                    <MobileStudioFilter />
                    <MobileYogaStyleFilter />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </Card>
        </div>
      </div>
    </>
  )
}

// Desktop When Filter Component
function WhenFilter({ options }: { options: Array<{ key: string; label: string }> }) {
  const { filters, updateFilter } = useScheduleFilters()
  const { t } = useTranslation()

  return (
    <div className="space-y-3">
      <h4 className="font-medium text-sm text-muted-foreground">
        {t('pages.publicSchedule.schedule.filters.when.label')}
      </h4>
      <div className="flex flex-wrap gap-2">
        {options.map(option => (
          <Button
            key={option.key}
            variant={filters.when === option.key ? 'default' : 'outline'}
            size="sm"
            onClick={() => updateFilter('when', option.key)}
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  )
}

// Desktop Studio Filter Component - Compact Version
function StudioFilter() {

  const { filters, availableStudioInfo, toggleStudio } = useScheduleFilters()
  const { t } = useTranslation()

  // Option 2: Always show section, even if loading or empty (better UX)
  // Users can see consistent filter options

  return (
    <div className="space-y-3">
      <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
        <MapPin className="h-4 w-4" />
        {t('pages.publicSchedule.schedule.filters.studio.label')}
      </h4>
      <div className="flex flex-wrap gap-2">
        {availableStudioInfo === undefined ? (
          // Loading skeleton
          <StudioFilterSkeleton />
        ) : availableStudioInfo.length === 0 ? (
          // Empty state - show subtle message
          <div className="text-xs text-muted-foreground italic">
            No studios found
          </div>
        ) : (
          // Actual studio buttons - compact version
          availableStudioInfo.map(studio => {
            const isSelected = filters.studios.includes(studio.id)
            const hasEventsInFilter = studio.hasEventsInFilter
            
            return (
              <Button
                key={studio.id}
                variant={isSelected ? 'default' : 'outline'}
                size="sm"
                onClick={() => toggleStudio(studio.id)}
                className={`h-8 px-3 text-sm ${
                  // Visual feedback for studios with/without events in current filter
                  !hasEventsInFilter && !isSelected ? 'opacity-60' : ''
                }`}
                title={`${studio.name}${studio.address ? ` - ${studio.address}` : ''}${hasEventsInFilter ? '' : ' (No events in current filter)'}`}
              >
                {studio.name}
              </Button>
            )
          })
        )}
      </div>
    </div>
  )
}

// Loading skeleton for studio filter
function StudioFilterSkeleton() {
  return (
    <>
      <Skeleton className="h-8 w-24" />
      <Skeleton className="h-8 w-20" />
      <Skeleton className="h-8 w-28" />
    </>
  )
}

// Desktop Yoga Style Filter Component
function YogaStyleFilter() {
  const { filters, filterStats, availableYogaStyles, toggleYogaStyle } = useScheduleFilters()
  const { t } = useTranslation()

  if (availableYogaStyles.length === 0) return null

  return (
    <div className="space-y-3">
      <h4 className="font-medium text-sm text-muted-foreground">{t('pages.publicSchedule.schedule.filters.yogaStyle.label')}</h4>
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
  const { t } = useTranslation()

  const selectOptions = options.map(({ key, label }) => ({
    value: key,
    label: label
  }))

  return (
    <Select
      label={t('pages.publicSchedule.schedule.filters.when.label')}
      value={filters.when}
      onChange={(value) => updateFilter('when', value)}
      options={selectOptions}
      placeholder={t('pages.publicSchedule.schedule.filters.when.placeholder')}
    />
  )
}

function MobileStudioFilter() {
  const { filters, availableStudioInfo, updateFilter } = useScheduleFilters()
  const { t } = useTranslation()

  // Option 2: Always show section for consistent UX, handle empty state gracefully
  if (!availableStudioInfo || availableStudioInfo.length === 0) return null

  const studioOptions = availableStudioInfo.map(studio => ({
    value: studio.id,
    label: studio.name, // Match desktop: show only studio name, not full location
    count: studio.eventCount
  }))

  return (
    <MultiSelect
      label={t('pages.publicSchedule.schedule.filters.studio.label')}
      value={filters.studios}
      onChange={(values) => updateFilter('studios', values)}
      options={studioOptions}
      placeholder={t('pages.publicSchedule.schedule.filters.studio.placeholder')}
      displayMode="compact"
      showCounts={true}
    />
  )
}

function MobileYogaStyleFilter() {
  const { filters, filterStats, availableYogaStyles, updateFilter } = useScheduleFilters()
  const { t } = useTranslation()

  if (availableYogaStyles.length === 0) return null

  const yogaStyleOptions = availableYogaStyles.map(style => ({
    value: style,
    label: style,
    count: filterStats.byYogaStyle[style]
  }))

  return (
    <MultiSelect
      label={t('pages.publicSchedule.schedule.filters.yogaStyle.label')}
      value={filters.yogaStyles}
      onChange={(values) => updateFilter('yogaStyles', values)}
      options={yogaStyleOptions}
      placeholder={t('pages.publicSchedule.schedule.filters.yogaStyle.placeholder')}
      displayMode="compact"
      showCounts={true}
    />
  )
} 