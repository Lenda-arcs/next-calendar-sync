'use client'

import { Container } from '@/components/layout/container'
import { PageSection } from '@/components/layout/page-section'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CopyLinkButton, LoadingLink, LoadingButtonLink } from '@/components/ui'
import { PrivateEventList } from '@/components/events'
import { CalendarFeedsProfileSection } from '@/components/calendar-feeds'
import { PATHS } from '@/lib/paths'
import { Calendar } from 'lucide-react'
import { TeacherStudioRequest } from './components/TeacherStudioRequest'
import { useTranslationNamespace } from '@/lib/i18n/context'
import { useSmartPreload } from '@/lib/hooks/useSmartPreload'

interface DashboardContentProps {
  user: { name?: string | null; public_url?: string | null } | null
  userId: string
  hasFeeds: boolean
  feeds: unknown[]
  publicPath: string | null
  hasCustomUrl: boolean
}

export default function DashboardContent({
  user,
  userId,
  hasFeeds,
  feeds,
  publicPath,
  hasCustomUrl
}: DashboardContentProps) {
  const { t } = useTranslationNamespace('dashboard')
  
  // ✨ Smart preloading for instant navigation
  const {
    preloadManageEventsData,
    preloadManageInvoicesData,
    preloadManageTagsData,
    preloadPublicEvents
  } = useSmartPreload()

  const shareLabel = hasCustomUrl
    ? t('publicSchedule.yourSchedule')
    : t('publicSchedule.yourScheduleCustomize')

  return (
    <div className="min-h-screen">
      <Container 
        title={t('welcome', { name: user?.name || 'Friend' })}
        subtitle={t('subtitle')}
        maxWidth="4xl"
      >
        {/* Your Upcoming Classes Section */}
        <PageSection>
          <Card variant="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-serif">
                <Calendar className="h-5 w-5" />
                {t('upcomingClasses.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {hasFeeds ? (
                <div>
                  <PrivateEventList
                    userId={userId}
                    eventCount={3}
                  />
                  <div className="mt-6 text-right">
                    <LoadingLink 
                      href={PATHS.APP.MANAGE_EVENTS}
                      className="text-sm text-primary hover:text-primary/80 hover:underline font-medium"
                    >
                      {t('upcomingClasses.viewAll')}
                    </LoadingLink>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground text-sm py-4">
                  {t('upcomingClasses.noCalendar')}
                </p>
              )}
            </CardContent>
          </Card>
        </PageSection>

        {/* Calendar Actions Section */}
        <PageSection title={t('calendarActions')}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 
             {/* Public Schedule */}
             {publicPath && (
               <Card variant="outlined">
                 <CardHeader>
                   <CardTitle className="text-lg">{t('publicSchedule.title')}</CardTitle>
                   <CardDescription>
                     {t('publicSchedule.description')}
                   </CardDescription>
                 </CardHeader>
                 <CardContent>
                   <div className="flex items-center gap-2">
                     <CopyLinkButton
                       url={publicPath}
                       showLabel={false}
                       label={shareLabel}
                       buttonText={t('publicSchedule.share')}
                     />
                     <div
                       onMouseEnter={() => preloadPublicEvents(userId)}
                       onFocus={() => preloadPublicEvents(userId)}
                     >
                       <LoadingButtonLink
                         href={publicPath}
                         variant="secondary"
                         className="flex-1"
                         iconName="Eye"
                       >
                         {t('publicSchedule.viewPublic')}
                       </LoadingButtonLink>
                     </div>
                   </div>
                 </CardContent>
               </Card>
             )}
 
             {/* Manage Events */}
             <Card variant="outlined">
               <CardHeader>
                 <CardTitle className="text-lg">{t('manageEvents.title')}</CardTitle>
                 <CardDescription>
                   {t('manageEvents.description')}
                 </CardDescription>
               </CardHeader>
               <CardContent>
                 <div
                   onMouseEnter={() => {
                     preloadManageEventsData(userId)
                   }}
                   onFocus={() => {
                     preloadManageEventsData(userId)
                   }}
                 >
                   <LoadingButtonLink
                     href={PATHS.APP.MANAGE_EVENTS}
                     variant="default"
                     className="w-full"
                     iconName="Calendar"
                   >
                     {t('manageEvents.button')}
                   </LoadingButtonLink>
                 </div>
               </CardContent>
             </Card>
 
             {/* Tag Rules */}
             <Card variant="outlined">
               <CardHeader>
                 <CardTitle className="text-lg">{t('tagRules.title')}</CardTitle>
                 <CardDescription>
                   {t('tagRules.description')}
                 </CardDescription>
               </CardHeader>
               <CardContent>
                 <div
                   onMouseEnter={() => {
                     preloadManageTagsData(userId)
                   }}
                   onFocus={() => {
                     preloadManageTagsData(userId)
                   }}
                 >
                   <LoadingButtonLink
                     href={PATHS.APP.MANAGE_TAGS}
                     variant="default"
                     className="w-full"
                     iconName="Tags"
                   >
                     {t('tagRules.button')}
                   </LoadingButtonLink>
                 </div>
               </CardContent>
             </Card>
 
             {/* Invoice Management */}
             <Card variant="outlined">
               <CardHeader>
                 <CardTitle className="text-lg">{t('invoices.title')}</CardTitle>
                 <CardDescription>
                   {t('invoices.description')}
                 </CardDescription>
               </CardHeader>
               <CardContent>
                 <div
                   onMouseEnter={() => {
                     preloadManageInvoicesData(userId)
                   }}
                   onFocus={() => {
                     preloadManageInvoicesData(userId)
                   }}
                 >
                   <LoadingButtonLink
                     href={PATHS.APP.MANAGE_INVOICES}
                     variant="default"
                     className="w-full"
                     iconName="Receipt"
                   >
                     {t('invoices.button')}
                   </LoadingButtonLink>
                 </div>
               </CardContent>
             </Card>

             {/* Teacher Studio Request */}
             <TeacherStudioRequest userId={userId} />

             {/* Calendar Integration */}
             {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
             <CalendarFeedsProfileSection feeds={feeds as any} />
 
             {/* Profile Setup (if no public URL) */}
             {!hasCustomUrl && (
               <Card variant="outlined">
                <CardHeader>
                  <CardTitle className="text-lg">{t('profile.title')}</CardTitle>
                  <CardDescription>
                    {t('profile.description')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <LoadingButtonLink
                    href={PATHS.APP.PROFILE}
                    variant="outline"
                    className="w-full"
                    iconName="LinkIcon"
                  >
                    {t('profile.button')}
                  </LoadingButtonLink>
                </CardContent>
              </Card>
            )}
          </div>
        </PageSection>
      </Container>
    </div>
  )
} 