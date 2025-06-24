import { Container } from '@/components/layout/container'
import { InvoiceManagement } from '@/components/events/InvoiceManagement'
import { createServerClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'

export default async function ManageInvoicesPage() {
  const supabase = await createServerClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    redirect('/auth/sign-in')
  }

  return (
    <div className="p-6">
      <Container maxWidth="4xl" className="px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Manage Invoices
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Create and track invoices for your events and services.
          </p>
        </div>

        <InvoiceManagement userId={user.id} />
      </Container>
    </div>
  )
} 