# Teacher Invitation System

## Overview

The Teacher Invitation System allows admins to invite teachers to join the closed beta by generating secure invitation tokens. This bypasses the closed beta restriction for invited users only.

## Key Features

- **🔐 Secure Token-based Invitations**: Each invitation has a unique 32-character token
- **⏰ Configurable Expiry**: Set custom expiration periods (1-30 days)
- **📧 Personalized Messages**: Include welcome messages for teachers
- **📊 Status Tracking**: Monitor invitation status (pending, accepted, expired, cancelled)
- **🔗 Easy Sharing**: One-click copy invitation links
- **🛡️ Admin-only Access**: Only admin users can manage invitations

## Database Schema

### `user_invitations` Table

```sql
CREATE TABLE user_invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Invitation details
  email text NOT NULL,
  token text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'pending',
  
  -- Metadata
  invited_by uuid REFERENCES auth.users(id),
  invited_name text,
  personal_message text,
  
  -- Expiration tracking
  expires_at timestamptz NOT NULL,
  used_at timestamptz,
  used_by uuid REFERENCES auth.users(id),
  
  -- Admin notes
  notes text
);
```

## API Endpoints

### Create Invitation
```http
POST /api/invitations
Content-Type: application/json

{
  "email": "teacher@example.com",
  "invitedName": "John Doe", // optional
  "personalMessage": "Welcome to our beta!", // optional
  "expiryDays": 7, // default: 7, max: 30
  "notes": "Internal notes" // optional
}
```

**Response:**
```json
{
  "success": true,
  "invitation": {
    "id": "uuid",
    "email": "teacher@example.com",
    "token": "unique-token",
    "status": "pending",
    "expires_at": "2024-02-01T12:00:00Z"
  },
  "invitationLink": "https://yourdomain.com/auth/register?token=unique-token"
}
```

### List Invitations (Admin)
```http
GET /api/invitations
```

### Cancel Invitation
```http
DELETE /api/invitations/{id}
```

### Validate Token
```http
GET /api/invitations/validate?token=unique-token
```

## Registration Flow

### 1. Standard Registration (Closed Beta)
When users visit `/auth/register` without a token:
- Shows "Closed Beta" message
- Provides link to request beta access
- Redirects existing users to sign-in

### 2. Invitation-based Registration
When users visit `/auth/register?token=unique-token`:
- Validates the invitation token
- Shows personalized welcome message
- Displays the registration form
- Marks invitation as "accepted" upon successful registration

## Admin Interface

### Accessing Invitation Management

The invitation management interface is available to admin users through the `InvitationManagement` component:

```tsx
import { InvitationManagement } from '@/components/admin/InvitationManagement'

// In your admin dashboard
<InvitationManagement />
```

### Features

- **Create Invitations**: Form with email, name, message, expiry settings
- **View All Invitations**: List with status badges and timestamps
- **Copy Links**: One-click invitation link copying
- **Cancel Invitations**: Cancel pending invitations
- **Status Tracking**: Visual status indicators

## Security Features

### Row Level Security (RLS)

```sql
-- Admins can manage all invitations
CREATE POLICY "Admins can manage invitations" ON user_invitations
  FOR ALL USING (
    auth.uid() IN (SELECT id FROM users WHERE role = 'admin')
  );

-- Users can view their own invitations
CREATE POLICY "Users can view own invitations" ON user_invitations
  FOR SELECT USING (email = auth.email());

-- Anonymous token validation
CREATE POLICY "Anonymous can validate tokens" ON user_invitations
  FOR SELECT USING (true);
```

### Token Generation

- 32-character random tokens using `[A-Za-z0-9]`
- Cryptographically secure random generation
- Unique constraint prevents duplicates

### Validation Checks

- Email format validation
- Duplicate email protection
- Existing user check
- Token expiration validation
- Status verification

## Usage Examples

### Creating an Invitation

```typescript
// Admin creates invitation
const response = await fetch('/api/invitations', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'teacher@example.com',
    invitedName: 'Jane Smith',
    personalMessage: 'Welcome to our yoga platform beta!',
    expiryDays: 14,
    notes: 'Recommended by Sarah'
  })
})

const result = await response.json()
console.log('Invitation link:', result.invitationLink)
```

