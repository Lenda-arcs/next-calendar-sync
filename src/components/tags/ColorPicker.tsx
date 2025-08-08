'use client'

import React from 'react'
import { TAG_COLORS } from '@/lib/constants/tag-constants'

interface ColorPickerProps {
  selectedColor: string
  onColorChange: (color: string) => void
  // Optional label rendered above the swatches
  label?: string
  // When set to 'input', renders inside an input-like container for alignment
  variant?: 'default' | 'input'
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  selectedColor,
  onColorChange,
  label,
  variant = 'default',
}) => {
  const containerClass =
    variant === 'input'
      ? 'flex items-center gap-2 h-10 px-2 border rounded-md bg-background overflow-x-auto'
      : 'flex flex-wrap gap-3 p-1'

  const buttonClass = (color: string) =>
    variant === 'input'
      ? `w-5 h-5 rounded-md border transition-transform duration-150 ${
          selectedColor === color
            ? 'ring-2 ring-ring border-transparent scale-105'
            : 'hover:scale-110 border-input'
        }`
      : `w-10 h-10 rounded-xl transition-all duration-200 hover:scale-110 backdrop-blur-md border-2 shadow-lg ${
          selectedColor === color
            ? 'ring-2 ring-offset-2 ring-ring border-white/80 shadow-xl scale-105'
            : 'border-white/50 hover:border-white/70 hover:shadow-xl'
        }`

  const swatches = (
    <div className={containerClass} role="listbox" aria-label="Color options">
      {TAG_COLORS.map((color) => (
        <button
          key={color}
          type="button"
          onClick={() => onColorChange(color)}
          className={buttonClass(color)}
          style={{ backgroundColor: color }}
          aria-label={`Select color ${color}`}
        />
      ))}
    </div>
  )

  if (label) {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground">{label}</label>
        {swatches}
      </div>
    )
  }

  return <div className="space-y-2">{swatches}</div>
}