-- Rollback foreign key relationships between invoices and billing_entities
-- Use this to revert the fix_billing_entities_foreign_keys.sql migration

-- Remove foreign key constraint for studio_id
ALTER TABLE invoices 
DROP CONSTRAINT IF EXISTS invoices_studio_id_fkey;

-- Remove foreign key constraint for substitute_teacher_entity_id
ALTER TABLE invoices 
DROP CONSTRAINT IF EXISTS invoices_substitute_teacher_entity_id_fkey; 