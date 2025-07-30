# 🔄 Query Constants Usage

Simple shared constants that prevent hook-preload mismatches.

## The Problem
```tsx
// ❌ Hook and preload use different configurations
// Hook
useSupabaseQuery(['tags', 'all', userId], () => getAllTags(userId))

// Preload (DIFFERENT!)
queryClient.prefetchQuery(['user_tags', userId], () => fetchUserTags())
// Result: Empty state because they don't match!
```

## The Solution
```tsx
// ✅ Both use the same constants
import { QUERY_CONFIGS } from '@/lib/query-constants'

// Hook
const config = QUERY_CONFIGS.allTags
useSupabaseQuery(
  config.queryKey(userId),
  (supabase) => config.queryFn(supabase, userId),
  { staleTime: config.staleTime }
)

// Preload (IDENTICAL!)
queryClient.prefetchQuery({
  queryKey: config.queryKey(userId),
  queryFn: () => config.queryFn(supabase, userId),
  staleTime: config.staleTime
})
```

## Usage in Hooks
```tsx
// src/lib/hooks/useAppQuery.ts
import { QUERY_CONFIGS } from '../query-constants'

export function useAllTags(userId: string) {
  const config = QUERY_CONFIGS.allTags
  return useSupabaseQuery(
    config.queryKey(userId),
    (supabase) => config.queryFn(supabase, userId),
    { staleTime: config.staleTime }
  )
}
```

## Usage in Preload
```tsx
// src/lib/hooks/useSmartPreload.ts  
import { QUERY_CONFIGS } from '../query-constants'

preloadUserTags: (userId: string) => {
  const config = QUERY_CONFIGS.allTags
  return queryClient.prefetchQuery({
    queryKey: config.queryKey(userId),
    queryFn: () => config.queryFn(supabase, userId),
    staleTime: config.staleTime
  })
}
```

## Adding New Queries

1. **Add to constants**:
```tsx
// src/lib/query-constants.ts
export const QUERY_CONFIGS = {
  myNewQuery: {
    queryKey: (userId: string) => ['my-new-query', userId],
    queryFn: (supabase: SupabaseClient, userId: string) => dataAccess.getMyData(supabase, userId),
    staleTime: 60 * 1000,
  }
}
```

2. **Use in hook**:
```tsx
const config = QUERY_CONFIGS.myNewQuery
return useSupabaseQuery(
  config.queryKey(userId),
  (supabase) => config.queryFn(supabase, userId),
  { staleTime: config.staleTime }
)
```

3. **Use in preload**:
```tsx
const config = QUERY_CONFIGS.myNewQuery
return queryClient.prefetchQuery({
  queryKey: config.queryKey(userId),
  queryFn: () => config.queryFn(supabase, userId),
  staleTime: config.staleTime
})
```

## Benefits
- ✅ **Impossible to have mismatches** - Both use same constants
- ✅ **Single source of truth** - One place to change configurations  
- ✅ **Simple and clean** - No complex abstractions
- ✅ **Type-safe** - TypeScript ensures consistency
- ✅ **Easy to maintain** - Clear pattern to follow