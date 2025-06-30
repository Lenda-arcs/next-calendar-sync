'use client'

import React, { useState, useCallback, useMemo } from 'react'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import DataLoader from '@/components/ui/data-loader'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import { EventInvoiceCard } from './EventInvoiceCard'
import { StudioActionButtons } from './StudioActionButtons'
import { HistoricalSyncCTA } from './HistoricalSyncCTA'
import { UnmatchedEventsSection } from './UnmatchedEventsSection'
import { ExcludedEventsSection } from './ExcludedEventsSection'
import { SubstituteEventModal } from './SubstituteEventModal'
import { calculateTotalPayout, EventWithStudio } from '@/lib/invoice-utils'
import { useInvoiceEvents, useStudioActions } from '@/lib/hooks'
import { useCalendarFeeds } from '@/lib/hooks/useCalendarFeeds'
import { RefreshCw, Building2, User } from 'lucide-react'

interface UninvoicedEventsListProps {
  userId: string
  onCreateInvoice?: (studioId: string, eventIds: string[], events: EventWithStudio[]) => void
  onCreateStudio?: () => void
}

export function UninvoicedEventsList({ userId, onCreateInvoice, onCreateStudio }: UninvoicedEventsListProps) {
  // ==================== STATE MANAGEMENT ====================
  const [selectedEvents, setSelectedEvents] = useState<Record<string, string[]>>({})
  const [substituteEventId, setSubstituteEventId] = useState<string | null>(null)
  const [substituteEventIds, setSubstituteEventIds] = useState<string[]>([])

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

  const selectedEvent = substituteEventId 
    ? uninvoicedEvents?.find(event => event.id === substituteEventId) || null
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
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
  }, [])

  const isTeacherBillingEntity = useCallback((studio: { recipient_type: string | null } | null) => {
    return studio?.recipient_type === 'internal_teacher' || 
           studio?.recipient_type === 'external_teacher'
  }, [])

  // ==================== DERIVED STATE ====================
  const hasConnectedFeeds = calendarFeeds && calendarFeeds.length > 0

  // ==================== RENDER ====================
  return (
    <div className="space-y-4">
      {/* Historical Sync CTA */}
      {hasConnectedFeeds && !feedsLoading && (
        <HistoricalSyncCTA 
          calendarFeeds={calendarFeeds}
          onSyncComplete={refetchAll}
        />
      )}

      {/* Unmatched Events Section */}
      <UnmatchedEventsSection
        unmatchedEvents={unmatchedEvents || []}
        isLoading={isUnmatchedLoading}
        onRefresh={refetchAll}
        onCreateStudio={onCreateStudio || (() => {})}
        userId={userId}
      />

      {/* Excluded Events Section */}
      <ExcludedEventsSection
        excludedEvents={excludedEvents || []}
        isLoading={isExcludedLoading}
        onRefresh={refetchAll}
        userId={userId}
      />

      {/* Main Events List */}
      <DataLoader
        data={eventsByStudio}
        loading={isLoading}
        error={error?.message || null}
        empty={
          <Card>
            <CardContent className="py-12 text-center">
              <div className="w-12 h-12 mx-auto mb-4 text-gray-300">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Uninvoiced Events</h3>
              <p className="text-sm text-gray-600 mb-4">
                All your completed events have been invoiced, or you don&apos;t have any events with assigned studios yet.
              </p>
              <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
                <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Syncing & Refreshing...' : 'Refresh'}
              </Button>
            </CardContent>
          </Card>
        }
      >
        {(data) => {
          const studios = Object.keys(data)
          return (
            <Accordion type="multiple" className="w-full space-y-4">
              {studios.map(studioId => {
                const studioEvents = data[studioId] || []
                const studio = studioEvents[0]?.studio
                const selectedEventIds = selectedEvents[studioId] || []
                const allEventsSelected = studioEvents.length > 0 && 
                  studioEvents.every((event) => selectedEventIds.includes(event.id))
                const someEventsSelected = selectedEventIds.length > 0
                const totalPayout = studioTotalPayouts[studioId] || 0
                const selectedTotal = getSelectedTotal(studioId)
                const isTeacher = isTeacherBillingEntity(studio)

                if (!studio) return null

                return (
                  <AccordionItem value={studioId} key={studioId}>
                    <Card variant="outlined" className="overflow-hidden">
                      <AccordionTrigger className="px-6 py-4 hover:no-underline cursor-pointer group">
                        <div className="flex items-center justify-between w-full mr-4 group-hover:text-blue-600 transition-colors">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 flex-1">
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-2">
                                {isTeacher ? (
                                  <User className="w-4 h-4 text-purple-600" />
                                ) : (
                                  <Building2 className="w-4 h-4 text-blue-600" />
                                )}
                                <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                                  {studio.entity_name}
                                </CardTitle>
                                {isTeacher && (
                                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                                    Teacher
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-gray-400 group-hover:text-blue-500 transition-colors opacity-0 group-hover:opacity-100 hidden sm:block">
                                Click to expand
                              </div>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                              <span className="text-gray-600">
                                {studioEvents.length} event{studioEvents.length !== 1 ? 's' : ''}
                              </span>
                              <span className="text-gray-500 text-xs">
                                {studio.rate_type === 'flat' ? 'Flat Rate' : 'Per Student'} • Base: €{studio.base_rate?.toFixed(2) || '0.00'}
                              </span>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className="text-lg font-bold text-gray-900">
                              €{totalPayout.toFixed(2)}
                            </div>
                            <div className="text-xs text-gray-600">
                              Total
                            </div>
                          </div>
                        </div>
                      </AccordionTrigger>

                      <AccordionContent className="px-0 pb-0 overflow-hidden">
                        <CardContent className="pt-0 overflow-hidden">
                          {/* Studio Actions */}
                          <div className="mb-6 p-4 bg-blue-50/50 rounded-lg space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                              {/* Left side: Select controls */}
                              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                <Button
                                  onClick={() => handleSelectAllStudio(studioId)}
                                  variant="outline"
                                  size="sm"
                                  className="w-full sm:w-auto"
                                >
                                  {allEventsSelected ? 'Deselect All' : 'Select All'}
                                </Button>
                                {someEventsSelected && (
                                  <div className="text-sm text-gray-600 text-center sm:text-left">
                                    {selectedEventIds.length} of {studioEvents.length} events selected
                                  </div>
                                )}
                              </div>

                              {/* Right side: Total and Actions */}
                              {someEventsSelected && (
                                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                                  <div className="text-center sm:text-right">
                                    <div className="text-lg font-bold text-blue-600">
                                      €{selectedTotal.toFixed(2)}
                                    </div>
                                    <div className="text-xs text-gray-600">Selected Total</div>
                                  </div>
                                  
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
                            </div>

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

                          {/* Events List */}
                          <div className="space-y-3 overflow-hidden">
                            {(() => {
                              const groupedEvents = groupEventsByMonth(studioEvents)
                              const sortedMonthKeys = Object.keys(groupedEvents).sort()
                              
                              return sortedMonthKeys.map(monthKey => (
                                <div key={monthKey}>
                                  {/* Month Divider */}
                                  <div className="flex items-center gap-3 my-4">
                                    <div className="flex-1 h-px bg-gray-300"></div>
                                    <div className="text-sm font-medium text-gray-600 px-3">
                                      {getMonthLabel(monthKey)}
                                    </div>
                                    <div className="flex-1 h-px bg-gray-300"></div>
                                  </div>
                                  
                                  {/* Events for this month */}
                                  <div className="space-y-3 overflow-hidden">
                                    {groupedEvents[monthKey].map((event) => (
                                      <EventInvoiceCard
                                        key={event.id}
                                        event={event}
                                        selected={selectedEventIds.includes(event.id)}
                                        onToggleSelect={(eventId) => handleToggleEvent(studioId, eventId)}
                                        showCheckbox={true}
                                        variant="compact"
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
    </div>
  )
} 