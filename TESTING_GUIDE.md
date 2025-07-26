# 🧪 Calendar Import Feature - Testing Guide

## 🚀 Quick Start Testing

### Prerequisites
1. **Environment Variables**: Set up Google OAuth credentials
2. **Database**: Ensure Supabase is configured
3. **Development Server**: Next.js dev server running

## 📝 Environment Setup

### 1. Google OAuth Configuration

Create/update your `.env.local` file:

```bash
# Google OAuth (required for testing)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase (existing)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 2. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **Google Calendar API**
4. Create OAuth 2.0 credentials:
   - **Application type**: Web application
   - **Authorized redirect URIs**: `http://localhost:3000/api/auth/google/callback`
   - **Authorized JavaScript origins**: `http://localhost:3000`

### 3. Start Development Server

```bash
npm run dev
```

## 🧪 Testing Scenarios

### Scenario 1: Complete New User Flow

**Objective**: Test the full onboarding experience

**Steps**:
1. **Create New Account**
   ```
   http://localhost:3000/auth/register
   ```
   - Register with a new email
   - Verify email if required

2. **Navigate to Calendar Setup**
   ```
   http://localhost:3000/app/add-calendar
   ```
   - Should see the new yoga calendar onboarding

3. **Connect Google Calendar**
   - Click "Connect Google Calendar"
   - Complete OAuth flow
   - Should redirect back with success

4. **Create Yoga Calendar**
   - Click "Create Yoga Calendar"
   - Wait for calendar creation
   - Should see import options

5. **Test Google Calendar Import**
   - Click "Choose Google Calendar"
   - Select a calendar with events
   - Review event preview
   - Select/deselect events
   - Complete import

**Expected Results**:
- ✅ Dedicated yoga calendar created in Google Calendar
- ✅ Selected events imported with proper metadata
- ✅ Events visible in dashboard
- ✅ Tags and categorization applied

### Scenario 2: ICS File Import

**Objective**: Test importing from .ics files

**Test Data Preparation**:
1. **Export from Google Calendar**:
   - Go to Google Calendar → Settings → Import & Export
   - Export any calendar as .ics file

2. **Export from Apple Calendar** (if available):
   - File → Export → Export...

**Testing Steps**:
1. **Start Import Flow**
   - Go to onboarding or `/app/add-calendar`
   - Choose "Upload ICS File"

2. **Upload Test File**
   - Select your .ics file
   - Wait for parsing

3. **Review Preview**
   - Check event detection accuracy
   - Verify yoga vs. private classification
   - Test search and filtering

4. **Import Events**
   - Select events to import
   - Complete import process

**Expected Results**:
- ✅ ICS file parsed correctly
- ✅ Events displayed in preview
- ✅ Smart categorization working
- ✅ Import completes successfully

### Scenario 3: Edge Cases & Error Handling

**Test Cases**:

1. **Empty Calendar**
   - Try importing from calendar with no events
   - Should show "No events found" message

2. **Large Calendar**
   - Import from calendar with 100+ events
   - Test performance and pagination

3. **Invalid ICS File**
   - Upload a non-ICS file
   - Upload corrupted ICS content
   - Should show appropriate error messages

4. **Network Issues**
   - Test with slow/interrupted connection
   - Check retry mechanisms

5. **Permission Issues**
   - Test with limited calendar permissions
   - Should handle gracefully

## 🔍 Manual Testing Checklist

### OAuth Flow
- [ ] OAuth initiation works
- [ ] Google permission screen appears
- [ ] Callback handling successful
- [ ] Token storage in database
- [ ] Token refresh functionality

### Calendar Creation
- [ ] Yoga calendar created in Google
- [ ] Correct calendar name format
- [ ] Calendar permissions set properly
- [ ] Database records updated

### Import Functionality
- [ ] Available calendars fetched
- [ ] Event preview loads correctly
- [ ] Smart categorization accurate
- [ ] Search functionality works
- [ ] Filtering options functional
- [ ] Selection/deselection works
- [ ] Import process completes
- [ ] Events appear in Google Calendar
- [ ] Metadata properly stored

### UI/UX Testing
- [ ] Loading states display properly
- [ ] Error messages clear and helpful
- [ ] Navigation flow intuitive
- [ ] Mobile responsiveness
- [ ] Success feedback appropriate

## 🛠️ Developer Testing Tools

### 1. API Testing with cURL

**Get Available Calendars**:
```bash
curl -X GET "http://localhost:3000/api/calendar/import" \
  -H "Cookie: your-session-cookie"
```

