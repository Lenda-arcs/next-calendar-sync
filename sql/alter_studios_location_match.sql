-- Migration: Change studios.location_match from text to text[] to support multiple locations
-- This allows a studio to match against multiple event locations

-- Step 1: Add a new temporary column with array type
ALTER TABLE studios ADD COLUMN location_match_new text[];

-- Step 2: Migrate existing data - wrap single location_match values in arrays
UPDATE studios 
SET location_match_new = ARRAY[location_match] 
WHERE location_match IS NOT NULL;

-- Step 3: Handle any NULL values
UPDATE studios 
SET location_match_new = ARRAY[]::text[] 
WHERE location_match IS NULL;

-- Step 4: Drop the old column
ALTER TABLE studios DROP COLUMN location_match;

-- Step 5: Rename the new column to the original name
ALTER TABLE studios RENAME COLUMN location_match_new TO location_match;

-- Step 6: Add a constraint to ensure the array is not empty
ALTER TABLE studios ADD CONSTRAINT studios_location_match_not_empty 
CHECK (array_length(location_match, 1) > 0);

-- Optional: Add an index on the array column for better query performance
CREATE INDEX idx_studios_location_match_gin ON studios USING GIN (location_match); 