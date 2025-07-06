# Email Invitation System

## Overview

The Email Invitation System provides a user-friendly alternative to OAuth and manual .ics URL entry for calendar integration. Users can generate unique email addresses that they invite to their calendar, enabling automatic detection and syncing of calendar events.

## How It Works

### 1. Email Generation
- Users generate unique email addresses like `user-abc123@yourdomain.com`
- Each email is tied to their user account and expires after 72 hours
- Up to 3 active invitations per user to prevent abuse

### 2. Calendar Invitation Processing
The system handles different types of calendar invitations:

#### Google Calendar Invitations
- Often include direct iCal feed URLs (.ics files)
- Can be automatically processed and synced immediately
- Feed URLs look like: `https://calendar.google.com/calendar/ical/[id]/basic.ics`

#### Outlook/Office 365 Invitations
- May include direct feed URLs or require manual setup
- Feed URLs look like: `https://outlook.live.com/owa/calendar/[id]/calendar.ics`

#### Apple iCloud Calendar Invitations
- **Different approach**: Don't contain direct feed URLs
- Instead contain iCloud sharing URLs like: `https://www.icloud.com/calendar/share/#st=e&i=[encoded_id]`
- These URLs allow users to accept calendar sharing through iCloud's web interface
- **Requires manual setup**: After accepting the invitation, users must manually get the feed URL from their Apple Calendar

### 3. Processing Flow
1. User invites the generated email to their calendar
2. Calendar provider sends invitation email to your domain
3. Email service (SendGrid) forwards the email to the Edge Function
4. Function extracts calendar information:
   - **Direct feed URLs**: Automatically creates calendar feed
   - **iCloud sharing URLs**: Stores sharing URL and marks as requiring manual setup
   - **No URLs found**: Creates placeholder record for manual processing

### 4. Manual Setup for iCloud Calendars
When an iCloud calendar invitation is received:
1. The system extracts the calendar name and iCloud sharing URL
2. Updates the invitation status to "pending" with manual setup instructions
3. User must:
   - Click the iCloud sharing URL to accept the invitation
   - Open Apple Calendar app or iCloud.com
   - Find the shared calendar settings
   - Get the iCal feed URL (usually in calendar settings)
   - Manually add the feed URL to the calendar sync system

## Implementation Components

### Database Schema

```sql
-- Calendar invitations table
CREATE TABLE calendar_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  invitation_email TEXT NOT NULL UNIQUE,
  calendar_provider TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired', 'cancelled')),
  calendar_metadata JSONB DEFAULT '{}',
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
```

### API Endpoints

#### Create Calendar Invitation
```http
POST /api/calendar-invitations
Content-Type: application/json

{
  "expiry_hours": 72,
  "base_domain": "calendarsync.yourdomain.com"
}
```

#### Get User's Invitations
```http
GET /api/calendar-invitations
GET /api/calendar-invitations?active=true
```

#### Manage Individual Invitation
```http
GET /api/calendar-invitations/{id}
PUT /api/calendar-invitations/{id}
DELETE /api/calendar-invitations/{id}
```

### UI Components

- **EmailInvitationSystem**: Main component for managing invitations
- **Enhanced Onboarding**: Includes email invitation as a tab option
- **Real-time Status Updates**: Shows invitation status and expiry

## Setup Instructions

### 1. Database Migration

Run the SQL migration to create the necessary tables and functions:

```bash
# Execute the SQL file in your Supabase database
psql $DATABASE_URL -f sql/add_calendar_invitations_enhanced.sql

# Or run through Supabase dashboard SQL editor
```

**Alternatively, copy the SQL content from `sql/add_calendar_invitations_enhanced.sql` and run it in your Supabase SQL editor.**

### 2. Environment Configuration

Add the following environment variable (optional):

```env
# .env.local
CALENDAR_INVITATION_DOMAIN=calendarsync.yourdomain.com
```

If not set, defaults to `calendarsync.yourdomain.com`.

### 3. Email Processing Setup

**Note**: This implementation provides the foundation for email processing. To complete the system, you'll need to set up:

1. **Email Domain**: Configure your domain to receive emails at `user-*@yourdomain.com`
2. **Email Processing**: Set up webhook or IMAP processing to handle incoming calendar invitations
3. **Calendar Parsing**: Parse incoming calendar invitations to extract feed URLs

Example webhook endpoint structure:
```typescript
// /api/webhooks/calendar-invitation
export async function POST(request: NextRequest) {
  const { invitationEmail, calendarData } = await request.json()
  
  const result = await processIncomingCalendarInvitation(invitationEmail, {
    provider: 'google',
    feedUrl: 'https://calendar.google.com/calendar/ical/...',
    calendarName: 'My Calendar',
    metadata: { /* additional calendar info */ }
  })
  
  return NextResponse.json(result)
}
```

