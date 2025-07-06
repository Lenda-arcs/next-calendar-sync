export * from './useCalendarFeeds'
export * from './useCalendarSync'
export * from './useEventExport'
export * from './useNavLoading'
export * from './useOrigin'
export * from './useOwnerAuth'
export * from './useAuthUser'
export * from './useTeacherStudioRelationships'
export * from './useResponsive'
export * from './useScheduleExport'

export * from './useScrollIntoView'
export * from './useSupabaseMutation'
export * from './useSupabaseQuery'
export * from './useTagForm'
export * from './useTagOperations'

// New shared hooks
export * from './useAllTags'
export * from './useEnhancedEvents'
export * from './useInvoiceEvents'
export * from './useStudioActions'

export {
  useSupabaseQuery,
  useSupabaseTable,
  type UseSupabaseQueryOptions,
  type UseSupabaseQueryResult,
} from './useSupabaseQuery'

export {
  useSupabaseMutation,
  useSupabaseInsert,
  useSupabaseUpdate,
  useSupabaseDelete,
  type UseSupabaseMutationOptions,
  type UseSupabaseMutationResult,
} from './useSupabaseMutation'

export { useTagForm } from './useTagForm'
export { useTagOperations } from './useTagOperations'
export { useBillingEntityManagement } from './useBillingEntityManagement'
export { useCalendarSync } from './useCalendarSync'
export { 
  useCalendarFeeds,
  useCalendarFeedActions,
  useCreateCalendarFeed,
  useDeleteCalendarFeed,
  useSyncCalendarFeed
} from './useCalendarFeeds'

export { useOrigin, useFullUrl } from './useOrigin'
export { useScheduleExport } from './useScheduleExport'
export { useOwnerAuth } from './useOwnerAuth'
export { useKeywordSuggestions } from './useKeywordSuggestions'

export * from './useCalendarSelection' 