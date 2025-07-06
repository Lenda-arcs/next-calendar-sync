'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { UnifiedDialog } from "@/components/ui/unified-dialog"

import { CalendarInvitation } from "@/lib/types"
import { toast } from "sonner"
import { 
  Mail, 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  AlertTriangle, 
  Plus,
  Trash2,
  RefreshCw,
  Copy
} from "lucide-react"

interface EmailInvitationSystemProps {
  user: { id: string; name?: string | null } | null
}

export function EmailInvitationSystem({ user }: EmailInvitationSystemProps) {
  const [invitations, setInvitations] = useState<CalendarInvitation[]>([])
  const [loading, setLoading] = useState(false)
  const [creating, setCreating] = useState(false)
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  const fetchInvitations = useCallback(async () => {
    if (!user) return
    
    try {
      setLoading(true)
      const response = await fetch('/api/calendar-invitations')
      
      if (!response.ok) {
        throw new Error('Failed to fetch invitations')
      }
      
      const data = await response.json()
      setInvitations(data.invitations || [])
    } catch (error) {
      console.error('Error fetching invitations:', error)
      toast.error('Failed to load calendar invitations')
    } finally {
      setLoading(false)
    }
  }, [user])

  // Fetch invitations on component mount
  useEffect(() => {
    if (user) {
      fetchInvitations()
    }
  }, [user, fetchInvitations])

  const createInvitation = async () => {
    if (!user) return
    
    try {
      setCreating(true)
      const response = await fetch('/api/calendar-invitations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          expiry_hours: 72 // 3 days default
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to create invitation')
      }
      
      await response.json()
      toast.success('Calendar invitation created successfully!')
      setShowCreateDialog(false)
      
      // Refresh invitations list
      await fetchInvitations()
    } catch (error) {
      console.error('Error creating invitation:', error)
      toast.error('Failed to create calendar invitation')
    } finally {
      setCreating(false)
    }
  }

  const cancelInvitation = async (invitationId: string) => {
    try {
      const response = await fetch(`/api/calendar-invitations/${invitationId}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        throw new Error('Failed to cancel invitation')
      }
      
      toast.success('Calendar invitation cancelled')
      await fetchInvitations()
    } catch (error) {
      console.error('Error cancelling invitation:', error)
      toast.error('Failed to cancel invitation')
    }
  }

  const getStatusIcon = (status: CalendarInvitation['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-blue-600" />
      case 'accepted':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'expired':
        return <AlertTriangle className="h-4 w-4 text-orange-600" />
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: CalendarInvitation['status']) => {
    switch (status) {
      case 'pending': return 'blue'
      case 'accepted': return 'green'
      case 'expired': return 'orange'
      case 'cancelled': return 'red'
      default: return 'gray'
    }
  }

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date()
  }

  const formatExpiryDate = (expiresAt: string) => {
    const date = new Date(expiresAt)
    const now = new Date()
    const diffMs = date.getTime() - now.getTime()
    const diffHours = Math.ceil(diffMs / (1000 * 60 * 60))
    
    if (diffHours < 0) {
      return 'Expired'
    } else if (diffHours < 24) {
      return `Expires in ${diffHours} hours`
    } else {
      const diffDays = Math.ceil(diffHours / 24)
      return `Expires in ${diffDays} days`
    }
  }

  const activeInvitations = invitations.filter(inv => 
    inv.status === 'pending' && !isExpired(inv.expires_at)
  )

  const createDialogContent = (
    <div className="space-y-6">
      <Card variant="glass" className="p-4 bg-blue-50/50 dark:bg-blue-950/30 border-blue-200/50">
        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
          <Mail className="h-4 w-4" />
          How Email Invitations Work
        </h4>
                 <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-3">
           <li className="flex items-start gap-2">
             <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></span>
             <div>
               <strong>We&apos;ll generate a unique email address</strong> for you
             </div>
           </li>
           <li className="flex items-start gap-2">
             <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></span>
             <div>
               <strong>Go to your calendar app</strong> (Google Calendar, Outlook, Apple Calendar)
               <br />
               <em className="text-xs opacity-75">Create or edit an event and add this email as a guest/attendee</em>
             </div>
           </li>
           <li className="flex items-start gap-2">
             <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></span>
             <div>
               <strong>Send the calendar invitation</strong> and we&apos;ll automatically sync your events
             </div>
           </li>
         </ul>
      </Card>
      
      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-4">
          This invitation will expire in 3 days for security.
        </p>
      </div>
    </div>
  )

  const footerContent = (
    <>
      <Button variant="outline" onClick={() => setShowCreateDialog(false)} disabled={creating}>
        Cancel
      </Button>
      <Button onClick={createInvitation} disabled={creating}>
        {creating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
        {creating ? 'Creating...' : 'Create Invitation'}
      </Button>
    </>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Email Calendar Invitations</h3>
          <p className="text-sm text-muted-foreground">
            Invite our system to your calendar for automatic syncing
          </p>
        </div>
        <Button 
          onClick={() => setShowCreateDialog(true)}
          disabled={activeInvitations.length >= 3} // Limit active invitations
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Invitation
        </Button>
      </div>

      {/* Active Invitations */}
      {activeInvitations.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-green-700 dark:text-green-300">
            Active Invitations ({activeInvitations.length})
          </h4>
          {activeInvitations.map((invitation) => (
            <Card key={invitation.id} variant="glass" className="p-4 bg-green-50/50 border-green-200/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Mail className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                                         <div className="flex items-center gap-2 mb-1">
                       <code className="text-sm font-mono bg-white/80 px-2 py-1 rounded border">
                         {invitation.invitation_email}
                       </code>
                       <Button 
                         variant="ghost"
                         size="sm"
                         onClick={() => {
                           navigator.clipboard.writeText(invitation.invitation_email)
                           toast.success('Email address copied!')
                         }}
                       >
                         <Copy className="h-3 w-3 mr-1" />
                         Copy
                       </Button>
                     </div>
                    <p className="text-xs text-green-600 font-medium">
                      {formatExpiryDate(invitation.expires_at)}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => cancelInvitation(invitation.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Cancel
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* All Invitations History */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">Invitation History</h4>
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchInvitations}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
        
        {loading ? (
          <Card variant="ghost" className="text-center py-8">
            <CardContent>
              <Loader2 className="h-8 w-8 mx-auto mb-4 text-muted-foreground animate-spin" />
              <p className="text-muted-foreground">Loading invitations...</p>
            </CardContent>
          </Card>
        ) : invitations.length === 0 ? (
          <Card variant="ghost" className="text-center py-8">
            <CardContent>
              <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                No calendar invitations yet. Create one to get started!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {invitations.map((invitation) => (
              <Card key={invitation.id} variant="default" className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(invitation.status)}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <code className="text-xs font-mono">
                          {invitation.invitation_email}
                        </code>
                        <Badge variant="outline" className={`text-xs bg-${getStatusColor(invitation.status)}-50`}>
                          {invitation.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Created {new Date(invitation.created_at).toLocaleDateString()}
                        {invitation.status === 'pending' && ` • ${formatExpiryDate(invitation.expires_at)}`}
                      </p>
                    </div>
                  </div>
                                     {invitation.status === 'pending' && !isExpired(invitation.expires_at) && (
                     <Button
                       variant="ghost"
                       size="sm"
                       onClick={() => {
                         navigator.clipboard.writeText(invitation.invitation_email)
                         toast.success('Email address copied!')
                       }}
                     >
                       <Copy className="h-3 w-3 mr-1" />
                       Copy
                     </Button>
                   )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Create Invitation Dialog */}
      <UnifiedDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        size="md"
        title={
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Create Calendar Invitation
          </div>
        }
        description="Generate a unique email address to invite to your calendar for automatic syncing."
        footer={footerContent}
      >
        {createDialogContent}
      </UnifiedDialog>
    </div>
  )
} 