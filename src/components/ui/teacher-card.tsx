import { PublicProfile } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Card, CardContent } from './card'
import { LoadingLink } from './loading-link'
import { User } from 'lucide-react'
import { PATHS } from '@/lib/paths'

interface TeacherCardProps {
  teacher: Pick<PublicProfile, 'id' | 'name' | 'profile_image_url' | 'bio' | 'public_url'>
  className?: string
}

export function TeacherCard({ teacher, className }: TeacherCardProps) {
  const href = PATHS.DYNAMIC.TEACHER_SCHEDULE(teacher.public_url || teacher.id || '')

  return (
    <LoadingLink href={href} className={cn('block group', className)}>
      <Card variant="outlined" interactive padding="sm" className="flex items-center gap-4">
        <div className="w-14 h-14 flex-shrink-0 rounded-full overflow-hidden border border-white/40 bg-white/50 flex items-center justify-center">
          {teacher.profile_image_url ? (
            <img src={teacher.profile_image_url} alt={teacher.name || 'Teacher'} className="w-full h-full object-cover" />
          ) : (
            <User className="h-6 w-6 text-muted-foreground" />
          )}
        </div>
        <CardContent noPadding className="flex-1">
          <h3 className="text-lg font-serif group-hover:underline">
            {teacher.name || 'Unnamed'}
          </h3>
          {teacher.bio && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {teacher.bio}
            </p>
          )}
        </CardContent>
      </Card>
    </LoadingLink>
  )
}
