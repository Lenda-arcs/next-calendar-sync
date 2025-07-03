-- Create global Studios table for shared studio information
-- This enables studio public profiles and better teacher collaboration

CREATE TABLE studios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Basic studio information
  name TEXT NOT NULL,
  slug TEXT UNIQUE, -- for public URLs like /schedule/flow-studio-amsterdam
  description TEXT,
  
  -- Location matching for automatic event assignment
  location_patterns TEXT[], -- e.g., ['Flow Studio', 'Flow Amsterdam', 'Vondelpark Location']
  address TEXT,
  
  -- Contact information
  contact_info JSONB, -- { "email": "info@studio.com", "phone": "+31...", "website": "..." }
  
  -- Default rate configuration (teachers can override)
  default_rate_config JSONB, -- Studio's standard teacher rates
  
  -- Public profile settings
  public_profile_enabled BOOLEAN DEFAULT false,
  website_url TEXT,
  instagram_url TEXT,
  profile_images TEXT[], -- studio photos for public profile
  
  -- Business information
  business_hours JSONB, -- { "monday": "6:00-22:00", ... }
  amenities TEXT[], -- ['Heated', 'Props Included', 'Changing Rooms']
  
  -- Administrative
  created_by_user_id UUID REFERENCES users(id) NOT NULL, -- who created this studio
  verified BOOLEAN DEFAULT false, -- admin verification for quality control
  featured BOOLEAN DEFAULT false, -- featured studios on public pages
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for efficient queries
CREATE INDEX idx_studios_slug ON studios(slug);
CREATE INDEX idx_studios_location_patterns ON studios USING GIN(location_patterns);
CREATE INDEX idx_studios_created_by_user ON studios(created_by_user_id);
CREATE INDEX idx_studios_public_profile ON studios(public_profile_enabled);
CREATE INDEX idx_studios_verified ON studios(verified);

-- Add studio reference to billing_entities
ALTER TABLE billing_entities ADD COLUMN studio_id UUID REFERENCES studios(id) ON DELETE SET NULL;
ALTER TABLE billing_entities ADD COLUMN custom_rate_override JSONB; -- override studio's default rates
ALTER TABLE billing_entities ADD COLUMN individual_billing_email TEXT; -- teacher's personal billing email

-- Add index for studio relationship
CREATE INDEX idx_billing_entities_studio_id ON billing_entities(studio_id);

-- RLS policies for studios
ALTER TABLE studios ENABLE ROW LEVEL SECURITY;

-- Anyone can view public studios
CREATE POLICY "Anyone can view public studios" ON studios
  FOR SELECT USING (public_profile_enabled = true);

-- Users can view studios they created or have billing entities for
CREATE POLICY "Users can view their studios" ON studios
  FOR SELECT USING (
    auth.uid() = created_by_user_id OR 
    EXISTS (
      SELECT 1 FROM billing_entities 
      WHERE billing_entities.studio_id = studios.id 
      AND billing_entities.user_id = auth.uid()
    )
  );

-- Users can create new studios
CREATE POLICY "Users can create studios" ON studios
  FOR INSERT WITH CHECK (auth.uid() = created_by_user_id);

-- Studio creators can update their studios
CREATE POLICY "Studio creators can update" ON studios
  FOR UPDATE USING (auth.uid() = created_by_user_id);

-- Studio creators can delete their studios (if no billing entities reference them)
CREATE POLICY "Studio creators can delete" ON studios
  FOR DELETE USING (
    auth.uid() = created_by_user_id AND
    NOT EXISTS (SELECT 1 FROM billing_entities WHERE studio_id = studios.id)
  );

-- Trigger for updated_at
CREATE TRIGGER update_studios_updated_at 
  BEFORE UPDATE ON studios 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some example studios to demonstrate the concept
INSERT INTO studios (created_by_user_id, name, slug, description, location_patterns, default_rate_config, contact_info, public_profile_enabled, address) VALUES
(
  '00000000-0000-0000-0000-000000000000', -- Replace with actual user ID
  'Flow Studio Amsterdam',
  'flow-studio-amsterdam',
  'A vibrant yoga studio in the heart of Amsterdam offering dynamic flow classes for all levels.',
  ARRAY['Flow Studio', 'Flow Amsterdam', 'Vondelpark Location'],
  '{
    "type": "flat",
    "base_rate": 45.00,
    "minimum_threshold": 3,
    "bonus_threshold": 15,
    "bonus_per_student": 3.00,
    "online_bonus_per_student": 2.50,
    "online_bonus_ceiling": 5
  }',
  '{
    "email": "info@flowstudio.amsterdam",
    "phone": "+31 20 123 4567",
    "website": "https://flowstudio.amsterdam"
  }',
  true,
  'Vondelpark 1, 1071 AA Amsterdam, Netherlands'
),
(
  '00000000-0000-0000-0000-000000000000', -- Replace with actual user ID
  'Pure Yoga Rotterdam',
  'pure-yoga-rotterdam',
  'Rotterdam\'s premier destination for authentic yoga practice with experienced international teachers.',
  ARRAY['Pure Yoga', 'Pure Rotterdam', 'Rotterdam Central'],
  '{
    "type": "tiered",
    "tiers": [
      {"min": 3, "max": 9, "rate": 40.00},
      {"min": 10, "max": 15, "rate": 50.00},
      {"min": 16, "max": null, "rate": 55.00}
    ],
    "online_bonus_per_student": 2.50
  }',
  '{
    "email": "hello@pureyoga.nl",
    "phone": "+31 10 987 6543"
  }',
  true,
  'Coolsingel 100, 3012 AG Rotterdam, Netherlands'
); 