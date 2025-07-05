'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useAuthUser } from '@/lib/hooks/useAuthUser'
import { StudioTeacherRequest, RecipientInfo } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check, X, Clock, User, MapPin } from 'lucide-react'
import { toast } from 'sonner'

interface StudioTeacherRequestsProps {
  requests: StudioTeacherRequest[]
  onRequestProcessed: () => void
}

export function StudioTeacherRequests({ requests, onRequestProcessed }: StudioTeacherRequestsProps) {
  const [processingId, setProcessingId] = useState<string | null>(null)
  const { user } = useAuthUser()
  const supabase = createClient()

  const handleRequest = async (requestId: string, action: 'approve' | 'reject') => {
    if (!user) {
      toast.error('You must be logged in to process requests')
      return
    }

    setProcessingId(requestId)
    
    try {
      const now = new Date().toISOString()
      
      // Get the request details with studio information
      const { data: requestData, error: requestError } = await supabase
        .from('studio_teacher_requests')
        .select(`
          *,
          studio:studios(*),
          teacher:users!studio_teacher_requests_teacher_id_fkey(id, name, email)
        `)
        .eq('id', requestId)
        .single()

      if (requestError) {
        throw requestError
      }

      // Update the request status
      const { error: updateError } = await supabase
        .from('studio_teacher_requests')
        .update({
          status: action === 'approve' ? 'approved' : 'rejected',
          processed_at: now,
          processed_by: user.id,
          updated_at: now
        })
        .eq('id', requestId)

      if (updateError) {
        throw updateError
      }

      // If approved, create a billing entity for the teacher with studio's default config
      if (action === 'approve' && requestData) {
        const studio = requestData.studio
        const teacher = requestData.teacher
        
        if (studio && teacher) {
          // Build the billing entity data
          const recipientInfo: RecipientInfo = {
            type: 'external_teacher',
            name: teacher.name || 'Unknown Teacher',
            email: teacher.email || '',
          }
          
          // Use studio's location patterns as location match
          const locationMatch = studio.location_patterns || []

          const billingEntity = {
            entity_name: teacher.name || 'Unknown Teacher',
            entity_type: 'teacher',
            studio_id: studio.id,
            user_id: teacher.id,
            location_match: locationMatch,
            rate_config: null, // Teachers inherit studio rates by default
            custom_rate_override: null, // Can be customized later
            recipient_info: recipientInfo as any,
            banking_info: null,
            currency: 'EUR',
            notes: `Teacher billing profile created from approved studio request for ${studio.name}`
          }

          // Create the billing entity
          const { error: billingError } = await supabase
            .from('billing_entities')
            .insert(billingEntity)

          if (billingError) {
            console.error('Error creating billing entity:', billingError)
            // Don't throw here - the approval was successful, billing entity creation is a bonus
            toast.warning('Request approved, but there was an issue creating the billing profile', {
              description: 'The teacher can manually create their billing profile later.'
            })
          } else {
            toast.success('Request approved and billing profile created!', {
              description: `${teacher.name} can now be billed through ${studio.name} with the studio's default rates.`
            })
          }
        } else {
          toast.success('Request approved successfully', {
            description: 'The teacher can now be associated with this studio for billing purposes.'
          })
        }
      } else {
        toast.success('Request rejected successfully', {
          description: 'The teacher has been notified of the decision.'
        })
      }

      onRequestProcessed()
    } catch (error) {
      console.error(`Error ${action}ing request:`, error)
      toast.error(`Failed to ${action} request`, {
        description: 'Please try again or contact support if the issue persists.'
      })
    } finally {
      setProcessingId(null)
    }
  }

  if (requests.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center text-gray-500">
            <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No pending requests</p>
            <p className="text-sm">Teacher requests to join studios will appear here</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <Card key={request.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="w-5 h-5" />
                    {request.teacher?.name || 'Unknown Teacher'}
                  </CardTitle>
                  <Badge variant="outline" className="text-orange-600">
                    <Clock className="w-3 h-3 mr-1" />
                    Pending
                  </Badge>
                </div>
                
                <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
                  <MapPin className="w-4 h-4" />
                  Requesting to join: {request.studio?.name || 'Unknown Studio'}
                </div>
                
                <div className="text-sm text-gray-600 mb-2">
                  <strong>Teacher Email:</strong> {request.teacher?.email || 'Not provided'}
                </div>

                {request.message && (
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm font-medium mb-1">Message:</p>
                    <p className="text-sm text-gray-700">{request.message}</p>
                  </div>
                )}

                <div className="text-xs text-gray-400 mt-2">
                  Requested on {new Date(request.created_at).toLocaleDateString()}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRequest(request.id, 'approve')}
                  disabled={processingId === request.id}
                  className="text-green-600 hover:text-green-700 hover:bg-green-50"
                >
                  <Check className="w-4 h-4 mr-1" />
                  Approve
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRequest(request.id, 'reject')}
                  disabled={processingId === request.id}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="w-4 h-4 mr-1" />
                  Reject
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  )
}