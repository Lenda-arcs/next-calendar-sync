# User Management System

## Overview

The User Management System provides administrators with comprehensive tools to manage platform users, including the ability to safely remove users and all their associated data from the database. This system ensures complete data cleanup while maintaining referential integrity.

## Key Features

- **👥 User Listing**: View all platform users with detailed information
- **🗑️ Safe User Deletion**: Remove users and all associated data
- **🛡️ Admin Protection**: Prevent deletion of admin accounts
- **📊 User Analytics**: View user statistics and status indicators
- **🔗 Direct Links**: Access user public schedules
- **⚠️ Confirmation Dialogs**: Multi-step confirmation for destructive actions

## User Data Overview

### User Information Display
- **Basic Info**: Name, email, join date
- **Role Badges**: Admin, Moderator, User
- **Status Indicators**: Featured, Public schedule, Calendar feeds count
- **Public Schedule Links**: Direct access to user's public schedule page
- **User ID**: For technical reference

### User Roles & Permissions
- **Admin**: Full platform access (protected from deletion)
- **Moderator**: Limited admin functions
- **User**: Standard user privileges

## User Deletion Process

### Data Removed During User Deletion

When a user is deleted, the system removes **all** associated data in the correct order:

#### 1. **Financial Data**
- `invoices` - All user invoices and billing records
- `billing_entities` - User's billing entity configurations
- `user_invoice_settings` - Invoice preferences and settings

#### 2. **Calendar & Events Data**
- `events` - All user's calendar events
- `calendar_feeds` - Connected calendar feed configurations  
- `oauth_calendar_integrations` - Google/OAuth calendar connections

#### 3. **User Content**
- `tags` - Custom tags and tagging rules
- User-generated content and settings

#### 4. **System References** 
- `user_invitations` - Clears invited_by/used_by references (preserves invitation records)
- `rate_limit_blocks` - Removes any rate limiting records

#### 5. **Authentication**
- `users` - Main user profile record
- `auth.users` - Supabase authentication record

### Implementation Methods

#### **1. Primary Method: SQL Function (Recommended)**
The system now uses a dedicated PostgreSQL function `delete_user_cascade()` for reliable user deletion:

- **Atomic Operations**: All deletion logic happens server-side in a single transaction
- **Reliable**: Either all data is deleted or none (transaction safety)
- **Fast**: Single database call handles all related data
- **Error Handling**: Detailed success/error reporting via JSON response
- **Admin Protection**: Built-in prevention of admin user deletion

```sql
-- Example usage (called automatically by API)
SELECT delete_user_cascade('user-uuid-here');

-- Returns JSON:
{
  "success": true,
  "message": "User and associated data deleted successfully",
  "user_id": "...",
  "user_email": "...",
  "user_name": "...",
  "note": "Auth user must be deleted separately via API"
}
```

#### **2. Fallback Method: Manual SQL Script**
For complex cases or when the API fails, use the manual script:

```bash
# Edit sql/delete_user_cascade.sql with the user ID
npm run sql:file sql/delete_user_cascade.sql
```

### Safety Mechanisms

