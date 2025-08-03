'use client'

import { useState } from 'react'
import { useSupabaseQuery } from '@/lib/hooks/useQueryWithSupabase'
import { Studio, StudioWithStats, StudioTeacherWithInfo } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import DataLoader from '@/components/ui/data-loader'
import { Plus, Users, MapPin, Star, Shield } from 'lucide-react'
import { StudioForm } from './StudioForm'
import { StudioList } from './StudioList'
import { StudioTeacherRequests } from './StudioTeacherRequests'
import { useTranslation } from '@/lib/i18n/context'
import { toast } from 'sonner'

interface StudioManagementProps {
  userId: string
  userRole: 'admin' | 'moderator' | 'user'
}

export function StudioManagement({ userRole }: StudioManagementProps) {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('studios')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingStudio, setEditingStudio] = useState<Studio | null>(null)

  const hasAccess = userRole === 'admin' || userRole === 'moderator'

  // Fetch studios with stats using the new studio_teachers table
  const { 
    data: studios, 
    isLoading: studiosLoading, 
    error: studiosError, 
    refetch: refetchStudios 
  } = useSupabaseQuery(
    ['studios-with-stats'],
    async (supabase) => {
      const { data, error } = await supabase
        .from('studios')
        .select(`
          *,
          studio_teachers!studio_id (
            id,
            teacher_id,
            role,
            available_for_substitution,
            is_active,
            teacher:users!studio_teachers_teacher_id_fkey (
              id,
              name,
              email
            )
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error

      // Transform data to include stats from studio_teachers
      const studiosWithStats: StudioWithStats[] = data?.map((studio: Record<string, unknown>) => {
        const studioTeachers = (studio.studio_teachers as StudioTeacherWithInfo[]) || []
        const activeTeachers = studioTeachers.filter((st: StudioTeacherWithInfo) => st.is_active)
        
        return {
          ...studio,
          teacher_count: activeTeachers.length,
          substitute_teacher_count: activeTeachers.filter((st: StudioTeacherWithInfo) => st.available_for_substitution).length,
          billing_entities: activeTeachers, // For backward compatibility
          studio_teachers: studioTeachers // New field with full teacher data
        }
      }) || []

      return studiosWithStats
    },
    {
      enabled: hasAccess
    }
  )

  // Fetch pending teacher requests
  const { 
    data: pendingRequests, 
    isLoading: requestsLoading,
    error: requestsError,
    refetch: refetchRequests 
  } = useSupabaseQuery(
    ['studio-teacher-requests', 'pending'],
    async (supabase) => {
      const { data, error } = await supabase
        .from('studio_teacher_requests')
        .select(`
          *,
          studio:studios(id, name, slug),
          teacher:users!studio_teacher_requests_teacher_id_fkey(id, name, email)
        `)
        .or('status.eq.pending,status.is.null')
        .order('created_at', { ascending: false })

      if (error) throw error

      return data || []
    },
    {
      enabled: hasAccess
    }
  )

  // Only admins and moderators can access studio management
  if (!hasAccess) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            {t('studios.management.accessRestricted')}
          </CardTitle>
          <CardDescription>
            {t('studios.management.accessRestrictedDesc')}
          </CardDescription>
        </CardHeader>
      </Card>
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
    refetchStudios()
    toast.success(editingStudio ? t('studios.management.toast.studioUpdated') : t('studios.management.toast.studioCreated'))
  }

  const handleStudioDeleted = () => {
    refetchStudios()
    toast.success(t('studios.management.toast.studioDeleted'))
  }

  const handleRequestProcessed = () => {
    refetchRequests()
    refetchStudios() // Refresh studios as teacher counts might change
  }

  const isLoading = studiosLoading || requestsLoading
  const hasError = studiosError || requestsError

  return (
    <DataLoader
      data={studios}
      loading={isLoading}
      error={hasError ? t('studios.management.loadError') : null}
      empty={
        <Card>
          <CardContent className="py-12 text-center">
            <MapPin className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">{t('studios.management.emptyState.title')}</h3>
            <p className="text-muted-foreground mb-4">{t('studios.management.emptyState.description')}</p>
            <Button onClick={handleCreateStudio} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              {t('studios.management.createStudio')}
            </Button>
          </CardContent>
        </Card>
      }
    >
      {(loadedStudios) => (
        <div className="space-y-6">
          {/* Overview Cards with Create Button */}
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={handleCreateStudio} className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                {t('studios.management.createStudio')}
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              {t('studios.management.overview.totalStudios')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loadedStudios?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="w-4 h-4" />
              {t('studios.management.overview.activeTeachers')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loadedStudios?.reduce((sum, studio) => sum + (studio.teacher_count || 0), 0) || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-500" />
              Available Substitutes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {loadedStudios?.reduce((sum, studio) => sum + (studio.substitute_teacher_count || 0), 0) || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Star className="w-4 h-4" />
              {t('studios.management.overview.verifiedStudios')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loadedStudios?.filter(studio => studio.verified).length || 0}
            </div>
          </CardContent>
        </Card>
            </div>
          </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="studios">{t('studios.management.tabs.studios')}</TabsTrigger>
          <TabsTrigger value="requests">
            {t('studios.management.tabs.teacherRequests')}
            {pendingRequests && pendingRequests.length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {pendingRequests.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

          <TabsContent value="studios">
            <StudioList
              studios={loadedStudios || []}
              onEdit={handleEditStudio}
              onDelete={handleStudioDeleted}
              userRole={userRole}
            />
          </TabsContent>

          <TabsContent value="requests">
            <StudioTeacherRequests
              requests={pendingRequests || []}
              onRequestProcessed={handleRequestProcessed}
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
      )}
    </DataLoader>
  )
}