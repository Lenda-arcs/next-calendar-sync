'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Plus, X, AlertTriangle, CheckCircle, Eye } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase'

interface PatternConflict {
  pattern: string
  conflictingStudios: Array<{
    id: string
    name: string
    conflictingPattern: string
  }>
  affectedLocations: string[]
}

type PatternInputMode = 'location' | 'keywords'

interface PatternInputProps {
  label: string
  patterns: string[]
  onChange: (patterns: string[]) => void
  placeholder?: string
  userId: string
  currentStudioId?: string // For edit mode - exclude current studio from conflicts
  required?: boolean
  error?: string
  className?: string
  mode?: PatternInputMode // Removed location-keywords
  maxPatterns?: number
  suggestions?: Array<{ value: string; label: string; count?: number }>
}

export function PatternInput({
  label,
  patterns,
  onChange,
  placeholder = "e.g., Flow Studio, Yoga Works",
  userId,
  currentStudioId,
  required = false,
  error,
  className,
  mode = 'location',
  maxPatterns = 10,
  suggestions = []
}: PatternInputProps) {
  const [inputValue, setInputValue] = useState('')
  const [conflicts, setConflicts] = useState<PatternConflict[]>([])
  const [previewLocations, setPreviewLocations] = useState<string[]>([])
  const [previewEvents, setPreviewEvents] = useState<Array<{ id: string; title: string; location?: string }>>([])
  const [showPreview, setShowPreview] = useState(false)
  const [isCheckingConflicts, setIsCheckingConflicts] = useState(false)
  const supabase = createClient()

  // Update placeholder based on mode
  const getPlaceholder = () => {
    switch (mode) {
      case 'keywords':
        return placeholder || "e.g., Flow, Vinyasa, Meditation"
      case 'location':
        return placeholder || "e.g., Flow Studio, Yoga Works"
      default:
        return placeholder || "e.g., Flow Studio, Yoga Works"
    }
  }

  // Smart suggestion filtering
  const getFilteredSuggestions = (suggestions: Array<{ value: string; label: string; count?: number }>) => {
    const genericTerms = [
      // Countries
      'germany', 'netherlands', 'belgium', 'france', 'spain', 'italy', 'uk', 'usa',
      // Cities (common ones)
      'berlin', 'amsterdam', 'london', 'paris', 'madrid', 'rome', 'new york', 'los angeles',
      // Generic location terms
      'downtown', 'center', 'main', 'central', 'north', 'south', 'east', 'west',
      // Generic yoga terms (for keywords mode)
      'yoga', 'class', 'session', 'practice', 'workshop'
    ]
    
    return suggestions
      .filter(s => {
        const lowerValue = s.value.toLowerCase()
        // Filter out overly generic terms
        if (genericTerms.includes(lowerValue)) return false
        // Filter out very short terms (likely too generic)
        if (s.value.length < 3) return false
        // Filter out terms that are too common (more than 50% of events)
        if (s.count && s.count > 100) return false // Adjust threshold as needed
        return true
      })
      .sort((a, b) => {
        // Prioritize terms with moderate usage (not too rare, not too common)
        const aCount = a.count || 0
        const bCount = b.count || 0
        // Sweet spot: 5-50 events
        const aScore = aCount >= 5 && aCount <= 50 ? aCount : 0
        const bScore = bCount >= 5 && bCount <= 50 ? bCount : 0
        return bScore - aScore
      })
      .slice(0, 8) // Limit to top 8 suggestions
  }

  // Check for pattern conflicts based on mode
  const checkConflicts = useCallback(async (patternsToCheck: string[]) => {
    if (patternsToCheck.length === 0) {
      setConflicts([])
      return
    }

    setIsCheckingConflicts(true)
    try {
      if (mode === 'location') {
        // Original studio pattern conflict checking
        let query = supabase
          .from('billing_entities')
          .select('id, entity_name, location_match')
          .eq('user_id', userId)
          .eq('entity_type', 'studio')

        if (currentStudioId) {
          query = query.neq('id', currentStudioId)
        }

        const { data: existingStudios, error: studiosError } = await query
        if (studiosError) throw studiosError

        const newConflicts: PatternConflict[] = []

        for (const pattern of patternsToCheck) {
          const conflictingStudios = []
          const lowerPattern = pattern.toLowerCase()

          for (const studio of existingStudios || []) {
            const studioPatterns = studio.location_match || []
            
            for (const existingPattern of studioPatterns) {
              const lowerExisting = existingPattern.toLowerCase()
              
              if (lowerPattern.includes(lowerExisting) || lowerExisting.includes(lowerPattern)) {
                conflictingStudios.push({
                  id: studio.id,
                  name: studio.entity_name,
                  conflictingPattern: existingPattern
                })
              }
            }
          }

          if (conflictingStudios.length > 0) {
            newConflicts.push({
              pattern,
              conflictingStudios,
              affectedLocations: []
            })
          }
        }

        setConflicts(newConflicts)
      } else {
        // For keyword modes, check against existing tag rules
        const { data: existingRules, error: rulesError } = await supabase
          .from('tag_rules')
          .select('id, keywords, location_keywords, tags(name)')
          .eq('user_id', userId)

        if (rulesError) throw rulesError

        const newConflicts: PatternConflict[] = []

        for (const pattern of patternsToCheck) {
          const conflictingRules = []
          const lowerPattern = pattern.toLowerCase()

          for (const rule of existingRules || []) {
            const ruleKeywords = mode === 'keywords' 
              ? (rule.keywords || [])
              : (rule.location_keywords || [])

            if (ruleKeywords.some((k: string) => k.toLowerCase().includes(lowerPattern))) {
              conflictingRules.push({
                id: rule.id,
                name: rule.tags?.name || 'Unknown Tag',
                conflictingPattern: ruleKeywords.find((k: string) => k.toLowerCase().includes(lowerPattern)) || pattern
              })
            }
          }

          if (conflictingRules.length > 0) {
            newConflicts.push({
              pattern,
              conflictingStudios: conflictingRules,
              affectedLocations: []
            })
          }
        }

        setConflicts(newConflicts)
      }
    } catch (error) {
      console.error('Error checking pattern conflicts:', error)
    } finally {
      setIsCheckingConflicts(false)
    }
  }, [userId, currentStudioId, supabase, mode])

  // Preview which locations/events would match
  const previewMatches = useCallback(async (patternsToCheck: string[]) => {
    if (patternsToCheck.length === 0) {
      setPreviewLocations([])
      setPreviewEvents([])
      return
    }

    try {
      if (mode === 'location') {
        // Original location preview
        const { data: events, error } = await supabase
          .from('events')
          .select('location')
          .eq('user_id', userId)
          .not('location', 'is', null)

        if (error) throw error

        const uniqueLocations = Array.from(new Set(
          events.map(event => event.location).filter((location): location is string => Boolean(location))
        ))

        const matchingLocations = uniqueLocations.filter(location => 
          patternsToCheck.some(pattern => 
            location.toLowerCase().includes(pattern.toLowerCase())
          )
        )

        setPreviewLocations(matchingLocations)
      } else {
        // Preview events that would match keywords
        const { data: events, error } = await supabase
          .from('events')
          .select('id, title, location')
          .eq('user_id', userId)

        if (error) throw error

        const matchingEvents = events.filter(event => 
          patternsToCheck.some(pattern => {
            const lowerPattern = pattern.toLowerCase()
            if (mode === 'keywords') {
              return (event.title?.toLowerCase().includes(lowerPattern))
            } else {
              return (event.location?.toLowerCase().includes(lowerPattern))
            }
          })
        ).map(event => ({
          id: event.id,
          title: event.title || 'Untitled Event',
          location: event.location || undefined
        }))

        setPreviewEvents(matchingEvents.slice(0, 20)) // Limit to 20 events
      }
    } catch (error) {
      console.error('Error previewing matches:', error)
    }
  }, [userId, supabase, mode])

  // Check conflicts when patterns change
  useEffect(() => {
    checkConflicts(patterns)
  }, [patterns, checkConflicts])

  // Preview matches when requested
  useEffect(() => {
    if (showPreview) {
      previewMatches(patterns)
    }
  }, [showPreview, patterns, previewMatches])

  const addPattern = () => {
    const trimmedValue = inputValue.trim()
    if (trimmedValue && !patterns.includes(trimmedValue) && patterns.length < maxPatterns) {
      onChange([...patterns, trimmedValue])
      setInputValue('')
    }
  }

  const removePattern = (index: number) => {
    onChange(patterns.filter((_, i) => i !== index))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addPattern()
    }
  }

  const hasWarnings = conflicts.some(c => c.conflictingStudios.length > 0)

  return (
    <div className={cn('space-y-3', className)}>
      <Label className="block text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>

      {/* Input row */}
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={getPlaceholder()}
          className={error ? 'border-destructive' : ''}
        />
        <Button 
          type="button" 
          onClick={addPattern} 
          size="sm"
          disabled={!inputValue.trim() || patterns.includes(inputValue.trim()) || patterns.length >= maxPatterns}
        >
          <Plus className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowPreview(!showPreview)}
          disabled={patterns.length === 0}
        >
          <Eye className="w-4 h-4" />
          {showPreview ? 'Hide' : 'Preview'}
        </Button>
      </div>

      {/* Current patterns */}
      <div className="flex flex-wrap gap-2">
        {patterns.map((pattern, index) => {
          const hasConflict = conflicts.some(c => c.pattern === pattern)
          return (
            <Badge 
              key={index} 
              variant={hasConflict ? "destructive" : "secondary"}
              className="flex items-center gap-2"
            >
              {hasConflict && <AlertTriangle className="w-3 h-3" />}
              {pattern}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removePattern(index)}
                className="h-auto p-0 ml-1 hover:bg-white/20"
              >
                <X className="w-3 h-3" />
              </Button>
            </Badge>
          )
        })}
      </div>

      {/* Pattern limit warning */}
      {patterns.length >= maxPatterns && (
        <p className="text-xs text-muted-foreground">
          Maximum {maxPatterns} patterns reached. Remove a pattern to add another.
        </p>
      )}

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Suggestions:</p>
          <div className="flex flex-wrap gap-1">
            {getFilteredSuggestions(suggestions).map((suggestion, index) => (
              <Button
                key={index}
                type="button"
                variant="outline"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={() => {
                  if (!patterns.includes(suggestion.value) && patterns.length < maxPatterns) {
                    onChange([...patterns, suggestion.value])
                  }
                }}
                disabled={patterns.includes(suggestion.value) || patterns.length >= maxPatterns}
              >
                {suggestion.label}
                {suggestion.count && (
                  <span className="ml-1 text-muted-foreground">({suggestion.count})</span>
                )}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Conflict warnings */}
      {hasWarnings && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-medium">
                {mode === 'location' ? 'Pattern conflicts detected:' : 'Keyword conflicts detected:'}
              </p>
              {conflicts.map((conflict, index) => (
                <div key={index} className="text-sm">
                  <strong>&quot;{conflict.pattern}&quot;</strong> overlaps with:
                  <ul className="ml-4 mt-1">
                    {conflict.conflictingStudios.map((studio, studioIndex) => (
                      <li key={studioIndex}>
                        • {studio.name} (&quot;{studio.conflictingPattern}&quot;)
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              {mode === 'location' && (
                <p className="text-xs">
                  💡 Consider making patterns more specific (e.g., &quot;Flow Studio Amsterdam&quot; instead of &quot;Flow Studio&quot;)
                </p>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Preview */}
      {showPreview && mode === 'location' && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-medium">
                These patterns would match {previewLocations.length} existing locations:
              </p>
              {previewLocations.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {previewLocations.slice(0, 10).map((location, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {location}
                    </Badge>
                  ))}
                  {previewLocations.length > 10 && (
                    <Badge variant="outline" className="text-xs">
                      +{previewLocations.length - 10} more
                    </Badge>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No existing locations match these patterns yet.
                </p>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Event preview for keyword modes */}
      {showPreview && (mode === 'keywords') && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-medium">
                These keywords would match {previewEvents.length} existing events:
              </p>
              {previewEvents.length > 0 ? (
                <div className="space-y-1">
                  {previewEvents.slice(0, 5).map((event, index) => (
                    <div key={index} className="text-xs bg-gray-50 p-2 rounded">
                      <strong>{event.title}</strong>
                      {event.location && <span className="text-muted-foreground"> • {event.location}</span>}
                    </div>
                  ))}
                  {previewEvents.length > 5 && (
                    <p className="text-xs text-muted-foreground">
                      +{previewEvents.length - 5} more events
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No existing events match these keywords yet.
                </p>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Error message */}
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      {/* Loading state */}
      {isCheckingConflicts && (
        <p className="text-xs text-muted-foreground">Checking for conflicts...</p>
      )}

      {/* Help text */}
      <p className="text-xs text-muted-foreground">
        Add patterns that will match your event locations. 
        Examples: &quot;Flow Studio&quot;, &quot;Downtown Location&quot;, &quot;Amsterdam West&quot;
      </p>
    </div>
  )
} 