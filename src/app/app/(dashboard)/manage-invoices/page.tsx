import { Container } from '@/components/layout/container'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Receipt } from 'lucide-react'

export default function ManageInvoicesPage() {
  return (
    <div className="p-6">
      <Container>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Manage Invoices
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Track and generate invoices for your services.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Invoice Management</CardTitle>
            <CardDescription>
              Generate and track invoices for your events and services.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
              <Receipt className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Invoice Dashboard
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Implement invoice generation, tracking, and payment management.
              </p>
            </div>
          </CardContent>
        </Card>
      </Container>
    </div>
  )
} 