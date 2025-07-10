'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { 
  Calendar, 
  Shield, 
  ArrowRight,
  ChevronLeft,
  Apple,
  Mail,
  BookOpen,
  CheckCircle
} from 'lucide-react'
interface UserSegment {
  calendarProvider: 'google' | 'apple' | 'none'
  syncApproach: 'yoga_only' | 'mixed_calendar'
}

interface OnboardingPath {
  id: string
  title: string
  description: string
  method: 'oauth' | 'manual' | 'creation' | 'migration'
  estimatedTime: string
  icon: React.ReactNode
  benefits: string[]
}

interface OnboardingWizardProps {
  onPathSelected: (path: OnboardingPath, segment: UserSegment) => void
}

// Questions configuration
const QUESTIONS = [
  {
    id: 'calendarProvider',
    title: 'What calendar do you currently use?',
    subtitle: 'This helps us recommend the best connection method',
    options: [
      { value: 'google', label: 'Google Calendar / Outlook', icon: <Mail className="h-4 w-4" /> },
      { value: 'apple', label: 'Apple iCloud Calendar', icon: <Apple className="h-4 w-4" /> },
      { value: 'none', label: "I don't use a digital calendar", icon: <BookOpen className="h-4 w-4" /> }
    ]
  },
  {
    id: 'syncApproach',
    title: 'What type of calendar do you use?',
    subtitle: 'This determines how we sync your events',
    options: [
      { value: 'yoga_only', label: 'Dedicated yoga calendar', icon: <Calendar className="h-4 w-4" /> },
      { value: 'mixed_calendar', label: 'Mixed calendar (yoga + personal)', icon: <Shield className="h-4 w-4" /> }
    ]
  }
] as const

// Path configurations
const PATHS = {
  apple: {
    id: 'apple-guided',
    title: 'Apple iCloud Setup',
    description: 'Step-by-step guide to share your iCloud calendar securely',
    method: 'manual' as const,
    estimatedTime: '5-10 minutes',
    icon: <Apple className="h-5 w-5" />,
    benefits: [
      'Privacy-focused setup',
      'Works with existing calendar',
      'No third-party permissions needed'
    ]
  },
  google: {
    id: 'google-oauth',
    title: 'Google Calendar Connect',
    description: 'Secure one-click connection with calendar selection',
    method: 'oauth' as const,
    estimatedTime: '2-3 minutes',
    icon: <Mail className="h-5 w-5" />,
    benefits: [
      'Instant setup',
      'Real-time sync',
      'Choose specific calendars'
    ]
  },
  none: {
    id: 'calendar-creation',
    title: 'Digital Calendar Setup',
    description: 'We&apos;ll help you create your first digital calendar',
    method: 'creation' as const,
    estimatedTime: '10-15 minutes',
    icon: <Calendar className="h-5 w-5" />,
    benefits: [
      'Complete setup guidance',
      'Help choosing the right provider',
      'Migrate from paper schedule'
    ]
  }
}

export function OnboardingWizard({ onPathSelected }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Partial<UserSegment>>({})
  const [recommendedPath, setRecommendedPath] = useState<OnboardingPath | null>(null)

  const getRecommendedPath = (segment: UserSegment): OnboardingPath => {
    return PATHS[segment.calendarProvider] || PATHS.google
  }

  const handleAnswer = (questionId: string, value: string) => {
    const newAnswers = { ...answers, [questionId]: value }
    setAnswers(newAnswers)

    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // All questions answered, generate recommendation
      const segment = newAnswers as UserSegment
      const path = getRecommendedPath(segment)
      setRecommendedPath(path)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSelectPath = async () => {
    if (recommendedPath) {
      const segment = answers as UserSegment
      // Store the sync approach in localStorage for use during calendar feed creation
      // We no longer store this on the user level, but per calendar feed
      onPathSelected(recommendedPath, segment)
    }
  }

  const handleBackToQuestions = () => {
    setRecommendedPath(null)
    setCurrentStep(QUESTIONS.length - 1)
  }

  // Show recommendation screen
  if (recommendedPath) {
    return (
      <div className="max-w-xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-xl font-semibold">Recommended Setup</h2>
          <p className="text-sm text-muted-foreground">
              Based on your answers, here&apos;s the best approach
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                {recommendedPath.icon}
              </div>
              <div className="flex-1">
                <CardTitle className="text-lg">{recommendedPath.title}</CardTitle>
                <CardDescription>{recommendedPath.description}</CardDescription>
              </div>
              <div className="text-right text-sm text-muted-foreground">
                {recommendedPath.estimatedTime}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">What you&apos;ll get:</h4>
              <ul className="space-y-1">
                {recommendedPath.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleSelectPath} className="flex-1">
                <ArrowRight className="mr-2 h-4 w-4" />
                Start Setup
              </Button>
              <Button variant="outline" onClick={handleBackToQuestions}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show questions
  const currentQuestion = QUESTIONS[currentStep]

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Progress indicator */}
      <div className="flex items-center justify-center space-x-2">
        {QUESTIONS.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${
              index <= currentStep ? 'bg-primary' : 'bg-muted'
            }`}
          />
        ))}
      </div>

      {/* Question */}
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">{currentQuestion.title}</CardTitle>
          <CardDescription>{currentQuestion.subtitle}</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={answers[currentQuestion.id as keyof UserSegment] || ''}
            onValueChange={(value) => handleAnswer(currentQuestion.id, value)}
          >
            <div className="space-y-3">
              {currentQuestion.options.map((option) => (
                <div key={option.value} className="flex items-center space-x-3">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label 
                    htmlFor={option.value} 
                    className="flex-1 flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    {option.icon}
                    <span>{option.label}</span>
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <span className="text-sm text-muted-foreground">
          {currentStep + 1} of {QUESTIONS.length}
        </span>
      </div>
    </div>
  )
} 