#### **Admin Protection**
- Admin accounts cannot be deleted (enforced in SQL function)
- API prevents deletion of users with `role = 'admin'`
- Self-deletion prevention (admins can't delete themselves)

#### **Confirmation Process**
1. **Click Delete Button** → Opens confirmation dialog
2. **Review Warning** → Lists all data that will be deleted
3. **Confirm Action** → Requires explicit confirmation
4. **Processing** → Shows deletion in progress (SQL function + auth deletion)
5. **Completion** → Success/failure notification

#### **Error Handling**
- **Database Function**: Atomic transaction handling
- **Auth Deletion**: Separate service role API call for `auth.users`
- **Graceful Fallback**: Detailed error messages for troubleshooting
- **Audit Logging**: All deletion attempts logged

## API Endpoints

### Get All Users
```http
GET /api/admin/users
Authorization: Admin role required

Response:
{
  "success": true,
  "users": [
    {
      "id": "uuid",
      "email": "user@example.com",
      "name": "User Name",
      "role": "user",
      "created_at": "2024-01-01T00:00:00Z",
      "calendar_feed_count": 2,
      "is_featured": false,
      "public_url": "teacher-slug"
    }
  ]
}
```

### Delete User
```http
DELETE /api/admin/users/{userId}
Authorization: Admin role required

Process:
1. Calls delete_user_cascade() SQL function
2. Deletes auth user via service role API
3. Returns combined result

Response:
{
  "success": true,
  "message": "User John Doe has been completely removed"
}

Error Response:
{
  "success": false,
  "error": "Database function error: Cannot delete admin users for security reasons"
}
```

## Manual SQL Deletion

For complex cases or API failures, use the manual SQL script:

### Using the SQL Script

1. **Replace User ID** in `sql/delete_user_cascade.sql`
   ```sql
   target_user_id UUID := 'REPLACE_WITH_ACTUAL_USER_ID';
   ```

2. **Run the Script**
   ```bash
   npm run sql:file sql/delete_user_cascade.sql
   ```

3. **Verify Completion**
   - Check logs for success/failure messages
   - Verify user no longer exists in database

### SQL Script Features
- **Detailed Logging**: Step-by-step deletion progress
- **Error Handling**: Graceful failure with detailed error messages
- **Order Management**: Deletes in correct order to handle constraints
- **Safety Checks**: Verifies user exists before deletion

## Admin Dashboard Integration

### Accessing User Management

The user management interface is integrated into the admin dashboard:

1. **Navigate to**: `/app/admin`
2. **Scroll to**: "User Management" section
3. **View**: Complete user list with actions

### Dashboard Features

#### **User List Display**
- **Card-based Layout**: Each user in individual card
- **Role Indicators**: Visual badges for user roles
- **Status Badges**: Featured, public, calendar counts
- **Quick Actions**: Delete button for non-admin users

#### **User Actions**
- **View Profile**: See detailed user information
- **Visit Schedule**: Direct link to public schedule (if available)
- **Delete User**: Remove user and all data (with confirmation)

#### **Admin Protections**
- Admin users show "Protected" instead of delete button
- Visual crown icon indicates admin status
- Cannot delete self or other admins

## Security Considerations

### Access Control
- **Admin Only**: All user management functions require admin role
- **Authentication**: JWT-based auth verification
- **Authorization**: Role-based access control (RBAC)

### Data Protection
- **Confirmation Required**: Multiple confirmation steps
- **Audit Logging**: Server-side logging of all deletion attempts
- **No Soft Deletes**: Complete data removal for privacy compliance

### Error Prevention
- **Admin Protection**: Cannot delete admin accounts
- **Self-Protection**: Cannot delete own account
- **Validation**: Input validation and sanitization
- **Transaction Safety**: Atomic operations where possible

## Monitoring & Logging

### What Gets Logged
- User deletion attempts (success/failure)
- Admin actions and timestamps
- Error details for failed deletions
- User data statistics before deletion

### Log Locations
- **Server Logs**: API endpoint access and errors
- **Database Logs**: SQL execution and constraint violations
- **Application Logs**: User interface actions and confirmations

## Troubleshooting

### Common Issues

#### **"Failed to delete user data"**
- **Cause**: Foreign key constraint violations
- **Solution**: Use manual SQL script with proper ordering
- **Prevention**: Ensure all related data is identified

#### **"Cannot delete admin users"**
- **Cause**: Attempting to delete user with admin role
- **Solution**: Change user role first, or skip deletion
- **Design**: This is intentional protection

#### **"Auth user deletion failed"**
- **Cause**: Supabase auth.users deletion permissions
- **Impact**: User profile deleted but auth record remains
- **Solution**: Manual cleanup via Supabase dashboard

### Debug Queries

```sql
-- Check user relationships before deletion
SELECT 
  u.id, u.email, u.name, u.role,
  (SELECT COUNT(*) FROM events WHERE user_id = u.id) as events_count,
  (SELECT COUNT(*) FROM calendar_feeds WHERE user_id = u.id) as feeds_count,
  (SELECT COUNT(*) FROM invoices WHERE user_id = u.id) as invoices_count
FROM users u 
WHERE u.id = 'USER_ID_HERE';

-- Verify user deletion
SELECT * FROM users WHERE id = 'USER_ID_HERE';
SELECT * FROM auth.users WHERE id = 'USER_ID_HERE';
```

## Best Practices

### Before Deletion
1. **Backup Important Data**: Export user data if needed
2. **Verify User Identity**: Confirm correct user selected
3. **Check Dependencies**: Review user's data relationships
4. **Notify Stakeholders**: Inform relevant team members

### During Deletion
1. **Monitor Progress**: Watch for error messages
2. **Don't Interrupt**: Allow process to complete
3. **Verify Success**: Confirm completion messages

### After Deletion
1. **Verify Cleanup**: Check database for remaining references
2. **Update Documentation**: Record deletion in admin logs
3. **Monitor Impact**: Watch for any system issues

## Future Enhancements

### Potential Improvements
- **Soft Delete Option**: Mark users as deleted instead of removing
- **Data Export**: Export user data before deletion
- **Bulk Operations**: Delete multiple users at once
- **Audit Trail**: Detailed audit log with admin attribution
- **Recovery System**: Ability to restore recently deleted users
- **Advanced Filtering**: Filter users by role, activity, etc.

### Configuration Options

Consider adding environment variables for:

```env
# User deletion settings
USER_DELETION_ENABLED=true
USER_DELETION_REQUIRE_CONFIRMATION=true
USER_DELETION_LOG_LEVEL=detailed
ADMIN_DELETION_PROTECTION=true
```

## Conclusion

The User Management System provides secure, comprehensive user administration capabilities while maintaining data integrity and providing necessary safety mechanisms. The combination of UI-based and SQL-based deletion options ensures flexibility for different scenarios while protecting against accidental data loss.

For questions or issues, refer to the troubleshooting section or contact the development team. 