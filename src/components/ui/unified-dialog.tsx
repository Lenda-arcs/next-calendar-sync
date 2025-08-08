'use client'

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { XIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface UnifiedDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: React.ReactNode
  description?: React.ReactNode
  children: React.ReactNode
  footer?: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  showCloseButton?: boolean
  className?: string
}

const sizeClasses = {
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-lg',
  lg: 'sm:max-w-2xl',
  xl: 'sm:max-w-4xl',
  full: 'sm:max-w-[95vw]'
}

function UnifiedDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  size = 'md',
  showCloseButton = true,
  className,
}: UnifiedDialogProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        {/* Enhanced Overlay with more transparent background */}
        <DialogPrimitive.Overlay
          className={cn(
            "fixed inset-0 z-50 backdrop-blur-sm bg-black/20",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "duration-300 ease-in-out"
          )}
        />
        
        {/* Dialog Content with responsive bottom-sheet behavior on mobile */}
        <DialogPrimitive.Content
          className={cn(
            // Positioning: bottom sheet on mobile, centered modal on larger screens
            "fixed inset-x-0 bottom-0 z-50 w-full sm:top-1/2 sm:left-1/2 sm:w-full sm:max-w-[calc(100%-2rem)] sm:-translate-x-1/2 sm:-translate-y-1/2",
            // Layout and height: up to 85% screen on mobile, original limit on larger screens
            "flex flex-col max-h-[85vh] sm:max-h-[85vh]",
            // Glassmorphism styling aligned with app theme
            "backdrop-blur-xl bg-white/80 border border-white/50 shadow-2xl",
            // Rounded corners: sheet-style on mobile, full rounded on larger screens
            "rounded-t-2xl sm:rounded-2xl overflow-hidden",
            // Enhanced animations: slide from bottom on mobile, original from top on larger screens
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:slide-out-to-bottom-[2%] data-[state=open]:slide-in-from-bottom-[2%]",
            "sm:data-[state=closed]:slide-out-to-top-[2%] sm:data-[state=open]:slide-in-from-top-[2%]",
            "duration-300 ease-in-out",
            sizeClasses[size],
            className
          )}
        >
          {/* Fixed Header */}
          <div className="flex-shrink-0 relative p-6 pb-4 border-b border-white/30">
            <div className="flex flex-col gap-2">
              <DialogPrimitive.Title className="text-xl font-serif font-semibold leading-none tracking-tight text-foreground">
                {title}
              </DialogPrimitive.Title>
              {description && (
                <DialogPrimitive.Description className="text-sm text-muted-foreground leading-relaxed">
                  {description}
                </DialogPrimitive.Description>
              )}
            </div>
            
            {/* Close Button */}
            {showCloseButton && (
              <DialogPrimitive.Close className="absolute top-4 right-4 rounded-full p-2 opacity-70 ring-offset-background transition-all hover:opacity-100 hover:bg-white/50 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-inset disabled:pointer-events-none">
                <XIcon className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </DialogPrimitive.Close>
            )}
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 py-4">
            <div className="space-y-4">
              {children}
            </div>
          </div>

          {/* Fixed Footer (only shown if footer content provided) */}
          {footer && (
            <div className="flex-shrink-0 p-6 pt-4 border-t border-white/30 bg-white/30">
              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                {footer}
              </div>
            </div>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

export { UnifiedDialog } 