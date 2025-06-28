-- Migration: Add exclude_from_studio_matching field to events table
-- This allows users to mark events that shouldn't be assigned to studios (free events, personal practice, etc.)

-- Add the new boolean field (defaults to false for existing events)
ALTER TABLE events ADD COLUMN exclude_from_studio_matching boolean DEFAULT false;

-- Add a comment to document the field
COMMENT ON COLUMN events.exclude_from_studio_matching IS 'When true, this event will not appear in unmatched events and will not be auto-assigned to studios. Used for free events, personal practice, etc.';

-- Optional: Create an index for better query performance
CREATE INDEX idx_events_exclude_from_studio_matching ON events (exclude_from_studio_matching) WHERE exclude_from_studio_matching = true; 