-- Rollback: Change studios.location_match from text[] back to text
-- This reverts the location_match field to support only a single location

-- Step 1: Drop the constraint if it exists
ALTER TABLE studios DROP CONSTRAINT IF EXISTS studios_location_match_not_empty;

-- Step 2: Drop the GIN index if it exists
DROP INDEX IF EXISTS idx_studios_location_match_gin;

-- Step 3: Add a new temporary column with text type
ALTER TABLE studios ADD COLUMN location_match_new text;

-- Step 4: Migrate existing array data back to single strings (take first element)
UPDATE studios 
SET location_match_new = location_match[1] 
WHERE location_match IS NOT NULL AND array_length(location_match, 1) > 0;

-- Step 5: Handle empty arrays
UPDATE studios 
SET location_match_new = NULL 
WHERE location_match IS NULL OR array_length(location_match, 1) = 0;

-- Step 6: Drop the old array column
ALTER TABLE studios DROP COLUMN location_match;

-- Step 7: Rename the new column to the original name
ALTER TABLE studios RENAME COLUMN location_match_new TO location_match; 