'use client'

import { useQueryClient } from '@tanstack/react-query'
// Smart cache management with TanStack Query

/**
 * 🔄 Smart Cache Management System
 * 
 * Demonstrates TanStack Query's powerful cache invalidation patterns
 * Keeps all related data perfectly synchronized across your app
 */
export function useSmartCache() {
  const queryClient = useQueryClient()

  return {
    // 🎯 EVENT OPERATIONS: Smart invalidation for event-related actions
    events: {
      // When creating an event, refresh all event-related data
      onCreate: (userId: string) => {
        return Promise.all([
          queryClient.invalidateQueries({ queryKey: ['events', 'list', userId] }),
          queryClient.invalidateQueries({ queryKey: ['events', 'public', userId] }),
          queryClient.invalidateQueries({ queryKey: ['events', 'activity', userId] }),
          queryClient.invalidateQueries({ queryKey: ['invoices', 'uninvoiced', userId] }), // New events = new uninvoiced events
        ])
      },

      // When updating an event, refresh specific and related data
      onUpdate: (userId: string, eventId: string) => {
        return Promise.all([
          queryClient.invalidateQueries({ queryKey: ['events', 'list', userId] }),
          queryClient.invalidateQueries({ queryKey: ['events', 'detail', eventId] }),
          queryClient.invalidateQueries({ queryKey: ['events', 'public', userId] }),
          queryClient.invalidateQueries({ queryKey: ['invoices', 'uninvoiced', userId] }),
        ])
      },

      // When deleting an event, comprehensive cleanup
      onDelete: (userId: string, eventId: string) => {
        return Promise.all([
          queryClient.invalidateQueries({ queryKey: ['events', 'list', userId] }),
          queryClient.invalidateQueries({ queryKey: ['events', 'public', userId] }),
          queryClient.invalidateQueries({ queryKey: ['invoices', 'uninvoiced', userId] }),
          queryClient.removeQueries({ queryKey: ['events', 'detail', eventId] }), // Remove specific event cache
        ])
      }
    },

    // 🏷️ TAG OPERATIONS: When tags change, update everything that uses them
    tags: {
      onCreate: (userId: string) => {
        return Promise.all([
          queryClient.invalidateQueries({ queryKey: ['tags', 'all', userId] }),
          queryClient.invalidateQueries({ queryKey: ['tags', 'user', userId] }),
          queryClient.invalidateQueries({ queryKey: ['events', 'list', userId] }), // Events display tags
        ])
      },

      onUpdate: (userId: string, tagId: string) => {
        return Promise.all([
          queryClient.invalidateQueries({ queryKey: ['tags', 'all', userId] }),
          queryClient.invalidateQueries({ queryKey: ['tags', 'detail', tagId] }),
          queryClient.invalidateQueries({ queryKey: ['events', 'list', userId] }), // Re-match events with updated tag
          queryClient.invalidateQueries({ queryKey: ['tags', 'rules', userId] }), // Tag rules might be affected
        ])
      },

      onDelete: (userId: string, tagId: string) => {
        return Promise.all([
          queryClient.invalidateQueries({ queryKey: ['tags', 'all', userId] }),
          queryClient.invalidateQueries({ queryKey: ['events', 'list', userId] }), // Remove tag from events
          queryClient.removeQueries({ queryKey: ['tags', 'detail', tagId] }),
        ])
      }
    },

    // 🏢 STUDIO OPERATIONS: Studio changes affect events and invoices
    studios: {
      onCreate: (userId: string) => {
        return Promise.all([
          queryClient.invalidateQueries({ queryKey: ['studios', 'user', userId] }),
          queryClient.invalidateQueries({ queryKey: ['studios', 'all'] }),
          queryClient.invalidateQueries({ queryKey: ['events', 'list', userId] }), // Events might be re-matched to studios
        ])
      },

      onUpdate: (userId: string, studioId: string) => {
        return Promise.all([
          queryClient.invalidateQueries({ queryKey: ['studios', 'user', userId] }),
          queryClient.invalidateQueries({ queryKey: ['studios', 'detail', studioId] }),
          queryClient.invalidateQueries({ queryKey: ['events', 'list', userId] }),
          queryClient.invalidateQueries({ queryKey: ['invoices', 'uninvoiced', userId] }), // Studio rates might change
        ])
      }
    },

    // 📄 INVOICE OPERATIONS: Invoice changes affect events and studios
    invoices: {
      onCreate: (userId: string) => {
        return Promise.all([
          queryClient.invalidateQueries({ queryKey: ['invoices', 'user', userId] }),
          queryClient.invalidateQueries({ queryKey: ['invoices', 'uninvoiced', userId] }),
          queryClient.invalidateQueries({ queryKey: ['events', 'list', userId] }), // Events might show invoice status
        ])
      }
    },

    // 🔄 GLOBAL REFRESH: For when you want to refresh everything
    refreshAll: (userId: string) => {
      return Promise.all([
        queryClient.invalidateQueries({ queryKey: ['events'] }),
        queryClient.invalidateQueries({ queryKey: ['tags'] }),
        queryClient.invalidateQueries({ queryKey: ['studios'] }),
        queryClient.invalidateQueries({ queryKey: ['invoices'] }),
        queryClient.invalidateQueries({ queryKey: ['users', 'profile', userId] }),
      ])
    },

    // 🎯 OPTIMISTIC HELPERS: For instant UI updates
    optimistic: {
      // Add an item optimistically to a list
      addToList: <T>(queryKey: readonly unknown[], newItem: T) => {
        queryClient.setQueryData(queryKey, (old: T[] | undefined) => {
          return old ? [newItem, ...old] : [newItem]
        })
      },

      // Remove an item optimistically from a list
      removeFromList: <T extends { id: string }>(queryKey: readonly unknown[], itemId: string) => {
        queryClient.setQueryData(queryKey, (old: T[] | undefined) => {
          return old ? old.filter(item => item.id !== itemId) : []
        })
      },

      // Update an item optimistically in a list
      updateInList: <T extends { id: string }>(queryKey: readonly unknown[], itemId: string, updates: Partial<T>) => {
        queryClient.setQueryData(queryKey, (old: T[] | undefined) => {
          return old ? old.map(item => 
            item.id === itemId ? { ...item, ...updates } : item
          ) : []
        })
      }
    }
  }
} 