# 📅 Calendar Import & Cleanup Feature

## 🎯 Overview

The Calendar Import feature allows users to import events from existing calendars into their newly created dedicated "Yoga Schedule" calendar. This accelerates onboarding while maintaining a clean, yoga-focused calendar structure.

## ✅ Implementation Complete

### 🔧 Core Components

#### 1. **Calendar Import Service** (`src/lib/calendar-import-service.ts`)
- **Google Calendar Import**: Fetches events from user's existing Google Calendars
- **Smart Event Detection**: Automatically identifies yoga-related vs. private events
- **Tag Suggestion**: Generates relevant tags based on event content
- **Bulk Import**: Efficiently imports selected events with metadata tracking

#### 2. **ICS Parser** (`src/lib/ics-parser.ts`)
- **Universal Support**: Parses .ics files from Apple Calendar, Outlook, and other apps
- **Date/Time Handling**: Properly converts various ICS date formats
- **Event Filtering**: Excludes cancelled events and handles recurring events
- **Error Handling**: Robust parsing with detailed error reporting

#### 3. **Event Preview UI** (`src/components/calendar-feeds/EventImportPreview.tsx`)
- **Interactive Selection**: Checkboxes for individual event selection
- **Smart Filtering**: Filter by yoga-related, private, or selected events
- **Search Functionality**: Search events by title, description, or location
- **Bulk Actions**: Select all, deselect all, select yoga-only options
- **Tag Display**: Shows suggested tags for each event

#### 4. **Import Step Component** (`src/components/calendar-feeds/CalendarImportStep.tsx`)
- **Dual Import Methods**: Google Calendar and ICS file upload
- **Step-by-Step Flow**: Guided experience from source selection to completion
- **Progress Tracking**: Visual feedback during import process
- **Error Handling**: User-friendly error messages and recovery

#### 5. **API Endpoints** (`src/app/api/calendar/import/route.ts`)
- **GET**: Fetch available Google Calendars for import
- **POST**: Preview events or execute import
- **Security**: Full authentication and authorization checks
- **Error Handling**: Comprehensive error responses

## 🔄 User Flow

### Google Calendar Import
1. **Connect Google Calendar** → OAuth with full calendar access
2. **Choose Source Calendar** → Select from user's existing calendars
3. **Preview Events** → Smart selection with yoga-likelihood detection
4. **Review & Filter** → Manual selection, search, and filtering
5. **Import** → Events added to dedicated yoga calendar

### ICS File Import
1. **Upload .ics File** → Drag & drop or file selection
2. **Parse & Preview** → Automatic parsing and event extraction
3. **Review & Filter** → Same preview interface as Google import
4. **Import** → Events added to dedicated yoga calendar

## 🧠 Smart Features

### Automatic Event Detection
- **Yoga Keywords**: yoga, pilates, meditation, wellness, fitness, class, workshop, retreat
- **Private Keywords**: personal, private, dentist, doctor, appointment, meeting, call, birthday
- **Auto-Selection**: Automatically selects likely yoga events, excludes private ones

### Tag Generation
- **Style Detection**: vinyasa, hatha, yin, power based on content
- **Level Detection**: beginner, advanced based on keywords
- **Format Detection**: online, studio, private based on content
- **Type Detection**: workshop, meditation based on content

### Metadata Tracking
- **Import Source**: Tracks whether event came from Google Calendar or ICS
- **Import Date**: When the event was imported
- **Source Calendar**: Original calendar name for reference
- **Platform Tags**: Marks events as imported with platform-specific metadata

## 🔌 API Reference

### Get Available Calendars
```http
GET /api/calendar/import
```

**Response:**
```json
{
  "success": true,
  "calendars": [
    {
      "id": "calendar-id",
      "name": "Calendar Name",
      "description": "Calendar description",
      "primary": false,
      "accessRole": "owner"
    }
  ],
  "yogaCalendarId": "yoga-calendar-id"
}
```

