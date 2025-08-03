'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, Calendar, CreditCard, Clock, Users } from 'lucide-react'
import { useTeacherDepartureImpact, useDeactivateTeacher } from '@/lib/hooks/useTeacherManagement'

interface TeacherDepartureDialogProps {
  isOpen: boolean
  onClose: () => void
  studioId: string
  teacherId: string
  teacherName: string
  studioName: string
  onSuccess?: () => void
}

export function TeacherDepartureDialog({
  isOpen,
  onClose,
  studioId,
  teacherId,
  teacherName,
  studioName,
  onSuccess
}: TeacherDepartureDialogProps) {
  const [reason, setReason] = useState('')
  const [showConfirmation, setShowConfirmation] = useState(false)

  // Fetch departure impact analysis
  const { data: impact, isLoading: impactLoading } = useTeacherDepartureImpact(studioId, teacherId)
  
  // Deactivation mutation
  const deactivateMutation = useDeactivateTeacher()

  const handleDeactivate = async () => {
    try {
      await deactivateMutation.mutateAsync({
        studioId,
        teacherId,
        reason: reason.trim() || undefined
      })

      toast.success('Teacher relationship deactivated', {
        description: `${teacherName} is no longer active at ${studioName}`
      })

      onSuccess?.()
      onClose()
    } catch (error) {
      console.error('Error deactivating teacher:', error)
      toast.error('Failed to deactivate teacher relationship', {
        description: 'Please try again or contact support'
      })
    }
  }

  const hasImpact = impact && (
    impact.future_events_count > 0 || 
    impact.unpaid_invoices_count > 0
  )

  const formatDuration = (days: number) => {
    if (days < 30) return `${days} days`
    if (days < 365) return `${Math.round(days / 30)} months`
    return `${Math.round(days / 365)} years`
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Deactivate Teacher Relationship
          </DialogTitle>
          <DialogDescription>
            {showConfirmation 
              ? `Confirm deactivation of ${teacherName} from ${studioName}`
              : `Review the impact of removing ${teacherName} from ${studioName}`
            }
          </DialogDescription>
        </DialogHeader>

        {!showConfirmation ? (
          <div className="space-y-6">
            {/* Impact Analysis */}
            {impactLoading ? (
              <Card>
                <CardContent className="py-6">
                  <div className="animate-pulse space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </CardContent>
              </Card>
            ) : impact ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Impact Analysis</CardTitle>
                  <CardDescription>
                    Relationship active for {formatDuration(impact.relationship_duration_days)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-orange-500" />
                      <div>
                        <div className="font-medium">{impact.future_events_count}</div>
                        <div className="text-sm text-gray-600">Future Events</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <CreditCard className="h-4 w-4 text-red-500" />
                      <div>
                        <div className="font-medium">{impact.unpaid_invoices_count}</div>
                        <div className="text-sm text-gray-600">Unpaid Invoices</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <div>
                        <div className="font-medium">
                          {impact.last_event_date 
                            ? new Date(impact.last_event_date).toLocaleDateString()
                            : 'None'
                          }
                        </div>
                        <div className="text-sm text-gray-600">Last Event</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <CreditCard className="h-4 w-4 text-green-500" />
                      <div>
                        <div className="font-medium">€{impact.total_unpaid_amount}</div>
                        <div className="text-sm text-gray-600">Unpaid Amount</div>
                      </div>
                    </div>
                  </div>

                  {hasImpact && (
                    <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg border border-orange-200">
                      <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                      <div>
                        <div className="font-medium text-orange-800">Action Required</div>
                        <div className="text-sm text-orange-700 mt-1">
                          {impact.future_events_count > 0 && (
                            <div>• {impact.future_events_count} future events may need reassignment</div>
                          )}
                          {impact.unpaid_invoices_count > 0 && (
                            <div>• {impact.unpaid_invoices_count} unpaid invoices should be resolved</div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : null}

            {/* Reason Input */}
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Deactivation (Optional)</Label>
              <Textarea
                id="reason"
                placeholder="e.g., Teacher moved to another city, contract ended, etc."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
              />
            </div>

            {/* Information */}
            <div className="text-sm text-gray-600 space-y-2">
              <div>• Teacher relationship will be marked as inactive</div>
              <div>• Historical data and billing entities will be preserved</div>
              <div>• Substitute availability will be disabled</div>
              <div>• Relationship can be reactivated later if needed</div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="font-medium text-red-800">Confirm Deactivation</div>
              <div className="text-sm text-red-700 mt-1">
                This will deactivate {teacherName}&apos;s relationship with {studioName}.
                {hasImpact && ' Please ensure future events and invoices are handled appropriately.'}
              </div>
            </div>

            {reason && (
              <div>
                <Label>Reason</Label>
                <div className="mt-1 p-3 bg-gray-50 rounded border text-sm">
                  {reason}
                </div>
              </div>
            )}
          </div>
        )}

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          {!showConfirmation ? (
            <Button 
              onClick={() => setShowConfirmation(true)}
              variant="destructive"
              disabled={impactLoading}
            >
              Continue
            </Button>
          ) : (
            <Button 
              onClick={handleDeactivate}
              variant="destructive"
              disabled={deactivateMutation.isPending}
            >
              {deactivateMutation.isPending ? 'Deactivating...' : 'Confirm Deactivation'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}