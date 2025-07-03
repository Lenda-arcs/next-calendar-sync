-- Rollback enhanced rate calculation fields from billing_entities table
-- This script removes the tiered rate system fields added in enhance_tiered_rate_calculations.sql

-- Drop the indexes first
DROP INDEX IF EXISTS idx_billing_entities_rate_tiers;

-- Remove the new columns
ALTER TABLE billing_entities 
DROP COLUMN IF EXISTS online_bonus_ceiling,
DROP COLUMN IF EXISTS rate_tiers,
DROP COLUMN IF EXISTS separate_online_studio_calculation; 