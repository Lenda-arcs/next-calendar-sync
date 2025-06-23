'use client'

import React from 'react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { EventDisplayVariant } from '@/lib/event-types'
import { cn } from '@/lib/utils'

/**
 * Reusable tabs component for selecting EventCard display variants
 * 
 * @example
 * ```tsx
 * const [variant, setVariant] = useState<EventDisplayVariant>('compact')
 * 
 * <EventCardVariantTabs
 *   value={variant}
 *   onValueChange={setVariant}
 *   size="sm"
 * />
 * ```
 */

interface EventCardVariantTabsProps {
  value: EventDisplayVariant
  onValueChange: (value: EventDisplayVariant) => void
  className?: string
  size?: 'sm' | 'default'
}

const variantLabels: Record<EventDisplayVariant, string> = {
  minimal: 'Minimal',
  compact: 'Compact',
  full: 'Full'
}

export const EventCardVariantTabs: React.FC<EventCardVariantTabsProps> = ({
  value,
  onValueChange,
  className,
  size = 'default'
}) => {
  const variants: EventDisplayVariant[] = ['minimal', 'compact', 'full']

  return (
    <Tabs 
      value={value} 
      onValueChange={onValueChange as (value: string) => void}
      className={cn('w-auto', className)}
    >
      <TabsList className={cn(
        'grid w-full grid-cols-3',
        size === 'sm' && 'h-8 p-0.5'
      )}>
        {variants.map((variant) => (
          <TabsTrigger 
            key={variant}
            value={variant}
            className={cn(
              'capitalize',
              size === 'sm' && 'text-xs px-2 py-1'
            )}
          >
            {variantLabels[variant]}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
} 