-- Rollback substitute teacher tracking changes
-- This removes the substitute_teacher_entity_id fields

-- Drop indexes
DROP INDEX IF EXISTS idx_events_substitute_teacher;
DROP INDEX IF EXISTS idx_invoices_substitute_teacher;

-- Drop foreign key constraints
ALTER TABLE events DROP CONSTRAINT IF EXISTS events_substitute_teacher_fkey;
ALTER TABLE invoices DROP CONSTRAINT IF EXISTS invoices_substitute_teacher_fkey;

-- Remove fields from events table
ALTER TABLE events DROP COLUMN IF EXISTS substitute_teacher_entity_id;

-- Remove fields from invoices table
ALTER TABLE invoices DROP COLUMN IF EXISTS substitute_teacher_entity_id; 