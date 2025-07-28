'use client'

import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabContent, LoadingTabsTrigger } from '@/components/ui'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import DataLoader from '@/components/ui/data-loader'
import { UninvoicedEventsList } from './UninvoicedEventsList'
import { InvoiceCreationModal } from './InvoiceCreationModal'
import { InvoiceSettings } from './InvoiceSettings'
import { InvoiceCard } from './InvoiceCard'
import { 
  useUserInvoices, 
  useUninvoicedEvents,
  useUpdateInvoiceStatus,
  useGenerateInvoicePDF,
  useDeleteInvoice 
} from '@/lib/hooks/useAppQuery'
import { EventWithStudio, InvoiceWithDetails } from '@/lib/invoice-utils'
import { toast } from 'sonner'
import { Receipt, FileText, Settings, Loader2 } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'

interface InvoiceManagementProps {
  userId: string
}

type TabValue = 'uninvoiced' | 'invoices' | 'settings'

export function InvoiceManagement({ userId }: InvoiceManagementProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false)
  const [selectedStudioId, setSelectedStudioId] = useState<string>('')
  const [selectedEventIds, setSelectedEventIds] = useState<string[]>([])
  const [selectedEvents, setSelectedEvents] = useState<EventWithStudio[]>([])
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [editingInvoice, setEditingInvoice] = useState<InvoiceWithDetails | null>(null)
  const [tabSwitchLoading, setTabSwitchLoading] = useState<TabValue | null>(null)

  // Get active tab from URL, default to 'uninvoiced'
  const getActiveTabFromUrl = (): TabValue => {
    const tab = searchParams.get('tab') as TabValue
    return ['uninvoiced', 'invoices', 'settings'].includes(tab) ? tab : 'uninvoiced'
  }

  // Use URL as source of truth for active tab
  const activeTab = getActiveTabFromUrl()

  // Update URL when tab changes with loading feedback
  const setActiveTab = (tab: TabValue) => {
    if (tab === activeTab) return // Don't switch if already on the tab
    
    setTabSwitchLoading(tab)
    const params = new URLSearchParams(searchParams)
    params.set('tab', tab)
    router.push(`?${params.toString()}`, { scroll: false })
    
    // Clear loading state after a short delay to ensure smooth transition
    setTimeout(() => setTabSwitchLoading(null), 150)
  }

  // ✨ NEW: Use unified hooks for data fetching
  // Fetch uninvoiced events only when on uninvoiced tab
  const { 
    data: uninvoicedEvents, 
    isLoading: uninvoicedLoading,
    refetch: refetchUninvoiced 
  } = useUninvoicedEvents(userId, undefined, {
    enabled: !!userId && (activeTab === 'uninvoiced' || tabSwitchLoading === 'uninvoiced')
  })

  // Fetch user invoices only when on invoices tab
  const { 
    data: userInvoices,
    isLoading: invoicesLoading,
    error: invoicesError,
    refetch: refetchInvoices 
  } = useUserInvoices(userId, {
    enabled: !!userId && (activeTab === 'invoices' || tabSwitchLoading === 'invoices')
  })

  const handleCreateInvoice = (studioId: string, eventIds: string[], events: EventWithStudio[]) => {
    setModalMode('create')
    setEditingInvoice(null)
    setSelectedStudioId(studioId)
    setSelectedEventIds(eventIds)
    setSelectedEvents(events)
    setInvoiceModalOpen(true)
  }

  const handleEditInvoice = (invoice: InvoiceWithDetails) => {
    setModalMode('edit')
    setEditingInvoice(invoice)
    setSelectedStudioId(invoice.studio_id)
    setSelectedEventIds(invoice.events.map(e => e.id))
    setSelectedEvents(invoice.events.map(event => ({ ...event, studio: invoice.studio })))
    setInvoiceModalOpen(true)
  }

  // ✨ NEW: Use unified mutation hooks
  const updateInvoiceStatusMutation = useUpdateInvoiceStatus()
  const generateInvoicePDFMutation = useGenerateInvoicePDF()
  const deleteInvoiceMutation = useDeleteInvoice()

  const handleStatusChange = (invoiceId: string, newStatus: 'sent' | 'paid' | 'overdue') => {
    const timestamp = new Date().toISOString()
    
    updateInvoiceStatusMutation.mutate(
      { invoiceId, status: newStatus, timestamp },
      {
        onSuccess: () => {
          // Refresh invoices list to show updated status
          refetchInvoices()
        },
        onError: (error) => {
          console.error('Failed to update invoice status:', error)
          toast.error('Failed to update invoice status')
        }
      }
    )
  }

  const handleGeneratePDF = (invoiceId: string, language: 'en' | 'de' | 'es' = 'en') => {
    generateInvoicePDFMutation.mutate(
      { invoiceId, language },
      {
        onSuccess: ({ pdf_url }) => {
          // Refresh invoices list to show updated PDF URL
          refetchInvoices()
          
          // Show success toast with option to view PDF
          toast(t('invoices.creation.pdfGenerated'), {
            description: t('invoices.creation.pdfGeneratedDesc'),
            action: {
              label: t('invoices.creation.viewPDF'),
              onClick: () => window.open(pdf_url, '_blank'),
            },
            duration: 8000
          })
        },
        onError: (error) => {
          console.error('Failed to generate PDF:', error)
          toast.error(t('invoices.creation.pdfFailed'), {
            description: t('invoices.creation.pdfFailedDesc'),
            duration: 6000
          })
        }
      }
    )
  }

  const handleViewPDF = (pdfUrl: string) => {
    window.open(pdfUrl, '_blank')
  }

  const handleDeleteInvoice = (invoiceId: string) => {
    deleteInvoiceMutation.mutate(
      { invoiceId },
      {
        onSuccess: () => {
          // Refresh both uninvoiced events and invoices lists
          refetchUninvoiced()
          refetchInvoices()
          
          toast(t('invoices.card.deleteSuccess'), {
            description: t('invoices.card.deleteSuccessDesc'),
            duration: 5000
          })
        },
        onError: (error) => {
          console.error('Failed to delete invoice:', error)
          toast.error(t('invoices.card.deleteFailed'), {
            description: t('invoices.card.deleteFailedDesc'),
            duration: 6000
          })
        }
      }
    )
  }

  const handleInvoiceSuccess = () => {
    // Force refetch of uninvoiced events
    refetchUninvoiced()
    
    // Force refetch of invoices
    refetchInvoices()
    
    // Switch to invoices tab to show the new invoice
    setActiveTab('invoices')
    
    // Close the modal and reset state
    setInvoiceModalOpen(false)
    setModalMode('create')
    setEditingInvoice(null)
    setSelectedStudioId('')
    setSelectedEventIds([])
    setSelectedEvents([])
  }

  // Only show counters when data is available to avoid showing 0 when still loading
  const totalUninvoicedEvents = uninvoicedEvents?.length
  const totalInvoices = userInvoices?.length

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabValue)}>
        <TabsList className="grid w-full grid-cols-3">
          <LoadingTabsTrigger
            value="uninvoiced"
            icon={Receipt}
            fullText={t('invoices.management.tabs.billing')}
            shortText={t('invoices.management.tabs.billingShort')}
            isLoading={tabSwitchLoading === 'uninvoiced'}
            count={totalUninvoicedEvents}
          />
          <LoadingTabsTrigger
            value="invoices"
            icon={FileText}
            fullText={t('invoices.management.tabs.invoices')}
            shortText={t('invoices.management.tabs.invoicesShort')}
            isLoading={tabSwitchLoading === 'invoices'}
            count={totalInvoices}
          />
          <LoadingTabsTrigger
            value="settings"
            icon={Settings}
            fullText={t('invoices.management.tabs.settings')}
            shortText={t('invoices.management.tabs.settingsShort')}
            isLoading={tabSwitchLoading === 'settings'}
          />
        </TabsList>

        <TabsContent value="uninvoiced">
          <TabContent 
            title={t('invoices.management.billingTab.title')}
            description={t('invoices.management.billingTab.description')}
          >
            {uninvoicedLoading ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">{t('invoices.management.billingTab.loading')}</p>
                </CardContent>
              </Card>
            ) : (
              <UninvoicedEventsList 
                userId={userId} 
                onCreateInvoice={handleCreateInvoice}
                onCreateStudio={() => setActiveTab('settings')}
              />
            )}
          </TabContent>
        </TabsContent>

        <TabsContent value="invoices">
          <TabContent 
            title={t('invoices.management.invoicesTab.title')}
            description={t('invoices.management.invoicesTab.description')}
          >
            <DataLoader
              data={userInvoices}
              loading={invoicesLoading || tabSwitchLoading === 'invoices'}
              error={invoicesError?.message || null}
              empty={
                <Card>
                  <CardContent className="py-12 text-center">
                    <div className="w-12 h-12 mx-auto mb-4 text-gray-300">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{t('invoices.management.invoicesTab.noInvoicesTitle')}</h3>
                    <p className="text-sm text-gray-600 mb-4 max-w-sm mx-auto">
                      {t('invoices.management.invoicesTab.noInvoicesDescription')}
                    </p>
                    <Button 
                      onClick={() => setActiveTab('uninvoiced')}
                      variant="outline"
                    >
                      {t('invoices.management.invoicesTab.viewUninvoiced')}
                    </Button>
                  </CardContent>
                </Card>
              }
            >
              {(invoices: InvoiceWithDetails[]) => (
                <div className="space-y-4">
                  {invoices.map((invoice) => (
                    <InvoiceCard 
                      key={invoice.id} 
                      invoice={invoice} 
                      onEdit={handleEditInvoice}
                      onStatusChange={handleStatusChange}
                      onGeneratePDF={handleGeneratePDF}
                      onViewPDF={handleViewPDF}
                      onDelete={handleDeleteInvoice}
                    />
                  ))}
                </div>
              )}
            </DataLoader>
          </TabContent>
        </TabsContent>

        <TabsContent value="settings">
          <TabContent 
            title={t('invoices.management.settingsTab.title')}
            description={t('invoices.management.settingsTab.description')}
          >
            {tabSwitchLoading === 'settings' ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">{t('invoices.management.settingsTab.loading')}</p>
                </CardContent>
              </Card>
            ) : (
              <InvoiceSettings userId={userId} />
            )}
          </TabContent>
        </TabsContent>
      </Tabs>

      {/* Invoice Creation/Edit Modal */}
      <InvoiceCreationModal
        isOpen={invoiceModalOpen}
        onClose={() => setInvoiceModalOpen(false)}
        userId={userId}
        studioId={selectedStudioId}
        eventIds={selectedEventIds}
        events={selectedEvents}
        mode={modalMode}
        existingInvoice={editingInvoice || undefined}
        onSuccess={handleInvoiceSuccess}
      />
    </div>
  )
} 