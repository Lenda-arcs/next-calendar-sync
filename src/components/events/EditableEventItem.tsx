'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Edit3, Check, X } from 'lucide-react'

interface EditableEventItemProps {
  id: string
  title: string
  rate: number
  date: string
  onUpdate: (id: string, title: string, rate: number) => void
  disabled?: boolean
}

export function EditableEventItem({
  id,
  title,
  rate,
  date,
  onUpdate,
  disabled = false
}: EditableEventItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editingTitle, setEditingTitle] = useState(title)
  const [editingRate, setEditingRate] = useState(rate)

  const handleStartEdit = () => {
    setEditingTitle(title)
    setEditingRate(rate)
    setIsEditing(true)
  }

  const handleSaveEdit = () => {
    onUpdate(id, editingTitle, editingRate)
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setEditingTitle(title)
    setEditingRate(rate)
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
          <div className="lg:col-span-2 space-y-2">
            <Label htmlFor={`editing-title-${id}`}>Event Title</Label>
            <Input
              id={`editing-title-${id}`}
              value={editingTitle}
              onChange={(e) => setEditingTitle(e.target.value)}
              placeholder="Enter event title"
              disabled={disabled}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`editing-rate-${id}`}>Rate (€)</Label>
            <Input
              id={`editing-rate-${id}`}
              type="number"
              min="0"
              step="0.01"
              value={editingRate}
              onChange={(e) => setEditingRate(parseFloat(e.target.value) || 0)}
              placeholder="0.00"
              disabled={disabled}
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={handleSaveEdit}
            disabled={disabled}
            className="bg-green-600 hover:bg-green-700"
          >
            <Check className="w-4 h-4 mr-1" />
            Save
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleCancelEdit}
            disabled={disabled}
          >
            <X className="w-4 h-4 mr-1" />
            Cancel
          </Button>
        </div>
        <div className="text-sm text-gray-600">
          Date: {date}
        </div>
      </div>
    )
  }

  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h4 className="font-medium text-lg truncate">{title}</h4>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleStartEdit}
              disabled={disabled}
              className="p-1 h-8 w-8 text-gray-500 hover:text-gray-700"
            >
              <Edit3 className="w-4 h-4" />
            </Button>
          </div>
          <div className="text-sm text-gray-600">
            Date: {date}
          </div>
        </div>
        <div className="text-right flex-shrink-0 ml-4">
          <div className="text-lg font-bold">
            €{rate.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  )
} 