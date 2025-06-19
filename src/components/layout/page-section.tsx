import { cn } from '@/lib/utils'
import React from 'react'

interface PageSectionProps {
  children: React.ReactNode
  className?: string
}

export function PageSection({ children, className }: PageSectionProps) {
  return (
    <section className={cn('py-8 sm:py-12', className)}>
      {children}
    </section>
  )
} 