'use client'

import React from 'react'
import {Button} from '@/components/ui/button'
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
import {useBillingEntityManagement} from '@/lib/hooks'
import {BillingEntityCard} from '@/components'
import BillingEntityFormModal from './BillingEntityFormModal'
import {useTranslation} from '@/lib/i18n/context'

interface BillingEntityManagementProps {
  userId: string
}

export function BillingEntityManagement({ userId }: BillingEntityManagementProps) {
  const { t } = useTranslation()
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
              <p className="text-base sm:text-lg mb-2 font-medium">{t('invoices.billingEntities.noBillingEntities')}</p>
              <p className="text-sm sm:text-base text-gray-500">{t('invoices.billingEntities.noBillingEntitiesDesc')}</p>
            </div>
            <Button 
              onClick={handleCreate}
              className="w-full sm:w-auto"
            >
              {t('invoices.billingEntities.createFirstProfile')}
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
                  {entityList.length} {t('invoices.billingEntities.title')}
                </h3>
              </div>
              <Button 
                onClick={handleCreate}
                className="w-full sm:w-auto"
              >
                {t('invoices.billingEntities.addNew')}
              </Button>
            </div>

            {/* Studios Section */}
            {studioEntities.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-gray-900">{t('invoices.billingEntities.studios')} ({studioEntities.length})</h4>
                </div>
                <div className="grid gap-4 sm:gap-6 grid-cols-1">
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
                  <h4 className="font-medium text-gray-900">{t('invoices.billingEntities.teachers')} ({teacherEntities.length})</h4>
                </div>
                <div className="grid gap-4 sm:gap-6 grid-cols-1">
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
            <AlertDialogTitle>{t('invoices.billingEntities.deleteTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('invoices.billingEntities.deleteConfirmation', { name: entityToDelete?.entity_name || '' })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDeleteDialogClose}>
              {t('invoices.billingEntities.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              {t('invoices.billingEntities.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
} 