# Onboarding Implementation Guide

## Overview
This guide shows how to implement the yoga teacher questionnaire results into a personalized onboarding experience in your calendar sync app.

## User Flow Architecture

```
Registration → Provider Detection → Privacy Choice → Method Selection → Setup → Success
```

## Implementation Steps

### 1. Provider Detection Component
```typescript
// components/onboarding/ProviderSelector.tsx
interface ProviderOption {
  id: string;
  name: string;
  icon: React.ComponentType;
  description: string;
  availability: 'oauth' | 'email' | 'manual';
}

const providers: ProviderOption[] = [
  {
    id: 'google',
    name: 'Google Calendar',
    icon: GoogleIcon,
    description: 'Gmail, Google Workspace',
    availability: 'oauth'
  },
  {
    id: 'icloud',
    name: 'Apple iCloud',
    icon: AppleIcon,
    description: 'iCloud, Apple Calendar',
    availability: 'email'
  },
  {
    id: 'outlook',
    name: 'Microsoft Outlook',
    icon: OutlookIcon,
    description: 'Outlook.com, Office 365',
    availability: 'oauth'
  }
];
```

### 2. Privacy & Organization Selector
```typescript
// components/onboarding/PrivacySelector.tsx
interface PrivacyOption {
  id: 'dedicated' | 'existing' | 'unsure';
  title: string;
  description: string;
  recommendation?: string;
}

const privacyOptions: PrivacyOption[] = [
  {
    id: 'dedicated',
    title: 'Create a new calendar for yoga classes',
    description: 'Keeps personal events private',
    recommendation: 'Recommended for privacy'
  },
  {
    id: 'existing',
    title: 'Use my existing calendar',
    description: 'All events will be visible publicly'
  },
  {
    id: 'unsure',
    title: 'Not sure - help me decide',
    description: 'Get personalized recommendation'
  }
];
```

### 3. Dynamic Method Selection
```typescript
// lib/onboarding/method-selector.ts
interface OnboardingPath {
  method: 'oauth' | 'email' | 'sharelink' | 'manual';
  steps: OnboardingStep[];
  estimatedTime: string;
  difficulty: 'easy' | 'medium' | 'advanced';
}

export function getRecommendedPath(
  provider: string,
  privacy: string,
  techComfort: string
): OnboardingPath {
  
  // Google Calendar paths
  if (provider === 'google') {
    if (techComfort === 'advanced' && privacy === 'dedicated') {
      return {
        method: 'oauth',
        steps: [
          { id: 'connect', title: 'Connect with Google' },
          { id: 'create-calendar', title: 'Create dedicated calendar' },
          { id: 'select-events', title: 'Choose events to sync' },
          { id: 'complete', title: 'Complete setup' }
        ],
        estimatedTime: '2-3 minutes',
        difficulty: 'easy'
      };
    }
    
    if (techComfort === 'basic') {
      return {
        method: 'email',
        steps: [
          { id: 'generate-email', title: 'Generate invitation email' },
          { id: 'forward-invite', title: 'Forward to your calendar' },
          { id: 'confirm-sync', title: 'Confirm synchronization' }
        ],
        estimatedTime: '5 minutes',
        difficulty: 'easy'
      };
    }
  }
  
  // iCloud Calendar (always email)
  if (provider === 'icloud') {
    return {
      method: 'email',
      steps: [
        { id: 'generate-email', title: 'Generate invitation email' },
        { id: 'add-to-calendar', title: 'Add to iCloud Calendar' },
        { id: 'verify-sync', title: 'Verify synchronization' }
      ],
      estimatedTime: '3-4 minutes',
      difficulty: 'easy'
    };
  }
  
  // Fallback to manual
  return {
    method: 'manual',
    steps: [
      { id: 'create-events', title: 'Add your classes' },
      { id: 'set-recurring', title: 'Set recurring patterns' },
      { id: 'publish', title: 'Publish schedule' }
    ],
    estimatedTime: '10-15 minutes',
    difficulty: 'medium'
  };
}
```

### 4. Setup Instructions by Method

