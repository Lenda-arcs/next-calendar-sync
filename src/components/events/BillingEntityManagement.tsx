'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import DataLoader from '@/components/ui/data-loader'
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '@/components/ui/alert-dialog'
import { useBillingEntityManagement } from '@/lib/hooks'
import { BillingEntityCard } from './BillingEntityCard'
import BillingEntityFormModal from './BillingEntityFormModal'

interface BillingEntityManagementProps {
  userId: string
}

export function BillingEntityManagement({ userId }: BillingEntityManagementProps) {
  const {
    entities,
    studioEntities,
    teacherEntities,
    eventLocations,
    isLoading,
    error,
    isModalOpen,
    editingEntity,
    deleteDialogOpen,
    entityToDelete,
    handleCreate,
    handleEdit,
    handleDelete,
    confirmDelete,
    handleModalSuccess,
    handleModalClose,
    handleDeleteDialogClose,
    isEntityDeleting
  } = useBillingEntityManagement({ userId })

  return (
    <>
      <DataLoader
        data={entities}
        loading={isLoading}
        error={error?.message || null}
        empty={
          <div className="text-center py-6 sm:py-8 px-4">
            <div className="text-gray-600 mb-4 sm:mb-6">
              <p className="text-base sm:text-lg mb-2 font-medium">No billing entities configured yet</p>
              <p className="text-sm sm:text-base text-gray-500">Create your first studio or teacher profile to start managing invoices</p>
            </div>
            <Button 
              onClick={handleCreate}
              className="w-full sm:w-auto"
            >
              Create Your First Profile
            </Button>
          </div>
        }
      >
        {(entityList) => (
          <div className="space-y-6">
            {/* Header with count and actions */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
              <div>
                <h3 className="text-base font-medium text-gray-900">
                  {entityList.length} Billing Entities
                </h3>
              </div>
              <Button 
                onClick={handleCreate}
                className="w-full sm:w-auto"
              >
                Add New
              </Button>
            </div>

            {/* Studios Section */}
            {studioEntities.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-gray-900">Studios ({studioEntities.length})</h4>
                </div>
                <div className="grid gap-4 sm:gap-6 sm:grid-cols-1 lg:grid-cols-2">
                  {studioEntities.map(entity => (
                    <BillingEntityCard
                      key={entity.id}
                      entity={entity}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      isDeleting={isEntityDeleting(entity.id)}
                    />
                  ))}
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
                  <h4 className="font-medium text-gray-900">Teachers ({teacherEntities.length})</h4>
                </div>
                <div className="grid gap-4 sm:gap-6 sm:grid-cols-1 lg:grid-cols-2">
                  {teacherEntities.map(entity => (
                    <BillingEntityCard
                      key={entity.id}
                      entity={entity}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      isDeleting={isEntityDeleting(entity.id)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </DataLoader>

      {/* Billing Entity Form Modal */}
      <BillingEntityFormModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        user={{ id: userId }}
        eventLocations={eventLocations || []}
        existingStudio={editingEntity}
        defaultEntityType={editingEntity ? editingEntity.entity_type : undefined}
        onStudioCreated={handleModalSuccess}
        onStudioUpdated={handleModalSuccess}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={handleDeleteDialogClose}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Billing Entity</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{entityToDelete?.entity_name}&quot;? This action cannot be undone and will remove all associated billing information.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDeleteDialogClose}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
} 