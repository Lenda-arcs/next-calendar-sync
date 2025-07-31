'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, Mail } from 'lucide-react'
import type { CreateInvitationForm, InvitationFormErrors, UserRole } from '@/lib/types/invitation'

interface InvitationFormProps {
  formData: CreateInvitationForm
  formErrors: InvitationFormErrors
  isSubmitting: boolean
  onSubmit: (e: React.FormEvent) => void
  onFormDataChange: (data: Partial<CreateInvitationForm>) => void
  onCancel: () => void
  submitError?: string
}

export function InvitationForm({
  formData,
  formErrors,
  isSubmitting,
  onSubmit,
  onFormDataChange,
  onCancel,
  submitError
}: InvitationFormProps) {
  const handleInputChange = (field: keyof CreateInvitationForm) => 
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      onFormDataChange({ [field]: e.target.value })
    }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">Send New Invitation</CardTitle>
        <CardDescription>
          This will create a user in Supabase Auth and send them a professional invitation email
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange('email')}
                placeholder="user@example.com"
                disabled={isSubmitting}
              />
              {formErrors.email && (
                <p className="text-sm text-destructive">{formErrors.email}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="invitedName">Full Name *</Label>
              <Input
                id="invitedName"
                value={formData.invitedName}
                onChange={handleInputChange('invitedName')}
                placeholder="John Doe"
                disabled={isSubmitting}
              />
              {formErrors.invitedName && (
                <p className="text-sm text-destructive">{formErrors.invitedName}</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <select 
                value={formData.role} 
                onChange={(e) => onFormDataChange({ role: e.target.value as UserRole })}
                disabled={isSubmitting}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="teacher">🧘‍♀️ Yoga Instructor</option>
                <option value="admin">👑 Admin</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">Email Language</Label>
              <select 
                value={formData.language || 'en'} 
                onChange={(e) => onFormDataChange({ language: e.target.value as 'en' | 'de' | 'es' })}
                disabled={isSubmitting}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="en">🇺🇸 English</option>
                <option value="de">🇩🇪 Deutsch</option>
                <option value="es">🇪🇸 Español</option>
              </select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="personalMessage">Personal Message (Optional)</Label>
            <Textarea
              id="personalMessage"
              value={formData.personalMessage}
              onChange={handleInputChange('personalMessage')}
              placeholder="Add a personal welcome message..."
              rows={3}
              disabled={isSubmitting}
            />
          </div>
          
          {submitError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{submitError}</AlertDescription>
            </Alert>
          )}
          
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              <Mail className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Sending...' : 'Send Invitation'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}