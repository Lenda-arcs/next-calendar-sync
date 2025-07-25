'use client'

import React, { useState, useCallback, useMemo } from 'react'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import DataLoader from '@/components/ui/data-loader'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import { EventInvoiceCard } from './EventInvoiceCard'
import { EventDetailsEditModal } from '@/components/events/EventDetailsEditModal'
import { StudioActionButtons } from '@/components/studios/StudioActionButtons'
import { HistoricalSyncCTA } from '@/components/events/HistoricalSyncCTA'
import { InfoCardSection, colorSchemes } from '@/components/events'
import { UnmatchedEventsSection } from '@/components/events/UnmatchedEventsSection'
import { ExcludedEventsSection } from '@/components/events/ExcludedEventsSection'
import { SubstituteEventModal } from '@/components/events/SubstituteEventModal'
import { calculateTotalPayout, EventWithStudio } from '@/lib/invoice-utils'
import { BillingEntity, RateConfig } from '@/lib/types'
import { useTranslation } from '@/lib/i18n/context'

import { useInvoiceEvents, useStudioActions } from '@/lib/hooks'
import { useCalendarFeeds } from '@/lib/hooks/useCalendarFeeds'
import { RefreshCw, Building2, User, RotateCcw } from 'lucide-react'
import { toast } from 'sonner'
import { rematchEvents } from '@/lib/rematch-utils'

// Extended type for events with substitute teacher data
type ExtendedEventWithStudio = EventWithStudio & { 
  substitute_teacher?: BillingEntity
}

interface UninvoicedEventsListProps {
  userId: string
  onCreateInvoice?: (studioId: string, eventIds: string[], events: EventWithStudio[]) => void
  onCreateStudio?: () => void
}

