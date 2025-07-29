'use client'

import { useState, useMemo } from 'react'
import { Container } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import DataLoader from '@/components/ui/data-loader'
import { CalendarDays, Clock, MapPin, Eye, EyeOff, Filter, Search, CheckCircle2, Loader2 } from 'lucide-react'
import { ImportableEvent, ImportPreviewResult } from '@/lib/calendar-import-service'
// import { useTranslation } from '@/lib/i18n/context'

interface EventImportPreviewProps {
  previewData: ImportPreviewResult
  sourceName: string
  onImport: (selectedEvents: ImportableEvent[]) => Promise<void>
  onCancel: () => void
  isImporting?: boolean
}

type FilterType = 'all' | 'yoga' | 'private' | 'selected'

//TODO: REFACTOR: make more readable by breaking into smaller components and hooks, and make more efficient
export function EventImportPreview({ 
  previewData, 
  sourceName, 
  onImport, 
  onCancel,
  isImporting = false 
}: EventImportPreviewProps) {
  // const { t } = useTranslation()
  const [events, setEvents] = useState<ImportableEvent[]>(previewData.events)
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState<FilterType>('all')
  const [showPrivate, setShowPrivate] = useState(false)

  // ==================== COMPUTED VALUES ====================
  
  const filteredEvents = useMemo(() => {
    let filtered = [...events]

    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(search) ||
        event.description?.toLowerCase().includes(search) ||
        event.location?.toLowerCase().includes(search)
      )
    }

    switch (filter) {
      case 'yoga':
        filtered = filtered.filter(event => event.isYogaLikely)
        break
      case 'private':
        filtered = filtered.filter(event => event.isPrivate)
        break
      case 'selected':
        filtered = filtered.filter(event => event.selected)
        break
    }

    if (!showPrivate) {
      filtered = filtered.filter(event => !event.isPrivate)
    }

    return filtered
  }, [events, searchTerm, filter, showPrivate])

  const stats = useMemo(() => {
    const selectedCount = events.filter(e => e.selected).reduce((total, event) => {
      if (event.isRecurringGroup && event.recurringInstanceCount) {
        return total + event.recurringInstanceCount
      }
      return total + 1
    }, 0)

    return {
      total: events.length,
      selected: selectedCount,
      yoga: events.filter(e => e.isYogaLikely).length,
      private: events.filter(e => e.isPrivate).length,
    }
  }, [events])

  // ==================== EVENT HANDLERS ====================

  const handleEventToggle = (eventId: string, selected: boolean) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId ? { ...event, selected } : event
    ))
  }

  const handleSelectAll = () => {
    const allSelected = filteredEvents.every(e => e.selected)
    const newSelection = !allSelected
    
    setEvents(prev => prev.map(event => {
      const isInFiltered = filteredEvents.some(fe => fe.id === event.id)
      return isInFiltered ? { ...event, selected: newSelection } : event
    }))
  }

  const handleQuickSelect = (type: 'yoga' | 'none') => {
    setEvents(prev => prev.map(event => ({
      ...event,
      selected: type === 'yoga' ? (event.isYogaLikely || false) && !event.isPrivate : false
    })))
  }

  const handleImport = async () => {
    const selectedEvents = events.filter(e => e.selected)
    
    const eventsToImport: ImportableEvent[] = []
    for (const event of selectedEvents) {
      if (event.isRecurringGroup && event.originalInstances) {
        eventsToImport.push(...event.originalInstances)
      } else {
        eventsToImport.push(event)
      }
    }
    
    await onImport(eventsToImport)
  }

  // ==================== UTILITY FUNCTIONS ====================

  const formatEventTime = (event: ImportableEvent) => {
    const start = new Date(event.start.dateTime || event.start.date || 0)
    const end = new Date(event.end.dateTime || event.end.date || 0)
    
    if (event.start.date && !event.start.dateTime) {
      return 'All day'
    }
    
    return `${start.toLocaleDateString()} ${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
  }

  // ==================== LOADING STATE ====================
  
  if (isImporting) {
    return (
      <Container>
        <div className="max-w-4xl mx-auto py-8">
          <Card>
            <CardContent className="py-12">
              <div className="text-center space-y-4">
                <Loader2 className="w-8 h-8 mx-auto animate-spin text-primary" />
                <div>
                  <h3 className="font-medium">Importing Events</h3>
                  <p className="text-sm text-muted-foreground">
                    Adding {stats.selected} events to your yoga calendar...
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>
    )
  }

  // ==================== MAIN RENDER ====================

  return (
    <Container>
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Review Import</h2>
          <p className="text-muted-foreground">
            Select which events to import from <span className="font-medium">{sourceName}</span>
          </p>
        </div>

        {/* Stats & Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Import Summary</span>
              <Badge variant="outline" className="text-sm">
                {stats.selected} selected
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="font-medium text-lg">{stats.total}</div>
                <div className="text-muted-foreground">Total Events</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="font-medium text-lg text-green-700">{stats.yoga}</div>
                <div className="text-muted-foreground">Yoga-related</div>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <div className="font-medium text-lg text-yellow-700">{stats.private}</div>
                <div className="text-muted-foreground">Private/Personal</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="font-medium text-lg text-blue-700">{stats.selected}</div>
                <div className="text-muted-foreground">Will Import</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickSelect('yoga')}
              >
                Select Yoga Only
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickSelect('none')}
              >
                Deselect All
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPrivate(!showPrivate)}
              >
                {showPrivate ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
                {showPrivate ? 'Hide' : 'Show'} Private
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Filters & Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search events..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                {(['all', 'yoga', 'private', 'selected'] as FilterType[]).map((filterType) => (
                  <Button
                    key={filterType}
                    variant={filter === filterType ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter(filterType)}
                    className="capitalize"
                  >
                    {filterType === 'all' ? 'All Events' : filterType}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Events List */}
        <DataLoader
          data={filteredEvents}
          loading={false}
          error={null}
          empty={
            <Card>
              <CardContent className="py-12 text-center">
                <CalendarDays className="w-8 h-8 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-medium mb-2">No events found</h3>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your search or filter settings
                </p>
              </CardContent>
            </Card>
          }
        >
          {(eventList) => (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="w-5 h-5" />
                    Events ({eventList.length})
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={eventList.length > 0 && eventList.every(e => e.selected)}
                      onCheckedChange={handleSelectAll}
                    />
                    <label className="text-sm font-medium">Select All Visible</label>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {eventList.map((event) => (
                  <div
                    key={event.id}
                    className={`p-4 border rounded-lg transition-colors ${
                      event.selected ? 'bg-primary/5 border-primary/20' : 'bg-background border-border'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={event.selected}
                        onCheckedChange={(checked) => handleEventToggle(event.id, !!checked)}
                        className="mt-1"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-medium text-sm leading-tight">
                            {event.title}
                            {event.isRecurringGroup && (
                              <Badge variant="outline" className="ml-2 text-xs">
                                {event.recurringPattern} • {event.recurringInstanceCount} events
                              </Badge>
                            )}
                            {event.isPrivate && (
                              <Badge variant="secondary" className="ml-2 text-xs">
                                Private
                              </Badge>
                            )}
                          </h4>
                        </div>
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {event.isRecurringGroup 
                              ? `${event.recurringPattern} series • First: ${formatEventTime(event)}`
                              : formatEventTime(event)
                            }
                          </div>
                          {event.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {event.location}
                            </div>
                          )}
                        </div>

                        {event.description && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {event.description}
                          </p>
                        )}

                        {event.suggestedTags && event.suggestedTags.length > 0 && (
                          <div className="flex items-center gap-1 mt-2">
                            {event.suggestedTags.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {event.suggestedTags.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{event.suggestedTags.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </DataLoader>

        {/* Action Bar */}
        <div className="sticky bottom-0 bg-background/95 backdrop-blur-sm border-t p-4 -mx-4">
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <div className="flex items-center gap-4">
              {stats.selected > 0 && (
                <Alert className="flex-1 max-w-md">
                  <CalendarDays className="h-4 w-4" />
                  <AlertDescription>
                    {stats.selected} event{stats.selected !== 1 ? 's' : ''} will be imported to your yoga calendar
                  </AlertDescription>
                </Alert>
              )}
              <Button 
                onClick={handleImport}
                disabled={stats.selected === 0}
                size="lg"
                className="min-w-[200px]"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Import {stats.selected} Event{stats.selected !== 1 ? 's' : ''}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
} 