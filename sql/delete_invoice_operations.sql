-- Delete Invoice Operations
-- This file documents the operations performed when deleting an invoice
-- These operations are executed through the deleteInvoice() function in src/lib/invoice-utils.ts

-- COMPLETE DELETION PROCESS:

-- 1. Fetch invoice details to get PDF info
SELECT pdf_url, user_id FROM invoices WHERE id = $1;

-- 2. Delete PDF files from Supabase Storage (if pdf_url exists)
-- Storage operations performed via Supabase client:
-- - List files in folder: invoices/{user_id}/{invoice_id}/
-- - Delete all files in the folder
-- - This removes: invoice-{number}-{timestamp}.pdf files

-- 3. Unlink all events from the invoice (free them for future invoicing)
UPDATE events 
SET invoice_id = NULL 
WHERE invoice_id = $1; -- $1 is the invoice ID parameter

-- 4. Delete the invoice record
DELETE FROM invoices 
WHERE id = $1; -- $1 is the invoice ID parameter

-- IMPORTANT NOTES:
-- - Storage deletion is done via Supabase Storage API, not SQL
-- - If storage deletion fails, database deletion still proceeds (with warning)
-- - Operations are performed in sequence for data consistency
-- - If event unlinking fails, invoice deletion is NOT attempted

-- COMPLETE CLEANUP ENSURES:
-- ✅ All events become available for future invoicing
-- ✅ The invoice record is completely removed
-- ✅ PDF files are deleted from storage (no orphaned files)
-- ✅ No orphaned references remain in the database
-- ✅ Storage space is properly freed 