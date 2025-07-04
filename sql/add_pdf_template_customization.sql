-- Add PDF template customization to user_invoice_settings
-- This allows users to customize their invoice PDF templates

-- Add new columns for PDF template customization
ALTER TABLE user_invoice_settings ADD COLUMN IF NOT EXISTS pdf_template_config JSONB DEFAULT '{
  "template_type": "default",
  "logo_url": null,
  "logo_size": "medium",
  "logo_position": "top-left",
  "header_color": "#000000",
  "accent_color": "#3B82F6",
  "font_family": "helvetica",
  "font_size": "normal",
  "show_company_address": true,
  "show_invoice_notes": true,
  "footer_text": null,
  "date_format": "locale",
  "currency_position": "before",
  "table_style": "default",
  "page_margins": "normal",
  "letterhead_text": null,
  "custom_css": null
}';

-- Add column for storing custom template files if using HTML templates
ALTER TABLE user_invoice_settings ADD COLUMN IF NOT EXISTS custom_template_html TEXT;

-- Add column for template theme selection
ALTER TABLE user_invoice_settings ADD COLUMN IF NOT EXISTS template_theme TEXT DEFAULT 'professional';

-- Comments explaining the PDF template configuration
COMMENT ON COLUMN user_invoice_settings.pdf_template_config IS 'JSON configuration for PDF template customization including colors, fonts, layout preferences, and branding options';

COMMENT ON COLUMN user_invoice_settings.custom_template_html IS 'Custom HTML template for advanced users who want full control over PDF layout';

COMMENT ON COLUMN user_invoice_settings.template_theme IS 'Predefined template theme: professional, modern, minimal, creative, or custom';

-- Create index for faster template queries
CREATE INDEX IF NOT EXISTS idx_user_invoice_settings_template_theme ON user_invoice_settings(template_theme);

-- Add validation constraints using DO blocks to avoid errors if they already exist
DO $$
BEGIN
  -- Add validation constraint for template theme
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'chk_template_theme' 
    AND conrelid = 'user_invoice_settings'::regclass
  ) THEN
    ALTER TABLE user_invoice_settings ADD CONSTRAINT chk_template_theme 
      CHECK (template_theme IN ('professional', 'modern', 'minimal', 'creative', 'custom'));
  END IF;
  
  -- Add validation for PDF template config structure
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'chk_pdf_template_config_structure' 
    AND conrelid = 'user_invoice_settings'::regclass
  ) THEN
    ALTER TABLE user_invoice_settings ADD CONSTRAINT chk_pdf_template_config_structure
      CHECK (
        pdf_template_config IS NULL OR (
          pdf_template_config ? 'template_type' AND
          pdf_template_config ? 'font_family' AND
          pdf_template_config ? 'font_size'
        )
      );
  END IF;
END $$; 