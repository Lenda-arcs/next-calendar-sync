import { Metadata } from 'next'
import { Container } from '@/components/layout/container'
import { PageSection } from '@/components/layout/page-section'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Database, Code, Zap, Shield } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Supabase Integration | Test Suite',
  description: 'Database hooks, queries, and mutations testing',
}

export default function IntegrationTestPage() {
  return (
    <div className="min-h-screen">
      <Container 
        maxWidth="4xl" 
        title="Supabase Integration Testing" 
        subtitle="Database hooks, queries, and mutations in action"
        className="py-8"
      >
        <PageSection title="Custom Hooks" subtitle="Supabase integration hooks available">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="h-5 w-5 mr-2" />
                  useSupabaseQuery
                </CardTitle>
                <CardDescription>
                  Data fetching with caching and error handling
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Badge variant="default">Implemented</Badge>
                    <p className="text-sm text-muted-foreground">
                      Features: Query key caching, stale time management, manual refetch
                    </p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <code className="text-xs">
                      {`const { data, isLoading, error } = useSupabaseQuery({
  queryKey: ['events'],
  fetcher: (supabase) => supabase.from('events').select('*')
})`}
                    </code>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Code className="h-5 w-5 mr-2" />
                  useSupabaseMutation
                </CardTitle>
                <CardDescription>
                  Insert, update, and delete operations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Badge variant="default">Implemented</Badge>
                    <p className="text-sm text-muted-foreground">
                      Features: Loading states, success/error callbacks, optimistic updates
                    </p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <code className="text-xs">
                      {`const insertEvent = useSupabaseInsert('events', {
  onSuccess: (data) => toast.success('Event created!'),
  onError: (error) => toast.error(error.message)
})`}
                    </code>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </PageSection>

        <PageSection title="Helper Hooks" subtitle="Specialized hooks for common operations">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                name: 'useSupabaseTable',
                description: 'Quick table queries with default select',
                status: 'complete'
              },
              {
                name: 'useSupabaseInsert',
                description: 'Insert operations with validation',
                status: 'complete'
              },
              {
                name: 'useSupabaseUpdate',
                description: 'Update operations by ID',
                status: 'complete'
              },
              {
                name: 'useSupabaseDelete',
                description: 'Delete operations with confirmation',
                status: 'complete'
              },
              {
                name: 'useSupabaseAuth',
                description: 'Authentication state management',
                status: 'planned'
              },
              {
                name: 'useSupabaseRealtime',
                description: 'Real-time subscriptions',
                status: 'planned'
              },
            ].map((hook) => (
              <Card key={hook.name}>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-sm">{hook.name}</h3>
                      <Badge 
                        variant={hook.status === 'complete' ? 'default' : 'outline'}
                        className="text-xs"
                      >
                        {hook.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {hook.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </PageSection>

        <PageSection title="Integration Features" subtitle="Advanced Supabase integration capabilities">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="h-5 w-5 mr-2" />
                  Performance Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Query result caching with stale time
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Automatic error handling and retries
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Optimistic updates for mutations
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Background refetch on window focus
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-500 mr-2">○</span>
                    Real-time subscriptions
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Security Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Row Level Security (RLS) support
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Type-safe database operations
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Automatic session management
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Environment-based configuration
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Server-side authentication
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </PageSection>

        <PageSection title="Usage Examples" subtitle="Common patterns and implementations">
          <Card>
            <CardHeader>
              <CardTitle>Code Examples</CardTitle>
              <CardDescription>
                Real-world usage patterns for the Supabase hooks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold mb-2">Fetching Events</h3>
                  <div className="p-3 bg-muted rounded-lg">
                    <code className="text-xs whitespace-pre-wrap">
{`// Simple table query
const { data: events, isLoading } = useSupabaseTable('events')

// Custom query with filters
const { data: upcomingEvents } = useSupabaseQuery({
  queryKey: ['events', 'upcoming'],
  fetcher: async (supabase) => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .gte('start_time', new Date().toISOString())
      .order('start_time', { ascending: true })
    
    if (error) throw error
    return data
  }
})`}
                    </code>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold mb-2">Creating Events</h3>
                  <div className="p-3 bg-muted rounded-lg">
                    <code className="text-xs whitespace-pre-wrap">
{`const createEvent = useSupabaseInsert('events', {
  onSuccess: (data) => {
    toast.success('Event created successfully!')
    router.push(\`/events/\${data[0].id}\`)
  },
  onError: (error) => {
    toast.error(\`Failed to create event: \${error.message}\`)
  }
})

const handleSubmit = (eventData) => {
  createEvent.mutate({
    title: eventData.title,
    start_time: eventData.startTime,
    location: eventData.location,
    user_id: user.id
  })
}`}
                    </code>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </PageSection>
      </Container>
    </div>
  )
} 