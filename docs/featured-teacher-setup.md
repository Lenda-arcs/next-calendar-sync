# Featured Teacher System

## Overview

The featured teacher system automatically showcases a different yoga instructor each day on the landing page. It randomly selects from teachers who have:
- A complete public profile (`public_url` and `name` set)
- At least 3 upcoming public events

## Components

### 1. Database Schema
The `users` table already includes an `is_featured` boolean field:
```sql
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;
```

### 2. Edge Function
**Location:** `supabase/functions/set-featured-teacher/`

This Supabase Edge Function:
- Clears all existing featured flags
- Finds eligible teachers (public profile + 3+ upcoming events)
- Randomly selects one teacher
- Sets their `is_featured` flag to `true`

### 3. Server Service
**Location:** `src/lib/server/featured-teacher-service.ts`

Provides:
- `getFeaturedTeacher()` - Fetches current featured teacher and their events
- `setFeaturedTeacher()` - Calls the Edge Function to set a new featured teacher

### 4. UI Components
**Location:** `src/components/landing/FeaturedTeacher.tsx`

Displays:
- Teacher profile (avatar, name, bio, social links)
- Upcoming classes in a clean grid
- Call-to-action to view full schedule

### 5. Landing Page Integration
**Location:** `src/app/page.tsx`

- Replaces example events with real featured teacher data
- Shows skeleton loading while fetching data
- Gracefully handles cases where no featured teacher is available

## Setup Instructions

### 1. Deploy Edge Function (Optional)
```bash
# Deploy the set-featured-teacher function
supabase functions deploy set-featured-teacher
```

### 2. Configure Environment Variables (For Edge Function)

If you want to use the Edge Function, set the `SUPABASE_SERVICE_ROLE_KEY` environment variable:

#### For Local Development (.env.local):
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

#### For Production:
Add the following environment variables in your deployment platform:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`  
- `SUPABASE_SERVICE_ROLE_KEY`

**Where to find your Service Role Key:**
1. Go to your Supabase project dashboard
2. Navigate to Settings → API
3. Copy the `service_role` key (NOT the `anon` key)

### 3. Set Up Cron Job (Optional)
You can set up a daily cron job to automatically rotate featured teachers:

#### Option A: Using Vercel Cron (if deployed on Vercel)
Add to `vercel.json`:
```json
{
  "crons": [{
    "path": "/api/set-featured-teacher",
    "schedule": "0 0 * * *"
  }]
}
```

#### Option B: Using External Cron Service
Set up a daily cron job that calls:
```bash
curl -X POST https://your-domain.com/api/set-featured-teacher
```

### 4. Manual Testing
You can manually trigger featured teacher selection via:

```bash
curl -X POST http://localhost:3000/api/set-featured-teacher
```

## How It Works

1. **Teacher Selection Criteria:**
   - Must have `public_url` set (indicating they've set up their public profile)
   - Must have `name` set
   - Must have at least 3 upcoming public events

2. **Dual Method Approach:**
   - **Primary**: Tries Supabase Edge Function (requires service role key)
   - **Fallback**: Uses direct database access if Edge Function fails
   - **Automatic**: System seamlessly switches between methods

3. **Daily Rotation:**
   - Previous featured teacher flag is cleared
   - New teacher is randomly selected from eligible pool
   - Only one teacher is featured at a time

4. **Landing Page Display:**
   - Shows teacher profile with avatar, bio, and social links
   - Displays up to 6 upcoming classes
   - Provides link to teacher's full schedule page

5. **Fallback Handling:**
   - If no featured teacher is set, shows a placeholder message
   - If featured teacher has insufficient upcoming events, they're not displayed

## Troubleshooting

### No Featured Teacher Displayed
1. **Check if users have public profiles:** Users need both `name` and `public_url` set
2. **Verify upcoming events:** Users need at least 3 upcoming public events
3. **Run the API manually:** Call `/api/set-featured-teacher` to select a teacher

### Edge Function Issues (Optional)
If you're using the Edge Function and see 401 errors:
1. **Check environment variables:** Ensure `SUPABASE_SERVICE_ROLE_KEY` is set
2. **Find service role key:** Go to Supabase Dashboard → Settings → API
3. **Restart application:** After adding environment variables
4. **Use fallback:** The system automatically falls back to direct database method

### Manual Selection
```bash
# This works with or without Edge Function configured
curl -X POST http://localhost:3000/api/set-featured-teacher
```

## Configuration

### Environment Variables (Optional)
Only needed if using Edge Function:
```bash
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Customization
You can customize the selection criteria by modifying:
- Minimum number of events required (currently 3)
- Number of events displayed on landing page (currently 6)
- Selection algorithm (currently random)

## Success Response
```json
{
  "success": true,
  "message": "Successfully set [Teacher Name] as featured teacher (X eligible users)",
  "method": "direct_database",
  "timestamp": "2025-07-24T12:51:44.078Z"
}
``` 