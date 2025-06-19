#!/bin/bash

# Regenerate Supabase types
echo "Generating Supabase types..."

# Check if SUPABASE_PROJECT_ID is set in environment
if [ -z "$SUPABASE_PROJECT_ID" ]; then
  # Check if .env file exists and try to load from there
  if [ -f ".env" ]; then
    echo "Loading SUPABASE_PROJECT_ID from .env file..."
    export $(grep -v '^#' .env | grep SUPABASE_PROJECT_ID)
  fi
  
  # Check again if it's set
  if [ -z "$SUPABASE_PROJECT_ID" ]; then
    echo "SUPABASE_PROJECT_ID not set. Please set it before running this script."
    echo "You can:"
    echo "1. Export it before running: SUPABASE_PROJECT_ID=your_project_id npm run generate-types"
    echo "2. Add it to your .env file: SUPABASE_PROJECT_ID=your_project_id"
    exit 1
  fi
fi

# Generate types to database-generated.types.ts
npx supabase gen types typescript --project-id "$SUPABASE_PROJECT_ID" > database-generated.types.ts

echo "Types generated to database-generated.types.ts"
echo "Your helper types in types/db.ts are preserved." 