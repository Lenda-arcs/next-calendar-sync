'use client'

import { usePrefetchQuery } from './useUnifiedQuery'
import { queryKeys } from '@/lib/query-keys'
import * as dataAccess from '@/lib/server/data-access'
import { useCallback } from 'react'

/**
 * Smart Preloading Hook
 * 
 * Preloads critical data on user intent (hover/focus) for instant navigation
 * Uses page-specific preloading strategies for optimal performance
 */
export function useSmartPreload() {
  const { prefetch } = usePrefetchQuery()

  return {
    // Page-specific preloading functions
    preloadManageEventsData: useCallback((userId: string) => {
      if (!userId) return Promise.resolve()
      
      // Preload what the manage events page needs
      return Promise.all([
        prefetch(
          queryKeys.events.list(userId),
          (supabase) => dataAccess.getUserEvents(supabase, userId),
          2 * 60 * 1000 // 2 minutes cache
        ),
        prefetch(
          queryKeys.tags.allForUser(userId),
          (supabase) => dataAccess.getAllTags(supabase, userId),
          10 * 60 * 1000 // 10 minutes cache
        )
      ])
    }, [prefetch]),

    preloadManageInvoicesData: useCallback((userId: string) => {
      if (!userId) return Promise.resolve()
      
      // Preload what the manage invoices page needs
      return Promise.all([
        prefetch(
          queryKeys.invoices.userInvoices(userId),
          (supabase) => dataAccess.getUserInvoices(supabase, userId),
          5 * 60 * 1000 // 5 minutes cache
        ),
        prefetch(
          queryKeys.invoices.uninvoicedEvents(userId),
          (supabase) => dataAccess.getUninvoicedEvents(supabase, userId),
          3 * 60 * 1000 // 3 minutes cache
        )
      ])
    }, [prefetch]),

    preloadManageTagsData: useCallback((userId: string) => {
      if (!userId) return Promise.resolve()
      
      // Preload what the manage tags page needs
      return prefetch(
        queryKeys.tags.allForUser(userId),
        (supabase) => dataAccess.getAllTags(supabase, userId),
        10 * 60 * 1000 // 10 minutes cache
      )
    }, [prefetch]),

    preloadPublicEvents: useCallback((userId: string, options?: { startDate?: string; endDate?: string }) => {
      if (!userId) return Promise.resolve()
      
      // Preload public events for teacher schedule pages
      return prefetch(
        queryKeys.events.public(userId, options),
        (supabase) => dataAccess.getPublicEvents(supabase, userId, options),
        5 * 60 * 1000 // 5 minutes cache
      )
    }, [prefetch]),

    preloadAdminData: useCallback(() => {
      // Preload admin data for admin pages
      return Promise.all([
        prefetch(
          queryKeys.admin.users(),
          (supabase) => dataAccess.getAllUsers(supabase),
          10 * 60 * 1000 // 10 minutes cache
        ),
        prefetch(
          queryKeys.admin.invitations(),
          (supabase) => dataAccess.getAllInvitations(supabase),
          5 * 60 * 1000 // 5 minutes cache
        )
      ])
    }, [prefetch])
  }
} 