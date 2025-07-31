'use client'

import React, { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogAction, AlertDialogCancel } from '@/components/ui/alert-dialog'
import { Clock, CheckCircle, AlertCircle, Trash2 } from 'lucide-react'
import type { SupabaseUser } from '@/lib/types/invitation'

interface UserListProps {
  users: SupabaseUser[]
  onCancelInvitation: (userId: string) => void
  isCancelling: boolean
}

export function UserList({ users, onCancelInvitation, isCancelling }: UserListProps) {
  const [cancelDialog, setCancelDialog] = useState<{ open: boolean; user: SupabaseUser | null }>({
    open: false,
    user: null
  })

  const handleCancelClick = (user: SupabaseUser) => {
    setCancelDialog({ open: true, user })
  }

  const handleConfirmCancel = () => {
    if (cancelDialog.user) {
      onCancelInvitation(cancelDialog.user.id)
    }
    setCancelDialog({ open: false, user: null })
  }

  const handleCancelDialogClose = () => {
    setCancelDialog({ open: false, user: null })
  }
  const getStatusBadge = (user: SupabaseUser) => {
    if (user.email_confirmed_at) {
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
    if (user.invited_at) {
      return (
        <Badge className="bg-yellow-100 text-yellow-800">
          <Clock className="w-3 h-3 mr-1" />
          Pending Invitation
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

  const formatDate = (dateString?: string) => {
    return dateString ? new Date(dateString).toLocaleDateString() : 'Never'
  }

  return (
    <div className="space-y-4">
      {users.map((user) => (
        <Card key={user.id}>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{user.email}</span>
                      {getStatusBadge(user)}
                    </div>
                    {user.user_metadata.full_name && (
                      <div className="text-sm text-muted-foreground">
                        {user.user_metadata.full_name}
                      </div>
                    )}
                    {user.user_metadata.role && (
                      <Badge variant="outline" className="mt-1">
                        {user.user_metadata.role}
                      </Badge>
                    )}
                  </div>
                </div>
                
                {user.user_metadata.invitation_message && (
                  <div className="text-sm text-muted-foreground italic">
                    &quot;{user.user_metadata.invitation_message}&quot;
                  </div>
                )}
                
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>Created: {formatDate(user.created_at)}</div>
                  {user.invited_at && (
                    <div>Invited: {formatDate(user.invited_at)}</div>
                  )}
                  {user.email_confirmed_at && (
                    <div>Confirmed: {formatDate(user.email_confirmed_at)}</div>
                  )}
                  {user.last_sign_in_at && (
                    <div>Last Sign In: {formatDate(user.last_sign_in_at)}</div>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2">
                {user.invited_at && !user.email_confirmed_at && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleCancelClick(user)}
                    disabled={isCancelling}
                    title="Cancel invitation"
                    className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 border-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      {/* Cancel Invitation Dialog */}
      <AlertDialog open={cancelDialog.open} onOpenChange={handleCancelDialogClose}>
        <AlertDialogContent className="border-red-200 bg-gradient-to-br from-red-50/80 to-orange-50/80 backdrop-blur-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-800">
              <Trash2 className="h-5 w-5 text-red-500" />
              Cancel Invitation?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-red-700 space-y-2">
              <p>
                Are you sure you want to cancel the invitation for <strong>{cancelDialog.user?.email}</strong>?
              </p>
              <p className="text-sm">
                This will permanently delete their account and they won&apos;t be able to access avara.studio.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              onClick={handleCancelDialogClose}
              className="border-red-200 hover:bg-red-100"
            >
              Keep Invitation
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmCancel}
              disabled={isCancelling}
              className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white border-0"
            >
              {isCancelling ? 'Cancelling...' : 'Cancel Invitation'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}