'use client'

import { useState } from 'react'
import { useSupabaseQuery } from '@/lib/hooks/useSupabaseQuery'
import { Studio, StudioWithStats } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Users, MapPin, Star, Shield } from 'lucide-react'
import { StudioForm } from './StudioForm'
import { StudioList } from './StudioList'
import { StudioTeacherRequests } from './StudioTeacherRequests'

interface StudioManagementProps {
  userId: string
  userRole: 'admin' | 'moderator' | 'user'
}

export function StudioManagement({ userRole }: StudioManagementProps) {
  const [activeTab, setActiveTab] = useState('studios')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingStudio, setEditingStudio] = useState<Studio | null>(null)

  const hasAccess = userRole === 'admin' || userRole === 'moderator'

  // Fetch studios with stats
  const { data: studios, isLoading, refetch } = useSupabaseQuery({
    queryKey: ['studios-with-stats'],
    fetcher: async (supabase) => {
      const { data, error } = await supabase
        .from('studios')
        .select(`
          *,
          billing_entities!studio_id (
            id,
            entity_name,
            user_id,
            users!billing_entities_user_id_fkey (
              id,
              name,
              email
            )
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error

      // Transform data to include stats
      const studiosWithStats: StudioWithStats[] = data?.map((studio: Record<string, unknown>) => ({
        ...studio,
        teacher_count: (studio.billing_entities as unknown[])?.length || 0,
        billing_entities: (studio.billing_entities as unknown[]) || []
      })) || []

      return studiosWithStats
    },
    enabled: hasAccess
  })

  // Fetch pending teacher requests
  const { data: pendingRequests } = useSupabaseQuery({
    queryKey: ['studio-teacher-requests', 'pending'],
    fetcher: async (supabase) => {
      const { data, error } = await supabase
        .from('studio_teacher_requests')
        .select(`
          *,
          studio:studios(id, name, slug),
          teacher:users!studio_teacher_requests_teacher_id_fkey(id, name, email)
        `)
        .or('status.eq.pending,status.is.null')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching teacher requests:', error)
        return []
      }

      return data || []
    },
    enabled: hasAccess
  })

  // Only admins and moderators can access studio management
  if (!hasAccess) {
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Access Restricted
            </CardTitle>
            <CardDescription>
              Only administrators can manage studios.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  const handleCreateStudio = () => {
    setEditingStudio(null)
    setShowCreateForm(true)
  }

  const handleEditStudio = (studio: StudioWithStats) => {
    // Clean the studio data to remove joined/computed fields that shouldn't be sent back
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { teacher_count, event_count, billing_entities, ...cleanStudio } = studio
    setEditingStudio(cleanStudio)
    setShowCreateForm(true)
  }

  const handleStudioSaved = () => {
    setShowCreateForm(false)
    setEditingStudio(null)
    refetch()
  }

  const handleStudioDeleted = () => {
    refetch()
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Studio Management</h1>
          <p className="text-gray-600">Manage studios, teachers, and billing relationships</p>
        </div>
        <Button onClick={handleCreateStudio} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Studio
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Total Studios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studios?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="w-4 h-4" />
              Active Teachers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {studios?.reduce((sum, studio) => sum + (studio.teacher_count || 0), 0) || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Star className="w-4 h-4" />
              Verified Studios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {studios?.filter(studio => studio.verified).length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="studios">Studios</TabsTrigger>
          <TabsTrigger value="requests">
            Teacher Requests
            {pendingRequests && pendingRequests.length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {pendingRequests.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="studios">
          <StudioList
            studios={studios || []}
            onEdit={handleEditStudio}
            onDelete={handleStudioDeleted}
            userRole={userRole}
          />
        </TabsContent>

        <TabsContent value="requests">
          <StudioTeacherRequests
            requests={pendingRequests || []}
            onRequestProcessed={refetch}
          />
        </TabsContent>
      </Tabs>

      {/* Create/Edit Form Modal */}
      <StudioForm
        studio={editingStudio}
        onSave={handleStudioSaved}
        onCancel={() => setShowCreateForm(false)}
        isOpen={showCreateForm}
      />
    </div>
  )
}