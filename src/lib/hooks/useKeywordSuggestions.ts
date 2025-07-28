import { useSupabaseQuery } from './useQueryWithSupabase'
import { useMemo } from 'react'

interface KeywordSuggestion {
  keyword: string
  count: number
  type: 'title' | 'location'
}

interface UseKeywordSuggestionsProps {
  userId: string
  enabled?: boolean
  minCount?: number // Minimum occurrences to be suggested
}

export function useKeywordSuggestions({ 
  userId, 
  enabled = true, 
  minCount = 2 
}: UseKeywordSuggestionsProps) {
  // Fetch user's events to analyze for keyword suggestions
  const { data: events, isLoading, error } = useSupabaseQuery({
    queryKey: ['keyword-suggestions', userId],
    fetcher: async (supabase) => {
      const { data, error } = await supabase
        .from('events')
        .select('title, location')
        .eq('user_id', userId)
        .not('title', 'is', null)
        .limit(500) // Limit to avoid too much data
      
      if (error) throw error
      return data
    },
    enabled: enabled && !!userId,
  })

  // Process events to extract keyword suggestions
  const suggestions = useMemo<KeywordSuggestion[]>(() => {
    if (!events || events.length === 0) return []

    const titleWords = new Map<string, number>()
    const locationWords = new Map<string, number>()

    // Extract and count words from titles and locations
    events.forEach((event: { title?: string | null; location?: string | null }) => {
      // Process title
      if (event.title) {
        const words = extractMeaningfulWords(event.title)
        words.forEach(word => {
          titleWords.set(word, (titleWords.get(word) || 0) + 1)
        })
      }

      // Process location
      if (event.location) {
        const words = extractMeaningfulWords(event.location)
        words.forEach(word => {
          locationWords.set(word, (locationWords.get(word) || 0) + 1)
        })
      }
    })

    // Convert to suggestions array
    const titleSuggestions: KeywordSuggestion[] = Array.from(titleWords.entries())
      .filter(([, count]) => count >= minCount)
      .map(([keyword, count]) => ({ keyword, count, type: 'title' as const }))

    const locationSuggestions: KeywordSuggestion[] = Array.from(locationWords.entries())
      .filter(([, count]) => count >= minCount)
      .map(([keyword, count]) => ({ keyword, count, type: 'location' as const }))

    // Combine and sort by count (descending)
    return [...titleSuggestions, ...locationSuggestions]
      .sort((a, b) => b.count - a.count)
      .slice(0, 50) // Limit to top 50 suggestions
  }, [events, minCount])

  // Separate suggestions by type for easier use
  const titleSuggestions = useMemo(() => 
    suggestions.filter(s => s.type === 'title'), [suggestions]
  )
  
  const locationSuggestions = useMemo(() => 
    suggestions.filter(s => s.type === 'location'), [suggestions]
  )

  return {
    allSuggestions: suggestions,
    titleSuggestions,
    locationSuggestions,
    isLoading,
    error
  }
}

/**
 * Extract meaningful words from text, filtering out common words and short words
 */
function extractMeaningfulWords(text: string): string[] {
  const commonWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from',
    'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
    'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'shall',
    'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they',
    'my', 'your', 'his', 'her', 'its', 'our', 'their', 'me', 'him', 'her', 'us', 'them',
    'class', 'session', 'workshop', 'event', 'practice', 'time', 'hour', 'minute', 'am', 'pm'
  ])

  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ') // Remove punctuation
    .split(/\s+/) // Split by whitespace
    .filter(word => 
      word.length >= 3 && // At least 3 characters
      !commonWords.has(word) && // Not a common word
      !/^\d+$/.test(word) // Not just numbers
    )
    .map(word => word.trim())
    .filter(word => word.length > 0)
} 