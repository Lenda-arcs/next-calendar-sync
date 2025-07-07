# Quick Calendar Onboarding Flow

## Step 1: Calendar Provider Detection
**"Which calendar do you currently use for your yoga classes?"**

- 🟢 **Google Calendar** → *Next: OAuth or Email options*
- 🔵 **Apple iCloud Calendar** → *Next: Email invitation setup*
- 🟠 **Microsoft Outlook/Office 365** → *Next: OAuth or Email options*
- ⚫ **Other/None** → *Next: Manual setup options*

## Step 2: Privacy & Organization
**"To keep your personal events private, would you like to create a dedicated calendar just for your yoga classes?"**

- ✅ **Yes, create a new calendar** → *Recommended for privacy*
- ❓ **Maybe, show me how easy it is** → *Provide guided setup*
- ❌ **No, use my existing calendar** → *Filter options needed*

## Step 3: Technical Comfort
**"How comfortable are you with technology?"**

- 🚀 **Very comfortable** → *OAuth/Advanced options*
- 👍 **Can follow instructions** → *Email invitation method*
- 🤝 **Prefer simple solutions** → *Manual/Copy-paste methods*

## Step 4: Connection Method Selection
*Based on previous answers, show 1-2 best options:*

### For Google Calendar Users:
- **Tech-savvy + New calendar**: "Connect with Google (OAuth)"
- **Basic users**: "Email invitation method"
- **Existing calendar**: "Share calendar link"

### For Apple iCloud Users:
- **All users**: "Email invitation system" (most reliable)
- **Alternative**: "Make calendar public + paste link"

### For Outlook Users:
- **Office 365**: "Connect with Microsoft (OAuth)"
- **Outlook.com**: "Email invitation method"

### For Other/Manual:
- **Manual entry**: "I'll add events directly"
- **Import**: "Upload calendar file"

---

## Implementation Logic

```javascript
// Onboarding decision tree
function determineOnboardingPath(responses) {
  const { provider, privacy, techComfort, multipleLocations } = responses;
  
  // High-level routing
  if (provider === 'google') {
    if (techComfort === 'advanced' && privacy === 'yes') {
      return 'google-oauth-new-calendar';
    } else if (techComfort === 'basic') {
      return 'google-email-invitation';
    } else {
      return 'google-share-link';
    }
  }
  
  if (provider === 'icloud') {
    return 'email-invitation-system'; // Most reliable for iCloud
  }
  
  if (provider === 'outlook') {
    if (techComfort === 'advanced') {
      return 'microsoft-oauth';
    } else {
      return 'outlook-email-invitation';
    }
  }
  
  return 'manual-entry'; // Fallback for other providers
}
```

## Quick Setup Instructions by Path

### Google OAuth (New Calendar)
1. "Connect with Google"
2. "Create new calendar called 'Yoga Classes'"
3. "Select events to sync"
4. "Done! Your schedule is live"

### Email Invitation (Universal)
1. "We'll send you a calendar invitation"
2. "Forward it to your calendar"
3. "Your events automatically sync"
4. "Manage from your calendar app"

### Share Link (Simple)
1. "Make your calendar public"
2. "Copy the share link"
3. "Paste it here"
4. "We'll sync automatically"

### Manual Entry
1. "Add your classes directly"
2. "Set recurring patterns"
3. "Update when needed"
4. "Full control over display"

---

## Key Questions for Data Collection

1. **Calendar Provider** → Determines technical approach
2. **Privacy Preference** → New calendar vs. existing
3. **Technical Comfort** → Complexity of setup method
4. **Change Frequency** → Manual vs. automatic sync priority
5. **Multiple Locations** → Advanced features needed

## Success Metrics to Track

- **Completion Rate**: % who finish onboarding
- **Method Success**: Which connection methods work best
- **Support Requests**: Where users need help
- **Drop-off Points**: Where users abandon setup
- **Time to First Sync**: How quickly users get connected

---

*This streamlined flow reduces friction while gathering essential information for optimal setup.* 