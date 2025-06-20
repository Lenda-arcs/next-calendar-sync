'use client'

import React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface Option {
  value: string
  label: string
}

interface FormMultiSelectProps {
  id: string
  name: string
  label: string
  options: Option[]
  value?: string[]
  onChange?: (values: string[]) => void
  required?: boolean
  error?: string
  placeholder?: string
  maxSelections?: number
}

const FormMultiSelect: React.FC<FormMultiSelectProps> = ({
  id,
  name,
  label,
  options,
  value = [],
  onChange,
  required = false,
  error,
  placeholder = 'Select options...',
  maxSelections,
}) => {
  const [isOpen, setIsOpen] = React.useState(false)

  const handleToggleOption = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange?.(value.filter((v) => v !== optionValue))
    } else {
      // Check if we've reached the max selections
      if (maxSelections && value.length >= maxSelections) {
        return // Don't add more items
      }
      onChange?.([...value, optionValue])
    }
  }

  const removeOption = (optionValue: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onChange?.(value.filter((v) => v !== optionValue))
  }

  const getSelectedLabels = () => {
    return value
      .filter((val) => val && typeof val === 'string') // Filter out null/undefined values
      .map((val) => {
        const option = options.find((opt) => opt.value === val)
        return { value: val, label: option?.label || val }
      })
  }

  const isMaxReached = maxSelections ? value.length >= maxSelections : false

  return (
    <div className="w-full">
      <Label htmlFor={id} className="block text-sm font-medium mb-2">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div
            className={cn(
              'w-full px-4 py-3 rounded-lg bg-background border cursor-pointer min-h-[48px]',
              'focus:outline-none focus:ring-2 focus:ring-ring flex items-center justify-between',
              error ? 'border-destructive' : 'border-input'
            )}
          >
            <div className="flex-1 flex flex-wrap gap-1">
              {value.length > 0 ? (
                getSelectedLabels().map((item) => (
                  <Badge
                    key={item.value}
                    variant="secondary"
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    {item.label}
                    <button
                      type="button"
                      className="ml-1 hover:bg-white/20 rounded-full w-4 h-4 flex items-center justify-center text-xs"
                      onClick={(e) => removeOption(item.value, e)}
                    >
                      ×
                    </button>
                  </Badge>
                ))
              ) : (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
            </div>
            <div className="ml-2 text-muted-foreground text-sm">{isOpen ? '⌃' : '⌄'}</div>
          </div>
        </PopoverTrigger>
        
        <PopoverContent 
          className="p-0" 
          align="start"
          style={{ width: 'var(--radix-popover-trigger-width)' }}
        >
          <div className="max-h-48 overflow-y-auto">
            {options
              .filter((option) => option && option.value && typeof option.value === 'string')
              .map((option) => {
              const isSelected = value.includes(option.value)
              const isDisabled = !isSelected && isMaxReached
              
              return (
                <div
                  key={option.value}
                  className={cn(
                    'px-4 py-2 flex items-center border-t border-border first:border-t-0',
                    isDisabled 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'cursor-pointer hover:bg-muted',
                    isSelected && 'bg-muted'
                  )}
                  onClick={() => !isDisabled && handleToggleOption(option.value)}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {}} // Handled by onClick above
                    disabled={isDisabled}
                    className="mr-2 accent-primary"
                  />
                  <span 
                    className={cn(
                      'text-sm', 
                      isDisabled ? 'text-muted-foreground' : 'text-foreground'
                    )}
                  >
                    {option.label}
                  </span>
                  {isDisabled && (
                    <span className="ml-auto text-xs text-muted-foreground">
                      Max reached
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </PopoverContent>
      </Popover>
      
      {/* Hidden input for form submission */}
      <input type="hidden" name={name} value={JSON.stringify(value)} />
      
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  )
}

export default FormMultiSelect 