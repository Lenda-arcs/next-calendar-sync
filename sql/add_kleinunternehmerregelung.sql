-- Add Kleinunternehmerregelung field to user_invoice_settings table
-- This field indicates if the user is exempt from VAT/taxes under German small business regulation

ALTER TABLE user_invoice_settings 
ADD COLUMN kleinunternehmerregelung BOOLEAN DEFAULT FALSE;

-- Add comment for documentation
COMMENT ON COLUMN user_invoice_settings.kleinunternehmerregelung IS 'German small business regulation (§19 UStG) - exempt from VAT';

-- Update existing records to explicitly set the default value
UPDATE user_invoice_settings 
SET kleinunternehmerregelung = FALSE 
WHERE kleinunternehmerregelung IS NULL; 