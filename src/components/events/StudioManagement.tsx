'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import DataLoader from '@/components/ui/data-loader'
import { useSupabaseQuery } from '@/lib/hooks/useSupabaseQuery'
import { useSupabaseMutation } from '@/lib/hooks/useSupabaseMutation'
import { getUserStudios, getUserEventLocations, deleteStudio } from '@/lib/invoice-utils'
import { BillingEntity } from '@/lib/types'
import { Trash2, Edit, Building2, User } from 'lucide-react'
import StudioFormModal from './StudioFormModal'

interface StudioManagementProps {
  userId: string
}

export function StudioManagement({ userId }: StudioManagementProps) {
  const [deletingStudio, setDeletingStudio] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingStudio, setEditingStudio] = useState<BillingEntity | null>(null)

  // Load user studios
  const { 
    data: studios, 
    isLoading: loading, 
    error,
    refetch: refetchStudios
  } = useSupabaseQuery({
    queryKey: ['user-studios', userId],
    fetcher: () => getUserStudios(userId),
    enabled: !!userId
  })

  // Load event locations for the form
  const { 
    data: eventLocations = []
  } = useSupabaseQuery({
    queryKey: ['user-event-locations', userId],
    fetcher: () => getUserEventLocations(userId),
    enabled: !!userId
  })

  // Delete studio mutation
  const deleteMutation = useSupabaseMutation({
    mutationFn: (supabase, studioId: string) => deleteStudio(studioId),
    onSuccess: () => {
      refetchStudios()
      setDeletingStudio(null)
    },
    onError: (error) => {
      console.error('Error deleting billing entity:', error)
      setDeletingStudio(null)
    }
  })

  const handleCreateEntity = () => {
    setEditingStudio(null)
    setIsModalOpen(true)
  }

  const handleEditStudio = (studio: BillingEntity) => {
    setEditingStudio(studio)
    setIsModalOpen(true)
  }

  const handleDeleteStudio = async (studioId: string) => {
    if (confirm('Are you sure you want to delete this billing entity? This action cannot be undone.')) {
      setDeletingStudio(studioId)
      await deleteMutation.mutateAsync(studioId)
    }
  }

  const handleStudioCreated = () => {
    refetchStudios()
    setEditingStudio(null)
    setIsModalOpen(false)
  }

  const handleStudioUpdated = () => {
    refetchStudios()
    setEditingStudio(null)
    setIsModalOpen(false)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setEditingStudio(null)
  }

  // Separate studios and teachers
  const studioEntities = (studios?.filter(s => s.recipient_type === 'studio') as BillingEntity[]) || []
  const teacherEntities = (studios?.filter(s => s.recipient_type === 'internal_teacher' || s.recipient_type === 'external_teacher') as BillingEntity[]) || []

  const renderEntityCard = (entity: BillingEntity) => {
    const isTeacher = entity.recipient_type === 'internal_teacher' || entity.recipient_type === 'external_teacher'
    
    return (
      <Card key={entity.id} className={`h-full ${isTeacher ? 'border-purple-200' : 'border-blue-200'}`}>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                {isTeacher ? (
                  <User className="h-4 w-4 text-purple-600" />
                ) : (
                  <Building2 className="h-4 w-4 text-blue-600" />
                )}
                                 <CardTitle className="text-lg">
                   {entity.entity_name}
                 </CardTitle>
                {isTeacher && (
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                    Teacher
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-600">
                Matches: {entity.location_match && entity.location_match.length > 0 
                  ? entity.location_match.map((location, index) => (
                      <span key={index}>
                        &quot;{location}&quot;
                        {entity.location_match && index < entity.location_match.length - 1 ? ', ' : ''}
                      </span>
                    ))
                  : 'No locations'
                }
              </p>
            </div>
            <div className="flex space-x-1 ml-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEditStudio(entity)}
                className="h-8 w-8 p-0"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteStudio(entity.id)}
                disabled={deletingStudio === entity.id}
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
              >
                {deletingStudio === entity.id ? (
                  <span className="text-xs">...</span>
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Teacher-specific fields */}
          {isTeacher && (
            <>
              {entity.recipient_email && (
                <div>
                  <span className="text-xs text-gray-600 uppercase tracking-wide block mb-1">Email</span>
                  <span className="text-sm font-mono text-gray-900 break-all">
                    {entity.recipient_email}
                  </span>
                </div>
              )}
              {entity.recipient_phone && (
                <div>
                  <span className="text-xs text-gray-600 uppercase tracking-wide block mb-1">Phone</span>
                  <span className="text-sm text-gray-900">
                    {entity.recipient_phone}
                  </span>
                </div>
              )}
            </>
          )}

          {/* Studio-specific fields */}
          {!isTeacher && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-gray-600 uppercase tracking-wide block mb-1">Rate Type</span>
                  <span className="text-sm font-medium text-gray-900">
                    {entity.rate_type === "flat" ? "Flat Rate" : "Per Student"}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-gray-600 uppercase tracking-wide block mb-1">Base Rate</span>
                  <span className="font-semibold text-gray-900">
                    €{entity.base_rate?.toFixed(2) || "0.00"}
                  </span>
                </div>
              </div>

              {entity.billing_email && (
                <div>
                  <span className="text-xs text-gray-600 uppercase tracking-wide block mb-1">Billing Email</span>
                  <span className="text-sm font-mono text-gray-900 break-all">
                    {entity.billing_email}
                  </span>
                </div>
              )}

              {entity.address && (
                <div>
                  <span className="text-xs text-gray-600 uppercase tracking-wide block mb-1">Address</span>
                  <span className="text-sm text-gray-900 break-words">
                    {entity.address}
                  </span>
                </div>
              )}

              {(entity.student_threshold || entity.studio_penalty_per_student || entity.online_penalty_per_student) && (
                <div>
                  <span className="text-xs text-gray-600 uppercase tracking-wide block mb-1">Rate Details</span>
                  <div className="text-xs text-gray-600 space-y-1">
                    {entity.student_threshold && (
                      <div>Student threshold: {entity.student_threshold}</div>
                    )}
                    {entity.studio_penalty_per_student && (
                      <div>Studio penalty: €{entity.studio_penalty_per_student}</div>
                    )}
                    {entity.online_penalty_per_student && (
                      <div>Online penalty: €{entity.online_penalty_per_student}</div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <DataLoader
        data={studios}
        loading={loading}
        error={error?.message || null}
        empty={
          <div className="text-center py-8">
            <div className="text-gray-600 mb-4">
              <p className="text-lg mb-2">No billing entities configured yet</p>
              <p>Create your first studio or teacher profile to start managing invoices</p>
            </div>
            <Button onClick={handleCreateEntity}>
              Create Your First Profile
            </Button>
          </div>
        }
      >
        {(entityList) => (
          <div className="space-y-6">
            {/* Header with actions */}
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Billing Entities ({entityList.length})
                </h3>
                <p className="text-sm text-gray-600">
                  Manage studios and teachers for invoice generation
                </p>
              </div>
              <div className="flex gap-3">
                <Button onClick={handleCreateEntity}>
                  Add New
                </Button>
              </div>
            </div>

            {/* Studios Section */}
            {studioEntities.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-blue-600" />
                  <h4 className="font-medium text-gray-900">Studios ({studioEntities.length})</h4>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  {studioEntities.map(renderEntityCard)}
                </div>
              </div>
            )}

            {/* Divider */}
            {studioEntities.length > 0 && teacherEntities.length > 0 && (
              <hr className="border-gray-200" />
            )}

            {/* Teachers Section */}
            {teacherEntities.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-purple-600" />
                  <h4 className="font-medium text-gray-900">Teachers ({teacherEntities.length})</h4>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  {teacherEntities.map(renderEntityCard)}
                </div>
              </div>
            )}
          </div>
        )}
      </DataLoader>

      {/* Studio Form Modal */}
      <StudioFormModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        user={{ id: userId }}
        eventLocations={eventLocations || []}
        existingStudio={editingStudio}
        defaultEntityType={editingStudio ? (editingStudio.recipient_type === 'studio' ? 'studio' : 'teacher') : undefined}
        onStudioCreated={handleStudioCreated}
        onStudioUpdated={handleStudioUpdated}
      />
    </>
  )
} 