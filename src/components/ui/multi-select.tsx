'use client'

/**
 * Unified MultiSelect Component
 * 
 * This component combines the functionality of the previous multi-select and form-multi-select components.
 * It supports:
 * - Multiple display modes (badges, compact, summary)
 * - Scroll arrows for dialog compatibility
 * - Custom option and badge renderers
 * - Maximum selections limit
 * - Form integration with hidden inputs
 * - Comprehensive styling and accessibility
 */

import React, { useState, useRef, useEffect } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { ChevronDown, ChevronUp, X } from 'lucide-react'

export interface MultiSelectOption {
  value: string
  label: string
  count?: number
  color?: string | null
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
  
  // Custom renderers (unified from form-multi-select)
  renderOption?: (option: MultiSelectOption, isSelected: boolean, isDisabled: boolean) => React.ReactNode
  renderSelectedBadge?: (option: MultiSelectOption, onRemove: (e: React.MouseEvent | React.KeyboardEvent) => void) => React.ReactNode
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
  error,
  renderOption,
  renderSelectedBadge
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [canScrollUp, setCanScrollUp] = useState(false)
  const [canScrollDown, setCanScrollDown] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Check scroll state
  const checkScrollState = () => {
    const container = scrollContainerRef.current
    if (!container) return

    const { scrollTop, scrollHeight, clientHeight } = container
    setCanScrollUp(scrollTop > 0)
    setCanScrollDown(scrollTop < scrollHeight - clientHeight - 1) // -1 for rounding
  }

  // Initialize scroll state when options or open state changes
  useEffect(() => {
    if (isOpen) {
      setTimeout(checkScrollState, 0) // Wait for render
    }
  }, [isOpen, options])

  // Scroll handlers
  const scrollUp = () => {
    const container = scrollContainerRef.current
    if (!container) return
    container.scrollBy({ top: -100, behavior: 'smooth' })
  }

  const scrollDown = () => {
    const container = scrollContainerRef.current
    if (!container) return
    container.scrollBy({ top: 100, behavior: 'smooth' })
  }

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
      return option || { value: val, label: val }
    })
  }

  // Default option renderer
  const defaultRenderOption = (option: MultiSelectOption, isSelected: boolean, isDisabled: boolean) => (
    <div className="flex items-center justify-between w-full">
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

  // Default selected badge renderer
  const defaultRenderSelectedBadge = (option: MultiSelectOption, onRemove: (e: React.MouseEvent | React.KeyboardEvent) => void) => (
    <Badge
      key={option.value}
      variant="secondary"
      className="bg-primary text-primary-foreground hover:bg-primary/90"
    >
      {option.label}
      <span
        role="button"
        tabIndex={0}
        className="ml-1 hover:bg-white/20 rounded-full w-4 h-4 flex items-center justify-center text-xs cursor-pointer"
        onClick={onRemove}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onRemove(e)
          }
        }}
      >
        <X className="h-2 w-2" />
      </span>
    </Badge>
  )

  const getDisplayContent = () => {
    if (value.length === 0) {
      return <span className="text-muted-foreground">{placeholder}</span>
    }

    switch (displayMode) {
      case 'badges':
        return (
          <div className="flex-1 flex flex-wrap gap-1">
            {getSelectedLabels().map((option) => (
              renderSelectedBadge ? 
                renderSelectedBadge(option, (e) => removeOption(option.value, e)) :
                defaultRenderSelectedBadge(option, (e) => removeOption(option.value, e))
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
          className="p-0 relative" 
          align="start"
          style={{ width: 'var(--radix-popover-trigger-width)' }}
        >
          {/* Top scroll arrow */}
          {canScrollUp && (
            <div 
              className="absolute top-0 left-0 right-0 z-10 h-8 bg-gradient-to-b from-background to-transparent flex items-center justify-center cursor-pointer hover:bg-accent/50 transition-colors"
              onClick={scrollUp}
            >
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            </div>
          )}
          
          {/* Scrollable content */}
          <div 
            ref={scrollContainerRef}
            className="max-h-48 overflow-y-auto"
            onScroll={checkScrollState}
            style={{ 
              paddingTop: canScrollUp ? '32px' : '0',
              paddingBottom: canScrollDown ? '32px' : '0'
            }}
          >
            {options.map((option) => {
              const isSelected = value.includes(option.value)
              const isDisabled = !isSelected && isMaxReached
              
              return (
                <div
                  key={option.value}
                  className={cn(
                    'px-3 py-2 flex items-center cursor-pointer',
                    'hover:bg-accent hover:text-accent-foreground',
                    'border-b border-border last:border-b-0',
                    isSelected && 'bg-accent text-accent-foreground',
                    isDisabled && 'opacity-50 cursor-not-allowed'
                  )}
                  onClick={() => !isDisabled && handleToggleOption(option.value)}
                >
                  {renderOption ? 
                    renderOption(option, isSelected, isDisabled) :
                    defaultRenderOption(option, isSelected, isDisabled)
                  }
                </div>
              )
            })}
          </div>
          
          {/* Bottom scroll arrow */}
          {canScrollDown && (
            <div 
              className="absolute bottom-0 left-0 right-0 z-10 h-8 bg-gradient-to-t from-background to-transparent flex items-center justify-center cursor-pointer hover:bg-accent/50 transition-colors"
              onClick={scrollDown}
            >
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </div>
          )}
        </PopoverContent>
      </Popover>
      
      {/* Hidden input for form submission (only if name is provided) */}
      {name && <input type="hidden" name={name} value={JSON.stringify(value)} />}
      
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  )
}

export default MultiSelect 