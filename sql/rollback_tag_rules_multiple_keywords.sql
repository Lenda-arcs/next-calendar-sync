-- Rollback script for tag_rules multiple keywords enhancement
-- This reverts the table to the original single keyword structure

-- Drop triggers and functions
DROP TRIGGER IF EXISTS update_tag_rules_updated_at ON tag_rules;
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Drop indexes
DROP INDEX IF EXISTS idx_tag_rules_keywords;
DROP INDEX IF EXISTS idx_tag_rules_location_keywords;
DROP INDEX IF EXISTS idx_tag_rules_user_id_keywords;

-- Remove constraints
ALTER TABLE tag_rules 
DROP CONSTRAINT IF EXISTS tag_rules_keywords_max_length,
DROP CONSTRAINT IF EXISTS tag_rules_location_keywords_max_length,
DROP CONSTRAINT IF EXISTS tag_rules_at_least_one_keyword;

-- Remove new columns
ALTER TABLE tag_rules 
DROP COLUMN IF EXISTS keywords,
DROP COLUMN IF EXISTS location_keywords,
DROP COLUMN IF EXISTS updated_at;

-- Note: The original keyword column should still exist and contain the data
-- If for some reason it was dropped, you would need to restore from backup 