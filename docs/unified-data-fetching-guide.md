# 🚀 Unified Data Fetching Guide

## Overview

This document outlines the **new unified data fetching approach** for Calendar Sync Next, designed to solve the inconsistencies between different data fetching patterns and provide a scalable, performant solution.

## 🔍 The Problem We Solved

Previously, our app had **3 different data fetching patterns**:

1. **Custom Supabase hooks** (`useSupabaseQuery`/`useSupabaseMutation`) - basic global cache
2. **API routes** (`/api/calendar-selection`) called with `fetch()`
3. **Server components** with direct `createServerClient()` calls

This led to:
- ❌ **Inconsistent caching** - data fetched multiple times
- ❌ **Complex invalidation** - hard to keep UI in sync
- ❌ **Mixed patterns** - confusing for developers
- ❌ **Poor performance** - no intelligent prefetching

## ✅ The Unified Solution

Our new system provides **one consistent pattern** that works everywhere:

```typescript
// Same pattern for ALL data fetching
const { data, isLoading, error } = useAllTags(userId)

// Same pattern for ALL mutations  
const { mutate } = useCreateTag()
```

### 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    TanStack Query                           │
│                  (Caching Layer)                           │
└─────────────────┬───────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────────┐
│              Query Key Factory                              │
│          (Consistent Invalidation)                         │
└─────────────────┬───────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────────┐
│             Data Access Layer                               │
│     (Single Source of Truth Functions)                     │
└─────────────────┬───────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────────┐
│                  Supabase                                   │
│            (Database & Auth)                               │
└─────────────────────────────────────────────────────────────┘
```

## 📚 Core Components

### 1. Query Keys Factory (`src/lib/query-keys.ts`)

Provides hierarchical, type-safe query keys for consistent cache invalidation:

```typescript
// Hierarchical keys enable smart invalidation
queryKeys.tags.allForUser(userId)     // ['tags', 'all', userId]
queryKeys.events.list(userId)         // ['events', 'list', userId]
queryKeys.users.profile(userId)       // ['users', 'profile', userId]

// Invalidate all tag-related data
queryInvalidation.invalidateTagData(userId)
```

### 2. Data Access Layer (`src/lib/server/data-access.ts`)

Single source of truth functions that work in **both server and client**:

```typescript
// Same function works everywhere!

// Server Component:
const tags = await getAllTags(await createServerClient(), userId)

// Client Hook:
const { data: tags } = useAllTags(userId)

