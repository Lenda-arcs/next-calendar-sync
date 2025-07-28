import { useState } from 'react'
import { useSupabaseQuery, useSupabaseMutation } from './useQueryWithSupabase'
import { getUserStudios, getUserEventLocations, deleteStudio } from '@/lib/invoice-utils'
import { BillingEntity } from '@/lib/types'

interface UseBillingEntityManagementProps {
  userId: string
}

export function useBillingEntityManagement({ userId }: UseBillingEntityManagementProps) {
  // State management
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingEntity, setEditingEntity] = useState<BillingEntity | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [entityToDelete, setEntityToDelete] = useState<BillingEntity | null>(null)
  const [deletingEntityId, setDeletingEntityId] = useState<string | null>(null)

  // Data fetching
  const { 
    data: entities, 
    isLoading, 
    error,
    refetch
  } = useSupabaseQuery({
    queryKey: ['user-studios', userId],
    fetcher: () => getUserStudios(userId),
    enabled: !!userId
  })

  const { 
    data: eventLocations = []
  } = useSupabaseQuery({
    queryKey: ['user-event-locations', userId],
    fetcher: () => getUserEventLocations(userId),
    enabled: !!userId
  })

  // Delete mutation
  const deleteMutation = useSupabaseMutation({
    mutationFn: (supabase, entityId: string) => deleteStudio(entityId),
    onSuccess: () => {
      refetch()
      setDeletingEntityId(null)
    },
    onError: (error) => {
      console.error('Error deleting billing entity:', error)
      setDeletingEntityId(null)
    }
  })

  // Computed values
  const studioEntities = (entities?.filter(e => e.entity_type === 'studio') as BillingEntity[]) || []
  const teacherEntities = (entities?.filter(e => e.entity_type === 'teacher') as BillingEntity[]) || []

  // Action handlers
  const handleCreate = () => {
    setEditingEntity(null)
    setIsModalOpen(true)
  }

  const handleEdit = (entity: BillingEntity) => {
    setEditingEntity(entity)
    setIsModalOpen(true)
  }

  const handleDelete = (entity: BillingEntity) => {
    setEntityToDelete(entity)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (entityToDelete) {
      setDeletingEntityId(entityToDelete.id)
      await deleteMutation.mutateAsync(entityToDelete.id)
      setDeleteDialogOpen(false)
      setEntityToDelete(null)
    }
  }

  const handleModalSuccess = () => {
    refetch()
    setEditingEntity(null)
    setIsModalOpen(false)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setEditingEntity(null)
  }

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false)
    setEntityToDelete(null)
  }

  return {
    // Data
    entities: entities || [],
    studioEntities,
    teacherEntities,
    eventLocations,
    isLoading,
    error,
    
    // State
    isModalOpen,
    editingEntity,
    deleteDialogOpen,
    entityToDelete,
    deletingEntityId,
    
    // Actions
    handleCreate,
    handleEdit,
    handleDelete,
    confirmDelete,
    handleModalSuccess,
    handleModalClose,
    handleDeleteDialogClose,
    
    // Utils
    isEntityDeleting: (entityId: string) => deletingEntityId === entityId
  }
} 