### Preview Events
```http
POST /api/calendar/import
Content-Type: application/json

{
  "action": "preview",
  "source": "google",
  "sourceCalendarId": "calendar-id"
}
```

**ICS Preview:**
```http
POST /api/calendar/import
Content-Type: application/json

{
  "action": "preview",
  "source": "ics",
  "icsContent": "BEGIN:VCALENDAR..."
}
```

**Response:**
```json
{
  "success": true,
  "preview": {
    "events": [...],
    "totalCount": 25,
    "yogaLikelyCount": 12,
    "privateLikelyCount": 8
  }
}
```

### Import Events
```http
POST /api/calendar/import
Content-Type: application/json

{
  "action": "import",
  "source": "google",
  "events": [
    {
      "id": "event-id",
      "title": "Yoga Class",
      "selected": true,
      ...
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "imported": 12,
  "skipped": 0,
  "errors": [],
  "eventIds": ["google-event-id-1", "google-event-id-2"]
}
```

## 🎨 UI Components

### Event Preview Interface
- **Summary Stats**: Total, yoga-related, private, selected counts
- **Quick Actions**: Select all, deselect all, select yoga only
- **Search & Filter**: Real-time search and category filtering
- **Event Cards**: Detailed event information with selection controls
- **Tag Display**: Visual tag representation for each event

### Import Progress
- **Step Indicators**: Visual progress through import flow
- **Loading States**: Smooth transitions and loading feedback
- **Success/Error States**: Clear completion and error messaging
- **Action Buttons**: Contextual actions for each step

## 🔒 Security & Privacy

### Data Protection
- **No Storage**: ICS files are parsed in memory, not stored
- **Limited Access**: Only accesses selected calendars
- **User Control**: Full user control over what gets imported
- **Metadata**: Tracks import source without exposing private data

### Authentication
- **OAuth Required**: Full Google Calendar OAuth integration
- **User Verification**: All requests verified against authenticated user
- **Rate Limiting**: API endpoints protected against abuse

## 📊 Analytics & Tracking

### Import Metrics
- **Source Tracking**: Google Calendar vs ICS file imports
- **Success Rates**: Import completion and error rates
- **Event Volumes**: Number of events imported per session
- **Tag Distribution**: Most common automatically detected tags

### User Behavior
- **Selection Patterns**: Which events users typically select/deselect
- **Filter Usage**: How users filter and search events
- **Completion Rates**: Percentage of users who complete import

## 🚀 Benefits

### For Users
- **Faster Onboarding**: Pre-populate calendar with existing events
- **Smart Filtering**: Automatic detection of relevant events
- **Clean Results**: Yoga-focused calendar without personal clutter
- **Universal Support**: Works with any calendar app that exports ICS

### For Platform
- **Higher Engagement**: Users start with populated calendars
- **Better Data Quality**: Consistent tagging and categorization
- **Reduced Support**: Self-service import reduces setup questions
- **Analytics Insights**: Better understanding of user event patterns

## 🔮 Future Enhancements

### Advanced Features
- **Recurring Event Handling**: Better support for complex recurring patterns
- **Bulk Editing**: Edit multiple imported events simultaneously
- **Auto-Sync**: Periodic re-import from source calendars
- **Template Creation**: Save import configurations for repeated use

### Integrations
- **More Providers**: Support for Outlook, Yahoo, Apple Calendar APIs
- **Studio Integrations**: Import from studio management systems
- **Social Platforms**: Import from Facebook Events, Meetup, etc.

---

## 🎉 Ready for Production

The Calendar Import feature is fully implemented and ready for user testing. It provides a comprehensive solution for populating yoga calendars while maintaining data quality and user control.

**Key Integration Points:**
- Integrates with existing OAuth flow
- Uses established Google Calendar service
- Follows platform design patterns
- Includes comprehensive error handling

**Next Steps:**
1. User testing with real calendar data
2. Performance optimization for large imports
3. Enhanced recurring event support
4. Additional calendar provider integrations 