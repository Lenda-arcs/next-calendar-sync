'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StudioRequestDialog } from '@/components/events'
import { useTeacherStudioRelationships } from '@/lib/hooks/useTeacherStudioRelationships'
import { Building, Send, MapPin, CheckCircle, Plus, Clock } from 'lucide-react'

interface TeacherStudioRequestProps {
  userId: string
}

export function TeacherStudioRequest({ userId }: TeacherStudioRequestProps) {
  const [showRequestDialog, setShowRequestDialog] = useState(false)

  // Fetch teacher's studio relationships
  const { data: teacherRelationships, isLoading } = useTeacherStudioRelationships({
    teacherId: userId,
    enabled: !!userId
  })

  const hasConnectedStudios = teacherRelationships && teacherRelationships.length > 0

  if (isLoading) {
    return (
      <Card variant="glass">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 font-serif">
            <Building className="h-5 w-5" />
            Studio Connections
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card variant="glass">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 font-serif">
            <Building className="h-5 w-5" />
            {hasConnectedStudios ? 'Connected Studios' : 'Join Studios'}
          </CardTitle>
          <CardDescription>
            {hasConnectedStudios 
              ? 'Your approved studio connections for substitute teaching.'
              : 'Request to join verified studios and expand your teaching opportunities.'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {hasConnectedStudios ? (
            <div className="space-y-4">
              {/* Show connected studios */}
              <div className="space-y-3">
                {teacherRelationships?.slice(0, 2).map((relationship) => (
                  <div key={relationship.id} className="border rounded-lg p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium flex items-center gap-2">
                          {relationship.studio.name}
                          <Badge variant="secondary" className="text-green-600">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Approved
                          </Badge>
                        </h4>
                        {relationship.studio.address && (
                          <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                            <MapPin className="w-3 h-3" />
                            {relationship.studio.address}
                          </div>
                        )}
                      </div>
                      {relationship.approved_at && (
                        <div className="text-xs text-gray-400">
                          <Clock className="w-3 h-3 inline mr-1" />
                          {new Date(relationship.approved_at).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    
                    {/* Show location patterns */}
                    {relationship.location_patterns.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {relationship.location_patterns.slice(0, 3).map((pattern, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {pattern}
                          </Badge>
                        ))}
                        {relationship.location_patterns.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{relationship.location_patterns.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                {/* Show more studios if there are more than 2 */}
                {teacherRelationships && teacherRelationships.length > 2 && (
                  <div className="text-center">
                    <Badge variant="outline" className="text-xs">
                      +{teacherRelationships.length - 2} more studio{teacherRelationships.length - 2 !== 1 ? 's' : ''} connected
                    </Badge>
                  </div>
                )}
              </div>

              {/* Add more studios button */}
              <div className="flex gap-2 pt-2">
                <Button 
                  onClick={() => setShowRequestDialog(true)}
                  variant="secondary"
                  size="sm"
                  className="flex-1"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Request More Studios
                </Button>
              </div>
            </div>
          ) : (
            /* Show CTA when no connections */
            <Button 
              onClick={() => setShowRequestDialog(true)}
              variant="default"
              className="w-full flex items-center gap-2"
            >
              <Send className="h-4 w-4" />
              Request Studio Access
            </Button>
          )}
        </CardContent>
      </Card>

      <StudioRequestDialog
        isOpen={showRequestDialog}
        onClose={() => setShowRequestDialog(false)}
        userId={userId}
      />
    </>
  )
} 