# Calendar Invitation Processing - Refactored

This edge function has been refactored to be more modular, maintainable, and robust. The function processes incoming calendar invitations sent via email and automatically creates calendar feeds when possible.

## Architecture

### Core Files

- **`index.ts`** - Main entry point and request handler
- **`types.ts`** - Type definitions and interfaces
- **`validation.ts`** - Request validation and webhook detection
- **`mime-parser.ts`** - MIME message parsing utilities
- **`calendar-providers.ts`** - Calendar provider detection and configuration
- **`calendar-extractor.ts`** - Calendar data extraction from email content
- **`invitation-processor.ts`** - Core invitation processing logic

### Key Features

1. **Modular Design**: Each concern is separated into its own module
2. **Type Safety**: Comprehensive TypeScript types throughout
3. **Error Handling**: Robust error handling with appropriate HTTP status codes
4. **Provider Detection**: Automatic detection of Google, Outlook, Apple, and unknown providers
5. **Content Extraction**: Multiple methods for extracting calendar data:
   - .ics file attachments
   - HTML content parsing
   - Plain text parsing
   - Provider-specific extraction logic
6. **iCloud Support**: Special handling for iCloud sharing URLs
7. **Webhook Security**: Automatic detection of webhook requests vs. API calls

## Supported Calendar Providers

### Google Calendar
- **Detection**: Gmail domain, Google-specific subjects
- **Extraction**: Direct .ics feeds, HTML content
- **Feed URL Pattern**: `https://calendar.google.com/calendar/ical/*/basic.ics`

### Outlook Calendar
- **Detection**: Outlook/Hotmail/Live domains
- **Extraction**: Direct .ics feeds, HTML content
- **Feed URL Pattern**: `https://outlook.live.com/owa/calendar/*/calendar.ics`

### Apple iCloud Calendar
- **Detection**: iCloud domain, German/English subjects
- **Extraction**: Sharing URLs (requires manual setup)
- **Special Handling**: Creates pending invitations for manual feed URL entry

### Unknown Providers
- **Detection**: Fallback for any other provider
- **Extraction**: Generic webcal and https .ics patterns

## Processing Flow

1. **Request Validation**: Validate webhook request and payload
2. **MIME Parsing**: Parse various email formats (JSON, form-data, raw MIME)
3. **Provider Detection**: Identify calendar provider from email domain/subject
4. **Data Extraction**: Extract calendar name and feed URL using multiple methods
5. **Database Processing**: Update invitation status and create calendar feed
6. **Response**: Return processing result with appropriate status

## Error Handling

- **400 Bad Request**: Invalid payload, missing fields
- **401 Unauthorized**: Missing authentication for non-webhook requests
- **404 Not Found**: Invitation not found or expired
- **500 Internal Server Error**: Database or processing errors

## Development

### Run locally:
```bash
deno run --allow-net --allow-env --allow-read --allow-write --watch index.ts
```

### Test:
```bash
deno test --allow-net --allow-env --allow-read
```

### Deploy:
```bash
supabase functions deploy process-calendar-invitation --no-verify-jwt
```

## Environment Variables

- `SUPABASE_URL`: Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY`: Service role key for admin operations
- `CALENDAR_INVITATION_DOMAIN`: Domain for invitation emails (e.g., calendar.yourdomain.com)

## Notes

- The function automatically detects webhook requests and skips authentication for them
- TypeScript linter errors about missing modules are expected in Deno edge functions
- The function handles both direct calendar feed URLs and iCloud sharing URLs
- Multiple extraction methods ensure compatibility with various email formats 