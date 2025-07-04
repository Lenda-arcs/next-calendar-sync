# Studio System Implementation

## Overview

The studio system enables a multi-studio platform where:
- **Admins/owners** can create and manage studio profiles
- **Teachers** can request to join studios
- **Automatic billing entity creation** when requests are approved
- **Location-based event matching** to studios
- **Rate configuration** inheritance from studios to teacher contracts

## Database Schema

### Studios Table
- **Basic Info**: name, slug, description, address
- **Location Matching**: `location_patterns` array for automatic event matching
- **Contact Info**: email, phone, website, instagram
- **Rate Configuration**: default rates inherited by teachers
- **Admin Controls**: verified, featured flags
- **Permissions**: only admins can create/manage studios

### Studio Teacher Requests Table
- **Request Management**: pending/approved/rejected status
- **Automatic Processing**: creates billing entity when approved
- **Message System**: teachers can include personal messages
- **Admin Tracking**: tracks who processed requests and when

### Billing Entities Integration
- **Studio Relationship**: `studio_id` links teachers to studios
- **Rate Inheritance**: inherits studio's default rate configuration
- **Location Matching**: inherits studio's location patterns

## Implementation Steps

### 1. Run Database Migrations

```bash
# Run the studio table creation
psql -d your_database -f sql/create_studios_table.sql

# Run the teacher requests table creation
psql -d your_database -f sql/create_studio_teacher_requests.sql
```

### 2. Update Database Types

```bash
# Generate new types (requires SUPABASE_PROJECT_ID)
npm run generate-types
```

### 3. Add Studio Management to Admin Navigation

Add a link to `/app/studios` in your admin navigation menu.

### 4. Add Teacher Request Dialog

```tsx
import { StudioRequestDialog } from '@/components/events'

// In your teacher dashboard or profile page
<StudioRequestDialog 
  isOpen={showRequestDialog}
  onClose={() => setShowRequestDialog(false)}
  userId={user.id}
/>
```

## Key Features

### Admin Features
- **Studio Management**: Create, edit, delete studios
- **Teacher Requests**: Approve/reject teacher requests
- **Rate Configuration**: Set default rates for each studio
- **Location Patterns**: Configure automatic event matching
- **Verification**: Mark studios as verified/featured

### Teacher Features
- **Studio Discovery**: Search and browse available studios
- **Request to Join**: Send requests with optional messages
- **Rate Transparency**: See studio's default rate configuration
- **Multiple Studios**: Teachers can work for multiple studios

### Automatic Features
- **Event Matching**: Events automatically match to studios based on location
- **Billing Entity Creation**: Approved requests create teacher-studio contracts
- **Rate Inheritance**: New contracts inherit studio's default rates
- **Location Inheritance**: Contracts inherit studio's location patterns

## Access Control

### Admin/Owner Permissions
- Create/edit/delete studios
- Process teacher requests
- Set studio verification/featured status
- Configure rates and location patterns

### Teacher Permissions
- View verified studios
- Request to join studios
- View their own requests
- Cannot request studios they're already connected to

### Security Features
- Row Level Security (RLS) policies
- Role-based access control
- Unique constraints prevent duplicate requests
- Automatic cleanup of orphaned data

## Auto-matching Logic

1. **Event Import**: When events are imported from calendars
2. **Location Parsing**: System checks event location field
3. **Pattern Matching**: Compares against studio location patterns
4. **Studio Assignment**: Matches event to studio via `studio_id`
5. **Rate Calculation**: Uses studio's rate configuration for payouts

## Rate Configuration

Studios can set default rates that are inherited by teachers:

```json
{
  "type": "flat",
  "base_rate": 45.00,
  "minimum_threshold": 3,
  "bonus_threshold": 15,
  "bonus_per_student": 3.00,
  "online_bonus_per_student": 2.50,
  "online_bonus_ceiling": 5
}
```

## Teacher Request Workflow

1. **Teacher searches** for available studios
2. **Submits request** with optional message
3. **Admin receives** notification of new request
4. **Admin reviews** teacher profile and message
5. **Admin approves** request
6. **System automatically** creates billing entity
7. **Teacher can** start receiving matched events

## Benefits

- **Scalability**: Supports unlimited studios and teachers
- **Automation**: Reduces manual billing entity creation
- **Transparency**: Clear rate structures and requirements
- **Flexibility**: Teachers can work for multiple studios
- **Quality Control**: Admin verification prevents spam

## Next Steps

1. **Run the SQL migrations** to create the necessary tables
2. **Update your database types** using the generate-types script
3. **Add the studio management page** to your admin interface
4. **Add the teacher request dialog** to your teacher interface
5. **Test the workflow** with sample studios and teacher requests

The system is designed to be production-ready with proper security, error handling, and user experience considerations.