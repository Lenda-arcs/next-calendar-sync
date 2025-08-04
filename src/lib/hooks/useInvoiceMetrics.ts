'use client'

import { useMemo } from 'react'
import { useUninvoicedEvents, useUserInvoices } from './useAppQuery'
import { calculateEventPayout } from '@/lib/invoice-utils'

export interface InvoiceMetrics {
  // Uninvoiced Events
  uninvoicedEventsCount: number
  uninvoicedEventsValue: number
  
  // Total Invoices
  totalInvoicesCount: number
  
  // Pending Revenue (unpaid invoices)
  pendingInvoicesCount: number
  pendingRevenue: number
  
  // This Month Revenue (completed invoices)
  thisMonthRevenue: number
  thisMonthInvoicesCount: number
  
  // Loading states
  isLoading: boolean
  error: string | null
}

/**
 * Hook to calculate overview metrics for invoice management
 * Reuses existing useUninvoicedEvents and useUserInvoices hooks
 */
export function useInvoiceMetrics(userId: string): InvoiceMetrics {
  // Fetch data using existing hooks
  const { 
    data: uninvoicedEvents, 
    isLoading: uninvoicedLoading, 
    error: uninvoicedError 
  } = useUninvoicedEvents(userId)
  
  const { 
    data: userInvoices, 
    isLoading: invoicesLoading, 
    error: invoicesError 
  } = useUserInvoices(userId)

  // Calculate metrics using useMemo for performance
  const metrics = useMemo(() => {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    
    // Default values
    let uninvoicedEventsCount = 0
    let uninvoicedEventsValue = 0
    let totalInvoicesCount = 0
    let pendingInvoicesCount = 0
    let pendingRevenue = 0
    let thisMonthRevenue = 0
    let thisMonthInvoicesCount = 0

    // Calculate uninvoiced events metrics
    if (uninvoicedEvents && uninvoicedEvents.length > 0) {
      uninvoicedEventsCount = uninvoicedEvents.length
      
      // Calculate total value of uninvoiced events
      uninvoicedEventsValue = uninvoicedEvents.reduce((total, event) => {
        try {
          // Use the same calculation logic as invoice creation
          const payout = calculateEventPayout(event)
          return total + payout
        } catch (error) {
          // If calculation fails for an event, skip it but continue
          console.warn('Failed to calculate payout for event:', event.id, error)
          return total
        }
      }, 0)
    }

    // Calculate invoice metrics
    if (userInvoices && userInvoices.length > 0) {
      totalInvoicesCount = userInvoices.length
      
      userInvoices.forEach((invoice) => {
        const invoiceDate = new Date(invoice.created_at)
        const invoiceMonth = invoiceDate.getMonth()
        const invoiceYear = invoiceDate.getFullYear()
        
        // Check if invoice is from current month
        const isCurrentMonth = invoiceMonth === currentMonth && invoiceYear === currentYear
        
        // Calculate pending revenue (unpaid invoices)
        if (invoice.status === 'draft' || invoice.status === 'sent' || invoice.status === 'overdue') {
          pendingInvoicesCount++
          pendingRevenue += invoice.total_amount || 0
        }
        
        // Calculate this month's revenue (paid invoices)
        if (invoice.status === 'paid' && isCurrentMonth) {
          thisMonthRevenue += invoice.total_amount || 0
          thisMonthInvoicesCount++
        }
      })
    }

    return {
      uninvoicedEventsCount,
      uninvoicedEventsValue,
      totalInvoicesCount,
      pendingInvoicesCount,
      pendingRevenue,
      thisMonthRevenue,
      thisMonthInvoicesCount,
      isLoading: uninvoicedLoading || invoicesLoading,
      error: uninvoicedError?.message || invoicesError?.message || null
    }
  }, [uninvoicedEvents, userInvoices, uninvoicedLoading, invoicesLoading, uninvoicedError, invoicesError])

  return metrics
}