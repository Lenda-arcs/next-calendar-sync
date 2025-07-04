'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Studio } from '@/lib/types'
import { useSupabaseQuery } from '@/lib/hooks/useSupabaseQuery'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search, MapPin, Mail, Phone, Globe, Instagram, Send, X } from 'lucide-react'
import { toast } from 'sonner'

interface StudioRequestDialogProps {
  isOpen: boolean
  onClose: () => void
  userId: string
}

export function StudioRequestDialog({ isOpen, onClose, userId }: StudioRequestDialogProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStudio, setSelectedStudio] = useState<Studio | null>(null)
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const supabase = createClient()

  // Fetch available studios
  const { data: studios, isLoading } = useSupabaseQuery({
    queryKey: ['available-studios', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('studios')
        .select('*')
        .eq('verified', true)
        .order('name')

      if (error) throw error

      // Filter out studios where user already has a request or billing entity
      const { data: existingRequests } = await supabase
        .from('studio_teacher_requests')
        .select('studio_id')
        .eq('teacher_id', userId)

      const { data: existingBillingEntities } = await supabase
        .from('billing_entities')
        .select('studio_id')
        .eq('user_id', userId)
        .not('studio_id', 'is', null)

      const excludedStudioIds = new Set([
        ...(existingRequests?.map(r => r.studio_id) || []),
        ...(existingBillingEntities?.map(b => b.studio_id) || [])
      ])

      return data?.filter(studio => !excludedStudioIds.has(studio.id)) || []
    },
    enabled: isOpen
  })

  // Reset form when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedStudio(null)
      setMessage('')
      setSearchTerm('')
    }
  }, [isOpen])

  const filteredStudios = studios?.filter(studio =>
    studio.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    studio.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    studio.location_patterns?.some(pattern => 
      pattern.toLowerCase().includes(searchTerm.toLowerCase())
    )
  ) || []

  const handleSubmitRequest = async () => {
    if (!selectedStudio) return

    setIsSubmitting(true)
    try {
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="w-5 h-5" />
            Request to Join Studio
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {!selectedStudio ? (
            // Studio selection step
            <div className="space-y-4">
              <div>
                <Label htmlFor="search">Search Studios</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    id="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name, location, or address..."
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="text-sm text-gray-500 mt-2">Loading studios...</p>
                  </div>
                ) : filteredStudios.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No studios found</p>
                    {searchTerm && (
                      <p className="text-sm">Try adjusting your search terms</p>
                    )}
                  </div>
                ) : (
                  filteredStudios.map((studio) => (
                    <Card 
                      key={studio.id}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => setSelectedStudio(studio)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg">{studio.name}</CardTitle>
                            {studio.description && (
                              <CardDescription className="mt-1">
                                {studio.description}
                              </CardDescription>
                            )}
                          </div>
                          <div className="flex gap-1">
                            {studio.verified && (
                              <Badge variant="secondary" className="text-green-600">
                                Verified
                              </Badge>
                            )}
                            {studio.featured && (
                              <Badge variant="secondary" className="text-yellow-600">
                                Featured
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {studio.address && (
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                            <MapPin className="w-4 h-4" />
                            {studio.address}
                          </div>
                        )}
                        
                        {studio.location_patterns && studio.location_patterns.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {studio.location_patterns.slice(0, 3).map((pattern, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {pattern}
                              </Badge>
                            ))}
                            {studio.location_patterns.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{studio.location_patterns.length - 3} more
                              </Badge>
                            )}
                          </div>
                        )}

                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          {studio.contact_info && (studio.contact_info as any).email && (
                            <div className="flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              Contact available
                            </div>
                          )}
                          {studio.website_url && (
                            <div className="flex items-center gap-1">
                              <Globe className="w-3 h-3" />
                              Website
                            </div>
                          )}
                          {studio.instagram_url && (
                            <div className="flex items-center gap-1">
                              <Instagram className="w-3 h-3" />
                              Instagram
                            </div>
                          )}
                        </div>
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
                  <CardTitle>Requesting to join: {selectedStudio.name}</CardTitle>
                  {selectedStudio.description && (
                    <CardDescription>{selectedStudio.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  {selectedStudio.address && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                      <MapPin className="w-4 h-4" />
                      {selectedStudio.address}
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

              <div className="flex justify-end gap-2">
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
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}