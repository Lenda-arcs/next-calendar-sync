import { useSupabaseQuery, useSupabaseMutation } from './useQueryWithSupabase'
import { SupabaseClient } from '@supabase/supabase-js'

interface TeacherDepartureImpact {
  future_events_count: number
  unpaid_invoices_count: number
  total_unpaid_amount: number
  last_event_date: string | null
  relationship_duration_days: number
}

interface DeactivateTeacherParams {
  studioId: string
  teacherId: string
  reason?: string
}

// Hook for teacher departure impact analysis
export function useTeacherDepartureImpact(studioId: string, teacherId: string) {
  return useSupabaseQuery<TeacherDepartureImpact>(
    ['teacher-departure-impact', studioId, teacherId],
    async (supabase: SupabaseClient) => {
      const { data, error } = await supabase.rpc(
        'analyze_teacher_departure_impact',
        {
          p_studio_id: studioId,
          p_teacher_id: teacherId
        }
      )

      if (error) throw error

      return data?.[0] || {
        future_events_count: 0,
        unpaid_invoices_count: 0,
        total_unpaid_amount: 0,
        last_event_date: null,
        relationship_duration_days: 0
      }
    },
    {
      enabled: !!(studioId && teacherId)
    }
  )
}

// Hook for deactivating teacher-studio relationship
export function useDeactivateTeacher() {
  return useSupabaseMutation<boolean, DeactivateTeacherParams>(
    async (supabase: SupabaseClient, { studioId, teacherId, reason }: DeactivateTeacherParams) => {
      const { data, error } = await supabase.rpc(
        'deactivate_teacher_studio_relationship',
        {
          p_studio_id: studioId,
          p_teacher_id: teacherId,
          p_deactivated_by: (await supabase.auth.getUser()).data.user?.id,
          p_reason: reason || null
        }
      )

      if (error) throw error
      return data
    }
  )
}

// Hook for reactivating teacher-studio relationship
export function useReactivateTeacher() {
  return useSupabaseMutation<boolean, { studioId: string; teacherId: string }>(
    async (supabase: SupabaseClient, { studioId, teacherId }) => {
      const { data, error } = await supabase.rpc(
        'reactivate_teacher_studio_relationship',
        {
          p_studio_id: studioId,
          p_teacher_id: teacherId,
          p_reactivated_by: (await supabase.auth.getUser()).data.user?.id
        }
      )

      if (error) throw error
      return data
    }
  )
}

// Hook for toggling substitute availability
export function useToggleSubstituteAvailability() {
  return useSupabaseMutation<boolean, { 
    studioId: string; 
    teacherId: string; 
    available: boolean;
    noticeHours?: number;
  }>(
    async (supabase: SupabaseClient, { studioId, teacherId, available, noticeHours }) => {
      const { error } = await supabase
        .from('studio_teachers')
        .update({
          available_for_substitution: available,
          substitution_notice_hours: noticeHours || 24,
          updated_at: new Date().toISOString()
        })
        .eq('studio_id', studioId)
        .eq('teacher_id', teacherId)
        .eq('is_active', true)

      if (error) throw error
      return true
    }
  )
}