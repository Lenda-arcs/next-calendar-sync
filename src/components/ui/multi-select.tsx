'use client'

import React, { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { ChevronDown, X } from 'lucide-react'

export interface MultiSelectOption {
  value: string
  label: string
  count?: number
}

export interface MultiSelectProps {
  // Core props
  options: MultiSelectOption[]
  value: string[]
  onChange: (values: string[]) => void
  
  // Display props
  placeholder?: string
  label?: string
  className?: string
  
  // Behavior props
  maxSelections?: number
  showCounts?: boolean
  displayMode?: 'badges' | 'compact' | 'summary'
  
  // Form props (optional)
  id?: string
  name?: string
  required?: boolean
  error?: string
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select options...',
  label,
  className,
  maxSelections,
  showCounts = false,
  displayMode = 'badges',
  id,
  name,
  required = false,
  error
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleToggleOption = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue))
    } else {
      // Check if we've reached the max selections
      if (maxSelections && value.length >= maxSelections) {
        return
      }
      onChange([...value, optionValue])
    }
  }

  const removeOption = (optionValue: string, e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onChange(value.filter((v) => v !== optionValue))
  }

  const getSelectedLabels = () => {
    return value.map((val) => {
      const option = options.find((opt) => opt.value === val)
      return { value: val, label: option?.label || val }
    })
  }

  const getDisplayContent = () => {
    if (value.length === 0) {
      return <span className="text-muted-foreground">{placeholder}</span>
    }

    switch (displayMode) {
      case 'badges':
        return (
          <div className="flex-1 flex flex-wrap gap-1">
            {getSelectedLabels().map((item) => (
              <Badge
                key={item.value}
                variant="secondary"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {item.label}
                <span
                  role="button"
                  tabIndex={0}
                  className="ml-1 hover:bg-white/20 rounded-full w-4 h-4 flex items-center justify-center text-xs cursor-pointer"
                  onClick={(e) => removeOption(item.value, e)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      removeOption(item.value, e)
                    }
                  }}
                >
                  <X className="h-2 w-2" />
                </span>
              </Badge>
            ))}
          </div>
        )
      
      case 'compact':
        return (
          <span className="text-foreground">
            {value.length === 1 
              ? getSelectedLabels()[0].label 
              : `${value.length} selected`
            }
          </span>
        )
      
      case 'summary':
        return (
          <span className="text-foreground">
            {value.length === 1 
              ? getSelectedLabels()[0].label 
              : value.length === 0 
                ? placeholder 
                : `${getSelectedLabels().slice(0, 2).map(l => l.label).join(', ')}${value.length > 2 ? ` +${value.length - 2}` : ''}`
            }
          </span>
        )
      
      default:
        return <span className="text-foreground">{value.length} selected</span>
    }
  }

  const isMaxReached = maxSelections ? value.length >= maxSelections : false

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label className="block text-sm font-medium mb-2 text-foreground" htmlFor={id}>
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}
      
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div
            role="button"
            tabIndex={0}
            id={id}
            className={cn(
              'w-full px-3 py-2 rounded-lg text-sm text-left cursor-pointer',
              'backdrop-blur-sm bg-white/50 border border-white/40 shadow-md',
              'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-inset',
              'flex items-center justify-between transition-all duration-200',
              'hover:bg-accent hover:text-accent-foreground',
              displayMode === 'badges' ? 'min-h-[48px] px-4 py-3' : 'h-10',
              error ? 'border-destructive focus:ring-destructive' : 'border-input'
            )}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                setIsOpen(!isOpen)
              }
            }}
          >
            {getDisplayContent()}
            <ChevronDown className={cn(
              'h-4 w-4 transition-transform duration-200 flex-shrink-0',
              displayMode === 'badges' ? 'ml-2' : 'ml-1',
              isOpen ? 'rotate-180' : ''
            )} />
          </div>
        </PopoverTrigger>
        
        <PopoverContent 
          className="p-0" 
          align="start"
          style={{ width: 'var(--radix-popover-trigger-width)' }}
        >
          <div className="max-h-48 overflow-y-auto">
            {options.map((option) => {
              const isSelected = value.includes(option.value)
              const isDisabled = !isSelected && isMaxReached
              
              return (
                <div
                  key={option.value}
                  className={cn(
                    'px-3 py-2 flex items-center justify-between cursor-pointer',
                    'hover:bg-accent hover:text-accent-foreground',
                    'border-b border-border last:border-b-0',
                    isSelected && 'bg-accent text-accent-foreground',
                    isDisabled && 'opacity-50 cursor-not-allowed'
                  )}
                  onClick={() => !isDisabled && handleToggleOption(option.value)}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}} // Handled by onClick above
                      disabled={isDisabled}
                      className="accent-primary"
                    />
                    <span className="text-sm">{option.label}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {showCounts && option.count !== undefined && (
                      <span className="text-xs text-muted-foreground">
                        ({option.count})
                      </span>
                    )}
                    {isDisabled && (
                      <span className="text-xs text-muted-foreground">
                        Max reached
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </PopoverContent>
      </Popover>
      
      {/* Hidden input for form submission (only if name is provided) */}
      {name && <input type="hidden" name={name} value={JSON.stringify(value)} />}
      
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  )
}

export default MultiSelect 