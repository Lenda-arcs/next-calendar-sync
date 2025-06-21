'use client'

import React from 'react'
import { TAG_COLORS } from '@/lib/constants/tag-constants'

interface ColorPickerProps {
  selectedColor: string
  onColorChange: (color: string) => void
  label?: string
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  selectedColor,
  onColorChange,
  label = 'Color'
}) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <div className="flex flex-wrap gap-3 p-1">
        {TAG_COLORS.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onColorChange(color)}
            className={`w-10 h-10 rounded-xl transition-all duration-200 hover:scale-110 backdrop-blur-md border-2 shadow-lg ${
              selectedColor === color
                ? 'ring-2 ring-offset-2 ring-ring border-white/80 shadow-xl scale-105'
                : 'border-white/50 hover:border-white/70 hover:shadow-xl'
            }`}
            style={{ backgroundColor: color }}
            aria-label={`Select color ${color}`}
          />
        ))}
      </div>
    </div>
  )
} 