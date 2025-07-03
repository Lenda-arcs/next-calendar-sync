-- Hard migration to simplified billing_entities structure
-- This will drop and recreate the table with JSON fields

-- Drop the existing table and recreate with simplified structure
DROP TABLE IF EXISTS billing_entities CASCADE;

CREATE TABLE billing_entities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Basic entity information
  entity_name TEXT NOT NULL,
  entity_type TEXT NOT NULL DEFAULT 'studio' CHECK (entity_type IN ('studio', 'teacher')),
  
  -- Location matching (keep as array, works well)
  location_match TEXT[],
  
  -- Consolidated rate configuration as JSON (nullable for teachers)
  rate_config JSONB,
  
  -- Consolidated recipient information as JSON
  recipient_info JSONB,
  
  -- Consolidated banking/tax information as JSON
  banking_info JSONB,
  
  -- Simple fields
  currency TEXT DEFAULT 'EUR',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for efficient queries
CREATE INDEX idx_billing_entities_user_id ON billing_entities(user_id);
CREATE INDEX idx_billing_entities_entity_type ON billing_entities(entity_type);
CREATE INDEX idx_billing_entities_location_match ON billing_entities USING GIN(location_match);
CREATE INDEX idx_billing_entities_rate_config ON billing_entities USING GIN(rate_config);

-- Add RLS policies
ALTER TABLE billing_entities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own billing entities" ON billing_entities
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own billing entities" ON billing_entities
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own billing entities" ON billing_entities
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own billing entities" ON billing_entities
  FOR DELETE USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_billing_entities_updated_at 
  BEFORE UPDATE ON billing_entities 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some example data to show the JSON structure
INSERT INTO billing_entities (user_id, entity_name, entity_type, location_match, rate_config, recipient_info, banking_info, currency) VALUES
(
  '00000000-0000-0000-0000-000000000000', -- Replace with actual user ID
  'Example Studio',
  'studio',
  ARRAY['Studio A', 'Downtown Location'],
  '{
    "type": "flat",
    "base_rate": 45.00,
    "minimum_threshold": 3,
    "bonus_threshold": 15,
    "bonus_per_student": 3.00,
    "online_bonus_per_student": 2.50,
    "online_bonus_ceiling": 5,
    "max_discount": 10.00
  }',
  '{
    "type": "studio",
    "name": "Example Studio",
    "email": "billing@example-studio.com",
    "phone": "+31 6 12345678",
    "address": "123 Studio Street, Amsterdam"
  }',
  '{
    "iban": "NL91 ABNA 0417 164300",
    "bic": "ABNANL2A",
    "tax_id": "123456789",
    "vat_id": "NL123456789B01"
  }',
  'EUR'
),
(
  '00000000-0000-0000-0000-000000000000', -- Replace with actual user ID
  'Tiered Rate Studio',
  'studio',
  ARRAY['Premium Location'],
  '{
    "type": "tiered",
    "tiers": [
      {"min": 3, "max": 9, "rate": 40.00},
      {"min": 10, "max": 15, "rate": 50.00},
      {"min": 16, "max": null, "rate": 55.00}
    ],
    "online_bonus_per_student": 2.50,
    "online_bonus_ceiling": 5
  }',
  '{
    "type": "studio",
    "name": "Tiered Rate Studio",
    "email": "billing@tiered-studio.com",
    "address": "456 Premium Ave, Amsterdam"
  }',
  null,
  'EUR'
),
(
  '00000000-0000-0000-0000-000000000000', -- Replace with actual user ID
  'External Teacher',
  'teacher',
  ARRAY['Studio A', 'Studio B'],
  null, -- Teachers don't have rate configs, they use the studio's rates
  '{
    "type": "external_teacher",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "phone": "+31 6 87654321",
    "address": "789 Teacher Lane, Amsterdam"
  }',
  '{
    "iban": "NL12 RABO 0123 456789",
    "tax_id": "987654321"
  }',
  'EUR'
);

-- Update events table to reference the new billing_entities structure
-- (The foreign key constraints should still work since we kept the same table name and id field) 