// Authentication hooks (commented out - file doesn't exist)
// export { useAuthProvider } from './useAuth'

// TanStack Query + Supabase hooks (main data fetching)
export { 
  useSupabaseQuery, 
  useSupabaseMutation, 
  useSupabaseInsert, 
  useSupabaseUpdate, 
  useSupabaseDelete 
} from './useQueryWithSupabase'

// Smart cache management
export { useSmartCache } from './useSmartCache'

// Smart preloading
export { useSmartPreload } from './useSmartPreload'

// Application-specific query hooks
export * from './useAppQuery'

// Specialized domain hooks
export { useAllTags } from './useAllTags'
export { useBillingEntityManagement } from './useBillingEntityManagement'
export { useInvoiceEvents } from './useInvoiceEvents'
export { useKeywordSuggestions } from './useKeywordSuggestions'
export { useTagOperations } from './useTagOperations'
export { useTeacherStudioRelationships } from './useTeacherStudioRelationships'

// Calendar and calendar selection hooks
export * from './useCalendarSelection'
export { useOrigin, useFullUrl } from './useOrigin'

// UI and interaction hooks
export { useOwnerAuth } from './useOwnerAuth'
export { useScheduleExport } from './useScheduleExport'
export { useScrollIntoView } from './useScrollIntoView'
export { useStudioActions } from './useStudioActions'

// Theme and UI hooks (commented out - file doesn't exist)
// export { useTheme } from './useTheme'

// Re-export TanStack Query essentials for convenience
export { useQuery, useMutation, useQueryClient } from '@tanstack/react-query' 