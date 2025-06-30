-- Refactor studios table to billing_entities for unified invoice recipient management
-- This keeps the events table lean while providing flexibility for all recipient types

-- Rename the table
ALTER TABLE studios RENAME TO billing_entities;

-- Add recipient type to distinguish between studios, internal teachers, and external teachers
ALTER TABLE billing_entities 
ADD COLUMN recipient_type TEXT DEFAULT 'studio' 
CHECK (recipient_type IN ('studio', 'internal_teacher', 'external_teacher'));

-- Add fields for external teacher recipients (similar to user_invoice_settings)
ALTER TABLE billing_entities ADD COLUMN recipient_user_id UUID REFERENCES users(id); -- For internal teachers
ALTER TABLE billing_entities ADD COLUMN recipient_name TEXT;      -- Override display name if needed
ALTER TABLE billing_entities ADD COLUMN recipient_email TEXT;     -- For external teachers
ALTER TABLE billing_entities ADD COLUMN recipient_phone TEXT;     -- For external teachers  
ALTER TABLE billing_entities ADD COLUMN tax_id TEXT;              -- For external teachers
ALTER TABLE billing_entities ADD COLUMN vat_id TEXT;              -- For external teachers
ALTER TABLE billing_entities ADD COLUMN iban TEXT;                -- For external teachers
ALTER TABLE billing_entities ADD COLUMN bic TEXT;                 -- For external teachers

-- Rename studio_name to entity_name for generalization
ALTER TABLE billing_entities RENAME COLUMN studio_name TO entity_name;

-- Add constraints to ensure data integrity
ALTER TABLE billing_entities ADD CONSTRAINT billing_entities_recipient_check 
  CHECK (
    (recipient_type = 'studio') OR 
    (recipient_type = 'internal_teacher' AND recipient_user_id IS NOT NULL) OR
    (recipient_type = 'external_teacher' AND recipient_name IS NOT NULL AND recipient_email IS NOT NULL)
  );

-- Add indexes for performance
CREATE INDEX idx_billing_entities_recipient_type ON billing_entities(recipient_type);
CREATE INDEX idx_billing_entities_user_id ON billing_entities(user_id);
CREATE INDEX idx_billing_entities_recipient_user_id ON billing_entities(recipient_user_id);
CREATE INDEX idx_billing_entities_location_match ON billing_entities USING GIN(location_match);

-- Update foreign key references
-- Note: We need to update all references from studios to billing_entities

-- Update events table foreign key
ALTER TABLE events DROP CONSTRAINT IF EXISTS events_studio_id_fkey;
ALTER TABLE events ADD CONSTRAINT events_billing_entity_id_fkey 
  FOREIGN KEY (studio_id) REFERENCES billing_entities(id);

-- Update invoices table foreign key  
ALTER TABLE invoices DROP CONSTRAINT IF EXISTS invoices_studio_id_fkey;
ALTER TABLE invoices ADD CONSTRAINT invoices_billing_entity_id_fkey 
  FOREIGN KEY (studio_id) REFERENCES billing_entities(id);

-- Add invoice_type to events and invoices for substitute teaching
ALTER TABLE events ADD COLUMN invoice_type TEXT DEFAULT 'studio_invoice' 
  CHECK (invoice_type IN ('studio_invoice', 'teacher_invoice'));

ALTER TABLE invoices ADD COLUMN invoice_type TEXT DEFAULT 'studio_invoice' 
  CHECK (invoice_type IN ('studio_invoice', 'teacher_invoice'));

-- Add substitute notes to events
ALTER TABLE events ADD COLUMN substitute_notes TEXT;

-- Add indexes for invoice types
CREATE INDEX idx_events_invoice_type ON events(invoice_type);
CREATE INDEX idx_invoices_invoice_type ON invoices(invoice_type);

-- Add comments for documentation
COMMENT ON TABLE billing_entities IS 'Unified table for all invoice recipients: studios, internal teachers, and external teachers';
COMMENT ON COLUMN billing_entities.recipient_type IS 'Type of recipient: studio, internal_teacher, or external_teacher';
COMMENT ON COLUMN billing_entities.recipient_user_id IS 'User ID for internal teacher recipients';
COMMENT ON COLUMN billing_entities.recipient_name IS 'Display name override or external teacher name';
COMMENT ON COLUMN billing_entities.recipient_email IS 'Email for external teacher recipients';
COMMENT ON COLUMN billing_entities.entity_name IS 'Main display name (studio name or teacher name)';
COMMENT ON COLUMN billing_entities.location_match IS 'Location patterns for automatic event matching (studios only)';
COMMENT ON COLUMN billing_entities.base_rate IS 'Base payment rate (studios only)';

-- Note: Applications will need to be updated to reference billing_entities instead of studios 