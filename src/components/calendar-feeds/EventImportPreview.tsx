'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CalendarDays, Clock, MapPin, Eye, EyeOff, Filter, Search, Tag } from 'lucide-react'
import { ImportableEvent, ImportPreviewResult } from '@/lib/calendar-import-service'

interface EventImportPreviewProps {
  previewData: ImportPreviewResult
  sourceName: string
  onImport: (selectedEvents: ImportableEvent[]) => Promise<void>
  onCancel: () => void
  isImporting?: boolean
}

type FilterType = 'all' | 'yoga' | 'private' | 'selected'

export function EventImportPreview({ 
  previewData, 
  sourceName, 
  onImport, 
  onCancel,
  isImporting = false 
}: EventImportPreviewProps) {
  const [events, setEvents] = useState<ImportableEvent[]>(previewData.events)
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState<FilterType>('all')
  const [showPrivate, setShowPrivate] = useState(false)

  // Filter and search events
  const filteredEvents = useMemo(() => {
    let filtered = [...events]

    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(search) ||
        event.description?.toLowerCase().includes(search) ||
        event.location?.toLowerCase().includes(search)
      )
    }

    // Apply type filter
    switch (filter) {
      case 'yoga':
        filtered = filtered.filter(event => 
          event.suggestedTags?.some(tag => 
            ['yoga', 'pilates', 'meditation', 'wellness', 'fitness'].includes(tag)
          )
        )
        break
      case 'private':
        filtered = filtered.filter(event => event.isPrivate)
        break
      case 'selected':
        filtered = filtered.filter(event => event.selected)
        break
    }

    // Hide private events unless explicitly shown
    if (!showPrivate) {
      filtered = filtered.filter(event => !event.isPrivate)
    }

    return filtered
  }, [events, searchTerm, filter, showPrivate])

  const selectedCount = events.filter(e => e.selected).length
  const yogaCount = events.filter(e => e.suggestedTags?.some(tag => 
    ['yoga', 'pilates', 'meditation', 'wellness', 'fitness'].includes(tag)
  )).length
  const privateCount = events.filter(e => e.isPrivate).length

  const handleEventToggle = (eventId: string, selected: boolean) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId ? { ...event, selected } : event
    ))
  }

  const handleSelectAll = (selected: boolean) => {
    setEvents(prev => prev.map(event => ({ ...event, selected })))
  }

  const handleSelectYogaOnly = () => {
    setEvents(prev => prev.map(event => ({
      ...event,
      selected: (event.suggestedTags?.some(tag => 
        ['yoga', 'pilates', 'meditation', 'wellness', 'fitness'].includes(tag)
      ) || false) && !event.isPrivate
    })))
  }

  const formatEventTime = (event: ImportableEvent) => {
    const startDate = new Date(event.start.dateTime || event.start.date || '')
    const endDate = new Date(event.end.dateTime || event.end.date || '')
    
    if (event.start.date) {
      // All-day event
      return startDate.toLocaleDateString()
    } else {
      // Timed event
      const sameDay = startDate.toDateString() === endDate.toDateString()
      if (sameDay) {
        return `${startDate.toLocaleDateString()} • ${startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
      } else {
        return `${startDate.toLocaleDateString()} ${startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${endDate.toLocaleDateString()} ${endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
      }
    }
  }

  const handleImport = async () => {
    const selectedEvents = events.filter(e => e.selected)
    await onImport(selectedEvents)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Import Events</h2>
        <p className="text-muted-foreground">
          Review and select events to import from &quot;{sourceName}&quot;
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{previewData.totalCount}</div>
            <p className="text-xs text-muted-foreground">Total Events</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{yogaCount}</div>
            <p className="text-xs text-muted-foreground">Yoga-related</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-orange-600">{privateCount}</div>
            <p className="text-xs text-muted-foreground">Private/Personal</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">{selectedCount}</div>
            <p className="text-xs text-muted-foreground">Selected</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Quickly select or filter events</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => handleSelectAll(true)}>
              Select All
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleSelectAll(false)}>
              Deselect All
            </Button>
            <Button variant="outline" size="sm" onClick={handleSelectYogaOnly}>
              Select Yoga Only
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowPrivate(!showPrivate)}
            >
              {showPrivate ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
              {showPrivate ? 'Hide' : 'Show'} Private
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as FilterType)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="all">All Events</option>
                <option value="yoga">Yoga-related</option>
                <option value="private">Private/Personal</option>
                <option value="selected">Selected</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Events List */}
      <Card>
        <CardHeader>
          <CardTitle>Events ({filteredEvents.length})</CardTitle>
          <CardDescription>
            Check the events you want to import into your yoga calendar
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredEvents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No events match your current filters
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className={`border rounded-lg p-4 space-y-3 transition-colors ${
                    event.selected ? 'bg-blue-50 border-blue-200' : 'bg-white'
                  } ${event.isPrivate ? 'opacity-75' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={event.selected}
                      onCheckedChange={(checked) => 
                        handleEventToggle(event.id, checked as boolean)
                      }
                      className="mt-1"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-medium text-sm leading-tight">
                          {event.title}
                          {event.isPrivate && (
                            <Badge variant="secondary" className="ml-2 text-xs">
                              Private
                            </Badge>
                          )}
                        </h4>
                      </div>
                      
                      <div className="space-y-2 mt-2">
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatEventTime(event)}
                          </div>
                          {event.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              <span className="truncate">{event.location}</span>
                            </div>
                          )}
                        </div>

                        {event.description && (
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {event.description}
                          </p>
                        )}

                        {event.suggestedTags && event.suggestedTags.length > 0 && (
                          <div className="flex items-center gap-1 flex-wrap">
                            <Tag className="w-3 h-3 text-muted-foreground" />
                            {event.suggestedTags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Import Actions */}
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={onCancel} disabled={isImporting}>
          Cancel
        </Button>
        <div className="flex items-center gap-4">
          {selectedCount > 0 && (
            <Alert className="flex-1 max-w-md">
              <CalendarDays className="h-4 w-4" />
              <AlertDescription>
                {selectedCount} event{selectedCount !== 1 ? 's' : ''} will be imported to your yoga calendar
              </AlertDescription>
            </Alert>
          )}
          <Button 
            onClick={handleImport}
            disabled={selectedCount === 0 || isImporting}
            size="lg"
          >
            {isImporting ? 'Importing...' : `Import ${selectedCount} Event${selectedCount !== 1 ? 's' : ''}`}
          </Button>
        </div>
      </div>
    </div>
  )
} 