**Preview Google Calendar Events**:
```bash
curl -X POST "http://localhost:3000/api/calendar/import" \
  -H "Content-Type: application/json" \
  -H "Cookie: your-session-cookie" \
  -d '{
    "action": "preview",
    "source": "google",
    "sourceCalendarId": "calendar-id-here"
  }'
```

**Test ICS Import**:
```bash
curl -X POST "http://localhost:3000/api/calendar/import" \
  -H "Content-Type: application/json" \
  -H "Cookie: your-session-cookie" \
  -d '{
    "action": "preview",
    "source": "ics",
    "icsContent": "BEGIN:VCALENDAR\nVERSION:2.0..."
  }'
```

### 2. Database Inspection

Check the following tables after testing:

```sql
-- OAuth integrations
SELECT * FROM oauth_calendar_integrations WHERE user_id = 'your-user-id';

-- Calendar feeds
SELECT * FROM calendar_feeds WHERE user_id = 'your-user-id';

-- Imported events
SELECT * FROM events WHERE user_id = 'your-user-id' 
  AND uid LIKE '%' 
  ORDER BY created_at DESC;
```

### 3. Browser DevTools

**Network Tab**:
- Monitor API calls during import
- Check for failed requests
- Verify response times

**Console**:
- Look for JavaScript errors
- Check for warning messages
- Monitor OAuth flow logs

## 📊 Test Data Creation

### Creating Test Calendars

1. **Yoga-Heavy Calendar**:
   - Create events with keywords: "Vinyasa Flow", "Hatha Yoga", "Meditation Session"
   - Mix of past and future events
   - Various locations and times

2. **Mixed Personal Calendar**:
   - Include yoga events
   - Add personal appointments: "Dentist", "Meeting", "Birthday"
   - Test automatic categorization

3. **Empty Calendar**:
   - Create calendar with no events
   - Test edge case handling

### Sample ICS Content

Create a test `.ics` file:

```ics
BEGIN:VCALENDAR
VERSION:2.0
PRODID:Test Calendar
BEGIN:VEVENT
UID:test-yoga-1
DTSTART:20241215T100000Z
DTEND:20241215T110000Z
SUMMARY:Morning Vinyasa Flow
DESCRIPTION:Dynamic yoga class focusing on breath and movement
LOCATION:Yoga Studio Downtown
END:VEVENT
BEGIN:VEVENT
UID:test-private-1
DTSTART:20241216T140000Z
DTEND:20241216T150000Z
SUMMARY:Doctor Appointment
DESCRIPTION:Annual checkup
LOCATION:Medical Center
END:VEVENT
END:VCALENDAR
```

## 🐛 Common Issues & Solutions

### OAuth Issues
**Problem**: "OAuth configuration missing"
**Solution**: Check environment variables are set correctly

**Problem**: "Redirect URI mismatch"
**Solution**: Verify Google Cloud Console redirect URIs match your local URL

### Import Issues
**Problem**: "No calendars found"
**Solution**: Ensure user has calendars with proper permissions

**Problem**: "Failed to parse ICS"
**Solution**: Verify ICS file format and encoding

### Database Issues
**Problem**: "Calendar feed not found"
**Solution**: Complete yoga calendar creation first

## 📈 Performance Testing

### Load Testing
1. **Large Import**: Test with 200+ events
2. **Multiple Users**: Simulate concurrent imports
3. **File Size**: Test with large ICS files (1MB+)

### Metrics to Monitor
- API response times
- Memory usage during ICS parsing
- Database query performance
- OAuth token refresh reliability

## ✅ Success Criteria

A successful test should demonstrate:

1. **Functional Requirements**:
   - [ ] OAuth flow completes successfully
   - [ ] Yoga calendar created automatically
   - [ ] Events import from both Google Calendar and ICS
   - [ ] Smart categorization works accurately
   - [ ] UI provides clear feedback

2. **Non-Functional Requirements**:
   - [ ] Performance acceptable (< 5s for typical imports)
   - [ ] Error handling graceful
   - [ ] Mobile-friendly interface
   - [ ] Secure data handling

3. **Integration Requirements**:
   - [ ] Works with existing sync system
   - [ ] Database consistency maintained
   - [ ] Google Calendar API limits respected

## 🎯 Next Steps After Testing

1. **Fix Issues**: Address any bugs found during testing
2. **Performance Optimization**: Improve slow operations
3. **User Feedback**: Gather feedback on UX flow
4. **Documentation**: Update user-facing documentation
5. **Monitoring**: Set up production monitoring

---

**Happy Testing! 🚀**

Remember to test with real calendar data for the most accurate results. The import feature should feel intuitive and provide clear value to users setting up their yoga calendar. 