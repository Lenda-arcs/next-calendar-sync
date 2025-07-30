'use client'

import React, {useEffect, useRef, useState} from 'react'
import {Filter, MapPin, X} from 'lucide-react'
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
    clearAllFilters
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
    { key: 'all', label: t('pages.publicSchedule.schedule.filters.when.options.all') },
    { key: 'today', label: t('pages.publicSchedule.schedule.filters.when.options.today') },
    { key: 'tomorrow', label: t('pages.publicSchedule.schedule.filters.when.options.tomorrow') },
    { key: 'weekend', label: t('pages.publicSchedule.schedule.filters.when.options.weekend') },
    { key: 'week', label: t('pages.publicSchedule.schedule.filters.when.options.week') },
    { key: 'month', label: t('pages.publicSchedule.schedule.filters.when.options.month') },
    { key: 'monday', label: t('pages.publicSchedule.schedule.filters.when.options.monday') },
    { key: 'tuesday', label: t('pages.publicSchedule.schedule.filters.when.options.tuesday') },
    { key: 'wednesday', label: t('pages.publicSchedule.schedule.filters.when.options.wednesday') },
    { key: 'thursday', label: t('pages.publicSchedule.schedule.filters.when.options.thursday') },
    { key: 'friday', label: t('pages.publicSchedule.schedule.filters.when.options.friday') },
    { key: 'saturday', label: t('pages.publicSchedule.schedule.filters.when.options.saturday') },
    { key: 'sunday', label: t('pages.publicSchedule.schedule.filters.when.options.sunday') }
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
      {/* Floating Action Button - Mobile */}
      {isFloatingVisible && (
        <div className="fixed bottom-6 right-6 z-50 md:hidden">
          <Button
            size="lg"
            onClick={handleFABClick}
            className="h-14 px-6 rounded-full shadow-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 ease-in-out transform hover:scale-105"
          >
            <Filter className="h-5 w-5 mr-2" />
            <span className="text-sm font-medium">
              {t('common.actions.filter')}
            </span>
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
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
            <div className="flex flex-wrap items-center gap-6">
              {/* When Filter */}
              <WhenFilter options={whenOptions} />
              
              {/* Studio Filter */}
              <StudioFilter />
              
              {/* Yoga Style Filter */}
              <YogaStyleFilter />
              
              {/* Clear All Button */}
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAllFilters}
                  className="ml-auto"
                >
                  <X className="h-4 w-4 mr-1" />
                  {t('pages.publicSchedule.schedule.header.clearFilters')}
                </Button>
              )}
            </div>
          </Card>
        </div>

        {/* Mobile: Collapsible accordion */}
        <div className="md:hidden">
          <Accordion 
            type="single" 
            collapsible 
            value={accordionValue} 
            onValueChange={setAccordionValue}
          >
            <AccordionItem value="filters">
              <AccordionTrigger className="text-base font-medium px-1">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span>{t('common.actions.filter')}</span>
                  {hasActiveFilters && (
                    <Badge variant="secondary" className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                      {getActiveFiltersCount()}
                    </Badge>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <Card className="mt-4">
                  <div className="p-4 space-y-4">
                    {/* Mobile Filters */}
                    <MobileWhenFilter options={whenOptions} />
                    <MobileStudioFilter />
                    <MobileYogaStyleFilter />
                    
                    {/* Clear All Button */}
                    {hasActiveFilters && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={clearAllFilters}
                        className="w-full"
                      >
                        <X className="h-4 w-4 mr-1" />
                        {t('pages.publicSchedule.schedule.header.clearFilters')}
                      </Button>
                    )}
                  </div>
                </Card>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
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
    <div className="flex items-center gap-3">
      <label className="text-sm font-medium text-muted-foreground">
        {t('pages.publicSchedule.schedule.filters.when.label')}
      </label>
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
        ) : availableStudioInfo.length === 0 ? null : (
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
                title={`${studio.name}${studio.address ? ` - ${studio.address}` : ''}${
                  studio.isVerified ? ' ✓ Verified' : ''
                }${hasEventsInFilter ? '' : ' (No events in current filter)'}`}
              >
                {studio.name}
                {studio.eventCount && (
                  <span className="ml-1 text-xs opacity-70">
                    ({studio.eventCount})
                  </span>
                )}
                {studio.isVerified && (
                  <span className="ml-1 text-xs text-green-600">✓</span>
                )}
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

  if (!availableStudioInfo || availableStudioInfo.length === 0) return null

  const studioOptions = availableStudioInfo.map(studio => ({
    value: studio.id,
    label: studio.address 
      ? `${studio.name} • ${studio.address}` 
      : studio.name,
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