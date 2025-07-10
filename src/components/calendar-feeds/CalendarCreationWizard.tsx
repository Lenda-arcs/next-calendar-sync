'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { 
  Calendar, 
  Apple, 
  Mail, 
  Settings, 
  ArrowRight, 
  ChevronLeft, 
  ExternalLink,
  CheckCircle,
  FileText,
  HelpCircle
} from 'lucide-react'

interface CalendarProvider {
  id: string
  name: string
  icon: React.ReactNode
  description: string
  pros: string[]
  cons: string[]
  difficulty: 'easy' | 'medium' | 'hard'
  bestFor: string
  color: string
}

interface CalendarCreationWizardProps {
  onCalendarCreated: () => void
  onCancel: () => void
}

export function CalendarCreationWizard({ onCalendarCreated, onCancel }: CalendarCreationWizardProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedProvider, setSelectedProvider] = useState<string>('')
  const [scheduleData, setScheduleData] = useState({
    classes: [] as Array<{
      name: string
      location: string
      day: string
      time: string
      duration: string
    }>,
    currentClass: {
      name: '',
      location: '',
      day: '',
      time: '',
      duration: ''
    }
  })

  const providers: CalendarProvider[] = [
    {
      id: 'google',
      name: 'Google Calendar',
      icon: <Mail className="h-6 w-6" />,
      description: 'Most popular and feature-rich option',
      pros: [
        'Works on all devices',
        'Easy to share with students',
        'Integrates with Gmail',
        'Free with lots of storage'
      ],
      cons: [
        'Requires Gmail account',
        'Google collects data'
      ],
      difficulty: 'easy',
      bestFor: 'Most yoga teachers',
      color: '#4285F4'
    },
    {
      id: 'apple',
      name: 'Apple iCloud Calendar',
      icon: <Apple className="h-6 w-6" />,
      description: 'Great for iPhone/Mac users',
      pros: [
        'Syncs perfectly with iPhone',
        'Privacy-focused',
        'Clean, simple interface',
        'Works offline'
      ],
      cons: [
        'Limited sharing options',
        'Requires Apple device',
        'Less customizable'
      ],
      difficulty: 'medium',
      bestFor: 'iPhone/Mac users',
      color: '#007AFF'
    },
    {
      id: 'outlook',
      name: 'Microsoft Outlook',
      icon: <Settings className="h-6 w-6" />,
      description: 'Professional option',
      pros: [
        'Professional features',
        'Good for business',
        'Integrates with Office',
        'Strong security'
      ],
      cons: [
        'Can be overwhelming',
        'More complex setup',
        'Requires Microsoft account'
      ],
      difficulty: 'hard',
      bestFor: 'Professional studios',
      color: '#0078D4'
    }
  ]

  const steps = [
    {
      id: 'provider',
      title: 'Choose Your Calendar Provider',
      description: 'Select the calendar service that works best for you'
    },
    {
      id: 'schedule',
      title: 'Add Your Current Schedule',
      description: 'Tell us about your yoga classes so we can help you migrate'
    },
    {
      id: 'setup',
      title: 'Setup Instructions',
      description: 'Step-by-step guide to create your calendar'
    },
    {
      id: 'connect',
      title: 'Connect to Our Platform',
      description: 'Link your new calendar to start syncing'
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

  const handleProviderSelect = (providerId: string) => {
    setSelectedProvider(providerId)
  }

  const handleAddClass = () => {
    if (scheduleData.currentClass.name && scheduleData.currentClass.day && scheduleData.currentClass.time) {
      setScheduleData(prev => ({
        classes: [...prev.classes, prev.currentClass],
        currentClass: {
          name: '',
          location: '',
          day: '',
          time: '',
          duration: ''
        }
      }))
    }
  }

  const handleRemoveClass = (index: number) => {
    setScheduleData(prev => ({
      ...prev,
      classes: prev.classes.filter((_, i) => i !== index)
    }))
  }

  const currentStepData = steps[currentStep]
  const selectedProviderData = providers.find(p => p.id === selectedProvider)

  // Step 1: Provider Selection
  if (currentStep === 0) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold font-serif">{currentStepData.title}</h2>
          <p className="text-muted-foreground">{currentStepData.description}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {providers.map((provider) => (
            <Card 
              key={provider.id} 
              variant={selectedProvider === provider.id ? "elevated" : "outlined"}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedProvider === provider.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => handleProviderSelect(provider.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                    style={{ backgroundColor: provider.color }}
                  >
                    {provider.icon}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{provider.name}</CardTitle>
                    <CardDescription>{provider.description}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge 
                    variant={provider.difficulty === 'easy' ? 'default' : provider.difficulty === 'medium' ? 'secondary' : 'outline'}
                    className="text-xs"
                  >
                    {provider.difficulty === 'easy' ? 'Easy' : provider.difficulty === 'medium' ? 'Medium' : 'Advanced'}
                  </Badge>
                  <span className="text-sm text-muted-foreground">• {provider.bestFor}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="font-semibold text-green-700 mb-1 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Pros
                  </h4>
                  <ul className="text-sm space-y-1">
                    {provider.pros.map((pro, index) => (
                      <li key={index} className="flex items-start gap-1">
                        <span className="text-green-600 mt-1">•</span>
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-orange-700 mb-1 flex items-center gap-1">
                    <HelpCircle className="h-3 w-3" />
                    Considerations
                  </h4>
                  <ul className="text-sm space-y-1">
                    {provider.cons.map((con, index) => (
                      <li key={index} className="flex items-start gap-1">
                        <span className="text-orange-600 mt-1">•</span>
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleNext} disabled={!selectedProvider}>
            <ArrowRight className="mr-2 h-4 w-4" />
            Continue
          </Button>
        </div>
      </div>
    )
  }

  // Step 2: Schedule Input
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
              Your Current Classes
            </CardTitle>
            <CardDescription>
              Add your regular yoga classes so we can help you set them up digitally
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Current Classes List */}
            {scheduleData.classes.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold">Added Classes:</h4>
                {scheduleData.classes.map((classItem, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <div className="font-medium">{classItem.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {classItem.day} at {classItem.time} • {classItem.location}
                        {classItem.duration && ` • ${classItem.duration}`}
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleRemoveClass(index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Add New Class Form */}
            <div className="space-y-3 p-4 border rounded-lg">
              <h4 className="font-semibold">Add a Class:</h4>
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <Label htmlFor="className">Class Name *</Label>
                  <Input
                    id="className"
                    placeholder="e.g., Vinyasa Flow, Hatha Yoga"
                    value={scheduleData.currentClass.name}
                    onChange={(e) => setScheduleData(prev => ({
                      ...prev,
                      currentClass: { ...prev.currentClass, name: e.target.value }
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="e.g., Zen Studio, Online"
                    value={scheduleData.currentClass.location}
                    onChange={(e) => setScheduleData(prev => ({
                      ...prev,
                      currentClass: { ...prev.currentClass, location: e.target.value }
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="day">Day of Week *</Label>
                  <select
                    id="day"
                    className="w-full p-2 border rounded-md"
                    value={scheduleData.currentClass.day}
                    onChange={(e) => setScheduleData(prev => ({
                      ...prev,
                      currentClass: { ...prev.currentClass, day: e.target.value }
                    }))}
                  >
                    <option value="">Select day</option>
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                    <option value="Sunday">Sunday</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="time">Time *</Label>
                  <Input
                    id="time"
                    type="time"
                    value={scheduleData.currentClass.time}
                    onChange={(e) => setScheduleData(prev => ({
                      ...prev,
                      currentClass: { ...prev.currentClass, time: e.target.value }
                    }))}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="duration">Duration (optional)</Label>
                  <Input
                    id="duration"
                    placeholder="e.g., 60 minutes, 1.5 hours"
                    value={scheduleData.currentClass.duration}
                    onChange={(e) => setScheduleData(prev => ({
                      ...prev,
                      currentClass: { ...prev.currentClass, duration: e.target.value }
                    }))}
                  />
                </div>
              </div>
              <Button 
                onClick={handleAddClass}
                disabled={!scheduleData.currentClass.name || !scheduleData.currentClass.day || !scheduleData.currentClass.time}
                className="w-full"
              >
                Add Class
              </Button>
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
            Continue
          </Button>
        </div>
      </div>
    )
  }

  // Step 3: Setup Instructions
  if (currentStep === 2 && selectedProviderData) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: `${selectedProviderData.color}20` }}>
            {selectedProviderData.icon}
          </div>
          <h2 className="text-2xl font-bold font-serif">{selectedProviderData.name} Setup</h2>
          <p className="text-muted-foreground">Follow these steps to create your {selectedProviderData.name} calendar</p>
        </div>

        <Card variant="glass">
          <CardHeader>
            <CardTitle>Step-by-Step Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedProviderData.id === 'google' && (
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">1</div>
                  <div>
                    <h4 className="font-semibold">Create Google Account</h4>
                    <p className="text-sm text-muted-foreground">Go to gmail.com and click &quot;Create account&quot;</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">2</div>
                  <div>
                    <h4 className="font-semibold">Access Google Calendar</h4>
                    <p className="text-sm text-muted-foreground">Go to calendar.google.com or click the calendar icon in Gmail</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">3</div>
                  <div>
                    <h4 className="font-semibold">Create Yoga Calendar</h4>
                    <p className="text-sm text-muted-foreground">Click + next to &quot;Other calendars&quot; and select &quot;Create new calendar&quot;</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">4</div>
                  <div>
                    <h4 className="font-semibold">Add Your Classes</h4>
                    <p className="text-sm text-muted-foreground">Click on time slots to add your yoga classes from the list below</p>
                  </div>
                </div>
              </div>
            )}
            
            {selectedProviderData.id === 'apple' && (
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">1</div>
                  <div>
                    <h4 className="font-semibold">Sign in to iCloud</h4>
                    <p className="text-sm text-muted-foreground">Go to iCloud.com and sign in with your Apple ID</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">2</div>
                  <div>
                    <h4 className="font-semibold">Open Calendar</h4>
                    <p className="text-sm text-muted-foreground">Click on the Calendar icon</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">3</div>
                  <div>
                    <h4 className="font-semibold">Create Yoga Calendar</h4>
                    <p className="text-sm text-muted-foreground">Click the + button to create a new calendar called &quot;Yoga Classes&quot;</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">4</div>
                  <div>
                    <h4 className="font-semibold">Add Your Classes</h4>
                    <p className="text-sm text-muted-foreground">Click on time slots to add your yoga classes</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Classes to Add */}
        {scheduleData.classes.length > 0 && (
          <Card variant="outlined">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Classes to Add
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {scheduleData.classes.map((classItem, index) => (
                  <div key={index} className="p-3 bg-muted rounded-lg">
                    <div className="font-medium">{classItem.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {classItem.day} at {classItem.time}
                      {classItem.location && ` • ${classItem.location}`}
                      {classItem.duration && ` • ${classItem.duration}`}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-between">
          <Button variant="outline" onClick={handleBack}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button onClick={handleNext}>
            <ArrowRight className="mr-2 h-4 w-4" />
            Next: Connect Calendar
          </Button>
        </div>
      </div>
    )
  }

  // Step 4: Connect Calendar
  if (currentStep === 3 && selectedProviderData) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold font-serif">Almost Done!</h2>
          <p className="text-muted-foreground">Now let&apos;s connect your new calendar to our platform</p>
        </div>

        <Card variant="glass">
          <CardHeader>
            <CardTitle>Connect Your {selectedProviderData.name}</CardTitle>
            <CardDescription>
              We need to connect your newly created calendar to sync with our platform
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold mb-2">What happens next:</h4>
              <ul className="space-y-1 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Your calendar will sync automatically</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Changes appear on your public schedule</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Students can discover your classes</span>
                </li>
              </ul>
            </div>

            <Button 
              onClick={() => onCalendarCreated()}
              className="w-full h-12"
              style={{ backgroundColor: selectedProviderData.color }}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Connect My {selectedProviderData.name}
            </Button>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button variant="outline" onClick={handleBack}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button variant="outline" onClick={onCancel}>
            I&apos;ll Do This Later
          </Button>
        </div>
      </div>
    )
  }

  return null
} 