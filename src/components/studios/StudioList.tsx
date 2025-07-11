'use client'

import { useState } from 'react'
import { Studio, StudioWithStats } from '@/lib/types'
import { Card, CardContent } from '@/components/ui/card'
import { MapPin } from 'lucide-react'
import { StudioItem } from './StudioItem'
import { StudioDeleteDialog } from './StudioDeleteDialog'

interface StudioListProps {
  studios: StudioWithStats[]
  onEdit: (studio: Studio) => void
  onDelete: () => void
  userRole: 'admin' | 'moderator' | 'user'
}

export function StudioList({ studios, onEdit, onDelete, userRole }: StudioListProps) {
  const [deletingStudio, setDeletingStudio] = useState<Studio | null>(null)

  const handleDeleteClose = () => {
    setDeletingStudio(null)
  }

  if (studios.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center text-gray-500">
            <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium mb-2">No studios found</p>
            <p className="text-sm">Create your first studio to get started</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {studios.map((studio) => (
        <StudioItem
          key={studio.id}
          studio={studio}
          userRole={userRole}
          onEdit={onEdit}
          onDelete={setDeletingStudio}
          onRefresh={onDelete}
        />
      ))}

      <StudioDeleteDialog
        studio={deletingStudio}
        onClose={handleDeleteClose}
        onDelete={onDelete}
      />
    </div>
  )
}