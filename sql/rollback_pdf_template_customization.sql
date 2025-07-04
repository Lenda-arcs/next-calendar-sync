-- Rollback PDF template customization changes
-- This removes the PDF template customization fields from user_invoice_settings

-- Remove validation constraints
ALTER TABLE user_invoice_settings DROP CONSTRAINT IF EXISTS chk_pdf_template_config_structure;
ALTER TABLE user_invoice_settings DROP CONSTRAINT IF EXISTS chk_template_theme;

-- Remove index
DROP INDEX IF EXISTS idx_user_invoice_settings_template_theme;

-- Remove new columns
ALTER TABLE user_invoice_settings DROP COLUMN IF EXISTS pdf_template_config;
ALTER TABLE user_invoice_settings DROP COLUMN IF EXISTS custom_template_html;
ALTER TABLE user_invoice_settings DROP COLUMN IF EXISTS template_theme; 