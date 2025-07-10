# Sync Approach and Filtering Relationship

## Overview

We've simplified the relationship between `sync_approach` and `filtering_enabled` in the `calendar_feeds` table to eliminate redundancy and make the system more intuitive.

## Primary Control: `sync_approach`

The `sync_approach` field is now the **primary control** for how calendar events are synced:

- **`yoga_only`**: Sync all events from the calendar (no filtering applied)
- **`mixed_calendar`**: Use pattern-based filtering to sync only yoga-related events

## Secondary Control: `filtering_enabled` 

The `filtering_enabled` field is now **automatically managed** but can be used for temporary control:

- **Auto-managed**: Database trigger automatically sets this based on `sync_approach`
  - `yoga_only` → `filtering_enabled = false`
  - `mixed_calendar` → `filtering_enabled = true`
  
- **Temporary override**: For `mixed_calendar` feeds, you can temporarily set `filtering_enabled = false` to disable filtering without changing the sync approach

## Database Changes

### Migration Updates
- Migrates existing `filtering_enabled = true` feeds to `sync_approach = 'mixed_calendar'`
- Adds database trigger to keep the fields in sync
- Moves `sync_approach` from users table to calendar_feeds table for per-feed control

### Automatic Sync Logic
```sql
-- Database trigger automatically maintains consistency
IF sync_approach = 'yoga_only' THEN
  filtering_enabled = false
ELSIF sync_approach = 'mixed_calendar' AND (was previously yoga_only) THEN  
  filtering_enabled = true
END IF
```

## Code Changes

### Filter Rules Application
The sync function now checks **both** fields for maximum flexibility:

```typescript
// In supabase/functions/sync-feed/filter-rules.ts
if (syncApproach === 'yoga_only') {
  return allEvents; // Always sync all events
}

if (syncApproach === 'mixed_calendar') {
  if (!filteringEnabled) {
    return allEvents; // Temporarily disabled filtering
  }
  // Apply pattern filtering...
}
```

### Service Functions Updated
- `updateCalendarFeedSyncApproach()` - Now automatically sets `filtering_enabled`
- `saveSyncFilterRules()` - Automatically sets sync approach to `mixed_calendar`
- `updateCalendarFeedFiltering()` - Still available for temporary filtering control

## Benefits

✅ **Simplified mental model**: `sync_approach` is the main control
✅ **Automatic consistency**: Database trigger prevents inconsistent states  
✅ **Flexible control**: Can temporarily disable filtering for mixed calendars
✅ **Per-feed granularity**: Each calendar feed can have its own sync strategy
✅ **Backwards compatibility**: Existing filtering settings are preserved

## Usage Examples

### Setting up a mixed calendar with filtering
```typescript
// User selects 'mixed_calendar' during onboarding
await updateCalendarFeedSyncApproach(feedId, 'mixed_calendar');
// filtering_enabled automatically becomes true

// Save pattern rules  
await saveSyncFilterRules(userId, feedId, rules);
// Automatically confirms sync_approach = 'mixed_calendar'
```

### Temporarily disabling filtering
```typescript
// Temporarily disable filtering without changing sync approach
await updateCalendarFeedFiltering(feedId, false);
// Feed remains mixed_calendar but filtering is disabled

// Re-enable filtering
await updateCalendarFeedFiltering(feedId, true);
```

### Converting to yoga-only calendar
```typescript
// Change to yoga-only approach
await updateCalendarFeedSyncApproach(feedId, 'yoga_only');
// filtering_enabled automatically becomes false via trigger
``` 