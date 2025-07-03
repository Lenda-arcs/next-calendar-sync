-- Add enhanced rate calculation fields to billing_entities table
-- This migration adds support for:
-- 1. Online student bonus ceiling (max online students that get bonuses)
-- 2. Tiered rate system (different rates for different student count ranges)
-- 3. More flexible rate calculation options

ALTER TABLE billing_entities 
ADD COLUMN IF NOT EXISTS online_bonus_ceiling INTEGER DEFAULT NULL,
ADD COLUMN IF NOT EXISTS rate_tiers JSONB DEFAULT NULL,
ADD COLUMN IF NOT EXISTS separate_online_studio_calculation BOOLEAN DEFAULT FALSE;

-- Add comments for documentation
COMMENT ON COLUMN billing_entities.online_bonus_ceiling IS 'Maximum number of online students that receive bonuses (ceiling)';
COMMENT ON COLUMN billing_entities.rate_tiers IS 'JSON array of rate tiers: [{"min_students": 3, "max_students": 9, "rate": 40}, {"min_students": 10, "max_students": 15, "rate": 50}]';
COMMENT ON COLUMN billing_entities.separate_online_studio_calculation IS 'Whether to treat online and studio students separately in calculations';

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_billing_entities_rate_tiers ON billing_entities USING gin(rate_tiers);

-- Example of rate_tiers JSON structure:
-- [
--   {"min_students": 3, "max_students": 9, "rate": 40.00, "currency": "EUR"},
--   {"min_students": 10, "max_students": 15, "rate": 50.00, "currency": "EUR"},
--   {"min_students": 16, "max_students": 20, "rate": 55.00, "currency": "EUR"},
--   {"min_students": 21, "max_students": null, "rate": 60.00, "currency": "EUR"}
-- ] 