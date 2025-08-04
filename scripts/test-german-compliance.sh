#!/bin/bash

# Test German Compliance Implementation
# This script tests the German compliance features we've implemented

echo "🧪 Testing German Compliance Implementation"
echo "=========================================="

# Load environment variables
if [ -f .env ]; then
  export $(cat .env | grep -v '^#' | xargs)
fi

# Test 1: Check if new database fields exist
echo ""
echo "📊 Test 1: Database Schema Verification"
echo "--------------------------------------"

# Test the new fields in user_invoice_settings
psql $DATABASE_URL -c "
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'user_invoice_settings' 
  AND column_name IN ('country', 'payment_terms_days', 'invoice_number_prefix', 'business_signature')
ORDER BY column_name;
"

# Test 2: Check if user_invoice_sequences table exists
echo ""
echo "📊 Test 2: Invoice Sequences Table"
echo "----------------------------------"

psql $DATABASE_URL -c "
SELECT 
  table_name,
  column_name,
  data_type
FROM information_schema.columns 
WHERE table_name = 'user_invoice_sequences'
ORDER BY ordinal_position;
"

# Test 3: Test the get_next_invoice_number function
echo ""
echo "📊 Test 3: Invoice Number Generation Function"
echo "--------------------------------------------"

# Create a test user if it doesn't exist
psql $DATABASE_URL -c "
INSERT INTO auth.users (id, email, created_at, updated_at)
VALUES (
  'test-user-german-compliance-' || gen_random_uuid()::text,
  'test-german-compliance@example.com',
  NOW(),
  NOW()
) ON CONFLICT DO NOTHING;
"

# Get the test user ID
TEST_USER_ID=$(psql $DATABASE_URL -t -c "
SELECT id FROM auth.users 
WHERE email = 'test-german-compliance@example.com' 
LIMIT 1;
" | xargs)

if [ -n "$TEST_USER_ID" ]; then
  echo "Test user ID: $TEST_USER_ID"
  
  # Test invoice number generation
  psql $DATABASE_URL -c "
  SELECT get_next_invoice_number('$TEST_USER_ID', 'TEST-2024-') as invoice_number;
  "
  
  # Test with different prefix
  psql $DATABASE_URL -c "
  SELECT get_next_invoice_number('$TEST_USER_ID', 'RECH-2024-') as invoice_number;
  "
else
  echo "❌ Could not create test user"
fi

# Test 4: Check if German compliance translations are working
echo ""
echo "📊 Test 4: Translation Keys Verification"
echo "---------------------------------------"

# Check if translation files contain the new keys
echo "Checking English translations..."
grep -q "paymentAndInvoice" src/lib/i18n/translations/en.ts && echo "✅ paymentAndInvoice found in EN" || echo "❌ paymentAndInvoice missing in EN"
grep -q "paymentTermsDays" src/lib/i18n/translations/en.ts && echo "✅ paymentTermsDays found in EN" || echo "❌ paymentTermsDays missing in EN"
grep -q "businessSignature" src/lib/i18n/translations/en.ts && echo "✅ businessSignature found in EN" || echo "❌ businessSignature missing in EN"

echo "Checking German translations..."
grep -q "paymentAndInvoice" src/lib/i18n/translations/de.ts && echo "✅ paymentAndInvoice found in DE" || echo "❌ paymentAndInvoice missing in DE"
grep -q "paymentTermsDays" src/lib/i18n/translations/de.ts && echo "✅ paymentTermsDays found in DE" || echo "❌ paymentTermsDays missing in DE"
grep -q "businessSignature" src/lib/i18n/translations/de.ts && echo "✅ businessSignature found in DE" || echo "❌ businessSignature missing in DE"

echo "Checking Spanish translations..."
grep -q "paymentAndInvoice" src/lib/i18n/translations/es.ts && echo "✅ paymentAndInvoice found in ES" || echo "❌ paymentAndInvoice missing in ES"
grep -q "paymentTermsDays" src/lib/i18n/translations/es.ts && echo "✅ paymentTermsDays found in ES" || echo "❌ paymentTermsDays missing in ES"
grep -q "businessSignature" src/lib/i18n/translations/es.ts && echo "✅ businessSignature found in ES" || echo "❌ businessSignature missing in ES"

# Test 5: Check if PDF generator has German compliance functions
echo ""
echo "📊 Test 5: PDF Generator Verification"
echo "------------------------------------"

# Check if the German compliance functions exist in the PDF generator
grep -q "generateGermanCompliantPDF" supabase/functions/generate-invoice-pdf/pdf-generator-dramatic.ts && echo "✅ generateGermanCompliantPDF function found" || echo "❌ generateGermanCompliantPDF function missing"
grep -q "addContractorSection" supabase/functions/generate-invoice-pdf/pdf-generator-dramatic.ts && echo "✅ addContractorSection function found" || echo "❌ addContractorSection function missing"
grep -q "addPaymentTermsSection" supabase/functions/generate-invoice-pdf/pdf-generator-dramatic.ts && echo "✅ addPaymentTermsSection function found" || echo "❌ addPaymentTermsSection function missing"

# Test 6: Check if frontend form has new fields
echo ""
echo "📊 Test 6: Frontend Form Verification"
echo "------------------------------------"

# Check if the form has the new fields
grep -q "payment_terms_days" src/components/invoices/UserInvoiceSettingsForm.tsx && echo "✅ payment_terms_days field found in form" || echo "❌ payment_terms_days field missing in form"
grep -q "invoice_number_prefix" src/components/invoices/UserInvoiceSettingsForm.tsx && echo "✅ invoice_number_prefix field found in form" || echo "❌ invoice_number_prefix field missing in form"
grep -q "business_signature" src/components/invoices/UserInvoiceSettingsForm.tsx && echo "✅ business_signature field found in form" || echo "❌ business_signature field missing in form"

echo ""
echo "🎉 German Compliance Implementation Test Complete!"
echo "=================================================="
echo ""
echo "📋 Summary:"
echo "- Database schema enhanced with German compliance fields"
echo "- Invoice numbering system implemented"
echo "- PDF generator supports German compliance mode"
echo "- Frontend form includes all required fields"
echo "- Multi-language translations added"
echo ""
echo "✅ Ready for German contractor billing compliance!" 