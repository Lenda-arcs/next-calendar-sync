'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import DataLoader from '@/components/ui/data-loader'
import { useAllUsers, useDeleteUser } from '@/lib/hooks/useAppQuery'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Users, Trash2, Crown, Star, Calendar, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'
import { PATHS } from '@/lib/paths'
import Link from 'next/link'

interface User {
  id: string
  email: string | null
  name: string | null
  role: string
  created_at: string | null
  calendar_feed_count: number
  is_featured: boolean | null
  public_url: string | null
}

export function UserManagement() {
  const [deletingUserId, setDeletingUserId] = React.useState<string | null>(null)

  // ✨ NEW: Use unified hooks
  const { data: users, isLoading, error: usersError, refetch } = useAllUsers()
  const deleteUserMutation = useDeleteUser()

  const handleDeleteUser = async (userId: string, userName: string | null, userEmail: string | null) => {
    setDeletingUserId(userId)

    try {
      // Call the admin API endpoint that uses delete_user_cascade
      const result = await deleteUserMutation.mutateAsync(userId)

      toast.success(result.message || `User ${userName || userEmail} has been completely removed`)
      refetch()

    } catch (error) {
      console.error('Error deleting user:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to delete user')
    } finally {
      setDeletingUserId(null)
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-purple-100 text-purple-800"><Crown className="w-3 h-3 mr-1" />Admin</Badge>
      case 'moderator':
        return <Badge className="bg-blue-100 text-blue-800">Moderator</Badge>
      default:
        return <Badge variant="outline">User</Badge>
    }
  }

  const getStatusIndicators = (user: User) => {
    const indicators = []
    
    if (user.is_featured) {
      indicators.push(
        <Badge key="featured" className="bg-yellow-100 text-yellow-800">
          <Star className="w-3 h-3 mr-1" />Featured
        </Badge>
      )
    }
    
    if (user.calendar_feed_count > 0) {
      indicators.push(
        <Badge key="calendar" variant="outline">
          <Calendar className="w-3 h-3 mr-1" />{user.calendar_feed_count} feeds
        </Badge>
      )
    }
    
    if (user.public_url) {
      indicators.push(
        <Badge key="public" className="bg-green-100 text-green-800">
          <ExternalLink className="w-3 h-3 mr-1" />Public
        </Badge>
      )
    }
    
    return indicators
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Unknown'
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              User Management
            </CardTitle>
            <CardDescription>
              Manage platform users and their accounts
            </CardDescription>
          </div>
          <div className="text-sm text-muted-foreground">
            {users?.length || 0} total users
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <DataLoader
          data={users}
          loading={isLoading}
          error={usersError ? 'Failed to load users' : null}
          empty={
            <div className="text-center py-12">
              <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No Users Found</h3>
              <p className="text-muted-foreground">No users are currently registered in the system.</p>
            </div>
          }
        >
          {(loadedUsers) => (
            <div className="space-y-4">
              {(loadedUsers || []).map((user: User) => (
                <Card key={user.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium">
                            {user.name || 'Unnamed User'}
                          </span>
                          {getRoleBadge(user.role)}
                          {getStatusIndicators(user).map(indicator => indicator)}
                        </div>
                        
                        <div className="text-sm text-muted-foreground">
                          <div>{user.email || 'No email'}</div>
                          <div>Joined: {formatDate(user.created_at)}</div>
                          {user.public_url && (
                            <div className="flex items-center gap-1">
                              Schedule: 
                              <Link 
                                href={PATHS.DYNAMIC.TEACHER_SCHEDULE(user.public_url)}
                                className="text-primary hover:text-primary/80 font-medium"
                                target="_blank"
                              >
                                /{user.public_url}
                                <ExternalLink className="w-3 h-3 ml-1 inline" />
                              </Link>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {/* Only allow deletion of non-admin users */}
                        {user.role !== 'admin' && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-destructive hover:text-destructive"
                                disabled={deletingUserId === user.id}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete User Account</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to permanently delete {user.name || user.email}?
                                  This will remove all associated data including events, tags, calendar feeds, and invoices.
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteUser(user.id, user.name, user.email)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  disabled={deletingUserId === user.id}
                                >
                                  {deletingUserId === user.id ? 'Deleting...' : 'Delete User'}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                        {user.role === 'admin' && (
                          <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                            Protected
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </DataLoader>
      </CardContent>
    </Card>
  )
}