### Teacher Registration

```bash
# Teacher receives link via email
https://avara.studio/auth/register?token=abc123xyz789...

# System validates token and shows registration form
# Upon successful registration, invitation marked as "accepted"
```

## Error Handling

### Common Error Responses

- **400 Bad Request**: Invalid email, duplicate invitation, validation errors
- **401 Unauthorized**: Not authenticated
- **403 Forbidden**: Not admin user
- **404 Not Found**: Invitation not found
- **500 Internal Server Error**: Server issues

### Validation Errors

- Email already has pending invitation
- User already exists with that email
- Invalid token format
- Expired invitation
- Already used invitation

## Monitoring and Analytics

### Invitation Metrics

Track invitation effectiveness:

```sql
-- Invitation success rate
SELECT 
  COUNT(*) as total_invitations,
  COUNT(CASE WHEN status = 'accepted' THEN 1 END) as accepted,
  ROUND(
    COUNT(CASE WHEN status = 'accepted' THEN 1 END) * 100.0 / COUNT(*), 
    2
  ) as success_rate
FROM user_invitations;

-- Time to acceptance
SELECT 
  email,
  used_at - created_at as time_to_accept
FROM user_invitations 
WHERE status = 'accepted';
```

## Integration with Email Services

### Manual Email Sending

Copy the invitation link and send via your preferred email client:

```
Subject: You're invited to join avara. beta!

Hi [Teacher Name],

You've been invited to join the avara. beta program! Click the link below to create your account:

[Invitation Link]

This invitation expires in [X] days.

Best regards,
The avara. team
```

### Automated Email Integration (Optional)

For automated emails, integrate with services like:
- SendGrid
- Mailgun  
- Resend
- AWS SES

```typescript
// Example with SendGrid
import sgMail from '@sendgrid/mail'

const sendInvitationEmail = async (invitation: Invitation) => {
  const msg = {
    to: invitation.email,
    from: 'hello@avara.studio',
    subject: 'Welcome to avara. beta!',
    html: `
      <h1>You're invited!</h1>
      <p>Hi ${invitation.invited_name},</p>
      <p>${invitation.personal_message}</p>
      <a href="${baseUrl}/auth/register?token=${invitation.token}">
        Join Now
      </a>
    `
  }
  
  await sgMail.send(msg)
}
```

## Troubleshooting

### Common Issues

**Token Validation Fails**
- Check token in URL parameters
- Verify invitation hasn't expired
- Ensure invitation status is "pending"

**Registration Form Not Showing**
- Verify token is valid and not expired
- Check browser developer tools for JavaScript errors
- Ensure API endpoints are accessible

**Admin Can't Create Invitations**
- Verify user has `role = 'admin'` in database
- Check API authentication
- Review RLS policies

### Debug Queries

```sql
-- Check invitation status
SELECT * FROM user_invitations WHERE email = 'teacher@example.com';

-- View expired invitations
SELECT * FROM user_invitations WHERE expires_at < NOW();

-- Check admin users
SELECT id, email, role FROM users WHERE role = 'admin';
```

## Future Enhancements

### Potential Improvements

- **Bulk Invitations**: Upload CSV for multiple invitations
- **Email Templates**: Customizable invitation email templates
- **Usage Analytics**: Detailed invitation funnel metrics
- **Invitation Limits**: Rate limiting per admin user
- **Auto-expiry Cleanup**: Background job to clean expired invitations
- **Invitation Reminders**: Automated follow-up emails

### Configuration Options

Consider adding environment variables for:

```env
# Invitation settings
INVITATION_DEFAULT_EXPIRY_DAYS=7
INVITATION_MAX_EXPIRY_DAYS=30
INVITATION_RATE_LIMIT_PER_HOUR=10
INVITATION_AUTO_CLEANUP_ENABLED=true
```

## Conclusion

The Teacher Invitation System provides a secure, user-friendly way to onboard teachers during the closed beta phase. It maintains security while providing a smooth experience for both admins and invited teachers.

For questions or issues, contact the development team or check the troubleshooting section above. 