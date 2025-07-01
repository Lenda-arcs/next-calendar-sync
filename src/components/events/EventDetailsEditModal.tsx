'use client'

import React, { useState, useEffect } from 'react'
import { UnifiedDialog } from '@/components/ui/unified-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useSupabaseMutation } from '@/lib/hooks/useSupabaseMutation'
import { updateEventStudentCounts, calculateEventPayout, EventWithStudio } from '@/lib/invoice-utils'
import { Event } from '@/lib/types'
import { toast } from 'sonner'
import { Users, Calendar, MapPin, Clock, Calculator } from 'lucide-react'

interface EventDetailsEditModalProps {
  isOpen: boolean
  onClose: () => void
  event: EventWithStudio | null
  onSuccess?: (updatedEvent: Event) => void
}

export function EventDetailsEditModal({
  isOpen,
  onClose,
  event,
  onSuccess
}: EventDetailsEditModalProps) {
  const [studentsStudio, setStudentsStudio] = useState<string>('')
  const [studentsOnline, setStudentsOnline] = useState<string>('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Reset form when event changes
  useEffect(() => {
    if (event) {
      setStudentsStudio(event.students_studio?.toString() || '')
      setStudentsOnline(event.students_online?.toString() || '')
      setErrors({})
    }
  }, [event])

  const updateMutation = useSupabaseMutation({
    mutationFn: (supabase, data: { eventId: string; studentsStudio: number | null; studentsOnline: number | null }) =>
      updateEventStudentCounts(data.eventId, data.studentsStudio, data.studentsOnline),
    onSuccess: (updatedEvent) => {
      toast.success('Event details updated successfully!')
      onSuccess?.(updatedEvent)
      onClose()
    },
    onError: (error) => {
      console.error('Failed to update event:', error)
      toast.error('Failed to update event details', {
        description: 'Please try again.',
      })
    }
  })

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (studentsStudio && (isNaN(Number(studentsStudio)) || Number(studentsStudio) < 0)) {
      newErrors.studentsStudio = "Studio students must be a non-negative number"
    }

    if (studentsOnline && (isNaN(Number(studentsOnline)) || Number(studentsOnline) < 0)) {
      newErrors.studentsOnline = "Online students must be a non-negative number"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!event || !validateForm()) return

    const studentsStudioValue = studentsStudio ? Number(studentsStudio) : null
    const studentsOnlineValue = studentsOnline ? Number(studentsOnline) : null

    await updateMutation.mutateAsync({
      eventId: event.id,
      studentsStudio: studentsStudioValue,
      studentsOnline: studentsOnlineValue
    })
  }

  // Calculate payout with current values
  const currentPayout = React.useMemo(() => {
    if (!event?.studio) return 0
    
    const mockEvent = {
      ...event,
      students_studio: studentsStudio ? Number(studentsStudio) : null,
      students_online: studentsOnline ? Number(studentsOnline) : null
    }
    
    return calculateEventPayout(mockEvent, event.studio)
  }, [event, studentsStudio, studentsOnline])

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "No date"
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (startTime: string | null, endTime: string | null) => {
    if (!startTime) return "No time"
    const start = new Date(startTime).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
    if (endTime) {
      const end = new Date(endTime).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
      return `${start} - ${end}`
    }
    return start
  }

  if (!event) return null

  const footer = (
    <>
      <Button
        variant="outline"
        onClick={onClose}
        disabled={updateMutation.isLoading}
      >
        Cancel
      </Button>
      <Button
        onClick={handleSubmit}
        disabled={updateMutation.isLoading}
      >
        {updateMutation.isLoading ? 'Saving...' : 'Save Changes'}
      </Button>
    </>
  )

  return (
    <UnifiedDialog
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
      title="Edit Event Details"
      description="Update student attendance and calculate payout"
      size="lg"
      footer={footer}
    >
      <div className="space-y-6">
        {/* Event Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Event Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">
                {event.title || 'Untitled Event'}
              </h3>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(event.start_time)}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{formatTime(event.start_time, event.end_time)}</span>
                </div>
                
                {event.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Studio Information */}
            {event.studio && (
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-blue-900">{event.studio.entity_name}</div>
                    <div className="text-sm text-blue-700">
                      Base Rate: €{event.studio.base_rate?.toFixed(2) || '0.00'} 
                      {event.studio.rate_type === 'per_student' && ' per student'}
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                    {event.studio.rate_type === 'flat' ? 'Flat Rate' : 'Per Student'}
                  </Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Student Count Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Student Attendance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="studentsStudio">
                    Studio Students
                  </Label>
                  <Input
                    id="studentsStudio"
                    type="number"
                    min="0"
                    value={studentsStudio}
                    onChange={(e) => {
                      setStudentsStudio(e.target.value)
                      // Clear error when user starts typing
                      if (errors.studentsStudio) {
                        setErrors(prev => ({ ...prev, studentsStudio: '' }))
                      }
                    }}
                    placeholder="0"
                    className={errors.studentsStudio ? "border-red-500" : ""}
                    disabled={updateMutation.isLoading}
                  />
                  {errors.studentsStudio && (
                    <p className="text-sm text-red-500 mt-1">{errors.studentsStudio}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    Number of students attending in-person
                  </p>
                </div>

                <div>
                  <Label htmlFor="studentsOnline">
                    Online Students
                  </Label>
                  <Input
                    id="studentsOnline"
                    type="number"
                    min="0"
                    value={studentsOnline}
                    onChange={(e) => {
                      setStudentsOnline(e.target.value)
                      // Clear error when user starts typing
                      if (errors.studentsOnline) {
                        setErrors(prev => ({ ...prev, studentsOnline: '' }))
                      }
                    }}
                    placeholder="0"
                    className={errors.studentsOnline ? "border-red-500" : ""}
                    disabled={updateMutation.isLoading}
                  />
                  {errors.studentsOnline && (
                    <p className="text-sm text-red-500 mt-1">{errors.studentsOnline}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    Number of students attending online
                  </p>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Payout Calculation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Calculated Payout
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-green-700 mb-1">
                    Total students: {(Number(studentsStudio) || 0) + (Number(studentsOnline) || 0)}
                  </div>
                  <div className="text-sm text-green-600">
                    Studio: {studentsStudio || 0} • Online: {studentsOnline || 0}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-900">
                    €{currentPayout.toFixed(2)}
                  </div>
                  <div className="text-sm text-green-700">Calculated payout</div>
                </div>
              </div>
            </div>

            {/* Rate structure explanation */}
            {event.studio && (
              <div className="mt-4 text-xs text-gray-600 space-y-1">
                <div>Rate calculation based on studio settings:</div>
                <ul className="space-y-1 ml-2">
                  <li>• Base rate: €{event.studio.base_rate?.toFixed(2) || '0.00'}</li>
                  {event.studio.minimum_student_threshold && (
                    <li>• Minimum threshold: {event.studio.minimum_student_threshold} students</li>
                  )}
                  {event.studio.bonus_student_threshold && (
                    <li>• Bonus threshold: {event.studio.bonus_student_threshold} students</li>
                  )}
                  {event.studio.bonus_per_student && (
                    <li>• Bonus per student: €{event.studio.bonus_per_student.toFixed(2)}</li>
                  )}
                                  {event.studio.online_bonus_per_student && (
                  <li>• Online bonus: €{event.studio.online_bonus_per_student.toFixed(2)} per student</li>
                )}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </UnifiedDialog>
  )
} 