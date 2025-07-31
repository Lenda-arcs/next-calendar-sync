'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
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
            <div className="relative">
              <Sparkles className="h-6 w-6 text-pink-500" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full animate-pulse" />
            </div>
            <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Send Branded Beta Invitation
            </span>
          </div>
        }
        description={
          <span className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4" />
            Create a beautifully designed yoga instructor invitation with multi-language support
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
              className="flex-1 sm:flex-none bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white border-0"
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
            <div className="flex items-center gap-2 pb-2 border-b border-pink-100">
              <Users className="h-5 w-5 text-pink-500" />
              <h3 className="font-medium text-gray-900">Instructor Details</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-pink-500" />
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  placeholder="yoga.instructor@example.com"
                  disabled={isSubmitting}
                  className="border-pink-200 focus:border-pink-400 focus:ring-pink-200"
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
                  <Users className="h-4 w-4 text-purple-500" />
                  Full Name *
                </Label>
                <Input
                  id="invitedName"
                  value={formData.invitedName}
                  onChange={handleInputChange('invitedName')}
                  placeholder="Sarah Johnson"
                  disabled={isSubmitting}
                  className="border-purple-200 focus:border-purple-400 focus:ring-purple-200"
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
            <div className="flex items-center gap-2 pb-2 border-b border-purple-100">
              <Crown className="h-5 w-5 text-purple-500" />
              <h3 className="font-medium text-gray-900">Access & Language</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role" className="flex items-center gap-2">
                  <Crown className="h-4 w-4 text-pink-500" />
                  Role
                </Label>
                <div className="relative">
                  <select 
                    value={formData.role} 
                    onChange={(e) => onFormDataChange({ role: e.target.value as UserRole })}
                    disabled={isSubmitting}
                    className="flex h-12 w-full rounded-lg border border-pink-200 bg-white/50 backdrop-blur-sm px-4 py-2 text-sm focus:border-pink-400 focus:ring-2 focus:ring-pink-200 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                  >
                    <option value="teacher">🧘‍♀️ Yoga Instructor</option>
                    <option value="admin">👑 Admin</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <Crown className="h-4 w-4 text-pink-400" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="language" className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-blue-500" />
                  Email Language
                </Label>
                <div className="relative">
                  <select 
                    value={formData.language} 
                    onChange={(e) => onFormDataChange({ language: e.target.value as 'en' | 'de' | 'es' })}
                    disabled={isSubmitting}
                    className="flex h-12 w-full rounded-lg border border-blue-200 bg-white/50 backdrop-blur-sm px-4 py-2 text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                  >
                    {languageOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <Globe className="h-4 w-4 text-blue-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Personal Message */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-green-100">
              <MessageSquare className="h-5 w-5 text-green-500" />
              <h3 className="font-medium text-gray-900">Personal Touch</h3>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="personalMessage" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-green-500" />
                Personal Welcome Message (Optional)
              </Label>
              <Textarea
                id="personalMessage"
                value={formData.personalMessage}
                onChange={handleInputChange('personalMessage')}
                placeholder="Add a personal welcome message that will make this yoga instructor feel special..."
                rows={4}
                disabled={isSubmitting}
                className="border-green-200 focus:border-green-400 focus:ring-green-200 resize-none"
              />
              <p className="text-xs text-green-600 flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                This message will be beautifully highlighted in the invitation email
              </p>
            </div>
          </div>

          {/* Enhanced Email Preview */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-orange-100">
              <Mail className="h-5 w-5 text-orange-500" />
              <h3 className="font-medium text-gray-900">Email Preview</h3>
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
            <summary className="flex items-center gap-2 cursor-pointer p-3 rounded-lg bg-gradient-to-r from-gray-50 to-slate-50 hover:from-gray-100 hover:to-slate-100 transition-all border border-gray-200">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"></div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                  Advanced Options (Optional)
                </span>
              </div>
              <div className="ml-auto transform group-open:rotate-180 transition-transform">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </summary>
            <div className="mt-4 pl-6 space-y-4 border-l-2 border-gradient-to-b from-indigo-200 to-purple-200">
              <div className="space-y-2">
                <Label htmlFor="timeZone" className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-indigo-500" />
                  Time Zone
                </Label>
                <Input
                  id="timeZone"
                  value={formData.timeZone || ''}
                  onChange={handleInputChange('timeZone')}
                  placeholder="Europe/Berlin, America/New_York, etc."
                  disabled={isSubmitting}
                  className="border-indigo-200 focus:border-indigo-400 focus:ring-indigo-200"
                />
                <p className="text-xs text-indigo-600 flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  Helps optimize scheduling experience for the yoga instructor
                </p>
              </div>
            </div>
          </details>
          
          {submitError && (
            <Alert variant="destructive" className="border-red-200 bg-red-50/50">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="flex items-center gap-2">
                <span>Failed to send invitation:</span>
                <span className="font-medium">{submitError}</span>
              </AlertDescription>
            </Alert>
          )}
        </form>
      </UnifiedDialog>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent className="border-orange-200 bg-gradient-to-br from-orange-50/80 to-red-50/80 backdrop-blur-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-orange-800">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              Discard Invitation?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-orange-700">
              You have unsaved changes in the invitation form. Are you sure you want to discard them?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              onClick={() => setShowCancelDialog(false)}
              className="border-orange-200 hover:bg-orange-100"
            >
              Keep Editing
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmCancel}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0"
            >
              Discard Changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}