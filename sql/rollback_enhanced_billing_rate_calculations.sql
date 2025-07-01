-- Rollback script for enhanced billing rate calculations
-- This reverts the changes made in enhance_billing_rate_calculations.sql

-- Remove the constraint
ALTER TABLE billing_entities DROP CONSTRAINT IF EXISTS billing_entities_threshold_check;

-- Remove the index
DROP INDEX IF EXISTS idx_billing_entities_thresholds;

-- Remove the new columns
ALTER TABLE billing_entities DROP COLUMN IF EXISTS minimum_student_threshold;
ALTER TABLE billing_entities DROP COLUMN IF EXISTS bonus_student_threshold;
ALTER TABLE billing_entities DROP COLUMN IF EXISTS bonus_per_student;

-- Remove the updated comments (revert to simpler version)
COMMENT ON TABLE billing_entities IS 'Unified table for all invoice recipients: studios, internal teachers, and external teachers';
COMMENT ON COLUMN billing_entities.student_threshold IS 'Minimum students required to avoid penalties'; 