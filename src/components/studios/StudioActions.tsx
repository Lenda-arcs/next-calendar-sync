'use client'

import { createClient } from '@/lib/supabase'
import { Studio } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Edit, Trash2, Check, X, Star } from 'lucide-react'
import { toast } from 'sonner'

interface StudioActionsProps {
  studio: Studio
  userRole: 'admin' | 'moderator' | 'user'
  onEdit: (studio: Studio) => void
  onDelete: (studio: Studio) => void
  onRefresh: () => void
}

export function StudioActions({ studio, userRole, onEdit, onDelete, onRefresh }: StudioActionsProps) {
  const supabase = createClient()

  const toggleVerification = async () => {
    try {
      const { error } = await supabase
        .from('studios')
        .update({ verified: !studio.verified })
        .eq('id', studio.id)

      if (error) throw error

      toast.success(`Studio ${studio.verified ? 'unverified' : 'verified'} successfully`)
      onRefresh()
    } catch (error) {
      console.error('Error updating studio verification:', error)
      toast.error('Failed to update studio verification')
    }
  }

  const toggleFeatured = async () => {
    try {
      const { error } = await supabase
        .from('studios')
        .update({ featured: !studio.featured })
        .eq('id', studio.id)

      if (error) throw error

      toast.success(`Studio ${studio.featured ? 'unfeatured' : 'featured'} successfully`)
      onRefresh()
    } catch (error) {
      console.error('Error updating studio featured status:', error)
      toast.error('Failed to update studio featured status')
    }
  }

  return (
    <div className="flex items-center gap-1">
      {userRole === 'admin' && (
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleVerification}
            className={`h-8 w-8 p-0 ${studio.verified ? 'text-green-600' : 'text-gray-400'}`}
            title={studio.verified ? 'Unverify studio' : 'Verify studio'}
          >
            {studio.verified ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleFeatured}
            className={`h-8 w-8 p-0 ${studio.featured ? 'text-yellow-600' : 'text-gray-400'}`}
            title={studio.featured ? 'Unfeature studio' : 'Feature studio'}
          >
            <Star className="w-4 h-4" />
          </Button>
        </>
      )}
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onEdit(studio)}
        className="h-8 w-8 p-0"
        title="Edit studio"
      >
        <Edit className="w-4 h-4" />
      </Button>
      
      {userRole === 'admin' && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(studio)}
          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
          title="Delete studio"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      )}
    </div>
  )
} 