## User Experience

### Enhanced Onboarding Flow

The email invitation system is integrated into the enhanced onboarding with three connection options:

1. **OAuth** (Fast) - One-click Google/Outlook connection
2. **Email** (Easy) - Generate invitation email to invite to calendar
3. **Manual** - Traditional .ics URL entry

### Invitation Management

Users can:
- Create up to 3 active invitations simultaneously
- Copy invitation emails with one click
- View invitation status and expiry times
- Cancel pending invitations
- See invitation history

### Status Tracking

- **Pending**: Invitation created, waiting for calendar invitation
- **Accepted**: Calendar invitation processed and feed created
- **Expired**: Invitation expired (default: 72 hours)
- **Cancelled**: User manually cancelled invitation

## Benefits

### For Users
- **No technical knowledge required** - just invite an email to their calendar
- **Works with any calendar provider** - Google, Outlook, Apple, Yahoo, etc.
- **Familiar process** - everyone knows how to invite someone to a calendar
- **Secure** - invitations expire automatically

### For Developers
- **Reduced OAuth complexity** - no need to maintain multiple OAuth integrations
- **Universal compatibility** - works with any calendar system that supports invitations
- **Existing infrastructure** - leverages current sync system
- **Graceful fallback** - provides alternative when OAuth isn't available

## Security Considerations

- **Automatic expiry**: Invitations expire after 72 hours by default
- **Unique emails**: Each invitation uses a unique, non-guessable email
- **Rate limiting**: Users limited to 3 active invitations
- **RLS policies**: Database access restricted to invitation owners

## Integration with Existing System

The email invitation system integrates seamlessly with existing infrastructure:

- **Same sync functions**: Uses existing `sync-feed` and `sync-all-feeds`
- **Same event processing**: Events go through existing tag matching and studio association
- **Same database tables**: Events stored in existing `events` table
- **Same UI components**: Events displayed using existing components

## Future Enhancements

### Phase 1 Additions
- **Email processing webhook**: Handle incoming calendar invitations automatically
- **Calendar provider detection**: Automatically identify calendar provider from invitation
- **Smart feed URL extraction**: Parse invitation emails to extract .ics URLs

### Phase 2 Enhancements
- **Multiple calendar support**: Handle multiple calendars from single invitation
- **Real-time notifications**: Notify users when invitations are accepted
- **Advanced metadata**: Store additional calendar information from invitations

## Troubleshooting

### Common Issues

1. **Database function not found**
   - Ensure SQL migration was applied correctly
   - Regenerate database types: `npm run generate-types`

2. **Invitation emails not working**
   - Verify domain configuration
   - Check email processing webhook setup

3. **Calendar feeds not created**
   - Ensure `processIncomingCalendarInvitation` function is called
   - Check webhook payload format

### Error Handling

The system includes comprehensive error handling:
- **API errors**: Proper HTTP status codes and error messages
- **Database errors**: Graceful fallbacks and user-friendly messages
- **Expired invitations**: Automatic cleanup and status updates
- **Network errors**: Retry logic and timeout handling

## Example Usage

```typescript
// Create invitation
const invitation = await createCalendarInvitation(userId, {
  expiry_hours: 48,
  base_domain: 'mycalendar.com'
})

// Process incoming invitation (webhook)
await processIncomingCalendarInvitation(
  'user-abc12345@mycalendar.com',
  {
    provider: 'google',
    feedUrl: 'https://calendar.google.com/calendar/ical/...',
    calendarName: 'My Yoga Classes'
  }
)
```

## Supported Calendar Providers

| Provider | Direct Feed URLs | Manual Setup Required | Notes |
|----------|------------------|----------------------|--------|
| Google Calendar | ✅ Yes | ❌ No | Usually includes direct .ics URLs |
| Outlook/Office 365 | ⚠️ Sometimes | ⚠️ Sometimes | Varies by configuration |
| Apple iCloud | ❌ No | ✅ Yes | Uses sharing URLs, requires manual feed URL |
| Other CalDAV | ⚠️ Varies | ⚠️ Varies | Depends on provider implementation |

## Edge Function Details

The `process-calendar-invitation` function handles:
- **MIME message parsing** for raw email content
- **Multi-part email processing** for attachments and HTML content
- **URL extraction** from email content (text, HTML, attachments)
- **Calendar provider detection** based on sender email domain
- **iCloud sharing URL detection** and special handling
- **Database updates** with appropriate metadata and instructions

This documentation provides a complete guide for implementing and using the Email Invitation System as an alternative to OAuth calendar connections. 