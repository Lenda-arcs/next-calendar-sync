'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface RadioGroupContextType {
  value: string
  onValueChange: (value: string) => void
}

const RadioGroupContext = React.createContext<RadioGroupContextType | undefined>(undefined)

interface RadioGroupProps {
  value: string
  onValueChange: (value: string) => void
  children: React.ReactNode
  className?: string
}

export function RadioGroup({ value, onValueChange, children, className }: RadioGroupProps) {
  return (
    <RadioGroupContext.Provider value={{ value, onValueChange }}>
      <div className={cn('space-y-2', className)} role="radiogroup">
        {children}
      </div>
    </RadioGroupContext.Provider>
  )
}

interface RadioGroupItemProps {
  value: string
  id: string
  disabled?: boolean
  className?: string
}

export function RadioGroupItem({ value, id, disabled, className }: RadioGroupItemProps) {
  const context = React.useContext(RadioGroupContext)
  
  if (!context) {
    throw new Error('RadioGroupItem must be used within a RadioGroup')
  }

  const { value: groupValue, onValueChange } = context
  const isSelected = groupValue === value

  return (
    <input
      type="radio"
      id={id}
      value={value}
      checked={isSelected}
      onChange={() => onValueChange(value)}
      disabled={disabled}
      className={cn(
        'h-4 w-4 border border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2',
        className
      )}
    />
  )
} 