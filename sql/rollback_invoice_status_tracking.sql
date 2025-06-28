-- Rollback invoice status tracking changes
-- This removes the status field, timestamps, and enum type

-- Remove indexes
DROP INDEX IF EXISTS idx_invoices_user_status;
DROP INDEX IF EXISTS idx_invoices_status;

-- Remove columns
ALTER TABLE invoices 
DROP COLUMN IF EXISTS paid_at,
DROP COLUMN IF EXISTS sent_at,
DROP COLUMN IF EXISTS status;

-- Drop enum type
DROP TYPE IF EXISTS invoice_status; 