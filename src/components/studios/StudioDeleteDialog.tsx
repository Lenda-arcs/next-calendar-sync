'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Studio } from '@/lib/types'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { toast } from 'sonner'

interface StudioDeleteDialogProps {
  studio: Studio | null
  onClose: () => void
  onDelete: () => void
}

export function StudioDeleteDialog({ studio, onClose, onDelete }: StudioDeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const supabase = createClient()

  const handleDelete = async () => {
    if (!studio) return
    
    setIsDeleting(true)
    try {
      // First check if studio has any billing entities
      const { data: billingEntities } = await supabase
        .from('billing_entities')
        .select('id')
        .eq('studio_id', studio.id)

      if (billingEntities && billingEntities.length > 0) {
        toast.error('Cannot delete studio with active billing entities')
        return
      }

      const { error } = await supabase
        .from('studios')
        .delete()
        .eq('id', studio.id)

      if (error) throw error

      toast.success('Studio deleted successfully')
      onDelete()
      onClose()
    } catch (error) {
      console.error('Error deleting studio:', error)
      toast.error('Failed to delete studio')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog open={!!studio} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Studio</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete &quot;{studio?.name}&quot;? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? 'Deleting...' : 'Delete Studio'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
} 