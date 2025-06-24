'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

import DataLoader from '@/components/ui/data-loader'
import { useSupabaseQuery } from '@/lib/hooks/useSupabaseQuery'
import { useSupabaseMutation } from '@/lib/hooks/useSupabaseMutation'
import { getUserStudios, getUserEventLocations, deleteStudio } from '@/lib/invoice-utils'
import { Studio } from '@/lib/types'
import { Trash2, Edit } from 'lucide-react'
import StudioFormModal from './StudioFormModal'

interface StudioManagementProps {
  userId: string
}

export function StudioManagement({ userId }: StudioManagementProps) {
  const [deletingStudio, setDeletingStudio] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingStudio, setEditingStudio] = useState<Studio | null>(null)

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
      console.error('Error deleting studio:', error)
      setDeletingStudio(null)
    }
  })

  const handleCreateStudio = () => {
    setEditingStudio(null)
    setIsModalOpen(true)
  }

  const handleEditStudio = (studio: Studio) => {
    setEditingStudio(studio)
    setIsModalOpen(true)
  }

  const handleDeleteStudio = async (studioId: string) => {
    if (confirm('Are you sure you want to delete this studio? This action cannot be undone.')) {
      setDeletingStudio(studioId)
      await deleteMutation.mutateAsync(studioId)
    }
  }

  const handleStudioCreated = () => {
    refetchStudios()
  }

  const handleStudioUpdated = () => {
    refetchStudios()
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
              <p className="text-lg mb-2">No studios configured yet</p>
              <p>Create your first studio profile to start managing invoices</p>
            </div>
            <Button onClick={handleCreateStudio}>
              Create Your First Studio
            </Button>
          </div>
        }
      >
        {(studioList: Studio[]) => (
          <div className="space-y-6">
            {/* Header with actions */}
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Your Studios ({studioList.length})
                </h3>
              </div>
              <div className="flex gap-3">
                <Button onClick={handleCreateStudio}>
                  Add Studio
                </Button>
              </div>
            </div>

            {/* Studios Grid */}
            <div className="grid gap-6 md:grid-cols-2">
              {studioList.map((studio) => (
                <Card key={studio.id} className="h-full">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg mb-1">
                          {studio.studio_name}
                        </CardTitle>
                        <p className="text-sm text-gray-600">
                          Matches: &quot;{studio.location_match}&quot;
                        </p>
                      </div>
                      <div className="flex space-x-1 ml-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditStudio(studio)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteStudio(studio.id)}
                          disabled={deletingStudio === studio.id}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        >
                          {deletingStudio === studio.id ? (
                            <span className="text-xs">...</span>
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-xs text-gray-600 uppercase tracking-wide block mb-1">Rate Type</span>
                        <span className="text-sm font-medium text-gray-900">
                          {studio.rate_type === "flat" ? "Flat Rate" : "Per Student"}
                        </span>
                      </div>
                      <div>
                        <span className="text-xs text-gray-600 uppercase tracking-wide block mb-1">Base Rate</span>
                        <span className="font-semibold text-gray-900">
                          €{studio.base_rate?.toFixed(2) || "0.00"}
                        </span>
                      </div>
                    </div>

                    {studio.billing_email && (
                      <div>
                        <span className="text-xs text-gray-600 uppercase tracking-wide block mb-1">Billing Email</span>
                        <span className="text-sm font-mono text-gray-900 break-all">
                          {studio.billing_email}
                        </span>
                      </div>
                    )}

                    {studio.address && (
                      <div>
                        <span className="text-xs text-gray-600 uppercase tracking-wide block mb-1">Address</span>
                        <span className="text-sm text-gray-900 break-words">
                          {studio.address}
                        </span>
                      </div>
                    )}

                    {(studio.student_threshold || studio.studio_penalty_per_student || studio.online_penalty_per_student) && (
                      <div>
                        <span className="text-xs text-gray-600 uppercase tracking-wide block mb-1">Rate Details</span>
                        <div className="text-xs text-gray-600 space-y-1">
                          {studio.student_threshold && (
                            <div>Student threshold: {studio.student_threshold}</div>
                          )}
                          {studio.studio_penalty_per_student && (
                            <div>Studio penalty: €{studio.studio_penalty_per_student}</div>
                          )}
                          {studio.online_penalty_per_student && (
                            <div>Online penalty: €{studio.online_penalty_per_student}</div>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </DataLoader>

      {/* Studio Form Modal */}
      <StudioFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={{ id: userId }}
        eventLocations={eventLocations || []}
        existingStudio={editingStudio}
        onStudioCreated={handleStudioCreated}
        onStudioUpdated={handleStudioUpdated}
      />
    </>
  )
} 