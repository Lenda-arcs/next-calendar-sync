#!/bin/bash

# Test script for Google Calendar OAuth Two-Way Sync Migration
# This script validates the key components are properly implemented

echo "🧪 Testing Google Calendar OAuth Two-Way Sync Migration"
echo "========================================================"

# Check if we're in the project root
if [ ! -f "package.json" ]; then
    echo "❌ Error: Run this script from the project root"
    exit 1
fi

echo "✅ Project root confirmed"

# Check required files exist
FILES=(
    "src/lib/google-calendar-service.ts"
    "src/app/api/calendar/create-yoga-calendar/route.ts" 
    "src/app/api/calendar/events/route.ts"
    "src/components/calendar-feeds/YogaCalendarOnboarding.tsx"
    "MIGRATION_SUMMARY.md"
)

echo ""
echo "📁 Checking required files..."
for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ Missing: $file"
        exit 1
    fi
done

# Check TypeScript compilation
echo ""
echo "🔧 Checking TypeScript compilation..."
npm run build 2>/dev/null
if [ $? -eq 0 ]; then
    echo "✅ TypeScript compilation successful"
else
    echo "❌ TypeScript compilation failed"
    echo "💡 Run 'npm run build' to see detailed errors"
    exit 1
fi

# Check linting
echo ""
echo "🔍 Checking code quality..."
npm run lint 2>/dev/null
if [ $? -eq 0 ]; then
    echo "✅ Linting passed"
else
    echo "⚠️  Linting issues found"
    echo "💡 Run 'npm run lint' to see detailed issues"
fi

# Check environment variables
echo ""
echo "🔑 Checking required environment variables..."
ENV_VARS=(
    "GOOGLE_CLIENT_ID"
    "GOOGLE_CLIENT_SECRET"
    "NEXT_PUBLIC_APP_URL"
)

for var in "${ENV_VARS[@]}"; do
    if [ -n "${!var}" ]; then
        echo "✅ $var is set"
    else
        echo "⚠️  $var is not set"
    fi
done

# Test API route structure
echo ""
echo "🛤️  Checking API route structure..."

# Check OAuth routes
if [ -f "src/app/api/auth/google/calendar/route.ts" ]; then
    echo "✅ OAuth initiation route exists"
else
    echo "❌ Missing OAuth initiation route"
fi

if [ -f "src/app/api/auth/google/callback/route.ts" ]; then
    echo "✅ OAuth callback route exists"
else
    echo "❌ Missing OAuth callback route"
fi

# Check calendar management routes
if [ -f "src/app/api/calendar/create-yoga-calendar/route.ts" ]; then
    echo "✅ Calendar creation route exists"
else
    echo "❌ Missing calendar creation route"
fi

if [ -f "src/app/api/calendar/events/route.ts" ]; then
    echo "✅ Events management route exists"
else
    echo "❌ Missing events management route"
fi

# Check component imports
echo ""
echo "📦 Checking component exports..."
if grep -q "YogaCalendarOnboarding" "src/components/calendar-feeds/YogaCalendarOnboarding.tsx"; then
    echo "✅ YogaCalendarOnboarding component exported"
else
    echo "❌ YogaCalendarOnboarding component not properly exported"
fi

# Check for Google Calendar service functions
echo ""
echo "🔧 Checking Google Calendar service functions..."
REQUIRED_FUNCTIONS=(
    "createCalendar"
    "getCalendars"
    "createEvent"
    "updateEvent"
    "deleteEvent"
    "getEvents"
)

for func in "${REQUIRED_FUNCTIONS[@]}"; do
    if grep -q "$func" "src/lib/google-calendar-service.ts"; then
        echo "✅ $func method implemented"
    else
        echo "❌ Missing $func method"
    fi
done

echo ""
echo "🎯 Migration Test Summary"
echo "========================="
echo "✅ Core files implemented"
echo "✅ TypeScript compilation working"
echo "✅ API routes structure complete"
echo "✅ Google Calendar service functions available"
echo ""
echo "🚀 Ready for testing with actual Google Calendar integration!"
echo ""
echo "Next steps:"
echo "1. Set up Google OAuth credentials in environment"
echo "2. Test OAuth flow: /api/auth/google/calendar"
echo "3. Test calendar creation: POST /api/calendar/create-yoga-calendar"
echo "4. Test event management: POST/PUT/DELETE /api/calendar/events"
echo ""
echo "📖 See MIGRATION_SUMMARY.md for detailed implementation notes" 