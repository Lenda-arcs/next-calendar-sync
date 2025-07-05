import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase-server'
import { StudioManagement } from '@/components/events'

export default async function StudiosPage() {
  const supabase = await createServerClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  // Get user role from the database
  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  const userRole = userData?.role || 'user'

  // Only admins and moderators can access studio management
  if (userRole !== 'admin' && userRole !== 'moderator') {
    redirect('/app')
  }

  return (
    <div className="container mx-auto">
      <Suspense fallback={<div>Loading...</div>}>
        <StudioManagement userId={user.id} userRole={userRole} />
      </Suspense>
    </div>
  )
}