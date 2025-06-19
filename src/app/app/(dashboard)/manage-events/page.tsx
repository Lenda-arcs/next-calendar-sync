import { Container } from '@/components/layout/container'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar } from 'lucide-react'

export default function ManageEventsPage() {
  return (
    <div className="p-6">
      <Container>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Manage Events
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            View and organize your calendar events.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Event Management</CardTitle>
            <CardDescription>
              Sync calendar feeds and manage your events.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
              <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Event Dashboard
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Implement event list, calendar feeds, and event editing functionality.
              </p>
            </div>
          </CardContent>
        </Card>
      </Container>
    </div>
  )
} 