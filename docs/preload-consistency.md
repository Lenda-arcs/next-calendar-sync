# 🔄 Query-Preload Consistency

## The Problem
When preload functions use different query keys than hooks, users see empty states even after data is preloaded.

## The Solution ✅
**Use shared constants** - Both hooks and preload functions import from the same source.

## Example

```tsx
// src/lib/query-constants.ts
export const QUERY_CONFIGS = {
  allTags: {
    queryKey: (userId: string) => queryKeys.tags.allForUser(userId),
    queryFn: (supabase: SupabaseClient, userId: string) => dataAccess.getAllTags(supabase, userId),
    staleTime: 60 * 1000,
  }
}

// ✅ Hook uses constants
const config = QUERY_CONFIGS.allTags
useSupabaseQuery(
  config.queryKey(userId),
  (supabase) => config.queryFn(supabase, userId),
  { staleTime: config.staleTime }
)

// ✅ Preload uses same constants (guaranteed match!)
queryClient.prefetchQuery({
  queryKey: config.queryKey(userId),
  queryFn: () => config.queryFn(supabase, userId),
  staleTime: config.staleTime
})
```

## Quick Check
1. **Hover over nav link** (triggers preload)
2. **Navigate to page**
3. **Expected**: Data appears immediately
4. **If empty state shows**: Check if both use same constants!

## Adding New Queries
1. Add to `query-constants.ts`
2. Use in both hook and preload
3. Impossible to have mismatches!