'use client'

import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger, TabContent } from '@/components/ui'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import DataLoader from '@/components/ui/data-loader'
import { UninvoicedEventsList } from './UninvoicedEventsList'
import { InvoiceCreationModal } from './InvoiceCreationModal'
import { InvoiceSettings } from './InvoiceSettings'
import { InvoiceCard } from './InvoiceCard'
import { useSupabaseQuery } from '@/lib/hooks/useSupabaseQuery'
import { getUserInvoices, getUninvoicedEvents, updateInvoiceStatus, generateInvoicePDF, deleteInvoice, EventWithStudio, InvoiceWithDetails } from '@/lib/invoice-utils'
import { toast } from 'sonner'
import { Receipt, FileText, Settings } from 'lucide-react'

interface InvoiceManagementProps {
  userId: string
}

type TabValue = 'uninvoiced' | 'invoices' | 'settings'

export function InvoiceManagement({ userId }: InvoiceManagementProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false)
  const [selectedStudioId, setSelectedStudioId] = useState<string>('')
  const [selectedEventIds, setSelectedEventIds] = useState<string[]>([])
  const [selectedEvents, setSelectedEvents] = useState<EventWithStudio[]>([])
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [editingInvoice, setEditingInvoice] = useState<InvoiceWithDetails | null>(null)

  // Get active tab from URL, default to 'uninvoiced'
  const getActiveTabFromUrl = (): TabValue => {
    const tab = searchParams.get('tab') as TabValue
    return ['uninvoiced', 'invoices', 'settings'].includes(tab) ? tab : 'uninvoiced'
  }

  // Use URL as source of truth for active tab
  const activeTab = getActiveTabFromUrl()

  // Update URL when tab changes
  const setActiveTab = (tab: TabValue) => {
    const params = new URLSearchParams(searchParams)
    params.set('tab', tab)
    router.push(`?${params.toString()}`, { scroll: false })
  }

  // Fetch uninvoiced events for overview
  const { 
    data: uninvoicedEvents, 
    refetch: refetchUninvoiced 
  } = useSupabaseQuery({
    queryKey: ['uninvoiced-events', userId],
    fetcher: () => getUninvoicedEvents(userId),
    enabled: !!userId
  })

  // Fetch user invoices for overview
  const { 
    data: userInvoices,
    isLoading: invoicesLoading,
    error: invoicesError,
    refetch: refetchInvoices 
  } = useSupabaseQuery({
    queryKey: ['user-invoices', userId],
    fetcher: () => getUserInvoices(userId),
    enabled: !!userId
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

  const handleStatusChange = async (invoiceId: string, newStatus: 'sent' | 'paid' | 'overdue') => {
    try {
      const timestamp = new Date().toISOString()
      await updateInvoiceStatus(invoiceId, newStatus, timestamp)
      
      // Refresh invoices list to show updated status
      refetchInvoices()
    } catch (error) {
      console.error('Failed to update invoice status:', error)
      // You might want to show a toast notification here
    }
  }

  const handleGeneratePDF = async (invoiceId: string) => {
    try {
      const { pdf_url } = await generateInvoicePDF(invoiceId)
      
      // Refresh invoices list to show updated PDF URL
      refetchInvoices()
      
      // Show success toast with option to view PDF
      toast('PDF Generated Successfully!', {
        description: 'Your invoice PDF has been created and is ready to view.',
        action: {
          label: 'View PDF',
          onClick: () => window.open(pdf_url, '_blank'),
        },
        duration: 8000
      })
    } catch (error) {
      console.error('Failed to generate PDF:', error)
      toast.error('PDF Generation Failed', {
        description: 'Unable to generate PDF. Please try again.',
        duration: 6000
      })
    }
  }

  const handleViewPDF = (pdfUrl: string) => {
    window.open(pdfUrl, '_blank')
  }

  const handleDeleteInvoice = async (invoiceId: string) => {
    try {
      await deleteInvoice(invoiceId)
      
      // Refresh both uninvoiced events and invoices lists
      refetchUninvoiced()
      refetchInvoices()
      
      toast('Invoice Deleted Successfully', {
        description: 'Invoice, PDF file, and all event links have been removed. Events are now available for future invoicing.',
        duration: 5000
      })
    } catch (error) {
      console.error('Failed to delete invoice:', error)
      toast.error('Failed to Delete Invoice', {
        description: 'Unable to delete the invoice. Please try again.',
        duration: 6000
      })
    }
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

  const totalUninvoicedEvents = uninvoicedEvents?.length || 0
  const totalInvoices = userInvoices?.length || 0

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabValue)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="uninvoiced" className="flex items-center gap-1 sm:gap-2">
            <Receipt className="w-4 h-4 flex-shrink-0" />
            <span className="hidden sm:inline">Uninvoiced Events</span>
            <span className="sm:hidden">Events</span>
            {totalUninvoicedEvents > 0 && (
              <Badge variant="secondary" className="ml-1 sm:ml-2 text-xs">
                {totalUninvoicedEvents}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="invoices" className="flex items-center gap-1 sm:gap-2">
            <FileText className="w-4 h-4 flex-shrink-0" />
            <span className="hidden sm:inline">Invoices</span>
            <span className="sm:hidden">Bills</span>
            {totalInvoices > 0 && (
              <Badge variant="secondary" className="ml-1 sm:ml-2 text-xs">
                {totalInvoices}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-1 sm:gap-2">
            <Settings className="w-4 h-4 flex-shrink-0" />
            <span className="hidden sm:inline">Settings</span>
            <span className="sm:hidden">Config</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="uninvoiced">
          <TabContent 
            title="Uninvoiced Events"
            description="Select events by studio to create invoices. Events must have assigned studios to appear here."
          >
            <UninvoicedEventsList 
              userId={userId} 
              onCreateInvoice={handleCreateInvoice}
              onCreateStudio={() => setActiveTab('settings')}
            />
          </TabContent>
        </TabsContent>

        <TabsContent value="invoices">
          <TabContent 
            title="Your Invoices"
            description="View and manage your created invoices."
          >
            <DataLoader
              data={userInvoices}
              loading={invoicesLoading}
              error={invoicesError?.message || null}
              empty={
                <Card>
                  <CardContent className="py-12 text-center">
                    <div className="w-12 h-12 mx-auto mb-4 text-gray-300">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Invoices Yet</h3>
                    <p className="text-sm text-gray-600 mb-4 max-w-sm mx-auto">
                      Create your first invoice by selecting events from the &quot;Uninvoiced Events&quot; tab.
                    </p>
                    <Button 
                      onClick={() => setActiveTab('uninvoiced')}
                      variant="outline"
                    >
                      View Uninvoiced Events
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
            title="Invoice Settings & Studios"
            description="Manage your personal billing information and studio configurations."
          >
            <InvoiceSettings userId={userId} />
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