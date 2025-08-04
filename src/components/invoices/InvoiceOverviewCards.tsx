'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useInvoiceMetrics } from '@/lib/hooks/useInvoiceMetrics'
import { useTranslation } from '@/lib/i18n/context'
import { Receipt, FileText, Clock, TrendingUp, Loader2 } from 'lucide-react'

// Color schemes for consistent glassmorphism theming
const overviewColorSchemes = {
  purple: {
    iconBg: 'bg-purple-100/80',
    iconColor: 'text-purple-600',
  },
  blue: {
    iconBg: 'bg-blue-100/80', 
    iconColor: 'text-blue-600',
  },
  orange: {
    iconBg: 'bg-orange-100/80',
    iconColor: 'text-orange-600',
  },
  green: {
    iconBg: 'bg-green-100/80',
    iconColor: 'text-green-600',
  }
}

interface InvoiceOverviewCardsProps {
  userId: string
}

/**
 * Format currency values with proper Euro formatting
 */
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

export function InvoiceOverviewCards({ userId }: InvoiceOverviewCardsProps) {
  const { t } = useTranslation()
  const metrics = useInvoiceMetrics(userId)

  // Show loading state while metrics are being calculated
  if (metrics.isLoading) {
    return (
      <div className="flex gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-4 md:overflow-visible">
        {[...Array(4)].map((_, index) => (
          <Card key={index} className="flex-shrink-0 w-64 md:w-auto snap-start shadow-lg border border-white/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <div className="p-2 bg-gray-100/80 rounded-full flex-shrink-0">
                  <Loader2 className="w-4 h-4 text-gray-500 animate-spin" />
                </div>
                Loading...
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Mobile: Horizontal scroll, Desktop: Grid */}
      <div className="flex gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-4 md:overflow-visible snap-x snap-mandatory scrollbar-hide">
        {/* Uninvoiced Events Card */}
        <Card className="flex-shrink-0 w-64 md:w-auto snap-start shadow-lg hover:shadow-xl transition-all duration-200 border border-white/60 hover:border-white/80">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <div className={`p-2 ${overviewColorSchemes.purple.iconBg} rounded-full flex-shrink-0 backdrop-blur-sm`}>
                <Receipt className={`w-4 h-4 ${overviewColorSchemes.purple.iconColor}`} />
              </div>
              {t('invoices.overview.uninvoicedEvents')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.uninvoicedEventsCount}</div>
            {metrics.uninvoicedEventsValue > 0 && (
              <div className="text-sm text-muted-foreground mt-1">
                {formatCurrency(metrics.uninvoicedEventsValue)}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Total Invoices Card */}
        <Card className="flex-shrink-0 w-64 md:w-auto snap-start shadow-lg hover:shadow-xl transition-all duration-200 border border-white/60 hover:border-white/80">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <div className={`p-2 ${overviewColorSchemes.blue.iconBg} rounded-full flex-shrink-0 backdrop-blur-sm`}>
                <FileText className={`w-4 h-4 ${overviewColorSchemes.blue.iconColor}`} />
              </div>
              {t('invoices.overview.totalInvoices')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalInvoicesCount}</div>
          </CardContent>
        </Card>

        {/* Pending Revenue Card */}
        <Card className="flex-shrink-0 w-64 md:w-auto snap-start shadow-lg hover:shadow-xl transition-all duration-200 border border-white/60 hover:border-white/80">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <div className={`p-2 ${overviewColorSchemes.orange.iconBg} rounded-full flex-shrink-0 backdrop-blur-sm`}>
                <Clock className={`w-4 h-4 ${overviewColorSchemes.orange.iconColor}`} />
              </div>
              {t('invoices.overview.pendingRevenue')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(metrics.pendingRevenue)}
            </div>
            {metrics.pendingInvoicesCount > 0 && (
              <div className="text-sm text-muted-foreground mt-1">
                {metrics.pendingInvoicesCount} {t('invoices.overview.unpaidInvoices')}
              </div>
            )}
          </CardContent>
        </Card>

        {/* This Month Revenue Card */}
        <Card className="flex-shrink-0 w-64 md:w-auto snap-start shadow-lg hover:shadow-xl transition-all duration-200 border border-white/60 hover:border-white/80">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <div className={`p-2 ${overviewColorSchemes.green.iconBg} rounded-full flex-shrink-0 backdrop-blur-sm`}>
                <TrendingUp className={`w-4 h-4 ${overviewColorSchemes.green.iconColor}`} />
              </div>
              {t('invoices.overview.thisMonthRevenue')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(metrics.thisMonthRevenue)}
            </div>
            {metrics.thisMonthInvoicesCount > 0 && (
              <div className="text-sm text-muted-foreground mt-1">
                {metrics.thisMonthInvoicesCount} {t('invoices.overview.paidInvoices')}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Mobile scroll indicator hint - only show if there are cards to scroll */}
      <div className="md:hidden text-center">
        <div className="text-xs text-muted-foreground opacity-60">
          ← {t('invoices.overview.swipeForMore')} →
        </div>
      </div>
    </div>
  )
}