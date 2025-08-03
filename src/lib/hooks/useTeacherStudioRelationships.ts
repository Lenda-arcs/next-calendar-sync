import { useSupabaseQuery } from './useQueryWithSupabase'
import { Studio, RateConfig } from '@/lib/types'

interface TeacherStudioRelationship {
  id: string
  studio: Studio
  approved_at: string
  role: string
  available_for_substitution: boolean
  default_rate_config: RateConfig | null
  location_patterns: string[]
}

interface UseTeacherStudioRelationshipsProps {
  teacherId: string | null
  enabled?: boolean
}

export function useTeacherStudioRelationships({ teacherId, enabled = true }: UseTeacherStudioRelationshipsProps) {
  return useSupabaseQuery<TeacherStudioRelationship[]>(
    ['teacher-studio-relationships', teacherId || 'null'],
    async (supabase) => {
      if (!teacherId) return []
      
      const { data, error } = await supabase
        .from('studio_teachers')
        .select(`
          id,
          approved_at,
          role,
          available_for_substitution,
          studio:studios(*)
        `)
        .eq('teacher_id', teacherId)
        .eq('is_active', true)
        .order('approved_at', { ascending: false })

      if (error) {
        console.error('Error fetching teacher-studio relationships:', error)
        return []
      }

      // Transform the data to include the studio's default configuration
      const relationships: TeacherStudioRelationship[] = data?.map((relationship: { 
        id: string; 
        approved_at: string; 
        role: string;
        available_for_substitution: boolean;
        studio: Studio 
      }) => ({
        id: relationship.id,
        studio: relationship.studio,
        approved_at: relationship.approved_at,
        role: relationship.role,
        available_for_substitution: relationship.available_for_substitution,
        default_rate_config: relationship.studio?.default_rate_config as RateConfig | null,
        location_patterns: relationship.studio?.location_patterns || []
      })) || []

      return relationships
    },
    { enabled: enabled && !!teacherId }
  )
}

// Helper function to get the best studio suggestion for a teacher
export function getBestStudioSuggestion(relationships: TeacherStudioRelationship[]): TeacherStudioRelationship | null {
  if (relationships.length === 0) return null
  
  // For now, return the most recently approved relationship
  // Could be enhanced with more sophisticated logic later
  return relationships[0]
}

// Helper function to extract billing entity defaults from a studio relationship
export function extractBillingDefaultsFromStudio(relationship: TeacherStudioRelationship | null) {
  if (!relationship) {
    return {
      defaultLocationMatch: [],
      defaultRateConfig: null,
      suggestedStudioId: null,
      suggestedStudioName: null
    }
  }

  return {
    defaultLocationMatch: relationship.location_patterns,
    defaultRateConfig: relationship.default_rate_config,
    suggestedStudioId: relationship.studio.id,
    suggestedStudioName: relationship.studio.name
  }
} 