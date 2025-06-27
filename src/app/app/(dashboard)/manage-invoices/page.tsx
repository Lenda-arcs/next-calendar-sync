import { Container } from '@/components/layout/container'
import { ManageInvoicesClient } from './ManageInvoicesClient'
import { createServerClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'

export default async function ManageInvoicesPage() {
  const supabase = await createServerClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    redirect('/auth/sign-in')
  }

  return (
    <Container 
      title="Manage Invoices"
      subtitle="Create and track invoices for your events and services."
    >
      <ManageInvoicesClient userId={user.id} />
    </Container>
  )
}  
