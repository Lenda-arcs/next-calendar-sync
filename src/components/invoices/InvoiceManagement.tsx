'use client'

import React, {useState} from 'react'
import {LoadingTabsTrigger, TabContent, Tabs, TabsContent, TabsList} from '@/components/ui'
import {Card, CardContent} from '@/components/ui/card'
import DataLoader from '@/components/ui/data-loader'
import {
  EmptyInvoicesState,
  InvoiceCreationModal,
  UninvoicedEventsList
} from '@/components'
import { GroupedInvoicesList } from './GroupedInvoicesList'
import { InvoiceOverviewCards } from './InvoiceOverviewCards'
import { InvoiceQuickActions } from './InvoiceQuickActions'

import {
  useDeleteInvoice,
  useUninvoicedEvents,
  useUpdateInvoiceStatus,
  useUserInvoices
} from '@/lib/hooks/useAppQuery'
import { useUserTimezone } from '@/lib/hooks/useUserTimezone'
import {EventWithStudio, InvoiceWithDetails} from '@/lib/invoice-utils'
import {toast} from 'sonner'
import {FileText, Loader2, Receipt} from 'lucide-react'
import {useTranslation} from '@/lib/i18n/context'
import {useTabNavigation} from '@/lib/hooks/useTabNavigation'

interface InvoiceManagementProps {
  userId: string
}

type TabValue = 'uninvoiced' | 'invoices'

const VALID_TABS = ['uninvoiced', 'invoices'] as const

export function InvoiceManagement({ userId }: InvoiceManagementProps) {
  const { t } = useTranslation()
  
  // ✅ NEW: Get user's timezone for consistent time display
  const userTimezone = useUserTimezone(userId)
  
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false)
  const [selectedStudioId, setSelectedStudioId] = useState<string>('')
  const [selectedEventIds, setSelectedEventIds] = useState<string[]>([])
  const [selectedEvents, setSelectedEvents] = useState<EventWithStudio[]>([])
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [editingInvoice, setEditingInvoice] = useState<InvoiceWithDetails | null>(null)

  // ✨ Use the new tab navigation hook
  const { activeTab, setActiveTab, isTabLoading } = useTabNavigation({
    validTabs: VALID_TABS,
    defaultTab: 'uninvoiced' as const
  })

  // ✨ NEW: Use unified hooks for data fetching
  // Fetch uninvoiced events only when on uninvoiced tab
  const { 
    data: uninvoicedEvents, 
    isLoading: uninvoicedLoading,
    refetch: refetchUninvoiced 
  } = useUninvoicedEvents(userId, {
    enabled: !!userId && (activeTab === 'uninvoiced' || isTabLoading('uninvoiced'))
  })

  // Fetch user invoices only when on invoices tab
  const { 
    data: userInvoices,
    isLoading: invoicesLoading,
    error: invoicesError,
    refetch: refetchInvoices 
  } = useUserInvoices(userId, {
    enabled: !!userId && (activeTab === 'invoices' || isTabLoading('invoices'))
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



  const handleViewPDF = (pdfUrl: string) => {
    window.open(pdfUrl, '_blank')
  }

  const handleDeleteInvoice = (invoiceId: string) => {
    deleteInvoiceMutation.mutate(
      invoiceId,
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
      {/* NEW: Overview Section */}
      <InvoiceOverviewCards userId={userId} />
      
      {/* NEW: Quick Actions */}
      <InvoiceQuickActions userId={userId} />
      
      {/* UPDATED: Simplified Tabs (remove settings tab) */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabValue)}>
        <TabsList className="grid w-full grid-cols-2">
          <LoadingTabsTrigger
            value="uninvoiced"
            icon={Receipt}
            fullText={t('invoices.management.tabs.billing')}
            shortText={t('invoices.management.tabs.billingShort')}
            isLoading={isTabLoading('uninvoiced')}
            count={totalUninvoicedEvents}
          />
          <LoadingTabsTrigger
            value="invoices"
            icon={FileText}
            fullText={t('invoices.management.tabs.invoices')}
            shortText={t('invoices.management.tabs.invoicesShort')}
            isLoading={isTabLoading('invoices')}
            count={totalInvoices}
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
                onCreateStudio={() => {}} // Studio creation is now handled via billing modal in quick actions
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
              data={userInvoices ?? null}
              loading={invoicesLoading || isTabLoading('invoices')}
              error={invoicesError?.message || null}
              empty={
                <EmptyInvoicesState onCreateNewInvoice={() => setActiveTab('uninvoiced')} />
              }
            >
              {(invoices) => (
                <GroupedInvoicesList
                  invoices={invoices}
                  onEdit={handleEditInvoice}
                  onStatusChange={handleStatusChange}
                  onViewPDF={handleViewPDF}
                  onDelete={handleDeleteInvoice}
                  userTimezone={userTimezone}
                />
              )}
            </DataLoader>
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