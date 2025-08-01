'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

import { UnifiedDialog } from '@/components/ui/unified-dialog'
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogAction, AlertDialogCancel } from '@/components/ui/alert-dialog'
import { AlertCircle, Mail, Globe, Sparkles, Users, MessageSquare, Crown } from 'lucide-react'
import type { EnhancedInvitationRequest, UserRole } from '@/lib/types/invitation'

interface EnhancedInvitationFormData extends EnhancedInvitationRequest {
  email: string
  invitedName: string
  personalMessage: string
  role: UserRole
  language: 'en' | 'de' | 'es'
  timeZone?: string
}

interface InvitationFormErrors {
  email?: string
  invitedName?: string
  personalMessage?: string
}

interface EnhancedInvitationFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  formData: EnhancedInvitationFormData
  formErrors: InvitationFormErrors
  isSubmitting: boolean
  onSubmit: (e: React.FormEvent) => void
  onFormDataChange: (data: Partial<EnhancedInvitationFormData>) => void
  submitError?: string
}

export function EnhancedInvitationForm({
  open,
  onOpenChange,
  formData,
  formErrors,
  isSubmitting,
  onSubmit,
  onFormDataChange,
  submitError
}: EnhancedInvitationFormProps) {
  const [showCancelDialog, setShowCancelDialog] = React.useState(false)
  const handleInputChange = (field: keyof EnhancedInvitationFormData) => 
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      onFormDataChange({ [field]: e.target.value })
    }

  const handleCancel = () => {
    // Check if form has data, show confirmation if it does
    const hasData = formData.email || formData.invitedName || formData.personalMessage
    if (hasData && !isSubmitting) {
      setShowCancelDialog(true)
    } else {
      onOpenChange(false)
    }
  }

  const confirmCancel = () => {
    setShowCancelDialog(false)
    onOpenChange(false)
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(e)
  }

  const languageOptions = [
    { value: 'en', label: '🇺🇸 English', flag: '🇺🇸' },
    { value: 'de', label: '🇩🇪 Deutsch', flag: '🇩🇪' },
    { value: 'es', label: '🇪🇸 Español', flag: '🇪🇸' }
  ]

  const getEmailPreviewText = () => {
    const previews = {
      en: {
        subject: '🧘‍♀️ Welcome to avara.studio Beta - Your Invitation Awaits',
        preview: 'You\'ve been invited to try avara.studio Beta - the yoga class planner with public student pages and invoice management...'
      },
      de: {
        subject: '🧘‍♀️ Willkommen bei avara.studio Beta - Ihre Einladung wartet',
        preview: 'Sie sind eingeladen, avara.studio Beta zu testen - den Yoga-Klassen Planer mit öffentlichen Schülerseiten...'
      },
      es: {
        subject: '🧘‍♀️ Bienvenido a avara.studio Beta - Tu invitación te espera',
        preview: 'Estás invitado a probar avara.studio Beta - el planificador de clases de yoga con páginas públicas para estudiantes...'
      }
    }
    return previews[formData.language] || previews.en
  }

  const preview = getEmailPreviewText()

  return (
    <>
      <UnifiedDialog
        open={open}
        onOpenChange={onOpenChange}
        size="lg"
        title={
          <div className="flex items-center gap-3">
            <Mail className="h-6 w-6 text-foreground" />
            <span className="text-foreground">
              Send Beta Invitation
            </span>
          </div>
        }
        description={
          <span className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4" />
            Create a yoga instructor invitation with multi-language support
          </span>
        }
        footer={
          <div className="flex gap-3 w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="flex-1 sm:flex-none"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting} 
              form="invitation-form"
              className="flex-1 sm:flex-none"
              loading={isSubmitting}
            >
              <Mail className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Sending...' : 'Send Invitation'}
            </Button>
          </div>
        }
      >
        <form id="invitation-form" onSubmit={handleFormSubmit} className="space-y-6">
          {/* Enhanced Basic Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <Users className="h-5 w-5 text-muted-foreground" />
              <h3 className="font-medium text-foreground">Instructor Details</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  placeholder="yoga.instructor@example.com"
                  disabled={isSubmitting}
                />
                {formErrors.email && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {formErrors.email}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="invitedName" className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  Full Name *
                </Label>
                <Input
                  id="invitedName"
                  value={formData.invitedName}
                  onChange={handleInputChange('invitedName')}
                  placeholder="Sarah Johnson"
                  disabled={isSubmitting}
                />
                {formErrors.invitedName && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {formErrors.invitedName}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Enhanced Role and Language Selection */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <Crown className="h-5 w-5 text-muted-foreground" />
              <h3 className="font-medium text-foreground">Access & Language</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role" className="flex items-center gap-2">
                  <Crown className="h-4 w-4 text-muted-foreground" />
                  Role
                </Label>
                <div className="relative">
                  <select 
                    value={formData.role} 
                    onChange={(e) => onFormDataChange({ role: e.target.value as UserRole })}
                    disabled={isSubmitting}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                  >
                    <option value="teacher">🧘‍♀️ Yoga Instructor</option>
                    <option value="admin">👑 Admin</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <Crown className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="language" className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  Email Language
                </Label>
                <div className="relative">
                  <select 
                    value={formData.language} 
                    onChange={(e) => onFormDataChange({ language: e.target.value as 'en' | 'de' | 'es' })}
                    disabled={isSubmitting}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                  >
                    {languageOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Personal Message */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <MessageSquare className="h-5 w-5 text-muted-foreground" />
              <h3 className="font-medium text-foreground">Personal Touch</h3>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="personalMessage" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                Personal Welcome Message (Optional)
              </Label>
              <Textarea
                id="personalMessage"
                value={formData.personalMessage}
                onChange={handleInputChange('personalMessage')}
                placeholder="Add a personal welcome message that will make this yoga instructor feel special..."
                rows={4}
                disabled={isSubmitting}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                This message will be highlighted in the invitation email
              </p>
            </div>
          </div>

          {/* Enhanced Email Preview */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <h3 className="font-medium text-foreground">Email Preview</h3>
            </div>
            
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-xl blur opacity-20 animate-pulse"></div>
              <div className="relative p-6 bg-gradient-to-br from-pink-50/80 via-purple-50/80 to-blue-50/80 backdrop-blur-sm border border-white/50 rounded-xl">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 p-3 bg-white/60 rounded-lg">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 animate-pulse"></div>
                    <div className="text-sm font-semibold text-gray-800">
                      <strong>Subject:</strong> {preview.subject}
                    </div>
                  </div>
                  <div className="p-3 bg-white/40 rounded-lg">
                    <div className="text-sm text-gray-700 leading-relaxed">
                      <strong>Preview:</strong> {preview.preview}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-orange-100/50 to-pink-100/50 rounded-lg">
                    <Sparkles className="h-4 w-4 text-orange-500 animate-pulse" />
                    <div className="text-xs text-gray-600">
                      Your invitation will feature elegant glassmorphism design with avara.studio branding
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Advanced Options */}
          <details className="group">
            <summary className="flex items-center gap-2 cursor-pointer p-3 rounded-lg bg-muted/50 hover:bg-muted transition-all border border-border">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-muted-foreground"></div>
                <span className="text-sm font-medium text-foreground group-hover:text-foreground">
                  Advanced Options (Optional)
                </span>
              </div>
              <div className="ml-auto transform group-open:rotate-180 transition-transform">
                <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </summary>
            <div className="mt-4 pl-6 space-y-4 border-l-2 border-border">
              <div className="space-y-2">
                <Label htmlFor="timeZone" className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  Time Zone
                </Label>
                <Input
                  id="timeZone"
                  value={formData.timeZone || ''}
                  onChange={handleInputChange('timeZone')}
                  placeholder="Europe/Berlin, America/New_York, etc."
                  disabled={isSubmitting}
                />
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  Helps optimize scheduling experience for the yoga instructor
                </p>
              </div>
            </div>
          </details>
          
          {submitError && (
            <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md dark:text-red-400 dark:bg-red-950/50 dark:border-red-800">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>Failed to send invitation: {submitError}</span>
            </div>
          )}
        </form>
      </UnifiedDialog>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Discard Invitation?
            </AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes in the invitation form. Are you sure you want to discard them?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowCancelDialog(false)}>
              Keep Editing
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmCancel}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Discard Changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}