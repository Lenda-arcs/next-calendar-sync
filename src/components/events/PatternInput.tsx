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
  className
}: PatternInputProps) {
  const [inputValue, setInputValue] = useState('')
  const [conflicts, setConflicts] = useState<PatternConflict[]>([])
  const [previewLocations, setPreviewLocations] = useState<string[]>([])
  const [showPreview, setShowPreview] = useState(false)
  const [isCheckingConflicts, setIsCheckingConflicts] = useState(false)
  const supabase = createClient()

  // Check for pattern conflicts
  const checkConflicts = useCallback(async (patternsToCheck: string[]) => {
    if (patternsToCheck.length === 0) {
      setConflicts([])
      return
    }

    setIsCheckingConflicts(true)
    try {
      // Get existing studios with patterns
      let query = supabase
        .from('billing_entities')
        .select('id, entity_name, location_match')
        .eq('user_id', userId)
        .eq('entity_type', 'studio')

      // Only exclude current studio if we're in edit mode
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
            
            // Check for overlaps: either pattern contains the other
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
            affectedLocations: [] // We'll populate this in preview
          })
        }
      }

      setConflicts(newConflicts)
    } catch (error) {
      console.error('Error checking pattern conflicts:', error)
    } finally {
      setIsCheckingConflicts(false)
    }
  }, [userId, currentStudioId, supabase])

  // Preview which locations would match
  const previewMatches = useCallback(async (patternsToCheck: string[]) => {
    if (patternsToCheck.length === 0) {
      setPreviewLocations([])
      return
    }

    try {
      // Get user's event locations
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
    } catch (error) {
      console.error('Error previewing matches:', error)
    }
  }, [userId, supabase])

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
    if (trimmedValue && !patterns.includes(trimmedValue)) {
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
          placeholder={placeholder}
          className={error ? 'border-destructive' : ''}
        />
        <Button 
          type="button" 
          onClick={addPattern} 
          size="sm"
          disabled={!inputValue.trim() || patterns.includes(inputValue.trim())}
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

      {/* Conflict warnings */}
      {hasWarnings && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-medium">Pattern conflicts detected:</p>
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
              <p className="text-xs">
                💡 Consider making patterns more specific (e.g., &quot;Flow Studio Amsterdam&quot; instead of &quot;Flow Studio&quot;)
              </p>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Location preview */}
      {showPreview && (
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