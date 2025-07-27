# Admin Setup Guide

## Environment Variables Required

For full admin functionality, especially user deletion, you need these environment variables in your `.env` file:

```env
# Required for admin auth user deletion
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here

# Optional - for invitation emails domain
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

## Getting Your Service Role Key

1. **Go to Supabase Dashboard**
   - Navigate to your project
   - Go to **Settings** → **API**

2. **Find Service Role Key**
   - Look for "service_role" in the Project API keys section
   - Copy the key (it starts with `eyJ...`)

3. **Add to Environment**
   ```env
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

⚠️ **Security Warning**: The service role key bypasses RLS. Keep it secure and never expose it client-side.

## Setting Up Admin User

To make yourself an admin:

1. **Via SQL (Recommended)**
   ```sql
   UPDATE users 
   SET role = 'admin' 
   WHERE email = 'your-email@example.com';
   ```

2. **Via Supabase Dashboard**
   - Go to **Table Editor** → **users**
   - Find your user record
   - Set `role` column to `'admin'`

## Testing Admin Functionality

1. **Check Admin Access**
   - Navigate to `/app/admin`
   - You should see the admin dashboard

2. **Test Invitations**
   - Create a test invitation
   - Copy the link and verify it works

3. **Test User Management**
   - View user list in admin dashboard
   - Admin users should show "Protected" 
   - Non-admin users should show delete button

## Troubleshooting

### "User not allowed" / "not_admin" Error

This error occurs when deleting users if the service role key is missing or incorrect:

```
Error [AuthApiError]: User not allowed
status: 403, code: 'not_admin'
```

**Solutions:**
1. Verify `SUPABASE_SERVICE_ROLE_KEY` in your `.env` file
2. Restart your development server after adding the key
3. Check the key format (should start with `eyJ`)
4. Verify the key is the "service_role" not "anon" key

### Manual Auth User Cleanup

If auth users remain after deletion, clean them up manually:

1. **Via Supabase Dashboard**
   - Go to **Authentication** → **Users**
   - Find the user and delete manually

2. **Via SQL (if you have direct access)**
   ```sql
   DELETE FROM auth.users WHERE id = 'user-id-here';
   ```

### Checking User Deletion Success

```sql
-- Verify user is completely removed
SELECT 
  (SELECT COUNT(*) FROM users WHERE id = 'user-id') as users_count,
  (SELECT COUNT(*) FROM auth.users WHERE id = 'user-id') as auth_count,
  (SELECT COUNT(*) FROM events WHERE user_id = 'user-id') as events_count,
  (SELECT COUNT(*) FROM calendar_feeds WHERE user_id = 'user-id') as feeds_count;
```

All counts should be 0 for complete deletion.

## Production Deployment

### Environment Variables

Ensure these are set in your production environment:

```env
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

### Security Considerations

1. **Service Role Key Protection**
   - Never commit to version control
   - Use secure environment variable management
   - Rotate periodically if compromised

2. **Admin User Protection**
   - Limit number of admin users
   - Use strong passwords for admin accounts
   - Enable 2FA where possible

3. **Audit Logging**
   - Monitor admin actions in server logs
   - Set up alerts for user deletions
   - Regular backup of user data

## Common Admin Tasks

### Creating Invitations
```bash
# Via Admin UI
1. Go to /app/admin
2. Scroll to "Teacher Invitation Management"
3. Click "Create Invitation"
4. Fill form and copy link

# Via API (for automation)
curl -X POST /api/invitations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-jwt-token" \
  -d '{"email": "teacher@example.com", "invitedName": "Teacher Name"}'
```

### Deleting Users
```bash
# Via Admin UI (Recommended)
1. Go to /app/admin
2. Scroll to "User Management"
3. Find user and click delete (trash icon)
4. Confirm in dialog

# Via SQL (Manual cleanup)
npm run sql:file sql/delete_user_cascade.sql
# (after editing the user ID in the file)
```

### Monitoring Platform
```sql
-- User statistics
SELECT 
  role,
  COUNT(*) as user_count,
  COUNT(CASE WHEN public_url IS NOT NULL THEN 1 END) as public_profiles,
  COUNT(CASE WHEN is_featured = true THEN 1 END) as featured_users
FROM users 
GROUP BY role;

-- Invitation statistics
SELECT 
  status,
  COUNT(*) as invitation_count,
  AVG(EXTRACT(EPOCH FROM (used_at - created_at))/3600) as avg_hours_to_accept
FROM user_invitations 
GROUP BY status;
``` 