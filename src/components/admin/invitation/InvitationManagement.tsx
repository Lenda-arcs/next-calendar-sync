'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import DataLoader from '@/components/ui/data-loader'
import { UserPlus, Info, Sparkles } from 'lucide-react'
import { useInvitationManagement } from '@/hooks/useInvitationManagement'
import { EnhancedInvitationForm } from './EnhancedInvitationForm'
import { InvitationStats } from './InvitationStats'
import { UserList } from './UserList'

/**
 * Main invitation management component
 * Orchestrates all invitation-related functionality
 */
export function InvitationManagement() {
  const [showInvitationDialog, setShowInvitationDialog] = useState(false)
  
  const {
    allUsers,
    stats,
    formData,
    formErrors,
    isLoading,
    usersError,
    isSubmitting,
    isCancelling,
    submitError,
    handleFormDataChange,
    handleSubmit,
    handleCancelInvitation,
    resetForm
  } = useInvitationManagement()

  const handleFormSubmit = async (e: React.FormEvent) => {
    try {
      await handleSubmit(e)
      // Close dialog on successful submission
      setShowInvitationDialog(false)
    } catch (error) {
      // Error handling is done in the hook, dialog stays open
      console.error('Failed to submit invitation:', error)
    }
  }

  const handleDialogOpenChange = (open: boolean) => {
    setShowInvitationDialog(open)
    if (!open) {
      resetForm()
    }
  }

  return (
    <div className="space-y-6">
      {/* System Info Alert */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Upgraded System:</strong> Now using Supabase&apos;s built-in invitation system. 
          Users are tracked directly in Supabase Auth with automatic email handling and state management.
        </AlertDescription>
      </Alert>

      {/* Enhanced Create Invitation Section */}
      <Card className="bg-gradient-to-br from-white to-pink-50/30">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <div className="relative">
                  <Sparkles className="h-5 w-5 text-pink-500" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full animate-pulse" />
                </div>
                <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  Send Branded Beta Invitation
                </span>
              </CardTitle>
              <CardDescription className="flex items-center gap-2">
                <UserPlus className="h-4 w-4 text-purple-500" />
                Create beautiful yoga instructor invitations with multi-language support
              </CardDescription>
            </div>
            <Button 
              onClick={() => setShowInvitationDialog(true)}
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white border-0"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Create Invitation
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Enhanced Invitation Dialog */}
      <EnhancedInvitationForm
        open={showInvitationDialog}
        onOpenChange={handleDialogOpenChange}
        formData={{
          ...formData,
          language: formData.language || 'en'
        }}
        formErrors={formErrors}
        isSubmitting={isSubmitting}
        onSubmit={handleFormSubmit}
        onFormDataChange={handleFormDataChange}
        submitError={submitError}
      />

      {/* Statistics */}
      <InvitationStats stats={stats} />

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            All Users & Invitations
          </CardTitle>
          <CardDescription>
            Real-time data from Supabase Auth - including pending invitations and confirmed users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataLoader
            data={allUsers}
            loading={isLoading}
            error={usersError ? 'Failed to load users from Supabase Auth' : null}
            empty={
              <div className="text-center py-12">
                <UserPlus className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No Users Yet</h3>
                <p className="text-muted-foreground mb-4">Send your first invitation to get started.</p>
                <Button onClick={() => setShowInvitationDialog(true)}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Send Invitation
                </Button>
              </div>
            }
          >
            {(users) => (
              <UserList
                users={users}
                onCancelInvitation={handleCancelInvitation}
                isCancelling={isCancelling}
              />
            )}
          </DataLoader>
        </CardContent>
      </Card>
    </div>
  )
}