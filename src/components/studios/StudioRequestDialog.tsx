'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect, useMemo } from 'react'
import { createClient } from '@/lib/supabase'
import { Studio } from '@/lib/types'
import { useSupabaseQuery } from '@/lib/hooks/useQueryWithSupabase'
import { Button } from '@/components/ui/button'
import { UnifiedDialog } from '@/components/ui/unified-dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search, MapPin, Send, X, Sparkles, Calendar } from 'lucide-react'
import { toast } from 'sonner'

interface StudioRequestDialogProps {
  isOpen: boolean
  onClose: () => void
  userId: string
}

interface StudioWithBillingEntities extends Studio {
  billing_entities?: Array<{
    location_match: string[] | null
  }>
}

interface RelevantStudio extends StudioWithBillingEntities {
  matchScore: number
  matchedLocations: string[]
  matchedPatterns: string[]
}

export function StudioRequestDialog({ isOpen, onClose, userId }: StudioRequestDialogProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStudio, setSelectedStudio] = useState<RelevantStudio | null>(null)
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const supabase = createClient()

  // Fetch user's event locations to determine relevant studios
  const { data: userEventLocations } = useSupabaseQuery(
    ['user-event-locations', userId],
    async (supabase) => {
      const { data, error } = await supabase
        .from('events')
        .select('location, title')
        .eq('user_id', userId)
        .not('location', 'is', null)
        .limit(100) // Recent events to determine patterns

      if (error) throw error

      // Extract unique locations and keywords from titles
      const locations = new Set<string>()
      const titleKeywords = new Set<string>()

      data?.forEach((event: { location?: string | null; title?: string | null }) => {
        if (event.location) {
          locations.add(event.location.toLowerCase())
        }
        if (event.title) {
          // Extract meaningful words from titles
          const words = event.title.toLowerCase().split(/\s+/)
            .filter((word: string) => word.length > 2 && !['the', 'and', 'with', 'for', 'class'].includes(word))
          words.forEach((word: string) => titleKeywords.add(word))
        }
      })

      return {
        locations: Array.from(locations),
        titleKeywords: Array.from(titleKeywords)
      }
    },
    { enabled: isOpen && !!userId }
  )

  // First check total studios available (before filtering by existing requests)
  const { data: totalStudiosCount } = useSupabaseQuery(
    ['total-studios-count'],
    async (supabase) => {
      const { count, error } = await supabase
        .from('studios')
        .select('*', { count: 'exact' })
        .eq('verified', true)

      if (error) throw error
      return count || 0
    },
    { enabled: isOpen }
  )

  // Fetch available studios and calculate relevance
  const { data: relevantStudios, isLoading } = useSupabaseQuery<RelevantStudio[]>(
    ['relevant-studios', userId, String(userEventLocations?.locations?.length || 0)],
    async (supabase) => {
      // Get all verified studios with their related billing entities for location matching
      const { data: studiosData, error: studiosError } = await supabase
        .from('studios')
        .select(`
          *,
          billing_entities:billing_entities!billing_entities_studio_id_fkey(
            location_match
          )
        `)
        .eq('verified', true)
        .order('name')

      if (studiosError) throw studiosError

      // Get existing requests for this user
      const { data: existingRequests, error: requestsError } = await supabase
        .from('studio_teacher_requests')
        .select('studio_id, status')
        .eq('teacher_id', userId)
        .in('status', ['pending', 'approved'])

      if (requestsError) throw requestsError

      const existingStudioIds = new Set(existingRequests?.map((req: { studio_id: string; status: string }) => req.studio_id) || [])
      const availableStudios = studiosData?.filter((studio: StudioWithBillingEntities) => !existingStudioIds.has(studio.id)) || []

      // If no user event data yet, return all available studios with score 0
      if (!userEventLocations?.locations || userEventLocations.locations.length === 0) {
        return availableStudios.map((studio: StudioWithBillingEntities) => ({
          ...studio,
          matchScore: 0,
          matchedLocations: [],
          matchedPatterns: []
        }))
      }

      // Calculate relevance score for each studio
      const relevantStudios: RelevantStudio[] = []

      for (const studio of availableStudios) {
        const locationPatterns = studio.location_patterns || []
        // Also check billing entities for location_match patterns
        // Note: This fixes the schema mismatch where some studios store location patterns
        // in studios.location_patterns while others store them in billing_entities.location_match
        const billingEntityPatterns = studio.billing_entities?.flatMap((entity: any) => entity.location_match || []) || []
        // Combine both location pattern sources for comprehensive matching
        const allLocationPatterns = [...locationPatterns, ...billingEntityPatterns]
        
        const studioName = studio.name.toLowerCase()
        const studioAddress = (studio.address || '').toLowerCase()
        
        let matchScore = 0
        const matchedLocations: string[] = []
        const matchedPatterns: string[] = []

        // Check if studio location patterns match user's event locations
        for (const userLocation of userEventLocations.locations) {
          for (const pattern of allLocationPatterns) {
            const patternLower = pattern.toLowerCase()
            
            // Strong match: pattern is contained in user location or vice versa
            if (userLocation.includes(patternLower) || patternLower.includes(userLocation)) {
              matchScore += 10
              if (!matchedLocations.includes(userLocation)) {
                matchedLocations.push(userLocation)
              }
              if (!matchedPatterns.includes(pattern)) {
                matchedPatterns.push(pattern)
              }
            }
          }

          // Medium match: studio name or address matches user location
          if (userLocation.includes(studioName) || studioName.includes(userLocation) ||
              (studioAddress && (userLocation.includes(studioAddress) || studioAddress.includes(userLocation)))) {
            matchScore += 5
            if (!matchedLocations.includes(userLocation)) {
              matchedLocations.push(userLocation)
            }
          }
        }

        // Include all studios - both with and without matches
        relevantStudios.push({
          ...studio,
          matchScore,
          matchedLocations,
          matchedPatterns
        })
      }

      // Sort by relevance score (highest first), then by name
      const sortedStudios = relevantStudios.sort((a, b) => {
        if (b.matchScore !== a.matchScore) {
          return b.matchScore - a.matchScore
        }
        return a.name.localeCompare(b.name)
      })

      return sortedStudios
    },
    { enabled: isOpen && !!userEventLocations }
  )

  // Reset form when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedStudio(null)
      setMessage('')
      setSearchTerm('')
    }
  }, [isOpen])

  // Fetch all studios for search functionality
  const { data: allStudios } = useSupabaseQuery(
    ['all-studios-search', userId],
    async (supabase) => {
      const { data: studiosData, error: studiosError } = await supabase
        .from('studios')
        .select(`
          *,
          billing_entities:billing_entities!billing_entities_studio_id_fkey(
            location_match
          )
        `)
        .eq('verified', true)
        .order('name')

      if (studiosError) throw studiosError

      // Get existing requests for this user
      const { data: existingRequests, error: requestsError } = await supabase
        .from('studio_teacher_requests')
        .select('studio_id, status')
        .eq('teacher_id', userId)
        .in('status', ['pending', 'approved'])

      if (requestsError) throw requestsError

      const existingStudioIds = new Set(existingRequests?.map((req: { studio_id: string; status: string }) => req.studio_id) || [])
      return studiosData?.filter((studio: StudioWithBillingEntities) => !existingStudioIds.has(studio.id)) || []
    },
    { enabled: isOpen && !!userId }
  )

  // Filter studios based on search - search all studios or show relevant ones
  const filteredStudios = useMemo(() => {
    if (!relevantStudios || relevantStudios.length === 0) return []
    
    if (!searchTerm) {
      // No search term - show top 8 most relevant
      return relevantStudios.slice(0, 8)
    }

    // When searching, search through ALL available studios, not just relevant ones
    if (!allStudios) return []
    
    const searchResults = allStudios.filter((studio: StudioWithBillingEntities) => {
      const searchLower = searchTerm.toLowerCase()
      const nameMatch = studio.name.toLowerCase().includes(searchLower)
      const addressMatch = studio.address?.toLowerCase().includes(searchLower)
      const locationPatternsMatch = (studio.location_patterns || []).some((pattern: string) => 
        pattern.toLowerCase().includes(searchLower)
      )
      const billingEntityPatternsMatch = studio.billing_entities?.some((entity: any) =>
        (entity.location_match || []).some((pattern: string) =>
          pattern.toLowerCase().includes(searchLower)
        )
      ) || false
      
      return nameMatch || addressMatch || locationPatternsMatch || billingEntityPatternsMatch
    }).slice(0, 8)

    // Convert to RelevantStudio format with calculated relevance
    return searchResults.map((studio: StudioWithBillingEntities) => {
      const relevantStudio = relevantStudios.find((rs: RelevantStudio) => rs.id === studio.id)
      
      if (relevantStudio) {
        // Studio was already in relevant list - use its existing relevance data
        return relevantStudio
      } else {
        // Studio not in relevant list - add it with 0 relevance
        return {
          ...studio,
          matchScore: 0,
          matchedLocations: [],
          matchedPatterns: []
        }
      }
    })
  }, [relevantStudios, searchTerm, allStudios])

  const handleSubmitRequest = async () => {
    if (!selectedStudio) return

    setIsSubmitting(true)
    try {
      // Check if there's already a pending or approved request for this studio
      const { data: existingRequest, error: checkError } = await supabase
        .from('studio_teacher_requests')
        .select('id, status')
        .eq('studio_id', selectedStudio.id)
        .eq('teacher_id', userId)
        .in('status', ['pending', 'approved'])
        .maybeSingle()

      if (checkError) throw checkError

      if (existingRequest) {
        if (existingRequest.status === 'pending') {
          toast.error('You already have a pending request for this studio')
        } else {
          toast.error('You are already approved for this studio')
        }
        return
      }

      const { error } = await supabase
        .from('studio_teacher_requests')
        .insert([{
          studio_id: selectedStudio.id,
          teacher_id: userId,
          message: message.trim() || null,
          status: 'pending'
        }])

      if (error) throw error

      toast.success('Request sent successfully!')
      onClose()
    } catch (error) {
      console.error('Error submitting request:', error)
      toast.error('Failed to send request')
    } finally {
      setIsSubmitting(false)
    }
  }

  const hasRelevantStudios = relevantStudios && relevantStudios.length > 0 && relevantStudios.some((s: RelevantStudio) => s.matchScore > 0)

  // Footer for request composition step
  const footer = selectedStudio ? (
    <>
      <Button variant="outline" onClick={onClose}>
        Cancel
      </Button>
      <Button 
        onClick={handleSubmitRequest}
        disabled={isSubmitting}
        className="flex items-center gap-2"
      >
        {isSubmitting ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            Sending...
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            Send Request
          </>
        )}
      </Button>
    </>
  ) : undefined

  return (
    <UnifiedDialog
      open={isOpen}
      onOpenChange={onClose}
      title={
        <div className="flex items-center gap-2">
          <Send className="w-5 h-5" />
          Request to Join Studio
        </div>
      }
      size="lg"
      footer={footer}
    >
      <div className="space-y-6">
          {!selectedStudio ? (
            // Studio selection step
            <div className="space-y-4">
              {hasRelevantStudios && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-blue-700">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-sm font-medium">Smart Suggestions</span>
                  </div>
                  <p className="text-xs text-blue-600 mt-1">
                    These studios match your event locations. Studios are ranked by relevance to your teaching history.
                  </p>
                </div>
              )}

              <div>
                <Label htmlFor="search">Search Studios</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    id="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name or location..."
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-3 max-h-96 min-h-[24rem] overflow-y-auto">
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="text-sm text-gray-500 mt-2">Finding relevant studios...</p>
                  </div>
                ) : filteredStudios.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    {/* Show different messages based on the situation */}
                    {searchTerm ? (
                      <>
                        <p className="font-medium">No matching studios found</p>
                        <p className="text-sm text-gray-400 mt-1">
                          Try adjusting your search terms
                        </p>
                      </>
                    ) : totalStudiosCount === 0 ? (
                      <>
                        <p className="font-medium">No studios available</p>
                        <p className="text-sm text-gray-400 mt-1">
                          There are currently no verified studios in the system
                        </p>
                      </>
                    ) : relevantStudios && relevantStudios.length === 0 ? (
                      <>
                        <p className="font-medium">You&apos;re connected to all available studios!</p>
                        <p className="text-sm text-gray-400 mt-1">
                          You already have approved requests for all {totalStudiosCount} studios. Check your profile to manage your studio connections.
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="font-medium">No matching studios found</p>
                        <p className="text-sm text-gray-400 mt-1">
                          Add some events to get personalized studio recommendations
                        </p>
                      </>
                    )}
                  </div>
                ) : (
                  filteredStudios.map((studio: RelevantStudio) => (
                    <Card 
                      key={studio.id}
                      className={`cursor-pointer hover:shadow-md transition-all duration-200 ${
                        studio.matchScore > 0 ? 'border-blue-200 bg-blue-50/30' : ''
                      }`}
                      onClick={() => setSelectedStudio(studio)}
                    >
                      <CardHeader className="pb-2 pt-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-base flex items-center gap-2">
                              {studio.name}
                              {studio.matchScore > 0 && (
                                <Badge variant="secondary" className="text-blue-600 bg-blue-100">
                                  <Sparkles className="w-3 h-3 mr-1" />
                                  Match
                                </Badge>
                              )}
                              {studio.featured && (
                                <Badge variant="secondary" className="text-yellow-600">
                                  Featured
                                </Badge>
                              )}
                            </CardTitle>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        {studio.address && (
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                            <MapPin className="w-4 h-4" />
                            {studio.address}
                          </div>
                        )}
                        
                        {studio.matchedLocations.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {studio.matchedLocations.slice(0, 2).map((location, index) => (
                              <Badge key={index} variant="outline" className="text-xs text-blue-600 border-blue-200">
                                📍 {location}
                              </Badge>
                            ))}
                            {studio.matchedLocations.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{studio.matchedLocations.length - 2} more
                              </Badge>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          ) : (
            // Request composition step
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedStudio(null)}
                >
                  <X className="w-4 h-4" />
                  Back to studios
                </Button>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    Requesting to join: {selectedStudio.name}
                    {selectedStudio.matchScore > 0 && (
                      <Badge variant="secondary" className="text-blue-600 bg-blue-100">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Recommended
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedStudio.address && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                      <MapPin className="w-4 h-4" />
                      {selectedStudio.address}
                    </div>
                  )}

                  {selectedStudio.matchedLocations.length > 0 && (
                    <div className="bg-green-50 p-3 rounded-md mb-4">
                      <p className="text-sm font-medium mb-2 text-green-800">Why this studio matches you:</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedStudio.matchedLocations.map((location, index) => (
                          <Badge key={index} variant="outline" className="text-xs text-green-700 border-green-300">
                            📍 You teach at: {location}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {selectedStudio.default_rate_config && (
                    <div className="bg-blue-50 p-3 rounded-md mb-4">
                      <p className="text-sm font-medium mb-1">Default Rate Information:</p>
                      <p className="text-sm text-gray-700">
                        Base: €{(selectedStudio.default_rate_config as any)?.base_rate || 0} • 
                        Min: {(selectedStudio.default_rate_config as any)?.minimum_threshold || 0} students • 
                        Bonus: €{(selectedStudio.default_rate_config as any)?.bonus_per_student || 0}/student
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div>
                <Label htmlFor="message">Message (Optional)</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell the studio about your experience, teaching style, or availability..."
                  rows={4}
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  A personal message can help studios understand your background and interests.
                </p>
              </div>


            </div>
          )}
        </div>
      </UnifiedDialog>
    )
  }