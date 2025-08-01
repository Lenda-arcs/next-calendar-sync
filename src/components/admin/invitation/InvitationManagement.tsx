'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

import DataLoader from '@/components/ui/data-loader'
import { UserPlus } from 'lucide-react'
import { useInvitationManagement } from '@/hooks/useInvitationManagement'
import { useAllUsers, useDeleteUser } from '@/lib/hooks/useAppQuery'
import { EnhancedInvitationForm } from './EnhancedInvitationForm'
import { InvitationStats } from './InvitationStats'
import { UnifiedUserList } from './UnifiedUserList'
import { toast } from 'sonner'

/**
 * Main invitation management component
 * Orchestrates all invitation-related functionality
 */
export function InvitationManagement() {
  const [showInvitationDialog, setShowInvitationDialog] = useState(false)
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null)
  
  // Auth users (for invitations)
  const {
    allUsers: authUsers,
    stats,
    formData,
    formErrors,
    isLoading: authLoading,
    usersError: authError,
    isSubmitting,
    isCancelling,
    submitError,
    handleFormDataChange,
    handleSubmit,
    handleCancelInvitation,
    resetForm
  } = useInvitationManagement()

  // App users (for app data and delete functionality)
  const { 
    data: appUsers, 
    isLoading: appLoading, 
    error: appError, 
    refetch: refetchAppUsers 
  } = useAllUsers()
  
  const deleteUserMutation = useDeleteUser()

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

  // Handle delete user (cascade delete for app users)
  const handleDeleteUser = async (userId: string, userName: string | null, userEmail: string | null) => {
    setDeletingUserId(userId)

    try {
      const result = await deleteUserMutation.mutateAsync(userId)
      toast.success(result.message || `User ${userName || userEmail} has been completely removed`)
      refetchAppUsers()
    } catch (error) {
      console.error('Error deleting user:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to delete user')
    } finally {
      setDeletingUserId(null)
    }
  }

  // Merge auth users with app users data
  const mergedUsers = React.useMemo(() => {
    if (!authUsers || !appUsers) return authUsers || []
    
    return authUsers.map(authUser => {
      // Find matching app user by email
      const appUser = appUsers.find(app => app.email === authUser.email)
      
      return {
        ...authUser,
        // Add app-specific data if available
        appData: appUser ? {
          id: appUser.id,
          name: appUser.name,
          role: appUser.role,
          calendar_feed_count: appUser.calendar_feed_count,
          is_featured: appUser.is_featured,
          public_url: appUser.public_url,
          created_at: appUser.created_at
        } : null
      }
    })
  }, [authUsers, appUsers])

  const isLoading = authLoading || appLoading
  const usersError = authError || appError

  return (
    <div className="space-y-6">


      {/* Enhanced Create Invitation Section */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Send Beta Invitation
              </CardTitle>
              <CardDescription className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Create yoga instructor invitations with multi-language support
              </CardDescription>
            </div>
            <Button 
              onClick={() => setShowInvitationDialog(true)}
            >
              <UserPlus className="w-4 h-4 mr-2" />
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

      {/* Unified Users List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Users & Invitations
          </CardTitle>
          <CardDescription>
            Complete user lifecycle: invitations, confirmations, and app activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataLoader
            data={mergedUsers}
            loading={isLoading}
            error={usersError ? 'Failed to load user data' : null}
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
              <UnifiedUserList
                users={users}
                onCancelInvitation={handleCancelInvitation}
                onDeleteUser={handleDeleteUser}
                isCancelling={isCancelling}
                isDeletingUserId={deletingUserId}
              />
            )}
          </DataLoader>
        </CardContent>
      </Card>
    </div>
  )
}