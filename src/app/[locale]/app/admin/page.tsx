import { Suspense } from 'react'
import { createServerClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { getValidLocale } from '@/lib/i18n/config'
import { Container } from '@/components/layout/container'
import { PageSection } from '@/components/layout/page-section'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { InvitationManagement, UserManagement } from '@/components/admin'
import { Badge } from '@/components/ui/badge'
import { LoadingLink } from '@/components/ui'
import { PATHS } from '@/lib/paths'
import { Shield, Users, Building, UserPlus, BarChart } from 'lucide-react'
import type { Metadata } from 'next'

interface AdminPageProps {
  params: Promise<{ locale: string }>
}

export const metadata: Metadata = {
  title: 'Admin Dashboard - avara.',
  description: 'Administrative tools and user management for avara.',
}

export default async function AdminPage({ params }: AdminPageProps) {
  const { locale: localeParam } = await params
  const locale = getValidLocale(localeParam)
  
  const supabase = await createServerClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    const signInPath = locale === 'en' ? '/auth/sign-in' : `/${locale}/auth/sign-in`
    redirect(signInPath)
  }

  // Get user role from the database  
  const { data: userData } = await supabase
    .from('users')
    .select('role, name')
    .eq('id', user.id)
    .single()

  const userRole = userData?.role || 'user'
  const userName = userData?.name

  // Only admins can access this page
  if (userRole !== 'admin') {
    const dashboardPath = locale === 'en' ? '/app' : `/${locale}/app`
    redirect(dashboardPath)
  }

  // Get some basic stats for the admin overview
  const [
    { count: totalUsers },
    { count: totalInvitations },
    { count: pendingInvitations },
    { count: totalStudios }
  ] = await Promise.all([
    supabase.from('users').select('*', { count: 'exact', head: true }),
    supabase.from('user_invitations').select('*', { count: 'exact', head: true }),
    supabase.from('user_invitations').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('studios').select('*', { count: 'exact', head: true })
  ])

  const studiosPath = locale === 'en' ? PATHS.APP.STUDIOS : `/${locale}${PATHS.APP.STUDIOS}`

  return (
    <div className="min-h-screen">
      <Container 
        title={`Admin Dashboard`}
        subtitle={`Welcome back, ${userName || 'Admin'}. Manage your platform and users.`}
        maxWidth="4xl"
      >
        {/* Admin Badge */}
        <div className="mb-8 flex justify-center">
          <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 text-sm font-medium">
            <Shield className="w-4 h-4 mr-2" />
            Administrator Access
          </Badge>
        </div>

        {/* Quick Stats */}
        <PageSection>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                    <p className="text-2xl font-bold">{totalUsers || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <UserPlus className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Total Invitations</p>
                    <p className="text-2xl font-bold">{totalInvitations || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <BarChart className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Pending Invites</p>
                    <p className="text-2xl font-bold">{pendingInvitations || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Building className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Total Studios</p>
                    <p className="text-2xl font-bold">{totalStudios || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </PageSection>

        {/* Quick Actions */}
        <PageSection>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common administrative tasks and shortcuts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <LoadingLink
                  href={studiosPath}
                  className="p-4 border rounded-lg hover:bg-muted/50 transition-colors text-center"
                >
                  <Building className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                  <div className="font-medium">Manage Studios</div>
                  <div className="text-sm text-muted-foreground">Studio partnerships & settings</div>
                </LoadingLink>

                <div className="p-4 border rounded-lg bg-muted/30 text-center">
                  <UserPlus className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <div className="font-medium">Invite Teachers</div>
                  <div className="text-sm text-muted-foreground">Manage below ↓</div>
                </div>

                <div className="p-4 border rounded-lg bg-muted/30 text-center">
                  <BarChart className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <div className="font-medium">Analytics</div>
                  <div className="text-sm text-muted-foreground">Coming soon</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </PageSection>

        {/* Teacher Invitation Management */}
        <PageSection>
          <Suspense fallback={
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <div className="text-sm text-muted-foreground">Loading invitation management...</div>
                </div>
              </CardContent>
            </Card>
          }>
            <InvitationManagement />
          </Suspense>
        </PageSection>

        {/* User Management */}
        <PageSection>
          <Suspense fallback={
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <div className="text-sm text-muted-foreground">Loading user management...</div>
                </div>
              </CardContent>
            </Card>
          }>
            <UserManagement />
          </Suspense>
        </PageSection>

      </Container>
    </div>
  )
} 