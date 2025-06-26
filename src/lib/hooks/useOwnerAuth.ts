interface UseOwnerAuthProps {
  currentUserId?: string
  teacherProfileId?: string
}

export function useOwnerAuth({ currentUserId, teacherProfileId }: UseOwnerAuthProps) {
  const isOwner = Boolean(currentUserId && teacherProfileId && currentUserId === teacherProfileId)
  
  return {
    isOwner,
    canManageSchedule: isOwner
  }
} 