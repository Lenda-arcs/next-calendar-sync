-- Add status tracking to invoices table
-- This adds status field with enum values, sent_at and paid_at timestamps

-- Create enum type for invoice status
CREATE TYPE invoice_status AS ENUM ('draft', 'sent', 'paid', 'overdue', 'cancelled');

-- Add status column with default 'draft'
ALTER TABLE invoices 
ADD COLUMN status invoice_status DEFAULT 'draft' NOT NULL;

-- Add timestamps for status changes
ALTER TABLE invoices 
ADD COLUMN sent_at TIMESTAMP WITH TIME ZONE NULL,
ADD COLUMN paid_at TIMESTAMP WITH TIME ZONE NULL;

-- Add index for efficient status queries
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_user_status ON invoices(user_id, status);

-- Add comments for documentation
COMMENT ON COLUMN invoices.status IS 'Current status of the invoice';
COMMENT ON COLUMN invoices.sent_at IS 'Timestamp when invoice was sent to client';
COMMENT ON COLUMN invoices.paid_at IS 'Timestamp when invoice was marked as paid'; 