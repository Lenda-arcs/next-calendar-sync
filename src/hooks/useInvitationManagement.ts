/**
 * Custom hook for invitation management logic
 * Separates business logic from UI components
 */

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useSupabaseQuery } from '@/lib/hooks/useQueryWithSupabase'
import type { 
  CreateInvitationForm, 
  SupabaseUser, 
  InvitationStats,
  InvitationFormErrors 
} from '@/lib/types/invitation'
import type { UserData } from '@/lib/server/user-management-service'

const QUERY_KEY = 'supabase-users-invitations'

export function useInvitationManagement() {
  const [formData, setFormData] = useState<CreateInvitationForm>({
    email: '',
    invitedName: '',
    personalMessage: '',
    role: 'teacher',
    language: 'en'
  })
  const [formErrors, setFormErrors] = useState<InvitationFormErrors>({})
  
  const queryClient = useQueryClient()

  // Fetch all users via API endpoint (uses admin client on server)
  const { 
    data: allUsers = [], 
    isLoading, 
    error: usersError 
  } = useSupabaseQuery<SupabaseUser[]>(
    [QUERY_KEY],
    async () => {
      console.log('🔍 Fetching users from admin API...')
      
      try {
        const response = await fetch('/api/admin/users', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        })
        
        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Failed to fetch users')
        }
        
        const data = await response.json()
        
        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch users')
        }
        
        console.log('✅ Successfully fetched users:', data.users?.length || 0)
        
        // Transform to SupabaseUser format
        return data.users?.map((user: UserData) => ({
          id: user.id,
          email: user.email || '',
          invited_at: user.invited_at,
          email_confirmed_at: user.email_confirmed_at,
          last_sign_in_at: user.last_sign_in_at,
          created_at: user.created_at,
          user_metadata: user.user_metadata || {}
        })) || []
      } catch (err) {
        console.error('❌ Failed to fetch users:', err)
        throw err
      }
    }
  )

  // Calculate user statistics
  const stats: InvitationStats = {
    totalUsers: allUsers.length,
    pendingInvitations: allUsers.filter(user => 
      user.invited_at && !user.email_confirmed_at
    ).length,
    confirmedUsers: allUsers.filter(user => 
      user.email_confirmed_at
    ).length,
    activeUsers: allUsers.filter(user => 
      user.last_sign_in_at
    ).length
  }

  // Create invitation mutation
  const createInvitationMutation = useMutation({
    mutationFn: async (formData: CreateInvitationForm) => {
      const response = await fetch('/api/invitations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create invitation')
      }
      
      return response.json()
    }
  })

  // Cancel invitation mutation
  const cancelInvitationMutation = useMutation({
    mutationFn: async (userId: string) => {
      const response = await fetch(`/api/invitations/${userId}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to cancel invitation')
      }
      
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast.success('Invitation cancelled successfully')
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to cancel invitation')
    }
  })

  // Form validation
  const validateForm = (): boolean => {
    const errors: InvitationFormErrors = {}
    
    if (!formData.email) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address'
    }
    
    if (!formData.invitedName?.trim()) {
      errors.invitedName = 'Name is required'
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Form handlers
  const handleFormDataChange = (changes: Partial<CreateInvitationForm>) => {
    setFormData(prev => ({ ...prev, ...changes }))
    // Clear related errors when user starts typing
    if (changes.email && formErrors.email) {
      setFormErrors(prev => ({ ...prev, email: undefined }))
    }
    if (changes.invitedName && formErrors.invitedName) {
      setFormErrors(prev => ({ ...prev, invitedName: undefined }))
    }
  }

  const resetForm = () => {
    setFormData({
      email: '',
      invitedName: '',
      personalMessage: '',
      role: 'teacher',
      language: 'en'
    })
    setFormErrors({})
  }

  const handleSubmit = (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    if (validateForm()) {
      return new Promise((resolve, reject) => {
        createInvitationMutation.mutate(formData, {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
            resetForm()
            toast.success('Invitation sent successfully!')
            resolve()
          },
          onError: (error) => {
            toast.error(error instanceof Error ? error.message : 'Failed to send invitation')
            reject(error)
          }
        })
      })
    }
    return Promise.resolve()
  }

  const handleCancelInvitation = (userId: string) => {
    // Note: This should now be handled by the AlertDialog in the UserList component
    cancelInvitationMutation.mutate(userId)
  }

  return {
    // Data
    allUsers,
    stats,
    formData,
    formErrors,
    
    // State
    isLoading,
    usersError,
    isSubmitting: createInvitationMutation.isPending,
    isCancelling: cancelInvitationMutation.isPending,
    submitError: createInvitationMutation.error?.message,
    
    // Handlers
    handleFormDataChange,
    handleSubmit,
    handleCancelInvitation,
    resetForm
  }
}