export function UninvoicedEventsList({ userId, onCreateInvoice, onCreateStudio }: UninvoicedEventsListProps) {
  const { t } = useTranslation()
  
  // ==================== STATE MANAGEMENT ====================
  const [selectedEvents, setSelectedEvents] = useState<Record<string, string[]>>({})
  const [substituteEventId, setSubstituteEventId] = useState<string | null>(null)
  const [substituteEventIds, setSubstituteEventIds] = useState<string[]>([])
  const [editingEventId, setEditingEventId] = useState<string | null>(null)
  const [isRematchingStudios, setIsRematchingStudios] = useState(false)

  // ==================== DATA FETCHING ====================
  const {
    uninvoicedEvents,
    unmatchedEvents,
    excludedEvents,
    eventsByStudio,
    isLoading,
    isUnmatchedLoading,
    isExcludedLoading,
    error,
    refetchAll
  } = useInvoiceEvents(userId)

  const { data: calendarFeeds, isLoading: feedsLoading } = useCalendarFeeds(userId)

  // ==================== SELECTION MANAGEMENT ====================
  const handleToggleEvent = useCallback((studioId: string, eventId: string) => {
    setSelectedEvents(prev => {
      const studioEvents = prev[studioId] || []
      const isSelected = studioEvents.includes(eventId)
      
      if (isSelected) {
        return {
          ...prev,
          [studioId]: studioEvents.filter(id => id !== eventId)
        }
      } else {
        return {
          ...prev,
          [studioId]: [...studioEvents, eventId]
        }
      }
    })
  }, [])

  const handleSelectAllStudio = useCallback((studioId: string) => {
    if (!eventsByStudio?.[studioId]) return
    
    const allEventIds = eventsByStudio[studioId].map(event => event.id)
    const currentSelected = selectedEvents[studioId] || []
    const allSelected = allEventIds.every(id => currentSelected.includes(id))
    
    setSelectedEvents(prev => ({
      ...prev,
      [studioId]: allSelected ? [] : allEventIds
    }))
  }, [eventsByStudio, selectedEvents])

  const clearSelections = useCallback(() => {
    setSelectedEvents({})
  }, [])

  // ==================== STUDIO ACTIONS ====================
  const {
    isRefreshing,
    revertingStudioId,
    handleRefresh,
    handleCreateInvoice,
    handleBatchSubstitute,
    handleRevertToStudio
  } = useStudioActions({
    selectedEvents,
    eventsByStudio,
    onCreateInvoice,
    onRefreshData: refetchAll,
    onClearSelections: clearSelections,
    userId
  })

  // ==================== MODAL MANAGEMENT ====================
  const handleSubstituteSuccess = useCallback(() => {
    setSubstituteEventId(null)
    setSubstituteEventIds([])
    clearSelections()
    refetchAll()
  }, [refetchAll, clearSelections])

  const handleEditEventSuccess = useCallback(() => {
    setEditingEventId(null)
    refetchAll() // Refresh data to show updated student counts and payouts
  }, [refetchAll])

  const handleEditEvent = useCallback((eventId: string) => {
    setEditingEventId(eventId)
  }, [])

  // ==================== REMATCH FUNCTIONALITY ====================
  const handleRematchStudios = useCallback(async () => {
    try {
      setIsRematchingStudios(true)

      const rematchResult = await rematchEvents({
        user_id: userId,
        rematch_tags: false,
        rematch_studios: true
      })
      
      toast.success(t('invoices.uninvoiced.studioMatchingUpdated'), {
        description: t('invoices.uninvoiced.studioMatchingUpdatedDesc', {
          updated_count: rematchResult.updated_count.toString(),
          total_events_processed: rematchResult.total_events_processed.toString()
        }),
        duration: 4000,
      })

      // Refresh data after successful rematch
      refetchAll()

    } catch (err) {
      console.error('Failed to rematch studios:', err)
      const errorMessage = err instanceof Error ? err.message : t('invoices.uninvoiced.studioMatchingFailed')
      
      toast.error(t('invoices.uninvoiced.studioMatchingFailed'), {
        description: errorMessage,
        duration: 6000,
      })
    } finally {
      setIsRematchingStudios(false)
    }
  }, [userId, refetchAll, t])

  const selectedEvent = substituteEventId 
    ? uninvoicedEvents?.find(event => event.id === substituteEventId) || null
    : null

  const editingEvent = editingEventId
    ? uninvoicedEvents?.find(event => event.id === editingEventId) || null
    : null

  const selectedEventsForBatch = substituteEventIds.length > 0
    ? uninvoicedEvents?.filter(event => substituteEventIds.includes(event.id)) || []
    : []

  // ==================== MEMOIZED CALCULATIONS ====================
  // Memoized selected totals for each studio
  const selectedTotals = useMemo(() => {
    if (!eventsByStudio) return {}
    
    const totals: Record<string, number> = {}
    Object.keys(eventsByStudio).forEach(studioId => {
      const selectedEventIds = selectedEvents[studioId] || []
      if (selectedEventIds.length === 0) {
        totals[studioId] = 0
        return
      }
      
      const selectedEventsData = eventsByStudio[studioId].filter(event => 
        selectedEventIds.includes(event.id)
      )
      const studio = eventsByStudio[studioId][0]?.studio
      
      if (studio) {
        totals[studioId] = calculateTotalPayout(selectedEventsData, studio)
      } else {
        totals[studioId] = 0
      }
    })
    
    return totals
  }, [eventsByStudio, selectedEvents])

  // Memoized total payouts for each studio
  const studioTotalPayouts = useMemo(() => {
    if (!eventsByStudio) return {}
    
    const totals: Record<string, number> = {}
    Object.keys(eventsByStudio).forEach(studioId => {
      const studioEvents = eventsByStudio[studioId] || []
      const studio = studioEvents[0]?.studio
      totals[studioId] = studio ? calculateTotalPayout(studioEvents, studio) : 0
    })
    
    return totals
  }, [eventsByStudio])

  const getSelectedTotal = useCallback((studioId: string): number => {
    return selectedTotals[studioId] || 0
  }, [selectedTotals])

  // ==================== UTILITY FUNCTIONS ====================
  const groupEventsByMonth = useCallback((events: EventWithStudio[]) => {
    const grouped: Record<string, EventWithStudio[]> = {}
    
    events.forEach(event => {
      if (event.start_time) {
        const date = new Date(event.start_time)
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        
        if (!grouped[monthKey]) {
          grouped[monthKey] = []
        }
        grouped[monthKey].push(event)
      }
    })

    // Sort events within each month by date
    Object.keys(grouped).forEach(monthKey => {
      grouped[monthKey].sort((a, b) => {
        if (!a.start_time || !b.start_time) return 0
        return new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
      })
    })

    return grouped
  }, [])

  const getMonthLabel = useCallback((monthKey: string) => {
    const [year, month] = monthKey.split('-')
    const date = new Date(parseInt(year), parseInt(month) - 1)
    const monthNames = [
      t('invoices.uninvoiced.months.january'),
      t('invoices.uninvoiced.months.february'),
      t('invoices.uninvoiced.months.march'),
      t('invoices.uninvoiced.months.april'),
      t('invoices.uninvoiced.months.may'),
      t('invoices.uninvoiced.months.june'),
      t('invoices.uninvoiced.months.july'),
      t('invoices.uninvoiced.months.august'),
      t('invoices.uninvoiced.months.september'),
      t('invoices.uninvoiced.months.october'),
      t('invoices.uninvoiced.months.november'),
      t('invoices.uninvoiced.months.december')
    ]
    return `${monthNames[date.getMonth()]} ${year}`
  }, [t])

  const isTeacherBillingEntity = useCallback((entity: BillingEntity | null) => {
    return entity?.entity_type === 'teacher'
  }, [])

  // ==================== DERIVED STATE ====================
  const hasConnectedFeeds = calendarFeeds && calendarFeeds.length > 0

  // ==================== RENDER ====================
  return (
    <div className="space-y-4">
      {/* Data & Matching Actions */}
      {hasConnectedFeeds && !feedsLoading && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <HistoricalSyncCTA 
            calendarFeeds={calendarFeeds}
            userId={userId}
            onSyncComplete={refetchAll}
            layout="vertical"
          />
          <InfoCardSection
            title={t('invoices.uninvoiced.studioMatchingIssues')}
            count={0}
            description={t('invoices.uninvoiced.studioMatchingIssuesDesc')}
            mobileDescription={t('invoices.uninvoiced.studioMatchingIssuesMobileDesc')}
            icon={RotateCcw}
            colorScheme={colorSchemes.purple}
            layout="vertical"
            actions={[
              {
                label: isRematchingStudios ? t('invoices.uninvoiced.updating') : t('invoices.uninvoiced.fixStudioMatching'),
                mobileLabel: isRematchingStudios ? t('invoices.uninvoiced.updating') : t('invoices.uninvoiced.fixMatching'),
                icon: RotateCcw,
                onClick: handleRematchStudios,
                disabled: isRematchingStudios,
                loading: isRematchingStudios,
                variant: 'outline',
                className: 'shadow-sm'
              }
            ]}
          />
        </div>
      )}

      {/* Unmatched Events Section */}
      <UnmatchedEventsSection
        unmatchedEvents={unmatchedEvents || []}
        isLoading={isUnmatchedLoading}
        onRefresh={refetchAll}
        onCreateStudio={onCreateStudio || (() => {})}
        userId={userId}
      />

      {/* Main Events List */}
      <DataLoader
        data={eventsByStudio}
        loading={isLoading}
        error={error?.message || null}
        empty={
          <Card>
            <CardContent className="py-8 sm:py-12 px-4 sm:px-6 text-center">
              <div className="w-10 sm:w-12 h-10 sm:h-12 mx-auto mb-3 sm:mb-4 text-gray-300">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">{t('invoices.uninvoiced.noEventsTitle')}</h3>
              <p className="text-sm text-gray-600 mb-3 sm:mb-4 max-w-sm mx-auto">
                {t('invoices.uninvoiced.noEventsDescription')}
              </p>
              <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing} size="sm" className="w-full sm:w-auto">
                <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? t('invoices.uninvoiced.syncingRefreshing') : t('invoices.uninvoiced.refresh')}
              </Button>
            </CardContent>
          </Card>
        }
      >
        {(data) => {
          const studios = Object.keys(data)
          return (
            <Accordion type="multiple" className="w-full space-y-3 sm:space-y-4">
              {studios.map(studioId => {
                const studioEvents = data[studioId] || []
                // Get the billing entity to display (substitute teacher if present, otherwise studio)
                const firstEvent = studioEvents[0] as ExtendedEventWithStudio
                const displayEntity = firstEvent?.substitute_teacher || firstEvent?.studio
                
                const selectedEventIds = selectedEvents[studioId] || []
                const allEventsSelected = studioEvents.length > 0 && 
                  studioEvents.every((event) => selectedEventIds.includes(event.id))
                const someEventsSelected = selectedEventIds.length > 0
                const totalPayout = studioTotalPayouts[studioId] || 0
                const selectedTotal = getSelectedTotal(studioId)
                const isTeacher = isTeacherBillingEntity(displayEntity)

                if (!displayEntity) return null

                return (
                  <AccordionItem value={studioId} key={studioId}>
                    <Card variant="outlined" className="overflow-hidden">
                      <AccordionTrigger className="px-4 sm:px-6 py-3 sm:py-4 hover:no-underline cursor-pointer group">
                        <div className="grid grid-cols-[1fr_auto] gap-2 sm:gap-4 w-full mr-2 sm:mr-4 group-hover:text-blue-600 transition-colors">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 min-w-0">
                            <div className="flex items-center gap-2 min-w-0">
                              {isTeacher ? (
                                <User className="w-4 h-4 text-purple-600 flex-shrink-0" />
                              ) : (
                                <Building2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                              )}
                              <CardTitle className="text-base sm:text-lg group-hover:text-blue-600 transition-colors overflow-hidden text-ellipsis whitespace-nowrap min-w-0">
                                {displayEntity.entity_name}
                              </CardTitle>
                              {isTeacher && (
                                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full flex-shrink-0">
                                  {t('invoices.uninvoiced.teacher')}
                                </span>
                              )}
                              <div className="text-xs text-gray-400 group-hover:text-blue-500 transition-colors opacity-0 group-hover:opacity-100 hidden sm:block flex-shrink-0 ml-2">
                                Click to expand
                              </div>
                            </div>
                            <div className="flex items-center gap-2 sm:gap-3 text-sm">
                              <span className="text-gray-600 text-xs sm:text-sm">
                                {studioEvents.length} {studioEvents.length !== 1 ? t('invoices.uninvoiced.events') : t('invoices.uninvoiced.event')}
                              </span>
                              <span className="text-gray-500 text-xs hidden sm:block">
                                {(() => {
                                  const rateConfig = displayEntity.rate_config as RateConfig | null
                                  if (!rateConfig) return t('invoices.uninvoiced.rateConfig.noRateConfig')
                                  
                                  const rateTypeDisplay = rateConfig.type === 'flat' ? t('invoices.uninvoiced.rateConfig.flatRate') : 
                                                         rateConfig.type === 'per_student' ? t('invoices.uninvoiced.rateConfig.perStudent') :
                                                         rateConfig.type === 'tiered' ? t('invoices.uninvoiced.rateConfig.tieredRates') : 'Unknown'
                                  
                                  const baseRateDisplay = rateConfig.type === 'flat' ? rateConfig.base_rate?.toFixed(2) :
                                                         rateConfig.type === 'per_student' ? rateConfig.rate_per_student?.toFixed(2) :
                                                         t('invoices.uninvoiced.rateConfig.variable')
                                  
                                  return `${rateTypeDisplay} • ${t('invoices.uninvoiced.rateConfig.base')} €${baseRateDisplay || '0.00'}`
                                })()}
                              </span>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className="text-base sm:text-lg font-bold text-gray-900">
                              €{totalPayout.toFixed(2)}
                            </div>
                            <div className="text-xs text-gray-600">
                              {t('invoices.uninvoiced.total')}
                            </div>
                          </div>
                        </div>
                      </AccordionTrigger>

                      <AccordionContent className="px-0 pb-0 overflow-hidden">
                        <CardContent className="pt-0 px-2 sm:px-4 pb-3 sm:pb-4 overflow-hidden">
                          {/* Studio Actions */}
                          <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-blue-50/50 rounded-lg">
                            {/* Selection Controls Row */}
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                              {/* Left side: Select controls and info */}
                              <div className="flex items-center justify-between gap-3 sm:justify-start">
                                <Button
                                  onClick={() => handleSelectAllStudio(studioId)}
                                  variant="outline"
                                  className="flex-shrink-0"
                                >
                                  {allEventsSelected ? t('invoices.uninvoiced.deselectAll') : t('invoices.uninvoiced.selectAll')}
                                </Button>
                                
                                {someEventsSelected && (
                                  <div className="flex items-center gap-3 text-sm">
                                    <span className="text-gray-600">
                                      {t('invoices.uninvoiced.selectedCount', { count: `${selectedEventIds.length}/${studioEvents.length}` })}
                                    </span>
                                    <div className="text-right">
                                      <div className="font-bold text-blue-600">
                                        €{selectedTotal.toFixed(2)}
                                      </div>
                                      <div className="text-xs text-gray-500">{t('invoices.uninvoiced.selectedTotal')}</div>
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Right side: Action buttons (desktop) */}
                              {someEventsSelected && (
                                <div className="hidden sm:block">
                                  <StudioActionButtons
                                    isTeacher={isTeacher}
                                    selectedCount={selectedEventIds.length}
                                    hasSelected={someEventsSelected}
                                    onCreateInvoice={() => handleCreateInvoice(studioId)}
                                    onBatchSubstitute={isTeacher ? undefined : () => handleBatchSubstitute(studioId, setSubstituteEventIds)}
                                    onRevertToStudio={isTeacher ? () => handleRevertToStudio(studioId) : undefined}
                                    isReverting={revertingStudioId === studioId}
                                    variant="desktop"
                                  />
                                </div>
                              )}

                              {/* Mobile: Action buttons below */}
                              {someEventsSelected && (
                                <div className="sm:hidden">
                                  <StudioActionButtons
                                    isTeacher={isTeacher}
                                    selectedCount={selectedEventIds.length}
                                    hasSelected={someEventsSelected}
                                    onCreateInvoice={() => handleCreateInvoice(studioId)}
                                    onBatchSubstitute={isTeacher ? undefined : () => handleBatchSubstitute(studioId, setSubstituteEventIds)}
                                    onRevertToStudio={isTeacher ? () => handleRevertToStudio(studioId) : undefined}
                                    isReverting={revertingStudioId === studioId}
                                    variant="mobile"
                                  />
                                </div>
                              )}

                              {/* Mobile-only: Action buttons when no events selected */}
                              {!someEventsSelected && (
                                <div className="sm:hidden">
                                  <StudioActionButtons
                                    isTeacher={isTeacher}
                                    selectedCount={0}
                                    hasSelected={false}
                                    onCreateInvoice={() => handleCreateInvoice(studioId)}
                                    onBatchSubstitute={isTeacher ? undefined : () => handleBatchSubstitute(studioId, setSubstituteEventIds)}
                                    onRevertToStudio={isTeacher ? () => handleRevertToStudio(studioId) : undefined}
                                    isReverting={revertingStudioId === studioId}
                                    variant="mobile"
                                  />
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Events List */}
                          <div className="space-y-1 sm:space-y-2 overflow-hidden">
                            {(() => {
                              const groupedEvents = groupEventsByMonth(studioEvents)
                              const sortedMonthKeys = Object.keys(groupedEvents).sort()
                              
                              return sortedMonthKeys.map(monthKey => (
                                <div key={monthKey}>
                                  {/* Month Divider */}
                                  <div className="flex items-center gap-3 my-2 sm:my-3">
                                    <div className="flex-1 h-px bg-gray-300"></div>
                                    <div className="text-sm font-medium text-gray-600 px-2 sm:px-3">
                                      {getMonthLabel(monthKey)}
                                    </div>
                                    <div className="flex-1 h-px bg-gray-300"></div>
                                  </div>
                                  
                                  {/* Events for this month */}
                                  <div className="space-y-1 sm:space-y-2 overflow-hidden">
                                    {groupedEvents[monthKey].map((event) => (
                                      <EventInvoiceCard
                                        key={event.id}
                                        event={event}
                                        selected={selectedEventIds.includes(event.id)}
                                        onToggleSelect={(eventId) => handleToggleEvent(studioId, eventId)}
                                        showCheckbox={true}
                                        variant="compact"
                                        onEditEvent={handleEditEvent}
                                      />
                                    ))}
                                  </div>
                                </div>
                              ))
                            })()}
                          </div>
                        </CardContent>
                      </AccordionContent>
                    </Card>
                  </AccordionItem>
                )
              })}
            </Accordion>
          )
        }}
      </DataLoader>

      {/* Excluded Events Section */}
      <ExcludedEventsSection
        excludedEvents={excludedEvents || []}
        isLoading={isExcludedLoading}
        onRefresh={refetchAll}
        userId={userId}
      />

      {/* Substitute Event Modal */}
      <SubstituteEventModal
        isOpen={!!substituteEventId || substituteEventIds.length > 0}
        onClose={() => {
          setSubstituteEventId(null)
          setSubstituteEventIds([])
        }}
        event={selectedEvent}
        events={selectedEventsForBatch}
        onSuccess={handleSubstituteSuccess}
      />

      {/* Event Details Edit Modal */}
      <EventDetailsEditModal
        isOpen={!!editingEventId}
        onClose={() => setEditingEventId(null)}
        event={editingEvent}
        onSuccess={handleEditEventSuccess}
      />
    </div>
  )
} 