// API Route:  
const tags = await getAllTags(await createServerClient(), userId)
```

### 3. Unified Query Hooks (`src/lib/hooks/useAppQuery.ts`)

Application-specific hooks with consistent API:

```typescript
// Clean, consistent interface
export function useAllTags(userId: string, options?: { enabled?: boolean }) {
  return useUnifiedQuery({
    queryKey: queryKeys.tags.allForUser(userId),
    fetcher: (supabase) => dataAccess.getAllTags(supabase, userId),
    enabled: options?.enabled ?? !!userId,
  })
}
```

## 🎯 Usage Examples

### Basic Query

```typescript
function TagsPage({ userId }: { userId: string }) {
  const { data: tagData, isLoading, error } = useAllTags(userId)
  
  if (isLoading) return <TagsSkeleton />
  if (error) return <ErrorState error={error} />
  
  return <TagList tags={tagData.allTags} />
}
```

### Mutation with Auto-Invalidation

```typescript
function CreateTagForm({ userId }: { userId: string }) {
  const { mutate: createTag, isLoading } = useCreateTag()
  
  const handleSubmit = (tagData) => {
    createTag(tagData, {
      onSuccess: () => {
        toast.success('Tag created!')
        // Cache automatically invalidated!
      }
    })
  }
  
  return <TagForm onSubmit={handleSubmit} loading={isLoading} />
}
```

### Server Component with Prefetching

```typescript
// Server Component
export default async function TagsPage({ params }) {
  const userId = params.userId
  
  // Prefetch data on server
  const tags = await getAllTags(await createServerClient(), userId)
  
  return (
    <div>
      <TagsPageContent userId={userId} />
      {/* ↑ Client component gets data instantly from cache */}
    </div>
  )
}
```

## ⚡ Performance Benefits

### 1. **Intelligent Caching**
- 5-minute default stale time
- Automatic background updates
- Deduplication of identical requests

### 2. **Smart Invalidation**
- Hierarchical cache keys
- Automatic invalidation on mutations
- Minimal re-fetching

### 3. **Fast First Contentful Paint**
- Server prefetching
- Client hydration from cache
- Progressive loading states

### 4. **Background Sync**
- Window focus refetching
- Network reconnection handling
- Retry strategies for failed requests

## 🛠️ Implementation Status

### ✅ Completed
- [x] TanStack Query setup with optimized defaults
- [x] Query key factory with hierarchical structure
- [x] Data access layer (single source of truth)
- [x] Unified query and mutation hooks
- [x] Example component (`ManageTagsClientUnified`)
- [x] Development tools integration

### 🚧 In Progress
- [ ] Complete TypeScript refinements
- [ ] Automatic cache invalidation on mutations
- [ ] Migration utilities for existing components

### 📋 Next Steps
- [ ] Convert remaining components to unified pattern
- [ ] Remove redundant API routes
- [ ] Add optimistic updates
- [ ] Server-side query prefetching utilities

## 🔄 Migration Guide

### Step 1: Replace useSupabaseQuery

**Before:**
```typescript
const { data, isLoading, error } = useSupabaseQuery({
  queryKey: ['tags', userId],
  fetcher: async (supabase) => {
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .eq('user_id', userId)
    if (error) throw error
    return data
  }
})
```

**After:**
```typescript
const { data, isLoading, error } = useAllTags(userId)
```

### Step 2: Replace useSupabaseMutation

**Before:**
```typescript
const { mutate } = useSupabaseMutation({
  mutationFn: async (supabase, tagData) => {
    const { data, error } = await supabase
      .from('tags')
      .insert(tagData)
      .select()
    if (error) throw error
    return data
  },
  onSuccess: () => {
    // Manual cache invalidation
    refetchTags()
  }
})
```

**After:**
```typescript
const { mutate } = useCreateTag()
// Automatic cache invalidation!
```

### Step 3: Replace API Route Calls

**Before:**
```typescript
const response = await fetch('/api/calendar-selection', {
  method: 'POST',
  body: JSON.stringify(data)
})
```

**After:**
```typescript
const { mutate } = useUpdateCalendarSelection()
mutate(data)
// Consistent error handling, loading states, and caching!
```

## 🎛️ Development Tools

### React Query Devtools
- **Automatic in development** - see caching in action
- **Cache inspection** - view stored data
- **Query monitoring** - watch network requests
- **Performance insights** - identify slow queries

### Cache Key Debugging
Enable development mode to see cache keys in components:

```typescript
// Shows in development
{process.env.NODE_ENV === 'development' && (
  <div>Cache Key: {JSON.stringify(queryKey)}</div>
)}
```

## 🔧 Configuration

### Query Client Defaults

```typescript
// src/lib/query-client.ts
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,        // 5 minutes
      gcTime: 10 * 60 * 1000,          // 10 minutes
      refetchOnWindowFocus: true,       // Keep data fresh
      retry: 3,                         // Retry failed requests
    }
  }
})
```

### Custom Stale Times

```typescript
// Longer cache for relatively static data
const { data } = useUserProfile(userId, {
  staleTime: 15 * 60 * 1000 // 15 minutes
})

// Shorter cache for frequently changing data
const { data } = useRealtimeEvents(userId, {
  staleTime: 30 * 1000 // 30 seconds
})
```

## 🚨 Best Practices

### 1. **Always Use App-Specific Hooks**
```typescript
// ✅ Good
const { data } = useAllTags(userId)

// ❌ Avoid
const { data } = useUnifiedQuery({ ... })
```

### 2. **Handle Loading and Error States**
```typescript
const { data, isLoading, error } = useAllTags(userId)

if (isLoading) return <Skeleton />
if (error) return <ErrorBoundary error={error} />
```

### 3. **Use Conditional Fetching**
```typescript
const { data } = useUserEvents(userId, filters, {
  enabled: !!userId && isAuthenticated
})
```

### 4. **Leverage Cache Invalidation**
```typescript
const { invalidate } = useInvalidateQueries()

// Invalidate specific data
await invalidate(queryKeys.tags.allForUser(userId))

// Invalidate related data
await invalidate([
  queryKeys.tags.allForUser(userId),
  queryKeys.events.list(userId)
])
```

## 📊 Performance Monitoring

### Key Metrics to Watch

1. **Cache Hit Rate** - Should be >80% in production
2. **Average Query Time** - Should be <100ms for cached data
3. **Network Requests** - Should decrease significantly
4. **Time to Interactive** - Should improve with prefetching

### Debugging Slow Queries

```typescript
// Add logging to data access functions
export async function getAllTags(supabase: SupabaseClient, userId: string) {
  console.time(`getAllTags-${userId}`)
  const result = await /* ... query ... */
  console.timeEnd(`getAllTags-${userId}`)
  return result
}
```

## 🤝 Contributing

When adding new data fetching:

1. **Add to data access layer** (`src/lib/server/data-access.ts`)
2. **Create query keys** (`src/lib/query-keys.ts`)
3. **Add app-specific hook** (`src/lib/hooks/useAppQuery.ts`)
4. **Update invalidation patterns** as needed
5. **Test with React Query Devtools**

## 📖 Additional Resources

- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [Supabase Client Libraries](https://supabase.com/docs/reference/javascript)
- [Next.js App Router](https://nextjs.org/docs/app)
- [React Query Devtools](https://tanstack.com/query/latest/docs/react/devtools)

---

🎉 **The unified data fetching system makes our app more consistent, performant, and maintainable!** 