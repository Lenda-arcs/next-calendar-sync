#!/bin/bash

# Test script for enhanced invoice numbering system
echo "🧪 Testing Enhanced Invoice Numbering System"
echo "=============================================="

# Load environment variables
if [ -f .env ]; then
  echo "Loading environment variables from .env file..."
  # Load variables using a more robust method
  while IFS= read -r line; do
    if [[ $line =~ ^[A-Z_]+= ]]; then
      key="${line%%=*}"
      value="${line#*=}"
      # Remove quotes if present
      value="${value%\"}"
      value="${value#\"}"
      export "$key"="$value"
    fi
  done < <(grep -v '^#' .env)
fi

# Check if required environment variables are set
if [ -z "$SUPABASE_PROJECT_ID" ]; then
  echo "❌ Error: SUPABASE_PROJECT_ID environment variable is not set"
  echo "Please make sure you have a .env file with SUPABASE_PROJECT_ID"
  exit 1
fi

if [ -z "$DATABASE_PASSWORD" ]; then
  echo "❌ Error: DATABASE_PASSWORD environment variable is not set"
  echo "Please make sure you have a .env file with DATABASE_PASSWORD"
  exit 1
fi

# Construct DATABASE_URL from Supabase components (same as run-sql.sh)
# URL encode the password to handle special characters
ENCODED_PASSWORD=$(printf '%s' "$DATABASE_PASSWORD" | python3 -c "import sys, urllib.parse; print(urllib.parse.quote(sys.stdin.read().strip()))")
DATABASE_URL="postgresql://postgres:${ENCODED_PASSWORD}@db.${SUPABASE_PROJECT_ID}.supabase.co:5432/postgres"

echo "📊 Testing database function with Supabase connection..."
echo "Project: $SUPABASE_PROJECT_ID"

# Get a real user ID from the database
echo "🔍 Getting a real user ID for testing..."
REAL_USER_ID=$(psql "$DATABASE_URL" -t -c "SELECT id FROM auth.users LIMIT 1;" | xargs)
echo "Using user ID: $REAL_USER_ID"

# Test case 1: Two words - "Roots Yoga" should become "RY"
echo "Test 1: Two words - 'Roots Yoga' (should become RY)"
psql "$DATABASE_URL" -c "
SELECT get_next_invoice_number(
  '$REAL_USER_ID'::UUID, 
  'Roots Yoga', 
  ''
) as invoice_number;
"

# Test case 2: Three words - "Yoga Studio Berlin" should become "YS"
echo "Test 2: Three words - 'Yoga Studio Berlin' (should become YS)"
psql "$DATABASE_URL" -c "
SELECT get_next_invoice_number(
  '$REAL_USER_ID'::UUID, 
  'Yoga Studio Berlin', 
  'INV'
) as invoice_number;
"

# Test case 3: Single word, long - "Wellness" should become "WE"
echo "Test 3: Single word, long - 'Wellness' (should become WE)"
psql "$DATABASE_URL" -c "
SELECT get_next_invoice_number(
  '$REAL_USER_ID'::UUID, 
  'Wellness', 
  'BILL'
) as invoice_number;
"

# Test case 4: Single word, short - "YO" should become "YO"
echo "Test 4: Single word, short - 'YO' (should become YO)"
psql "$DATABASE_URL" -c "
SELECT get_next_invoice_number(
  '$REAL_USER_ID'::UUID, 
  'YO', 
  ''
) as invoice_number;
"

# Test case 5: Single word, very short - "A" should become "AX"
echo "Test 5: Single word, very short - 'A' (should become AX)"
psql "$DATABASE_URL" -c "
SELECT get_next_invoice_number(
  '$REAL_USER_ID'::UUID, 
  'A', 
  ''
) as invoice_number;
"

# Test case 6: Four words - "The Great Yoga Studio" should become "TG"
echo "Test 6: Four words - 'The Great Yoga Studio' (should become TG)"
psql "$DATABASE_URL" -c "
SELECT get_next_invoice_number(
  '$REAL_USER_ID'::UUID, 
  'The Great Yoga Studio', 
  'INV'
) as invoice_number;
"

echo "✅ Enhanced invoice numbering tests completed!"
echo ""
echo "Expected formats:"
echo "- RY-2025-001 (Roots Yoga - first letter of each word)"
echo "- YS-2025-002 (Yoga Studio Berlin - first letter of first two words)"
echo "- WE-2025-003 (Wellness - first two letters of single word)"
echo "- YO-2025-004 (YO - first two letters of short word)"
echo "- AX-2025-005 (A - single letter + X for very short word)"
echo "- TG-2025-006 (The Great Yoga Studio - first letter of first two words)" 