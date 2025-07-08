import React from 'react'
import { TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LoadingTabsTriggerProps {
  value: string
  icon: React.ComponentType<{ className?: string }>
  fullText: string
  shortText: string
  isLoading?: boolean
  count?: number
  className?: string
}

export function LoadingTabsTrigger({
  value,
  icon: Icon,
  fullText,
  shortText,
  isLoading = false,
  count,
  className
}: LoadingTabsTriggerProps) {
  return (
    <TabsTrigger value={value} className={cn("flex items-center gap-1 sm:gap-2", className)}>
      {isLoading ? (
        <Loader2 className="w-4 h-4 flex-shrink-0 animate-spin" />
      ) : (
        <Icon className="w-4 h-4 flex-shrink-0" />
      )}
      <span className="hidden sm:inline">{fullText}</span>
      <span className="sm:hidden">{shortText}</span>
      {count !== undefined && count > 0 && (
        <Badge variant="secondary" className="ml-1 sm:ml-2 text-xs">
          {count}
        </Badge>
      )}
    </TabsTrigger>
  )
} 