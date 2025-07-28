# 🚀 TanStack Query Migration Plan

## 📊 Current State Analysis

### ❌ **What's Wrong:**
- **Custom Cache System**: 169-line `useSupabaseQuery` with manual `Map()` cache
- **No React Query Mutations**: Custom `useSupabaseMutation` doesn't use `@tanstack/react-query`
- **Over-abstraction**: Unnecessary `useUnifiedQuery` and `useUnifiedMutation` wrappers
- **Missing Features**: No optimistic updates, auto-retry, background refetch, offline support

### 📈 **Performance Impact:**
- **Slower Loading**: Manual cache vs React Query's intelligent caching
- **Memory Leaks**: Custom cache doesn't clean up properly
- **Poor UX**: No optimistic updates = slow-feeling app
- **Hard to Debug**: No proper devtools integration

---

## 🎯 Migration Strategy

### **Phase 1: Foundation (2-3 hours)**
**Goal**: Replace core custom hooks with native TanStack Query

1. **Delete Legacy Hooks**
   - ❌ `src/lib/hooks/useSupabaseQuery.ts` (169 lines)
   - ❌ `src/lib/hooks/useSupabaseMutation.ts` (118 lines)
   - ❌ `src/lib/hooks/useUnifiedQuery.ts` (179 lines - simplify)

2. **Create Simple TanStack Query Utilities**
   ```typescript
   // ✅ src/lib/hooks/useQueryWithSupabase.ts
   export function useSupabaseQuery(queryKey, fetcher, options) {
     const supabase = createBrowserClient(...)
     return useQuery({
       queryKey,
       queryFn: () => fetcher(supabase),
       ...options
     })
   }
   ```

3. **Setup Proper Devtools**
   ```typescript
   // ✅ Add to root layout
   import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
   ```

### **Phase 2: Systematic Component Migration (4-6 hours)**
**Goal**: Migrate all 16+ components to native TanStack Query

#### **Priority 1: High-Impact Components (2 hours)**
Components with most user interaction and complex state:

1. **`src/components/dashboard/manage-events/ManageEventsClient.tsx`**
   - ❌ 3x `useSupabaseMutation` → ✅ `useMutation` with optimistic updates
   - **Benefits**: Instant event create/edit/delete
   - **Time**: 45 minutes

2. **`src/components/tags/TagRuleManager.tsx`**
   - ❌ 2x `useSupabaseQuery` + 3x `useSupabaseMutation` → ✅ Native TanStack Query
   - **Benefits**: Smart caching, optimistic tag operations
   - **Time**: 30 minutes

3. **`src/components/dashboard/manage-invoices/ManageInvoicesClient.tsx`**
   - Already partially migrated, complete the work
   - **Benefits**: Optimistic invoice updates
   - **Time**: 15 minutes

#### **Priority 2: Query-Heavy Components (2 hours)**
Components with multiple data fetching needs:

4. **`src/components/studios/StudioManagement.tsx`**
   - ❌ 2x `useSupabaseQuery` → ✅ `useQueries` for parallel loading
   - **Benefits**: Faster page load with parallel queries
   - **Time**: 20 minutes

5. **`src/components/events/SubstituteEventModal.tsx`**
   - ❌ 2x `useSupabaseQuery` + 1x `useSupabaseMutation` → ✅ Native TanStack Query
   - **Benefits**: Smart caching, optimistic updates
   - **Time**: 25 minutes

6. **`src/components/events/PublicEventList.tsx`**
   - ❌ 1x `useSupabaseQuery` → ✅ `useQuery` with background refetch
   - **Benefits**: Always fresh public data
   - **Time**: 15 minutes

7. **`src/components/studios/StudioRequestDialog.tsx`**
   - ❌ 3x `useSupabaseQuery` → ✅ `useQueries` for parallel loading
   - **Benefits**: Much faster dialog opening
   - **Time**: 30 minutes

8. **`src/components/tags/TagLibrary.tsx`**
   - ❌ 2x `useSupabaseQuery` → ✅ Native TanStack Query
   - **Benefits**: Instant tag operations
   - **Time**: 20 minutes

#### **Priority 3: UI Components (1.5 hours)**
Form and UI components with mutations:

9. **`src/components/billing/BillingEntityForm.tsx`**
   - ❌ 2x `useSupabaseMutation` → ✅ `useMutation` with optimistic updates
   - **Time**: 20 minutes

10. **`src/components/invoices/InvoiceCreationModal.tsx`**
    - ❌ 1x `useSupabaseQuery` + 1x `useSupabaseMutation` → ✅ Native TanStack Query
    - **Time**: 15 minutes

11. **`src/components/invoices/InvoiceSettings.tsx`**
    - ❌ 1x `useSupabaseQuery` + 1x `useSupabaseMutation` → ✅ Native TanStack Query
    - **Time**: 15 minutes

12. **`src/components/invoices/UserInvoiceSettingsForm.tsx`**
    - ❌ 1x `useSupabaseMutation` → ✅ `useMutation`
    - **Time**: 10 minutes

13. **`src/components/ui/image-upload.tsx`**
    - ❌ 1x `useSupabaseQuery` + 2x `useSupabaseMutation` → ✅ Native TanStack Query
    - **Time**: 25 minutes

#### **Priority 4: Event Components (1 hour)**
Event-specific components:

14. **`src/components/events/ExcludedEventsSection.tsx`**
    - ❌ 1x `useSupabaseMutation` → ✅ `useMutation`
    - **Time**: 10 minutes

