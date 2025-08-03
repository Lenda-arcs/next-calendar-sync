'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StudioRequestDialog } from '@/components/studios'
import { useTeacherStudioRelationships } from '@/lib/hooks/useTeacherStudioRelationships'
import { useSupabaseQuery } from '@/lib/hooks/useQueryWithSupabase'
import { useTranslationNamespace } from '@/lib/i18n/context'
import { Building, Send, MapPin, CheckCircle, Plus, Clock } from 'lucide-react'

interface TeacherStudioRequestProps {
  userId: string
}

export function TeacherStudioRequest({ userId }: TeacherStudioRequestProps) {
  const { t } = useTranslationNamespace('dashboard.studioRequest')
  const [showRequestDialog, setShowRequestDialog] = useState(false)

  // Fetch teacher's studio relationships
  const { data: teacherRelationships, isLoading } = useTeacherStudioRelationships({
    teacherId: userId,
    enabled: !!userId
  })

  // Check if there are studios available to request access to
  const { data: availableStudiosCount } = useSupabaseQuery(
    ['available-studios-count', userId],
    async (supabase) => {
      // Get all verified studios
      const { count: totalStudios, error: studiosError } = await supabase
        .from('studios')
        .select('*', { count: 'exact' })
        .eq('verified', true)

      if (studiosError) throw studiosError

      // Get existing requests for this user
      const { count: existingRequests, error: requestsError } = await supabase
        .from('studio_teacher_requests')
        .select('*', { count: 'exact' })
        .eq('teacher_id', userId)
        .in('status', ['pending', 'approved'])

      if (requestsError) throw requestsError

      return (totalStudios || 0) - (existingRequests || 0)
    },
    { enabled: !!userId }
  )

  const hasConnectedStudios = teacherRelationships && teacherRelationships.length > 0

  if (isLoading) {
    return (
      <Card variant="glass">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 font-serif">
            <Building className="h-5 w-5" />
            {t('title')}
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
            {hasConnectedStudios ? t('titleConnected') : t('titleJoin')}
          </CardTitle>
          <CardDescription>
            {hasConnectedStudios 
              ? t('descriptionConnected')
              : t('descriptionJoin')
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
                            {t('approved')}
                          </Badge>
                          {relationship.role && relationship.role !== 'teacher' && (
                            <Badge variant="outline" className="text-xs capitalize">
                              {relationship.role}
                            </Badge>
                          )}
                          {relationship.available_for_substitution && (
                            <Badge variant="outline" className="text-xs text-blue-600">
                              Available for substitution
                            </Badge>
                          )}
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
                      {t('moreStudios', { 
                        count: (teacherRelationships.length - 2).toString(),
                        plural: teacherRelationships.length - 2 !== 1 ? 's' : ''
                      })}
                    </Badge>
                  </div>
                )}
              </div>

              {/* Add more studios button - only show if there are studios available */}
              {availableStudiosCount && availableStudiosCount > 0 && (
                <div className="flex gap-2 pt-2">
                  <Button 
                    onClick={() => setShowRequestDialog(true)}
                    variant="secondary"
                    size="sm"
                    className="flex-1"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {t('requestMore')}
                  </Button>
                </div>
              )}
            </div>
          ) : (
            /* Show CTA when no connections */
            availableStudiosCount && availableStudiosCount > 0 ? (
              <Button 
                onClick={() => setShowRequestDialog(true)}
                variant="default"
                className="w-full flex items-center gap-2"
              >
                <Send className="h-4 w-4" />
                {t('requestAccess')}
              </Button>
            ) : (
              <div className="text-center py-4 text-gray-500">
                <p className="text-sm">All available studios have been requested</p>
              </div>
            )
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