#### Google OAuth Setup
```typescript
// components/onboarding/GoogleOAuthSetup.tsx
export function GoogleOAuthSetup({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(1);
  
  const handleOAuthConnection = async () => {
    // Use existing OAuth flow
    const connection = await connectGoogleCalendar();
    setStep(2);
  };
  
  const handleCalendarCreation = async () => {
    // Create dedicated calendar
    await createDedicatedCalendar('Yoga Classes');
    setStep(3);
  };
  
  return (
    <div className="space-y-6">
      {step === 1 && (
        <div>
          <h3>Connect with Google</h3>
          <p>We'll securely connect to your Google Calendar</p>
          <Button onClick={handleOAuthConnection}>
            Connect Google Calendar
          </Button>
        </div>
      )}
      
      {step === 2 && (
        <div>
          <h3>Create Dedicated Calendar</h3>
          <p>This keeps your personal events private</p>
          <Button onClick={handleCalendarCreation}>
            Create "Yoga Classes" Calendar
          </Button>
        </div>
      )}
      
      {step === 3 && (
        <div>
          <h3>Setup Complete!</h3>
          <p>Your yoga schedule is now live</p>
          <Button onClick={onComplete}>
            View My Schedule
          </Button>
        </div>
      )}
    </div>
  );
}
```

#### Email Invitation Setup
```typescript
// components/onboarding/EmailInvitationSetup.tsx
export function EmailInvitationSetup() {
  const [invitationEmail, setInvitationEmail] = useState('');
  const [step, setStep] = useState(1);
  
  const generateInvitation = async () => {
    const email = await createCalendarInvitation();
    setInvitationEmail(email);
    setStep(2);
  };
  
  return (
    <div className="space-y-6">
      {step === 1 && (
        <div>
          <h3>Generate Calendar Invitation</h3>
          <p>We'll create a special email address for your calendar</p>
          <Button onClick={generateInvitation}>
            Generate Invitation
          </Button>
        </div>
      )}
      
      {step === 2 && (
        <div>
          <h3>Add to Your Calendar</h3>
          <p>Copy this email and add it to your calendar app:</p>
          <div className="bg-gray-100 p-4 rounded">
            <code>{invitationEmail}</code>
            <CopyButton text={invitationEmail} />
          </div>
          <div className="mt-4">
            <h4>Instructions for your calendar:</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Open your calendar app</li>
              <li>Create a new event</li>
              <li>Add this email as a guest</li>
              <li>Save the event</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
```

### 5. Success Metrics & Analytics

```typescript
// lib/analytics/onboarding-analytics.ts
export interface OnboardingMetrics {
  provider: string;
  method: string;
  completionTime: number;
  stepsCompleted: number;
  dropoffPoint?: string;
  supportRequests: number;
  success: boolean;
}

export function trackOnboardingStep(
  step: string,
  provider: string,
  method: string
) {
  // Track with your analytics provider
  analytics.track('Onboarding Step', {
    step,
    provider,
    method,
    timestamp: new Date().toISOString()
  });
}

export function trackOnboardingCompletion(metrics: OnboardingMetrics) {
  analytics.track('Onboarding Complete', metrics);
}
```

## UI Component Structure

```
components/onboarding/
├── OnboardingWizard.tsx          # Main wizard container
├── ProviderSelector.tsx          # Step 1: Provider selection
├── PrivacySelector.tsx           # Step 2: Privacy preferences
├── MethodSelector.tsx            # Step 3: Connection method
├── setup/
│   ├── GoogleOAuthSetup.tsx      # Google OAuth flow
│   ├── EmailInvitationSetup.tsx  # Email invitation flow
│   ├── ShareLinkSetup.tsx        # Share link method
│   └── ManualSetup.tsx           # Manual entry method
├── ProgressIndicator.tsx         # Step progress bar
└── SuccessScreen.tsx             # Completion screen
```

## Database Schema for Onboarding

```sql
-- Store onboarding preferences and analytics
CREATE TABLE onboarding_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  provider VARCHAR(50) NOT NULL,
  privacy_preference VARCHAR(50),
  tech_comfort VARCHAR(50),
  selected_method VARCHAR(50),
  completed_at TIMESTAMP,
  steps_completed INTEGER DEFAULT 0,
  total_steps INTEGER,
  dropoff_point VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Index for analytics
CREATE INDEX idx_onboarding_analytics ON onboarding_sessions(
  provider, selected_method, completed_at
);
```

## Key Benefits of This Approach

1. **Personalized Experience**: Each user gets the optimal setup method
2. **Reduced Friction**: Eliminates overwhelming choices
3. **Higher Completion Rates**: Simpler, guided flows
4. **Better Privacy**: Explicit choice about calendar separation
5. **Data-Driven Optimization**: Track what works best for each user type

## Next Steps

1. **Implement the questionnaire** as part of your existing onboarding flow
2. **A/B test different approaches** to optimize completion rates
3. **Add exit surveys** for users who don't complete setup
4. **Create help documentation** for each connection method
5. **Monitor success metrics** and iterate based on user feedback

This approach transforms the complex technical setup into a personalized, user-friendly experience that matches each yoga teacher's comfort level and preferences. 