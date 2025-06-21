'use client'

import React, { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { ChevronDown, Check } from 'lucide-react'

export interface SelectOption {
  value: string
  label: string
  count?: number
}

export interface SelectProps {
  // Core props
  options: SelectOption[]
  value: string
  onChange: (value: string) => void
  
  // Display props
  placeholder?: string
  label?: string
  className?: string
  
  // Behavior props
  showCounts?: boolean
  
  // Form props (optional)
  id?: string
  name?: string
  required?: boolean
  error?: string
  disabled?: boolean
}

export const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option...',
  label,
  className,
  showCounts = false,
  id,
  name,
  required = false,
  error,
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const selectedOption = options.find(option => option.value === value)
  
  const handleSelect = (optionValue: string) => {
    onChange(optionValue)
    setIsOpen(false)
  }

  const getDisplayText = () => {
    if (!selectedOption) return placeholder
    return selectedOption.label
  }

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label className="block text-sm font-medium mb-2 text-foreground" htmlFor={id}>
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}
      
      <Popover open={isOpen && !disabled} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            id={id}
            disabled={disabled}
            className={cn(
              'w-full px-3 py-2 rounded-lg text-sm text-left h-10',
              'backdrop-blur-sm bg-white/50 border border-white/40 shadow-md',
              'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
              'flex items-center justify-between transition-all duration-200',
              'hover:bg-accent hover:text-accent-foreground',
              'disabled:cursor-not-allowed disabled:opacity-50',
              error ? 'border-destructive focus:ring-destructive' : 'border-input'
            )}
          >
            <span className={cn(
              !selectedOption ? 'text-muted-foreground' : 'text-foreground'
            )}>
              {getDisplayText()}
            </span>
            <ChevronDown className={cn(
              'h-4 w-4 transition-transform duration-200 flex-shrink-0 ml-1',
              isOpen ? 'rotate-180' : ''
            )} />
          </button>
        </PopoverTrigger>
        
        <PopoverContent 
          className="p-0" 
          align="start"
          style={{ width: 'var(--radix-popover-trigger-width)' }}
        >
          <div className="max-h-48 overflow-y-auto">
            {options.map((option) => {
              const isSelected = option.value === value
              
              return (
                <div
                  key={option.value}
                  className={cn(
                    'px-3 py-2 flex items-center justify-between cursor-pointer',
                    'hover:bg-accent hover:text-accent-foreground',
                    'border-b border-border last:border-b-0',
                    isSelected && 'bg-accent text-accent-foreground'
                  )}
                  onClick={() => handleSelect(option.value)}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{option.label}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {showCounts && option.count !== undefined && (
                      <span className="text-xs text-muted-foreground">
                        ({option.count})
                      </span>
                    )}
                    {isSelected && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </PopoverContent>
      </Popover>
      
      {/* Hidden input for form submission (only if name is provided) */}
      {name && <input type="hidden" name={name} value={value} />}
      
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  )
}

export default Select 