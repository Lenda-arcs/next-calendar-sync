'use client'

import React, { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogAction, AlertDialogCancel } from '@/components/ui/alert-dialog'
import { Clock, CheckCircle, AlertCircle, Trash2, Crown, Star, Calendar, ExternalLink, UserX } from 'lucide-react'
import { PATHS } from '@/lib/paths'
import Link from 'next/link'
import type { SupabaseUser } from '@/lib/types/invitation'

interface UnifiedUser extends SupabaseUser {
  appData?: {
    id: string
    name: string | null
    role: string
    calendar_feed_count: number
    is_featured: boolean | null
    public_url: string | null
    created_at: string | null
  } | null
}

interface UnifiedUserListProps {
  users: UnifiedUser[]
  onCancelInvitation: (userId: string) => void
  onDeleteUser: (userId: string, userName: string | null, userEmail: string | null) => void
  isCancelling: boolean
  isDeletingUserId: string | null
}

export function UnifiedUserList({ 
  users, 
  onCancelInvitation, 
  onDeleteUser, 
  isCancelling, 
  isDeletingUserId 
}: UnifiedUserListProps) {
  const [cancelDialog, setCancelDialog] = useState<{ open: boolean; user: UnifiedUser | null }>({
    open: false,
    user: null
  })
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; user: UnifiedUser | null }>({
    open: false,
    user: null
  })

  const handleCancelClick = (user: UnifiedUser) => {
    setCancelDialog({ open: true, user })
  }

  const handleDeleteClick = (user: UnifiedUser) => {
    setDeleteDialog({ open: true, user })
  }

  const handleConfirmCancel = () => {
    if (cancelDialog.user) {
      onCancelInvitation(cancelDialog.user.id)
    }
    setCancelDialog({ open: false, user: null })
  }

  const handleConfirmDelete = () => {
    if (deleteDialog.user?.appData) {
      onDeleteUser(
        deleteDialog.user.appData.id,
        deleteDialog.user.appData.name,
        deleteDialog.user.email
      )
    }
    setDeleteDialog({ open: false, user: null })
  }

  const getUnifiedStatusBadge = (user: UnifiedUser) => {
    // Pending invitation (auth user without confirmation)
    if (user.invited_at && !user.email_confirmed_at) {
      return (
        <Badge className="bg-yellow-100 text-yellow-800">
          <Clock className="w-3 h-3 mr-1" />
          Pending Invitation
        </Badge>
      )
    }
    
    // Confirmed but no app activity yet
    if (user.email_confirmed_at && !user.appData) {
      return (
        <Badge className="bg-blue-100 text-blue-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Confirmed (No App Activity)
        </Badge>
      )
    }
    
    // Active user with app data
    if (user.email_confirmed_at && user.appData) {
      if (user.last_sign_in_at) {
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Active User
          </Badge>
        )
      }
      return (
        <Badge className="bg-blue-100 text-blue-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Confirmed
        </Badge>
      )
    }

    return (
      <Badge className="bg-gray-100 text-gray-800">
        <AlertCircle className="w-3 h-3 mr-1" />
        Unknown Status
      </Badge>
    )
  }

  const getRoleBadge = (user: UnifiedUser) => {
    const role = user.appData?.role || user.user_metadata.role
    if (!role) return null
    
    switch (role) {
      case 'admin':
        return <Badge className="bg-purple-100 text-purple-800"><Crown className="w-3 h-3 mr-1" />Admin</Badge>
      case 'moderator':
        return <Badge className="bg-blue-100 text-blue-800">Moderator</Badge>
      default:
        return <Badge variant="outline">Teacher</Badge>
    }
  }

  const getAppStatusIndicators = (user: UnifiedUser) => {
    if (!user.appData) return []
    
    const indicators = []
    
    if (user.appData.is_featured) {
      indicators.push(
        <Badge key="featured" className="bg-yellow-100 text-yellow-800">
          <Star className="w-3 h-3 mr-1" />Featured
        </Badge>
      )
    }
    
    if (user.appData.calendar_feed_count > 0) {
      indicators.push(
        <Badge key="calendar" variant="outline">
          <Calendar className="w-3 h-3 mr-1" />{user.appData.calendar_feed_count} feeds
        </Badge>
      )
    }
    
    if (user.appData.public_url) {
      indicators.push(
        <Badge key="public" className="bg-green-100 text-green-800">
          <ExternalLink className="w-3 h-3 mr-1" />Public
        </Badge>
      )
    }
    
    return indicators
  }

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'Never'
    return new Date(dateString).toLocaleDateString()
  }

  const getDisplayName = (user: UnifiedUser) => {
    return user.appData?.name || user.user_metadata.full_name || 'Unnamed User'
  }

  const canDelete = (user: UnifiedUser) => {
    // Can delete if user has app data and is not an admin
    return user.appData && user.appData.role !== 'admin'
  }

  const canCancelInvitation = (user: UnifiedUser) => {
    // Can cancel if user is invited but hasn't confirmed yet
    return user.invited_at && !user.email_confirmed_at
  }

  return (
    <div className="space-y-4">
      {users.map((user) => (
        <Card key={user.id}>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium">
                    {getDisplayName(user)}
                  </span>
                  {getUnifiedStatusBadge(user)}
                  {getRoleBadge(user)}
                  {getAppStatusIndicators(user).map(indicator => indicator)}
                </div>
                
                <div className="text-sm text-muted-foreground">
                  <div>{user.email}</div>
                  {user.appData?.public_url && (
                    <div className="flex items-center gap-1">
                      Schedule: 
                      <Link 
                        href={PATHS.DYNAMIC.TEACHER_SCHEDULE(user.appData.public_url)}
                        className="text-primary hover:text-primary/80 font-medium"
                        target="_blank"
                      >
                        /{user.appData.public_url}
                        <ExternalLink className="w-3 h-3 ml-1 inline" />
                      </Link>
                    </div>
                  )}
                </div>
                
                {user.user_metadata.invitation_message && (
                  <div className="text-sm text-muted-foreground italic">
                    &quot;{user.user_metadata.invitation_message}&quot;
                  </div>
                )}
                
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>Auth Created: {formatDate(user.created_at)}</div>
                  {user.invited_at && (
                    <div>Invited: {formatDate(user.invited_at)}</div>
                  )}
                  {user.email_confirmed_at && (
                    <div>Confirmed: {formatDate(user.email_confirmed_at)}</div>
                  )}
                  {user.last_sign_in_at && (
                    <div>Last Sign In: {formatDate(user.last_sign_in_at)}</div>
                  )}
                  {user.appData?.created_at && (
                    <div>App Joined: {formatDate(user.appData.created_at)}</div>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2">
                {/* Cancel Invitation (for pending invitations) */}
                {canCancelInvitation(user) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCancelClick(user)}
                    disabled={isCancelling}
                    title="Cancel invitation"
                    className="text-destructive hover:text-destructive"
                  >
                    <UserX className="h-4 w-4" />
                  </Button>
                )}
                
                {/* Delete User (for active users with app data) */}
                {canDelete(user) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteClick(user)}
                    disabled={isDeletingUserId === user.appData?.id}
                    title="Delete user completely"
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
                
                {/* Protected admin indicator */}
                {user.appData?.role === 'admin' && (
                  <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                    Protected
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      {/* Cancel Invitation Dialog */}
      <AlertDialog open={cancelDialog.open} onOpenChange={() => setCancelDialog({ open: false, user: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <UserX className="h-5 w-5 text-destructive" />
              Cancel Invitation?
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <div>
                Are you sure you want to cancel the invitation for <strong>{cancelDialog.user?.email}</strong>?
              </div>
              <div className="text-sm">
                This will permanently delete their account and they won&apos;t be able to access avara.studio.
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setCancelDialog({ open: false, user: null })}>
              Keep Invitation
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmCancel}
              disabled={isCancelling}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isCancelling ? 'Cancelling...' : 'Cancel Invitation'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete User Dialog */}
      <AlertDialog open={deleteDialog.open} onOpenChange={() => setDeleteDialog({ open: false, user: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-destructive" />
              Delete User Account
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <div>
                Are you sure you want to permanently delete <strong>{deleteDialog.user ? getDisplayName(deleteDialog.user) : 'this user'}</strong> ({deleteDialog.user?.email})?
              </div>
              <div className="text-sm">
                This will remove all associated data including events, tags, calendar feeds, and invoices.
                This action cannot be undone.
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteDialog({ open: false, user: null })}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeletingUserId === deleteDialog.user?.appData?.id}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeletingUserId === deleteDialog.user?.appData?.id ? 'Deleting...' : 'Delete User'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}