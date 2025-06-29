-- Alter tag_rules table to support multiple keywords and location matching
-- This enables more flexible automatic tagging rules

-- First, add new columns
ALTER TABLE tag_rules 
ADD COLUMN keywords TEXT[] DEFAULT '{}',
ADD COLUMN location_keywords TEXT[] DEFAULT '{}',
ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Migrate existing single keyword data to new keywords array
UPDATE tag_rules 
SET keywords = ARRAY[keyword] 
WHERE keyword IS NOT NULL AND keyword != '';

-- Add constraints
ALTER TABLE tag_rules 
ADD CONSTRAINT tag_rules_keywords_max_length CHECK (array_length(keywords, 1) <= 5),
ADD CONSTRAINT tag_rules_location_keywords_max_length CHECK (array_length(location_keywords, 1) <= 5),
ADD CONSTRAINT tag_rules_at_least_one_keyword CHECK (
  (keywords IS NOT NULL AND array_length(keywords, 1) > 0) OR 
  (location_keywords IS NOT NULL AND array_length(location_keywords, 1) > 0)
);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_tag_rules_updated_at 
BEFORE UPDATE ON tag_rules 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tag_rules_keywords ON tag_rules USING GIN (keywords);
CREATE INDEX IF NOT EXISTS idx_tag_rules_location_keywords ON tag_rules USING GIN (location_keywords);
CREATE INDEX IF NOT EXISTS idx_tag_rules_user_id_keywords ON tag_rules (user_id) INCLUDE (keywords, location_keywords);

-- Add comments
COMMENT ON COLUMN tag_rules.keywords IS 'Array of keywords to match in event title/description (max 5)';
COMMENT ON COLUMN tag_rules.location_keywords IS 'Array of keywords to match in event location (max 5)';
COMMENT ON COLUMN tag_rules.updated_at IS 'Timestamp when the rule was last updated'; 