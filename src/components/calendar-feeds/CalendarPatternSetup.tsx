'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { LoadingOverlay } from '@/components/ui/LoadingOverlay'
import { 
  analyzeCalendarPatterns, 
  saveSyncFilterRules,
  type CalendarPatternAnalysis,
  type CalendarEvent,
  type SyncFilterRule
} from '@/lib/sync-approach-service'
import { AlertCircle, Check, Plus, X, Eye } from 'lucide-react'

interface CalendarPatternSetupProps {
  userId: string
  calendarFeedId: string
  onComplete: (rules: SyncFilterRule[]) => void
  onSkip: () => void
}

export function CalendarPatternSetup({ 
  userId, 
  calendarFeedId, 
  onComplete, 
  onSkip 
}: CalendarPatternSetupProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<CalendarPatternAnalysis | null>(null)
  const [selectedRules, setSelectedRules] = useState<SyncFilterRule[]>([])
  const [customRules, setCustomRules] = useState<SyncFilterRule[]>([])
  const [showPreview, setShowPreview] = useState(false)
  const [previewEvents, setPreviewEvents] = useState<CalendarEvent[]>([])
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([])
  const [loadingEvents, setLoadingEvents] = useState(false)
  const [newRule, setNewRule] = useState<{
    pattern_type: 'title' | 'location' | 'description'
    pattern_value: string
    match_type: 'contains' | 'exact' | 'starts_with' | 'ends_with'
  }>({
    pattern_type: 'title',
    pattern_value: '',
    match_type: 'contains'
  })

  // Fetch real calendar events for pattern analysis
  useEffect(() => {
    const fetchCalendarEvents = async () => {
      setLoadingEvents(true)
      try {
        const response = await fetch(`/api/calendar-feeds/${calendarFeedId}/events`)
        if (response.ok) {
          const data = await response.json()
          setCalendarEvents(data.events || [])
        } else {
          console.error('Failed to fetch calendar events')
          // Fallback to empty array if fetch fails
          setCalendarEvents([])
        }
      } catch (error) {
        console.error('Error fetching calendar events:', error)
        setCalendarEvents([])
      } finally {
        setLoadingEvents(false)
      }
    }

    if (calendarFeedId) {
      fetchCalendarEvents()
    }
  }, [calendarFeedId])

  const analyzePatterns = async () => {
    setIsAnalyzing(true)
    try {
      // Use real calendar events for pattern analysis
      const patternAnalysis = await analyzeCalendarPatterns(calendarEvents)
      setAnalysis(patternAnalysis)
      setSelectedRules(patternAnalysis.suggestedRules)
    } catch (error) {
      console.error('Pattern analysis failed:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const toggleRule = (rule: SyncFilterRule) => {
    setSelectedRules(prev => {
      const exists = prev.find(r => 
        r.pattern_type === rule.pattern_type && 
        r.pattern_value === rule.pattern_value
      )
      if (exists) {
        return prev.filter(r => r !== exists)
      } else {
        return [...prev, rule]
      }
    })
  }

  const addCustomRule = () => {
    if (!newRule.pattern_value.trim()) return
    
    const rule: SyncFilterRule = {
      id: `custom-${Date.now()}`,
      user_id: userId,
      calendar_feed_id: calendarFeedId,
      pattern_type: newRule.pattern_type,
      pattern_value: newRule.pattern_value,
      match_type: newRule.match_type,
      is_active: true
    }
    
    setCustomRules(prev => [...prev, rule])
    setSelectedRules(prev => [...prev, rule])
    setNewRule({
      pattern_type: 'title',
      pattern_value: '',
      match_type: 'contains'
    })
  }

  const removeCustomRule = (ruleId: string) => {
    setCustomRules(prev => prev.filter(r => r.id !== ruleId))
    setSelectedRules(prev => prev.filter(r => r.id !== ruleId))
  }

  const previewFiltering = () => {
    const allRules = [...selectedRules]
    const filteredEvents = calendarEvents.filter((event: CalendarEvent) => {
      return allRules.some(rule => {
        let content = ''
        switch (rule.pattern_type) {
          case 'title':
            content = event.title
            break
          case 'location':
            content = event.location
            break
          case 'description':
            content = event.description
            break
        }
        
        const lowerContent = content.toLowerCase()
        const lowerPattern = rule.pattern_value.toLowerCase()
        
        switch (rule.match_type) {
          case 'contains':
            return lowerContent.includes(lowerPattern)
          case 'exact':
            return lowerContent === lowerPattern
          case 'starts_with':
            return lowerContent.startsWith(lowerPattern)
          case 'ends_with':
            return lowerContent.endsWith(lowerPattern)
          default:
            return false
        }
      })
    })
    
    setPreviewEvents(filteredEvents)
    setShowPreview(true)
  }

  const saveFilters = async () => {
    setIsLoading(true)
    try {
      // Save filter rules
      const rulesToSave = selectedRules.map(rule => ({
        pattern_type: rule.pattern_type,
        pattern_value: rule.pattern_value,
        match_type: rule.match_type,
        is_active: rule.is_active
      }))
      
      // saveSyncFilterRules now automatically sets sync_approach to 'mixed_calendar' 
      // and enables filtering, so we don't need to call updateCalendarFeedFiltering
      await saveSyncFilterRules(userId, calendarFeedId, rulesToSave)
      
      onComplete(selectedRules)
    } catch (error) {
      console.error('Failed to save filters:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold">Set Up Calendar Filtering</h2>
        <p className="text-gray-600">
          Since you have a mixed calendar, let&apos;s analyze your events and create rules to sync only your yoga classes.
        </p>
        {loadingEvents && (
          <p className="text-sm text-muted-foreground">
            Loading your calendar events for analysis...
          </p>
        )}
        {!loadingEvents && calendarEvents.length === 0 && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No recent events found in your calendar. You can still create custom filtering rules.
            </AlertDescription>
          </Alert>
        )}
      </div>

      {!analysis ? (
        <Card>
          <CardHeader>
            <CardTitle>Step 1: Analyze Your Calendar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              We&apos;ll look at your calendar events and suggest filtering rules to identify yoga-related content.
            </p>
            <Button 
              onClick={analyzePatterns}
              disabled={isAnalyzing || loadingEvents}
              className="w-full"
            >
              {isAnalyzing ? 'Analyzing Calendar...' : loadingEvents ? 'Loading Events...' : 'Analyze My Calendar'}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <Tabs defaultValue="suggested" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="suggested">Suggested Rules</TabsTrigger>
              <TabsTrigger value="custom">Custom Rules</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
            
            <TabsContent value="suggested" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Suggested Filter Rules</CardTitle>
                  <p className="text-sm text-gray-600">
                    Based on your calendar analysis, here are suggested rules. Select the ones that make sense for your yoga classes.
                  </p>
                </CardHeader>
                <CardContent>
                  {analysis.suggestedRules.length === 0 ? (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        No yoga-related patterns found automatically. You can create custom rules in the next tab.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <div className="space-y-3">
                      {analysis.suggestedRules.map((rule, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-3 p-3 border rounded-lg"
                        >
                          <Checkbox
                            checked={selectedRules.some(r => 
                              r.pattern_type === rule.pattern_type && 
                              r.pattern_value === rule.pattern_value
                            )}
                            onCheckedChange={() => toggleRule(rule)}
                          />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline">{rule.pattern_type}</Badge>
                              <span className="font-medium">{rule.pattern_value}</span>
                            </div>
                            <p className="text-sm text-gray-500">
                              {rule.match_type === 'contains' ? 'Contains' : rule.match_type} match
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="custom" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Add Custom Rules</CardTitle>
                  <p className="text-sm text-gray-600">
                    Create your own rules to match yoga-related events.
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="pattern_type">Field to Match</Label>
                      <Select 
                        value={newRule.pattern_type} 
                        onChange={(value: string) => 
                          setNewRule(prev => ({ ...prev, pattern_type: value as 'title' | 'location' | 'description' }))
                        }
                        options={[
                          { value: 'title', label: 'Title' },
                          { value: 'location', label: 'Location' },
                          { value: 'description', label: 'Description' }
                        ]}
                        placeholder="Select field to match"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="match_type">Match Type</Label>
                      <Select 
                        value={newRule.match_type} 
                        onChange={(value: string) => 
                          setNewRule(prev => ({ ...prev, match_type: value as 'contains' | 'exact' | 'starts_with' | 'ends_with' }))
                        }
                        options={[
                          { value: 'contains', label: 'Contains' },
                          { value: 'exact', label: 'Exact match' },
                          { value: 'starts_with', label: 'Starts with' },
                          { value: 'ends_with', label: 'Ends with' }
                        ]}
                        placeholder="Select match type"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="pattern_value">Pattern</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="pattern_value"
                          value={newRule.pattern_value}
                          onChange={(e) => setNewRule(prev => ({ 
                            ...prev, 
                            pattern_value: e.target.value 
                          }))}
                          placeholder="e.g., yoga, studio name..."
                        />
                        <Button 
                          onClick={addCustomRule}
                          disabled={!newRule.pattern_value.trim()}
                          size="sm"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {customRules.length > 0 && (
                    <div className="space-y-2">
                      <Label>Custom Rules</Label>
                      {customRules.map((rule) => (
                        <div
                          key={rule.id}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">{rule.pattern_type}</Badge>
                            <span className="font-medium">{rule.pattern_value}</span>
                            <span className="text-sm text-gray-500">({rule.match_type})</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeCustomRule(rule.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="preview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Preview Filtering Results</CardTitle>
                  <p className="text-sm text-gray-600">
                    See which events would be synced with your current rules.
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    onClick={previewFiltering}
                    disabled={selectedRules.length === 0}
                    className="w-full"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview Filtering
                  </Button>
                  
                  {showPreview && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Events that would be synced:</h4>
                        <Badge variant="secondary">{previewEvents.length} events</Badge>
                      </div>
                      
                      {previewEvents.length === 0 ? (
                        <Alert>
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>
                            No events match your current rules. Try adjusting your filters.
                          </AlertDescription>
                        </Alert>
                      ) : (
                        <div className="space-y-2">
                          {previewEvents.map((event, index) => (
                            <div key={index} className="p-3 border rounded-lg">
                              <div className="font-medium">{event.title}</div>
                              <div className="text-sm text-gray-600">{event.location}</div>
                              <div className="text-sm text-gray-500">{event.description}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-between">
            <Button variant="outline" onClick={onSkip}>
              Skip for Now
            </Button>
            <Button 
              onClick={saveFilters}
              disabled={selectedRules.length === 0 || isLoading}
              className="min-w-32"
            >
              {isLoading ? (
                <>
                  <LoadingOverlay isVisible={true} />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Save Filters
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
} 