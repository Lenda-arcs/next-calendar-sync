'use client'

import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import DataLoader from '@/components/ui/data-loader'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import { EventInvoiceCard } from './EventInvoiceCard'
import { HistoricalSyncCTA } from './HistoricalSyncCTA'
import { UnmatchedEventsSection } from './UnmatchedEventsSection'
import { useSupabaseQuery } from '@/lib/hooks/useSupabaseQuery'
import { getUninvoicedEvents, getUnmatchedEvents, calculateTotalPayout, EventWithStudio } from '@/lib/invoice-utils'
import { useCalendarFeeds, useCalendarFeedActions } from '@/lib/hooks/useCalendarFeeds'
import { RefreshCw } from 'lucide-react'

interface UninvoicedEventsListProps {
  userId: string
  onCreateInvoice?: (studioId: string, eventIds: string[]) => void
  onCreateStudio?: () => void
}

export function UninvoicedEventsList({ userId, onCreateInvoice, onCreateStudio }: UninvoicedEventsListProps) {
  const [selectedEvents, setSelectedEvents] = useState<Record<string, string[]>>({})
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Use the same query key as InvoiceManagement to leverage caching
  const {
    data: uninvoicedEvents,
    isLoading,
    error,
    refetch
  } = useSupabaseQuery({
    queryKey: ['uninvoiced-events', userId],
    fetcher: () => getUninvoicedEvents(userId),
    enabled: !!userId
  })

  const { syncFeed } = useCalendarFeedActions()

  // Group events by studio client-side
  const eventsByStudio = useMemo(() => {
    if (!uninvoicedEvents) return null
    
    return uninvoicedEvents.reduce((acc, event) => {
      const studioId = event.studio_id!
      if (!acc[studioId]) {
        acc[studioId] = []
      }
      acc[studioId].push(event)
      return acc
    }, {} as Record<string, EventWithStudio[]>)
  }, [uninvoicedEvents])

  // Fetch unmatched events (events without studio assignment)
  const {
    data: unmatchedEvents,
    isLoading: unmatchedLoading,
    refetch: refetchUnmatched
  } = useSupabaseQuery({
    queryKey: ['unmatched-events', userId],
    fetcher: () => getUnmatchedEvents(userId),
    enabled: !!userId
  })

  const { data: calendarFeeds, isLoading: feedsLoading } = useCalendarFeeds(userId)

  const hasConnectedFeeds = calendarFeeds && calendarFeeds.length > 0
  
  // Check if there are any uninvoiced events (matched or unmatched)
  const hasUninvoicedEvents = (eventsByStudio && Object.keys(eventsByStudio).length > 0) || 
                              (unmatchedEvents && unmatchedEvents.length > 0)

  // Enhanced refresh that syncs feeds first, then refetches data
  const handleRefresh = async () => {
    if (!calendarFeeds || calendarFeeds.length === 0) {
      // If no feeds, just refetch data
      refetch()
      return
    }

    setIsRefreshing(true)
    try {
      // Sync all calendar feeds in historical mode
      const syncPromises = calendarFeeds.map(feed => 
        syncFeed(feed.id, 'historical')
      )
      
      await Promise.all(syncPromises)
      
      // Then refetch the data
      refetch()
    } catch (error) {
      console.error('Failed to sync feeds during refresh:', error)
      // Still refetch data even if sync fails
      refetch()
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleToggleEvent = (studioId: string, eventId: string) => {
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
  }

  const handleSelectAllStudio = (studioId: string) => {
    if (!eventsByStudio?.[studioId]) return
    
    const allEventIds = eventsByStudio[studioId].map(event => event.id)
    const currentSelected = selectedEvents[studioId] || []
    const allSelected = allEventIds.every(id => currentSelected.includes(id))
    
    setSelectedEvents(prev => ({
      ...prev,
      [studioId]: allSelected ? [] : allEventIds
    }))
  }

  const handleCreateInvoice = (studioId: string) => {
    const eventIds = selectedEvents[studioId] || []
    if (eventIds.length > 0 && onCreateInvoice) {
      onCreateInvoice(studioId, eventIds)
    }
  }

  const getSelectedTotal = (studioId: string): number => {
    if (!eventsByStudio?.[studioId]) return 0
    
    const selectedEventIds = selectedEvents[studioId] || []
    const selectedEventsData = eventsByStudio[studioId].filter(event => 
      selectedEventIds.includes(event.id)
    )
    
    const studio = eventsByStudio[studioId][0]?.studio
    if (!studio) return 0
    
    return calculateTotalPayout(selectedEventsData, studio)
  }

  const groupEventsByMonth = (events: EventWithStudio[]) => {
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
  }

  const getMonthLabel = (monthKey: string) => {
    const [year, month] = monthKey.split('-')
    const date = new Date(parseInt(year), parseInt(month) - 1)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
  }

  return (
    <div className="space-y-4">
      {/* Historical Sync CTA - Only visible when feeds are connected and no uninvoiced events exist */}
      {hasConnectedFeeds && !feedsLoading && !hasUninvoicedEvents && (
        <HistoricalSyncCTA 
          calendarFeeds={calendarFeeds}
          onSyncComplete={refetch}
        />
      )}

      {/* Unmatched Events Section */}
      <UnmatchedEventsSection
        unmatchedEvents={unmatchedEvents || []}
        isLoading={unmatchedLoading}
        onRefresh={refetchUnmatched}
        onCreateStudio={onCreateStudio || (() => {})}
        userId={userId}
      />

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
              const totalPayout = studio ? calculateTotalPayout(studioEvents, studio) : 0
              const selectedTotal = getSelectedTotal(studioId)

              if (!studio) return null

              return (
                <AccordionItem value={studioId} key={studioId}>
                  <Card variant="outlined" className="overflow-hidden">
                    <AccordionTrigger className="px-6 py-4 hover:no-underline cursor-pointer group">
                      <div className="flex items-center justify-between w-full mr-4 group-hover:text-blue-600 transition-colors">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 flex-1">
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">{studio.studio_name}</CardTitle>
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

                    <AccordionContent className="px-0 pb-0">
                      <CardContent className="pt-0">
                        {/* Studio Actions */}
                        <div className="flex items-center justify-between mb-6 p-4 bg-blue-50/50 rounded-lg">
                          <div className="flex items-center gap-4">
                            <Button
                              onClick={() => handleSelectAllStudio(studioId)}
                              variant="outline"
                              size="sm"
                            >
                              {allEventsSelected ? 'Deselect All' : 'Select All'}
                            </Button>
                            {someEventsSelected && (
                              <div className="text-sm text-gray-600">
                                {selectedEventIds.length} of {studioEvents.length} events selected
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-4">
                            {someEventsSelected && (
                              <div className="text-right">
                                <div className="text-lg font-bold text-blue-600">
                                  €{selectedTotal.toFixed(2)}
                                </div>
                                <div className="text-xs text-gray-600">Selected Total</div>
                              </div>
                            )}
                            <Button
                              onClick={() => handleCreateInvoice(studioId)}
                              disabled={!someEventsSelected}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              Create Invoice ({selectedEventIds.length})
                            </Button>
                          </div>
                        </div>

                        {/* Events List */}
                        <div className="space-y-3">
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
                                <div className="space-y-3">
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
    </div>
  )
} 