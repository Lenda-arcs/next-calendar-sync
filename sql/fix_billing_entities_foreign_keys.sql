-- Fix foreign key relationships between invoices and billing_entities
-- This addresses the PostgREST error: "Could not find a relationship between 'invoices' and 'billing_entities'"

-- Add foreign key constraint for studio_id -> billing_entities.id
ALTER TABLE invoices 
ADD CONSTRAINT invoices_studio_id_fkey 
FOREIGN KEY (studio_id) 
REFERENCES billing_entities(id) 
ON DELETE SET NULL;

-- Add foreign key constraint for substitute_teacher_entity_id -> billing_entities.id  
ALTER TABLE invoices 
ADD CONSTRAINT invoices_substitute_teacher_entity_id_fkey 
FOREIGN KEY (substitute_teacher_entity_id) 
REFERENCES billing_entities(id) 
ON DELETE SET NULL;

-- Note: We use ON DELETE SET NULL because if a billing entity is deleted,
-- we want to preserve the invoice record but clear the reference 