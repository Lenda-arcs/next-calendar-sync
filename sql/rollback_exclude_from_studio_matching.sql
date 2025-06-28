-- Rollback: Remove exclude_from_studio_matching field from events table
-- This reverts the changes made by add_exclude_from_studio_matching.sql

-- Drop the index if it exists
DROP INDEX IF EXISTS idx_events_exclude_from_studio_matching;

-- Remove the column
ALTER TABLE events DROP COLUMN IF EXISTS exclude_from_studio_matching; 