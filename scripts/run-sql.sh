#!/bin/bash

# Helper script to run SQL queries against Supabase database
# Usage: ./scripts/run-sql.sh query "SELECT * FROM users;"
# Usage: ./scripts/run-sql.sh file sql/your-file.sql

# Load environment variables from .env file
if [ -f ".env" ]; then
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

# Check if DATABASE_URL is set, if not try to build it from components
if [ -z "$DATABASE_URL" ]; then
  # Try to build DATABASE_URL from individual components
  if [ -n "$DATABASE_PASSWORD" ] && [ -n "$SUPABASE_PROJECT_ID" ]; then
    echo "Building DATABASE_URL from components..."
    
    # URL encode the password to handle special characters
    ENCODED_PASSWORD=$(printf '%s' "$DATABASE_PASSWORD" | python3 -c "import sys, urllib.parse; print(urllib.parse.quote(sys.stdin.read().strip()))")
    
    DATABASE_URL="postgresql://postgres:${ENCODED_PASSWORD}@db.${SUPABASE_PROJECT_ID}.supabase.co:5432/postgres"
    export DATABASE_URL
    echo "Built DATABASE_URL for project: $SUPABASE_PROJECT_ID"
  else
    echo "DATABASE_URL not set and cannot build from components."
    echo "You can either:"
    echo "1. Set DATABASE_URL directly in .env:"
    echo "   DATABASE_URL=postgresql://postgres:your-password@db.your-project-ref.supabase.co:5432/postgres"
    echo "2. Set individual components in .env:"
    echo "   DATABASE_PASSWORD=your-password"
    echo "   SUPABASE_PROJECT_ID=your-project-ref"
    echo "3. Export DATABASE_URL before running: DATABASE_URL=your_connection_string ./scripts/run-sql.sh"
    echo "4. Get your connection string from your Supabase dashboard > Settings > Database"
    exit 1
  fi
fi

# Check if psql is available
if ! command -v psql &> /dev/null; then
  echo "psql command not found. Please install PostgreSQL client."
  echo "macOS: brew install postgresql"
  echo "Ubuntu/Debian: sudo apt-get install postgresql-client"
  echo "CentOS/RHEL: sudo yum install postgresql"
  exit 1
fi

# Check command type
if [ "$1" = "query" ]; then
  if [ -z "$2" ]; then
    echo "Usage: ./scripts/run-sql.sh query \"SELECT * FROM users;\""
    exit 1
  fi
  
  echo "Executing SQL query..."
  psql "$DATABASE_URL" -c "$2"
  
elif [ "$1" = "file" ]; then
  if [ -z "$2" ]; then
    echo "Usage: ./scripts/run-sql.sh file sql/your-file.sql"
    exit 1
  fi
  
  if [ ! -f "$2" ]; then
    echo "File not found: $2"
    exit 1
  fi
  
  echo "Executing SQL file: $2"
  psql "$DATABASE_URL" -f "$2"
  
else
  echo "SQL Query Runner for Supabase"
  echo ""
  echo "Usage:"
  echo "  ./scripts/run-sql.sh query \"SELECT * FROM users;\""
  echo "  ./scripts/run-sql.sh file sql/your-file.sql"
  echo ""
  echo "Examples:"
  echo "  ./scripts/run-sql.sh query \"SELECT id, email FROM auth.users LIMIT 5;\""
  echo "  ./scripts/run-sql.sh file sql/create_studios_table.sql"
  echo ""
  echo "Environment Setup (choose one):"
  echo "  Option 1 - Direct DATABASE_URL in .env:"
  echo "    DATABASE_URL=postgresql://postgres:your-password@db.your-project-ref.supabase.co:5432/postgres"
  echo ""
  echo "  Option 2 - Separate components in .env:"
  echo "    DATABASE_PASSWORD=your-password"
  echo "    SUPABASE_PROJECT_ID=your-project-ref"
  echo ""
  echo "Available SQL files:"
  ls -la sql/*.sql 2>/dev/null || echo "  No SQL files found in sql/ directory"
fi 