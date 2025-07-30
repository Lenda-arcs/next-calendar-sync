'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { useAllInvitations, useCreateInvitation, useCancelInvitation } from '@/lib/hooks/useAppQuery'
import { UserPlus, Copy, X, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import type { UserInvitation } from '@/lib/server/data-access'

interface CreateInvitationForm {
  email: string
  invitedName: string
  personalMessage: string
  expiryDays: number
  notes: string
}

export function InvitationManagement() {
  const [showCreateForm, setShowCreateForm] = React.useState(false)
  const [isCreating, setIsCreating] = React.useState(false)
  const [formData, setFormData] = React.useState<CreateInvitationForm>({
    email: '',
    invitedName: '',
    personalMessage: '',
    expiryDays: 7,
    notes: ''
  })

  // ✨ NEW: Use unified hooks
  const { data: invitations, isLoading, refetch } = useAllInvitations()
  const createInvitationMutation = useCreateInvitation()
  const cancelInvitationMutation = useCancelInvitation()

  const handleCreateInvitation = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsCreating(true)

    try {
      // ✨ NEW: Use unified mutation
      const result = await createInvitationMutation.mutateAsync({
        email: formData.email,
        invited_name: formData.invitedName,
        personal_message: formData.personalMessage,
        expiry_days: formData.expiryDays,
        notes: formData.notes,
      })

      toast.success('Invitation created successfully')
      
      // Copy invitation link to clipboard
      if (result.invitationLink) {
        await navigator.clipboard.writeText(result.invitationLink)
        toast.success('Invitation link copied to clipboard')
      }

      // Reset form and close
      setFormData({
        email: '',
        invitedName: '',
        personalMessage: '',
        expiryDays: 7,
        notes: ''
      })
      setShowCreateForm(false)
      refetch()

    } catch (error) {
      console.error('Error creating invitation:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to create invitation')
    } finally {
      setIsCreating(false)
    }
  }

  const handleCancelInvitation = async (invitationId: string) => {
    try {
      // ✨ NEW: Use unified mutation
      await cancelInvitationMutation.mutateAsync(invitationId)

      toast.success('Invitation cancelled')
      refetch()

    } catch (error) {
      console.error('Error cancelling invitation:', error)
      toast.error('Failed to cancel invitation')
    }
  }

  const copyInvitationLink = async (token: string) => {
    const baseUrl = window.location.origin
    const invitationLink = `${baseUrl}/auth/register?token=${token}`
    
    try {
      await navigator.clipboard.writeText(invitationLink)
      toast.success('Invitation link copied to clipboard')
    } catch {
      toast.error('Failed to copy link')
    }
  }

  const getStatusBadge = (invitation: UserInvitation) => {
    const isExpired = new Date(invitation.expires_at) < new Date()
    
    if (invitation.status === 'accepted') {
      return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Accepted</Badge>
    }
    if (invitation.status === 'cancelled') {
      return <Badge className="bg-gray-100 text-gray-800"><XCircle className="w-3 h-3 mr-1" />Cancelled</Badge>
    }
    if (isExpired) {
      return <Badge className="bg-red-100 text-red-800"><AlertCircle className="w-3 h-3 mr-1" />Expired</Badge>
    }
    return <Badge className="bg-blue-100 text-blue-800"><Clock className="w-3 h-3 mr-1" />Pending</Badge>
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Teacher Invitations
            </CardTitle>
            <CardDescription>
              Manage invitations for teachers to join the beta
            </CardDescription>
          </div>
          <Button onClick={() => setShowCreateForm(!showCreateForm)}>
            {showCreateForm ? 'Cancel' : 'Create Invitation'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {showCreateForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Create New Invitation</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateInvitation} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="invitedName">Teacher Name</Label>
                    <Input
                      id="invitedName"
                      value={formData.invitedName}
                      onChange={(e) => setFormData(prev => ({ ...prev, invitedName: e.target.value }))}
                      placeholder="Optional"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="personalMessage">Personal Message</Label>
                  <Textarea
                    id="personalMessage"
                    value={formData.personalMessage}
                    onChange={(e) => setFormData(prev => ({ ...prev, personalMessage: e.target.value }))}
                    placeholder="Optional welcome message for the teacher"
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiryDays">Expiry (Days)</Label>
                    <Input
                      id="expiryDays"
                      type="number"
                      min="1"
                      max="30"
                      value={formData.expiryDays}
                      onChange={(e) => setFormData(prev => ({ ...prev, expiryDays: Number(e.target.value) }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="notes">Internal Notes</Label>
                    <Input
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Internal notes (not visible to teacher)"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isCreating}>
                    {isCreating ? 'Creating...' : 'Create Invitation'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {isLoading ? (
          <div className="text-center py-8">
            <div className="text-sm text-muted-foreground">Loading invitations...</div>
          </div>
        ) : (
          <div className="space-y-4">
            {invitations && invitations.length > 0 ? (
              invitations.map((invitation: UserInvitation) => (
                <Card key={invitation.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{invitation.email}</span>
                          {getStatusBadge(invitation)}
                        </div>
                        {invitation.invited_name && (
                          <div className="text-sm text-muted-foreground">
                            Name: {invitation.invited_name}
                          </div>
                        )}
                        {invitation.personal_message && (
                          <div className="text-sm text-muted-foreground italic">
                            &quot;{invitation.personal_message}&quot;
                          </div>
                        )}
                        <div className="text-xs text-muted-foreground">
                          Created: {new Date(invitation.created_at).toLocaleDateString()}
                          {' • '}
                          Expires: {new Date(invitation.expires_at).toLocaleDateString()}
                          {invitation.used_at && (
                            <>
                              {' • '}
                              Used: {new Date(invitation.used_at).toLocaleDateString()}
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {invitation.status === 'pending' && new Date(invitation.expires_at) > new Date() && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyInvitationLink(invitation.token)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCancelInvitation(invitation.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <div className="text-sm text-muted-foreground">No invitations created yet</div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 