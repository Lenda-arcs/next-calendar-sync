import { QueryClient } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache for 5 minutes by default
      staleTime: 5 * 60 * 1000,
      // Keep data in cache for 10 minutes when unused
      gcTime: 10 * 60 * 1000,
      // Retry failed requests 3 times with exponential backoff
      retry: (failureCount, error: unknown) => {
        // Don't retry on 4xx errors (client errors)
        const errorWithStatus = error as { status?: number }
        if (errorWithStatus?.status && errorWithStatus.status >= 400 && errorWithStatus.status < 500) {
          return false
        }
        return failureCount < 3
      },
      // Refetch on window focus for important data
      refetchOnWindowFocus: true,
      // Don't refetch on reconnect unless data is stale
      refetchOnReconnect: 'always',
      // Don't refetch on mount if data is fresh
      refetchOnMount: true,
    },
    mutations: {
      // Retry mutations once on network errors
      retry: (failureCount, error: unknown) => {
        const errorWithName = error as { name?: string }
        if (errorWithName?.name === 'NetworkError' && failureCount < 1) {
          return true
        }
        return false
      },
    },
  },
})

export { queryClient } 