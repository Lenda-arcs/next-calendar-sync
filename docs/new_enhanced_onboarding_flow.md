## Current System Overview

**Database Structure:**
- `calendar_feeds` table stores feed URLs and metadata
- `events` table holds enriched calendar events with tags, billing info, and studio associations
- Smart matching system for tags and studios based on event content/location
- Comprehensive billing and invoicing system integrated with events

**Current Onboarding Flow:**
1. Users manually locate their calendar's .ics feed URL in their email provider settings
2. Copy/paste the URL into your `AddCalendarForm`
3. System validates and syncs events via your `sync-feed` function
4. Events are enriched with tags, studio matching, and billing information

## Enhancement Opportunities

### 1. **Calendar Provider OAuth Integration**
Instead of manual URL sharing, integrate directly with calendar providers:

```typescript
// New table for OAuth tokens
oauth_calendar_integrations: {
  user_id: string
  provider: 'google' | 'outlook' | 'apple' | 'yahoo'
  access_token: string (encrypted)
  refresh_token: string (encrypted)
  calendar_ids: string[] // Multiple calendars from same provider
  scopes: string[]
  expires_at: timestamp
}
```

**Benefits:**
- No manual URL finding
- Real-time sync capabilities
- Access to richer calendar metadata
- Better error handling and token refresh

### 2. **Smart Email Invitation System**
Create a system where users invite your domain to their calendar:

```typescript
// New table for calendar invitations
calendar_invitations: {
  user_id: string
  invitation_email: string // Generated unique email like user123@calendarsync.yourdomain.com
  calendar_provider: string
  status: 'pending' | 'accepted' | 'expired'
  calendar_metadata: Json // Calendar name, description, etc.
  expires_at: timestamp
}
```

**Implementation:**
- Generate unique email addresses for each user
- Users invite this email to their calendar
- System processes incoming calendar invitations
- Automatically extract calendar feed URLs from invitations

### 3. **Calendar Discovery via Email**
For providers that support it, implement email-based calendar discovery:

```typescript
// Enhanced user flow
email_calendar_discovery: {
  user_id: string
  email_address: string
  discovered_calendars: Json[] // List of available calendars
  provider_hints: string[] // google.com, outlook.com, etc.
  last_scanned: timestamp
}
```

## Recommended Implementation Approach
Ran tool

### **Phase 1: OAuth Integration (Recommended Priority)**

Start with Google Calendar and Outlook since they're most common:

1. **Google Calendar API Integration**
   - Implement OAuth 2.0 flow
   - Request `https://www.googleapis.com/auth/calendar.readonly` scope
   - Store encrypted tokens in new `oauth_calendar_integrations` table
   - Create webhook endpoints for real-time updates

2. **Enhanced Sync Process**
   - Modify your existing `sync-feed` function to support OAuth
   - Add token refresh logic
   - Implement incremental sync for better performance

### **Phase 2: Email Invitation System**

Create a user-friendly alternative:

1. **Dynamic Email Generation**
   - Generate unique emails like `user-abc123@calendar.yourdomain.com`
   - Set up email forwarding/processing system
   - Parse incoming calendar invitations

2. **Invitation Processing Pipeline**
   - Extract calendar feed URLs from invitation emails
   - Validate calendar access permissions
   - Automatically create calendar feeds

### **Phase 3: Hybrid Onboarding Experience**

**New Enhanced Onboarding Flow:**

```typescript
// Enhanced onboarding component structure
<CalendarConnectionOptions>
  <OAuthConnection provider="google" />
  <OAuthConnection provider="outlook" />
  <EmailInvitation />
  <ManualFeedEntry /> // Keep as fallback
</CalendarConnectionOptions>
```

**Benefits of this approach:**
- **Reduced friction**: One-click OAuth vs manual URL hunting
- **Better reliability**: OAuth tokens can be refreshed automatically
- **Enhanced features**: Real-time sync, richer metadata access
- **Fallback support**: Manual feed entry for unsupported providers

### **Migration Strategy for Existing Users**

1. Keep existing manual feed URLs functional
2. Add "Upgrade Connection" prompts in the dashboard
3. Gradually migrate users to OAuth when they perform actions
4. Maintain backward compatibility

### **Security Considerations**

- Encrypt all OAuth tokens at rest
- Implement proper token rotation
- Use least-privilege scopes
- Add rate limiting for calendar API calls
- Audit trail for calendar access

Would you like me to start implementing any of these enhancements? I'd recommend beginning with the Google Calendar OAuth integration as it would provide the biggest UX improvement for most users.◊