'use client'

import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CreateEventFABProps {
  onClick: () => void
  className?: string
}

export default function CreateEventFAB({
  onClick,
  className
}: CreateEventFABProps) {
  return (
    <div className={cn("fixed bottom-6 right-6 z-50", className)}>
      <Button
        onClick={onClick}
        size="lg"
        className={cn(
          "h-14 w-14 rounded-full shadow-lg transition-all duration-200",
          "bg-green-600 hover:bg-green-700 text-white",
          "hover:scale-110 active:scale-95"
        )}
        title="Create New Event"
      >
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  )
} 