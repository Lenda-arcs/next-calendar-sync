-- Add proper substitute teacher tracking to events and invoices
-- This separates "rate source" (studio) from "payment recipient" (teacher)

-- Add substitute teacher tracking to events table
ALTER TABLE events ADD COLUMN substitute_teacher_entity_id UUID;

-- Add substitute teacher tracking to invoices table  
ALTER TABLE invoices ADD COLUMN substitute_teacher_entity_id UUID;

-- Add foreign key constraints
ALTER TABLE events ADD CONSTRAINT events_substitute_teacher_fkey 
  FOREIGN KEY (substitute_teacher_entity_id) REFERENCES billing_entities(id);

ALTER TABLE invoices ADD CONSTRAINT invoices_substitute_teacher_fkey 
  FOREIGN KEY (substitute_teacher_entity_id) REFERENCES billing_entities(id);

-- Add indexes for performance
CREATE INDEX idx_events_substitute_teacher ON events(substitute_teacher_entity_id);
CREATE INDEX idx_invoices_substitute_teacher ON invoices(substitute_teacher_entity_id);

-- Add comments for documentation
COMMENT ON COLUMN events.substitute_teacher_entity_id IS 'Teacher entity that gets paid for this event (for substitution scenarios). studio_id remains the rate source.';
COMMENT ON COLUMN invoices.substitute_teacher_entity_id IS 'Teacher entity that receives payment for this invoice (for substitution scenarios). studio_id remains the rate source.';

-- Note: This maintains the principle that:
-- - studio_id = rate calculation source (always the original studio)
-- - substitute_teacher_entity_id = payment recipient (teacher for substitutes)
-- - invoice_type = 'teacher_invoice' marks it as a substitute scenario

-- Update billing_entities comments to clarify entity type distinctions
COMMENT ON COLUMN billing_entities.base_rate IS 'Base payment rate - REQUIRED for studio entities (used for calculations), NULL for teacher entities (rates come from original studio)';
COMMENT ON COLUMN billing_entities.rate_type IS 'Type of rate calculation - REQUIRED for studio entities, NULL for teacher entities';
COMMENT ON COLUMN billing_entities.recipient_type IS 'Entity type: studio (needs rates), internal_teacher/external_teacher (no rates needed - just payment info)';
COMMENT ON COLUMN billing_entities.recipient_name IS 'For teacher entities: display name; For studio entities: NULL (uses entity_name instead)';
COMMENT ON COLUMN billing_entities.recipient_email IS 'For teacher entities: payment email; For studio entities: NULL (uses billing_email instead)';

-- Optional: Add constraint to ensure data integrity (uncomment if desired)
-- ALTER TABLE billing_entities ADD CONSTRAINT teacher_entities_no_rates_check 
-- CHECK (
--   (recipient_type IN ('internal_teacher', 'external_teacher') AND base_rate IS NULL) OR
--   (recipient_type = 'studio' AND base_rate IS NOT NULL)
-- ); 