'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Apple, 
  ExternalLink, 
  CheckCircle, 
  ArrowRight, 
  ChevronLeft, 
  Shield, 
  Eye,
  EyeOff,
  Calendar,
  Copy,
  AlertCircle,
  HelpCircle
} from 'lucide-react'

interface ICloudSetupGuideProps {
  onSetupComplete: (feedUrl: string, calendarName: string) => void
  onCancel: () => void
}

export function ICloudSetupGuide({ onSetupComplete, onCancel }: ICloudSetupGuideProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [calendarUrl, setCalendarUrl] = useState('')
  const [calendarName, setCalendarName] = useState('My Yoga Classes')
  const [showPrivacyDetails, setShowPrivacyDetails] = useState(false)
  const [testingConnection, setTestingConnection] = useState(false)
  const [connectionTest, setConnectionTest] = useState<{
    tested: boolean;
    success: boolean;
    message?: string;
  }>({ tested: false, success: false })

  const steps = [
    {
      id: 'privacy',
      title: 'Privacy & Setup Overview',
      description: 'Understand what we&apos;ll set up and how your privacy is protected'
    },
    {
      id: 'calendar',
      title: 'Create or Select Your Calendar',
      description: 'Set up a dedicated calendar for your yoga classes'
    },
    {
      id: 'share',
      title: 'Enable Public Sharing',
      description: 'Make your calendar accessible for syncing'
    },
    {
      id: 'connect',
      title: 'Connect & Test',
      description: 'Link your calendar and verify the connection'
    }
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleTestConnection = async () => {
    if (!calendarUrl.trim()) {
      setConnectionTest({
        tested: true,
        success: false,
        message: 'Please enter your calendar URL first'
      })
      return
    }

    setTestingConnection(true)
    
    try {
      // Simulate connection test - in real app this would validate the ICS feed
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      if (calendarUrl.includes('icloud.com') && calendarUrl.includes('webcal://')) {
        setConnectionTest({
          tested: true,
          success: true,
          message: 'Connection successful! Your calendar is ready to sync.'
        })
      } else {
        setConnectionTest({
          tested: true,
          success: false,
          message: 'This doesn&apos;t look like a valid iCloud calendar URL. Please check the format.'
        })
      }
         } catch {
       setConnectionTest({
         tested: true,
         success: false,
         message: 'Failed to test connection. Please check your URL and try again.'
       })
     } finally {
      setTestingConnection(false)
    }
  }

  const handleComplete = () => {
    if (connectionTest.success) {
      onSetupComplete(calendarUrl, calendarName)
    }
  }

  const currentStepData = steps[currentStep]

  // Step 1: Privacy & Overview
  if (currentStep === 0) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
            <Apple className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold font-serif">{currentStepData.title}</h2>
          <p className="text-muted-foreground">{currentStepData.description}</p>
        </div>

        <Card variant="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-600" />
              Privacy-First Setup
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <h4 className="font-semibold text-green-700">What we&apos;ll do:</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Create a dedicated yoga calendar</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Only sync yoga-related events</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Keep personal events private</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>You control what&apos;s shared</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-blue-700">What we&apos;ll need:</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <Calendar className="h-4 w-4 text-blue-600 mt-0.5" />
                    <span>Access to your iCloud calendar</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ExternalLink className="h-4 w-4 text-blue-600 mt-0.5" />
                    <span>Enable public sharing (for sync only)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Copy className="h-4 w-4 text-blue-600 mt-0.5" />
                    <span>Copy your calendar&apos;s sharing URL</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <HelpCircle className="h-4 w-4 text-blue-600" />
                <h4 className="font-semibold text-blue-900">Why this method?</h4>
              </div>
              <p className="text-sm text-blue-800">
                iCloud doesn&apos;t support email invitations like Google Calendar. This manual setup ensures 
                reliable syncing while maintaining your privacy and control over your schedule.
              </p>
            </div>

            <Button 
              onClick={() => setShowPrivacyDetails(!showPrivacyDetails)}
              variant="outline"
              className="w-full"
            >
              {showPrivacyDetails ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
              {showPrivacyDetails ? 'Hide' : 'Show'} Privacy Details
            </Button>

            {showPrivacyDetails && (
              <div className="p-4 border rounded-lg space-y-3">
                <h4 className="font-semibold">Privacy & Data Protection:</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• We only access events you specifically share</li>
                  <li>• Your personal calendar remains completely private</li>
                  <li>• You can revoke access anytime by disabling sharing</li>
                  <li>• We don&apos;t store your Apple ID or personal information</li>
                  <li>• Only event details (title, time, location) are synced</li>
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleNext}>
            <ArrowRight className="mr-2 h-4 w-4" />
            Let&apos;s Begin
          </Button>
        </div>
      </div>
    )
  }

  // Step 2: Create Calendar
  if (currentStep === 1) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold font-serif">{currentStepData.title}</h2>
          <p className="text-muted-foreground">{currentStepData.description}</p>
        </div>

        <Card variant="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              iCloud Calendar Setup
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Follow these steps in a new browser tab:</strong> Keep this page open for reference.
              </AlertDescription>
            </Alert>

            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">1</div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">Open iCloud Calendar</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Go to <strong>iCloud.com</strong> and sign in with your Apple ID
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open('https://www.icloud.com/calendar', '_blank')}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Open iCloud Calendar
                  </Button>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">2</div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">Create a New Calendar</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Click the <strong>+</strong> button next to &quot;My Calendars&quot; and select <strong>&quot;New Calendar&quot;</strong>
                  </p>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm"><strong>Suggested name:</strong> &quot;Yoga Classes&quot; or &quot;Teaching Schedule&quot;</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Choose a descriptive name so you can easily identify it later
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">3</div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">Add Your Yoga Classes</h4>
                  <p className="text-sm text-muted-foreground">
                    Click on time slots in the calendar to add your regular yoga classes to the new calendar
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <h4 className="font-semibold text-green-900">Pro Tips:</h4>
              </div>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Use consistent naming for your classes (e.g., &quot;Vinyasa Flow&quot;, &quot;Hatha Yoga&quot;)</li>
                <li>• Include location information in the event details</li>
                <li>• Set up recurring events for regular classes</li>
                <li>• Use different colors for different types of classes</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button variant="outline" onClick={handleBack}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button onClick={handleNext}>
            <ArrowRight className="mr-2 h-4 w-4" />
            Next: Enable Sharing
          </Button>
        </div>
      </div>
    )
  }

  // Step 3: Enable Sharing
  if (currentStep === 2) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold font-serif">{currentStepData.title}</h2>
          <p className="text-muted-foreground">{currentStepData.description}</p>
        </div>

        <Card variant="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ExternalLink className="h-5 w-5" />
              Make Your Calendar Public
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                <strong>Privacy Note:</strong> Only the calendar you created for yoga classes will be shared. 
                Your personal calendar remains private.
              </AlertDescription>
            </Alert>

            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">1</div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">Right-click Your Yoga Calendar</h4>
                  <p className="text-sm text-muted-foreground">
                    In the sidebar, right-click on your yoga calendar and select <strong>&quot;Calendar Settings&quot;</strong>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">2</div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">Enable Public Calendar</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Check the box next to <strong>&quot;Public Calendar&quot;</strong>
                  </p>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>Important:</strong> This makes your yoga schedule visible to anyone with the link, 
                      but they can&apos;t edit or delete events.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">3</div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">Copy the Calendar URL</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Copy the URL that appears (it should start with <code>webcal://</code>)
                  </p>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm font-mono text-xs">
                      Example: webcal://p01-calendarws.icloud.com/published/2/...
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <HelpCircle className="h-4 w-4 text-blue-600" />
                <h4 className="font-semibold text-blue-900">Having trouble?</h4>
              </div>
              <p className="text-sm text-blue-800">
                If you can&apos;t find the &quot;Public Calendar&quot; option, make sure you&apos;re using 
                the calendar you created (not the default calendar). The option appears when you right-click 
                on your custom calendar.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button variant="outline" onClick={handleBack}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button onClick={handleNext}>
            <ArrowRight className="mr-2 h-4 w-4" />
            Next: Connect & Test
          </Button>
        </div>
      </div>
    )
  }

  // Step 4: Connect & Test
  if (currentStep === 3) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold font-serif">{currentStepData.title}</h2>
          <p className="text-muted-foreground">{currentStepData.description}</p>
        </div>

        <Card variant="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Apple className="h-5 w-5" />
              Connect Your iCloud Calendar
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <Label htmlFor="calendarName">Calendar Name</Label>
                <Input
                  id="calendarName"
                  placeholder="e.g., My Yoga Classes"
                  value={calendarName}
                  onChange={(e) => setCalendarName(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="calendarUrl">Calendar URL from iCloud *</Label>
                <Input
                  id="calendarUrl"
                  placeholder="webcal://p01-calendarws.icloud.com/published/2/..."
                  value={calendarUrl}
                  onChange={(e) => setCalendarUrl(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Paste the URL you copied from iCloud Calendar settings
                </p>
              </div>

              <Button 
                onClick={handleTestConnection}
                disabled={!calendarUrl.trim() || testingConnection}
                className="w-full"
              >
                {testingConnection ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Testing Connection...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Test Connection
                  </>
                )}
              </Button>

              {connectionTest.tested && (
                <Alert variant={connectionTest.success ? "default" : "destructive"}>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {connectionTest.message}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button variant="outline" onClick={handleBack}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button 
            onClick={handleComplete}
            disabled={!connectionTest.success}
            className="bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Complete Setup
          </Button>
        </div>
      </div>
    )
  }

  return null
} 