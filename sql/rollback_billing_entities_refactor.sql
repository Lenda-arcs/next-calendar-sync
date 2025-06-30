-- Rollback billing entities refactor
-- This reverts the studios table rename and removes added fields

-- Drop indexes
DROP INDEX IF EXISTS idx_billing_entities_recipient_type;
DROP INDEX IF EXISTS idx_billing_entities_user_id;
DROP INDEX IF EXISTS idx_billing_entities_recipient_user_id;
DROP INDEX IF EXISTS idx_billing_entities_location_match;
DROP INDEX IF EXISTS idx_events_invoice_type;
DROP INDEX IF EXISTS idx_invoices_invoice_type;

-- Remove fields from events table
ALTER TABLE events DROP COLUMN IF EXISTS invoice_type;
ALTER TABLE events DROP COLUMN IF EXISTS substitute_notes;

-- Remove fields from invoices table
ALTER TABLE invoices DROP COLUMN IF EXISTS invoice_type;

-- Drop constraints
ALTER TABLE billing_entities DROP CONSTRAINT IF EXISTS billing_entities_recipient_check;

-- Remove added fields from billing_entities
ALTER TABLE billing_entities DROP COLUMN IF EXISTS recipient_type;
ALTER TABLE billing_entities DROP COLUMN IF EXISTS recipient_user_id;
ALTER TABLE billing_entities DROP COLUMN IF EXISTS recipient_name;
ALTER TABLE billing_entities DROP COLUMN IF EXISTS recipient_email;
ALTER TABLE billing_entities DROP COLUMN IF EXISTS recipient_phone;
ALTER TABLE billing_entities DROP COLUMN IF EXISTS tax_id;
ALTER TABLE billing_entities DROP COLUMN IF EXISTS vat_id;
ALTER TABLE billing_entities DROP COLUMN IF EXISTS iban;
ALTER TABLE billing_entities DROP COLUMN IF EXISTS bic;

-- Rename entity_name back to studio_name
ALTER TABLE billing_entities RENAME COLUMN entity_name TO studio_name;

-- Rename table back to studios
ALTER TABLE billing_entities RENAME TO studios;

-- Restore original foreign key constraints
ALTER TABLE events DROP CONSTRAINT IF EXISTS events_billing_entity_id_fkey;
ALTER TABLE events ADD CONSTRAINT events_studio_id_fkey 
  FOREIGN KEY (studio_id) REFERENCES studios(id);

ALTER TABLE invoices DROP CONSTRAINT IF EXISTS invoices_billing_entity_id_fkey;
ALTER TABLE invoices ADD CONSTRAINT invoices_studio_id_fkey 
  FOREIGN KEY (studio_id) REFERENCES studios(id); 