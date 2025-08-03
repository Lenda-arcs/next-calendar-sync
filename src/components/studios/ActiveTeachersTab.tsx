'use client'

import { useState } from 'react'
import { useSupabaseQuery } from '@/lib/hooks/useQueryWithSupabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { TeacherDepartureDialog } from './TeacherDepartureDialog'
import { Users, UserMinus, Clock, Calendar } from 'lucide-react'

interface ActiveTeachersTabProps {
  onTeacherUpdated: () => void
}

interface StudioTeacher {
  id: string
  studio_id: string
  teacher_id: string
  role: string
  is_active: boolean
  available_for_substitution: boolean
  approved_at: string
  teacher: {
    id: string
    name: string
    email: string
  }
  studio: {
    id: string
    name: string
  }
}

export function ActiveTeachersTab({ onTeacherUpdated }: ActiveTeachersTabProps) {
  const [selectedTeacher, setSelectedTeacher] = useState<{
    teacherId: string
    teacherName: string
    studioId: string
    studioName: string
  } | null>(null)

  // Fetch all active teacher-studio relationships
  const { data: activeTeachers, isLoading, refetch } = useSupabaseQuery<StudioTeacher[]>(
    ['active-studio-teachers'],
    async (supabase) => {
      const { data, error } = await supabase
        .from('studio_teachers')
        .select(`
          *,
          teacher:users!studio_teachers_teacher_id_fkey(id, name, email),
          studio:studios(id, name)
        `)
        .eq('is_active', true)
        .order('approved_at', { ascending: false })

      if (error) throw error
      return data || []
    }
  )

  const handleDeactivateTeacher = (teacher: StudioTeacher) => {
    setSelectedTeacher({
      teacherId: teacher.teacher.id,
      teacherName: teacher.teacher.name,
      studioId: teacher.studio.id,
      studioName: teacher.studio.name
    })
  }

  const handleTeacherDeactivated = () => {
    refetch()
    onTeacherUpdated()
    setSelectedTeacher(null)
  }

  const formatDuration = (dateString: string) => {
    const days = Math.floor((Date.now() - new Date(dateString).getTime()) / (1000 * 60 * 60 * 24))
    if (days < 30) return `${days} days`
    if (days < 365) return `${Math.round(days / 30)} months`
    return `${Math.round(days / 365)} years`
  }

  // Group teachers by studio
  const teachersByStudio = activeTeachers?.reduce((acc, teacher) => {
    const studioId = teacher.studio.id
    if (!acc[studioId]) {
      acc[studioId] = {
        studio: teacher.studio,
        teachers: []
      }
    }
    acc[studioId].teachers.push(teacher)
    return acc
  }, {} as Record<string, { studio: { id: string; name: string }; teachers: StudioTeacher[] }>) || {}

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="py-6">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const studioEntries = Object.values(teachersByStudio)

  if (studioEntries.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">No Active Teachers</h3>
          <p className="text-muted-foreground">No teachers are currently active in any studios.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className="space-y-6">
        {studioEntries.map(({ studio, teachers }) => (
          <Card key={studio.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  {studio.name}
                </span>
                <Badge variant="secondary">
                  {teachers.length} teacher{teachers.length !== 1 ? 's' : ''}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {teachers.map((teacher) => (
                  <div
                    key={teacher.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>
                          {teacher.teacher.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{teacher.teacher.name}</span>
                          <Badge variant="outline" className="text-xs capitalize">
                            {teacher.role}
                          </Badge>
                          {teacher.available_for_substitution && (
                            <Badge variant="outline" className="text-xs text-blue-600">
                              Available for substitution
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Active for {formatDuration(teacher.approved_at)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Since {new Date(teacher.approved_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeactivateTeacher(teacher)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <UserMinus className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Teacher Departure Dialog */}
      {selectedTeacher && (
        <TeacherDepartureDialog
          isOpen={!!selectedTeacher}
          onClose={() => setSelectedTeacher(null)}
          studioId={selectedTeacher.studioId}
          teacherId={selectedTeacher.teacherId}
          teacherName={selectedTeacher.teacherName}
          studioName={selectedTeacher.studioName}
          onSuccess={handleTeacherDeactivated}
        />
      )}
    </>
  )
}