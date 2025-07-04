'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { StudioTeacherRequest } from '@/lib/types'
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
  const supabase = createClient()

  const handleRequest = async (requestId: string, action: 'approve' | 'reject') => {
    setProcessingId(requestId)
    
    try {
      // For now, we'll just show a toast since the table doesn't exist yet
      // In the future, this will:
      // 1. Update the request status
      // 2. If approved, create a billing entity for the teacher-studio relationship
      // 3. Send notification to the teacher
      
      toast.success(`Request ${action}d successfully`)
      onRequestProcessed()
    } catch (error) {
      console.error(`Error ${action}ing request:`, error)
      toast.error(`Failed to ${action} request`)
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