'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LoadingLink } from '@/components/ui'
import DataLoader from '@/components/ui/data-loader'
import { InvitationManagement, UserManagement } from '@/components/admin'
import { PageSection } from '@/components/layout/page-section'
import { PATHS } from '@/lib/paths'
import { Shield, Users, Building, UserPlus, BarChart } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'
import { useSupabaseQuery } from '@/lib/hooks/useQueryWithSupabase'


interface AdminDashboardClientProps {
  userRole: string
  locale: string
}

interface AdminStats {
  totalUsers: number
  totalInvitations: number
  pendingInvitations: number
  totalStudios: number
}

export function AdminDashboardClient({ userRole, locale }: AdminDashboardClientProps) {
  const { t } = useTranslation()

  // Fetch admin stats
  const { 
    data: stats, 
    isLoading: statsLoading, 
    error: statsError 
  } = useSupabaseQuery<AdminStats>(
    ['admin-stats'],
    async (supabase) => {
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

      return {
        totalUsers: totalUsers || 0,
        totalInvitations: totalInvitations || 0,
        pendingInvitations: pendingInvitations || 0,
        totalStudios: totalStudios || 0
      }
    },
    {
      enabled: userRole === 'admin'
    }
  )

  // Only admins can access this
  if (userRole !== 'admin') {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Shield className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">Access Restricted</h3>
          <p className="text-muted-foreground">Only administrators can access this dashboard.</p>
        </CardContent>
      </Card>
    )
  }

  const studiosPath = locale === 'en' ? PATHS.APP.STUDIOS : `/${locale}${PATHS.APP.STUDIOS}`

  return (
    <div className="space-y-8">
      {/* Admin Badge */}
      <div className="flex justify-center">
        <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 text-sm font-medium">
          <Shield className="w-4 h-4 mr-2" />
          {t('dashboard.admin.accessBadge')}
        </Badge>
      </div>

      {/* Quick Stats */}
      <PageSection>
        <DataLoader
          data={stats}
          loading={statsLoading}
          error={statsError ? t('dashboard.admin.loadError') : null}
          empty={null} // Stats should always have data
        >
          {(loadedStats) => (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">{t('dashboard.admin.stats.totalUsers')}</p>
                      <p className="text-2xl font-bold">{loadedStats?.totalUsers || 0}</p>
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
                      <p className="text-sm font-medium text-muted-foreground">{t('dashboard.admin.stats.totalInvitations')}</p>
                      <p className="text-2xl font-bold">{loadedStats?.totalInvitations || 0}</p>
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
                      <p className="text-sm font-medium text-muted-foreground">{t('dashboard.admin.stats.pendingInvites')}</p>
                      <p className="text-2xl font-bold">{loadedStats?.pendingInvitations || 0}</p>
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
                      <p className="text-sm font-medium text-muted-foreground">{t('dashboard.admin.stats.totalStudios')}</p>
                      <p className="text-2xl font-bold">{loadedStats?.totalStudios || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DataLoader>
      </PageSection>

      {/* Quick Actions */}
      <PageSection>
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.admin.quickActions.title')}</CardTitle>
            <CardDescription>
              {t('dashboard.admin.quickActions.description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <LoadingLink
                href={studiosPath}
                className="p-4 border rounded-lg hover:bg-muted/50 transition-colors text-center"
              >
                <Building className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <div className="font-medium">{t('dashboard.admin.quickActions.manageStudios')}</div>
                <div className="text-sm text-muted-foreground">{t('dashboard.admin.quickActions.manageStudiosDesc')}</div>
              </LoadingLink>

              <div className="p-4 border rounded-lg bg-muted/30 text-center">
                <UserPlus className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <div className="font-medium">{t('dashboard.admin.quickActions.inviteTeachers')}</div>
                <div className="text-sm text-muted-foreground">{t('dashboard.admin.quickActions.inviteTeachersDesc')}</div>
              </div>

              <div className="p-4 border rounded-lg bg-muted/30 text-center">
                <BarChart className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <div className="font-medium">{t('dashboard.admin.quickActions.analytics')}</div>
                <div className="text-sm text-muted-foreground">{t('dashboard.admin.quickActions.analyticsDesc')}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </PageSection>

      {/* Teacher Invitation Management */}
      <PageSection>
        <DataLoader
          data={true} // Always show this section
          loading={false}
          error={null}
          empty={null}
        >
          {() => (
            <div>
              <h2 className="text-xl font-semibold mb-4">{t('dashboard.admin.sections.invitations')}</h2>
              <InvitationManagement />
            </div>
          )}
        </DataLoader>
      </PageSection>

      {/* User Management */}
      <PageSection>
        <DataLoader
          data={true} // Always show this section
          loading={false}
          error={null}
          empty={null}
        >
          {() => (
            <div>
              <h2 className="text-xl font-semibold mb-4">{t('dashboard.admin.sections.users')}</h2>
              <UserManagement />
            </div>
          )}
        </DataLoader>
      </PageSection>
    </div>
  )
}