15. **`src/components/events/EventDetailsEditModal.tsx`**
    - ❌ 2x `useSupabaseMutation` → ✅ `useMutation` with optimistic updates
    - **Time**: 20 minutes

16. **`src/components/events/UnmatchedEventsSection.tsx`**
    - ❌ 1x `useSupabaseMutation` → ✅ `useMutation`
    - **Time**: 10 minutes

### **Phase 3: Advanced Features (2-3 hours)**
**Goal**: Leverage TanStack Query's advanced features

#### **3.1 Optimistic Updates Implementation**
```typescript
// ✅ Native optimistic updates
const updateTagMutation = useMutation({
  mutationFn: updateTag,
  onMutate: async (newTag) => {
    await queryClient.cancelQueries({ queryKey: ['tags'] })
    const previousTags = queryClient.getQueryData(['tags'])
    
    queryClient.setQueryData(['tags'], old => 
      old.map(tag => tag.id === newTag.id ? newTag : tag)
    )
    
    return { previousTags }
  },
  onError: (err, newTag, context) => {
    queryClient.setQueryData(['tags'], context.previousTags)
  }
})
```

#### **3.2 Parallel Loading with useQueries**
```typescript
// ✅ Load multiple queries in parallel
const results = useQueries({
  queries: [
    { queryKey: ['tags'], queryFn: fetchTags },
    { queryKey: ['events'], queryFn: fetchEvents },
    { queryKey: ['studios'], queryFn: fetchStudios }
  ]
})
```

#### **3.3 Smart Cache Invalidation**
```typescript
// ✅ Intelligent cache updates
await queryClient.invalidateQueries({
  queryKey: ['events'],
  refetchType: 'active' // Only refetch active queries
})
```

#### **3.4 Background Refetching**
```typescript
// ✅ Always fresh data
useQuery({
  queryKey: ['events'],
  queryFn: fetchEvents,
  staleTime: 30 * 1000, // 30 seconds
  refetchOnWindowFocus: true,
  refetchOnReconnect: true
})
```

---

## 🎁 Expected Benefits

### **Performance Improvements**
- ⚡ **50-70% faster page loads** (parallel queries vs sequential)
- 🚀 **Instant UI updates** (optimistic updates)
- 💾 **Better memory usage** (intelligent cache management)
- 🌐 **Offline resilience** (automatic retry + cache persistence)

### **Developer Experience**
- 🔍 **Proper DevTools** (query inspection, cache visualization)
- 🐛 **Easier Debugging** (query states, error boundaries)
- 📝 **Less Code** (no custom cache logic)
- 🔄 **Auto Cache Sync** (no manual invalidation needed)

### **User Experience**
- ⚡ **Feels Instant** (optimistic updates)
- 🔄 **Always Fresh** (background refetching)
- 🌐 **Works Offline** (smart caching)
- 💪 **Resilient** (auto retry on failures)

---

## 📋 Migration Checklist

### **Phase 1: Foundation**
- [ ] Delete `useSupabaseQuery.ts`
- [ ] Delete `useSupabaseMutation.ts`
- [ ] Simplify `useUnifiedQuery.ts`
- [ ] Add ReactQueryDevtools
- [ ] Create simple query utilities

### **Phase 2: Component Migration**
#### Priority 1 (High-Impact)
- [ ] ManageEventsClient (45min)
- [ ] TagRuleManager (30min)
- [ ] ManageInvoicesClient (15min)

#### Priority 2 (Query-Heavy)
- [ ] StudioManagement (20min)
- [ ] SubstituteEventModal (25min)
- [ ] PublicEventList (15min)
- [ ] StudioRequestDialog (30min)
- [ ] TagLibrary (20min)

#### Priority 3 (UI Components)
- [ ] BillingEntityForm (20min)
- [ ] InvoiceCreationModal (15min)
- [ ] InvoiceSettings (15min)
- [ ] UserInvoiceSettingsForm (10min)
- [ ] ImageUpload (25min)

#### Priority 4 (Event Components)
- [ ] ExcludedEventsSection (10min)
- [ ] EventDetailsEditModal (20min)
- [ ] UnmatchedEventsSection (10min)

### **Phase 3: Advanced Features**
- [ ] Implement optimistic updates for CRUD operations
- [ ] Add parallel loading with useQueries
- [ ] Setup smart cache invalidation
- [ ] Enable background refetching
- [ ] Add error boundaries for queries
- [ ] Setup persistent cache (optional)

---

## ⏱️ **Total Estimated Time: 8-12 hours**
- **Phase 1**: 2-3 hours
- **Phase 2**: 4-6 hours  
- **Phase 3**: 2-3 hours

## 🎯 **Success Metrics**
- **Performance**: Page load times reduced by 50%+
- **UX**: All CRUD operations feel instant (optimistic updates)
- **DX**: DevTools working, easier debugging
- **Reliability**: Automatic retries, offline support
- **Memory**: Reduced memory usage with smart caching

---

## 🚀 **Getting Started**

1. **Backup Current State**: Create branch `tanstack-query-migration`
2. **Start with Phase 1**: Foundation setup
3. **Migrate High-Impact Components First**: Immediate user benefit
4. **Test Each Migration**: Ensure no regressions
5. **Leverage Advanced Features**: Optimize for performance

**Ready to unlock TanStack Query's full potential!** 🎉 