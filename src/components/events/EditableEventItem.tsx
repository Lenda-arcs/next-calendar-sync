'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Edit3, Check, X, Trash2 } from 'lucide-react'

interface EditableEventItemProps {
  id: string
  title: string
  rate: number
  date: string
  studentsStudio?: number
  studentsOnline?: number
  onUpdate: (id: string, title: string, rate: number, studentsStudio?: number, studentsOnline?: number) => void
  disabled?: boolean
  onRemove?: (id: string) => void
  // Optional computed display rate when the rate should be derived from counts
  computedRate?: number
}

export function EditableEventItem({
  id,
  title,
  rate,
  date,
  studentsStudio = 0,
  studentsOnline = 0,
  onUpdate,
  disabled = false
  , onRemove,
  computedRate
}: EditableEventItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editingTitle, setEditingTitle] = useState(title)
  const [editingRate, setEditingRate] = useState(rate)
  const [editingStudentsStudio, setEditingStudentsStudio] = useState(studentsStudio)
  const [editingStudentsOnline, setEditingStudentsOnline] = useState(studentsOnline)

  const handleStartEdit = () => {
    setEditingTitle(title)
    setEditingRate(rate)
    setEditingStudentsStudio(studentsStudio)
    setEditingStudentsOnline(studentsOnline)
    setIsEditing(true)
  }

  const handleSaveEdit = () => {
    onUpdate(id, editingTitle, editingRate, editingStudentsStudio, editingStudentsOnline)
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setEditingTitle(title)
    setEditingRate(rate)
    setEditingStudentsStudio(studentsStudio)
    setEditingStudentsOnline(studentsOnline)
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
          <div className="space-y-2">
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
        
        {/* Student Count Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
          <div className="space-y-2">
            <Label htmlFor={`editing-students-studio-${id}`}>Students (Studio)</Label>
            <Input
              id={`editing-students-studio-${id}`}
              type="number"
              min="0"
              value={editingStudentsStudio}
              onChange={(e) => setEditingStudentsStudio(parseInt(e.target.value) || 0)}
              placeholder="0"
              disabled={disabled}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`editing-students-online-${id}`}>Students (Online)</Label>
            <Input
              id={`editing-students-online-${id}`}
              type="number"
              min="0"
              value={editingStudentsOnline}
              onChange={(e) => setEditingStudentsOnline(parseInt(e.target.value) || 0)}
              placeholder="0"
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
              {onRemove && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onRemove(id)}
                  disabled={disabled}
                  className="p-1 h-8 w-8 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <div>Date: {date}</div>
              <div>Students: {studentsStudio} (Studio) / {studentsOnline} (Online)</div>
            </div>
          </div>
          <div className="text-right flex-shrink-0 ml-4">
            <div className="text-lg font-bold">
              €{(computedRate ?? rate).toFixed(2)}
            </div>
          </div>
        </div>
    </div>
  )
} 