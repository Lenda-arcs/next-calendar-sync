'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useSupabaseQuery } from '@/lib/hooks/useSupabaseQuery'
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

  // Fetch users
  const { data: users, isLoading, refetch } = useSupabaseQuery<User[]>({
    queryKey: ['admin-users'],
    fetcher: async () => {
      const response = await fetch('/api/admin/users')
      if (!response.ok) {
        throw new Error('Failed to fetch users')
      }
      const result = await response.json()
      return result.users || []
    }
  })

  const handleDeleteUser = async (userId: string, userName: string | null, userEmail: string | null) => {
    setDeletingUserId(userId)

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE'
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete user')
      }

      toast.success(`User ${userName || userEmail} has been completely removed`)
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
        {isLoading ? (
          <div className="text-center py-8">
            <div className="text-sm text-muted-foreground">Loading users...</div>
          </div>
        ) : (
          <div className="space-y-4">
            {users && users.length > 0 ? (
              users.map((user) => (
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
                        
                        <div className="text-xs text-muted-foreground">
                          ID: {user.id}
                        </div>
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        {user.role !== 'admin' && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={deletingUserId === user.id}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete User Account</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete <strong>{user.name || user.email}</strong>?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <div className="space-y-4">
                                <div className="text-sm text-red-600 font-medium">
                                  This will permanently delete:
                                </div>
                                <ul className="text-sm text-red-600 list-disc list-inside space-y-1">
                                  <li>User profile and authentication</li>
                                  <li>All calendar feeds and events</li>
                                  <li>All invoices and billing data</li>
                                  <li>All tags and settings</li>
                                  <li>Any associated data</li>
                                </ul>
                                <div className="text-sm font-medium">
                                  This action cannot be undone!
                                </div>
                              </div>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteUser(user.id, user.name, user.email)}
                                  disabled={deletingUserId === user.id}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  {deletingUserId === user.id ? 'Deleting...' : 'Delete User'}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                        
                        {user.role === 'admin' && (
                          <div className="text-xs text-muted-foreground flex items-center">
                            <Crown className="w-3 h-3 mr-1" />
                            Protected
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <div className="text-sm text-muted-foreground">No users found</div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 