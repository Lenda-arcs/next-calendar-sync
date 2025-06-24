'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import DataLoader from '@/components/ui/data-loader'
import { UninvoicedEventsList } from './UninvoicedEventsList'
import { InvoiceCreationModal } from './InvoiceCreationModal'
import { InvoiceSettings } from './InvoiceSettings'
import { useSupabaseQuery } from '@/lib/hooks/useSupabaseQuery'
import { getUserInvoices, getUninvoicedEvents, EventWithStudio, InvoiceWithDetails } from '@/lib/invoice-utils'
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

  // Get active tab from URL, default to 'uninvoiced'
  const getActiveTabFromUrl = useCallback((): TabValue => {
    const tab = searchParams.get('tab') as TabValue
    return ['uninvoiced', 'invoices', 'settings'].includes(tab) ? tab : 'uninvoiced'
  }, [searchParams])

  const [activeTab, setActiveTabState] = useState<TabValue>(() => {
    const tab = searchParams.get('tab') as TabValue
    return ['uninvoiced', 'invoices', 'settings'].includes(tab) ? tab : 'uninvoiced'
  })

  // Update local state when URL changes
  useEffect(() => {
    setActiveTabState(getActiveTabFromUrl())
  }, [getActiveTabFromUrl])

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

  const handleCreateInvoice = (studioId: string, eventIds: string[]) => {
    const eventsForInvoice = uninvoicedEvents?.filter(event => eventIds.includes(event.id)) || []
    setSelectedStudioId(studioId)
    setSelectedEventIds(eventIds)
    setSelectedEvents(eventsForInvoice)
    setInvoiceModalOpen(true)
  }

  const handleInvoiceSuccess = () => {
    console.log('Invoice success callback triggered, refetching data...')
    
    // Force refetch of uninvoiced events
    refetchUninvoiced()
    
    // Force refetch of invoices
    refetchInvoices()
    
    // Switch to invoices tab to show the new invoice
    setActiveTab('invoices')
    
    console.log('Data refetch completed, switched to invoices tab')
    
    // Close the modal
    setInvoiceModalOpen(false)
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
          <TabsTrigger value="uninvoiced" className="flex items-center gap-2">
            <Receipt className="w-4 h-4" />
            Uninvoiced Events
            {totalUninvoicedEvents > 0 && (
              <Badge variant="secondary" className="ml-2">
                {totalUninvoicedEvents}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="invoices" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Invoices
            {totalInvoices > 0 && (
              <Badge variant="secondary" className="ml-2">
                {totalInvoices}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="uninvoiced" className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Uninvoiced Events</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Select events by studio to create invoices. Events must have assigned studios to appear here.
            </p>
          </div>
          
          <UninvoicedEventsList 
            userId={userId} 
            onCreateInvoice={handleCreateInvoice}
          />
        </TabsContent>

        <TabsContent value="invoices" className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Your Invoices</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              View and manage your created invoices.
            </p>
          </div>
          
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
                  <Card key={invoice.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-3 sm:space-y-0">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {invoice.invoice_number || `Invoice ${invoice.id.slice(0, 8)}`}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            {invoice.studio?.studio_name || 'Unknown Studio'}
                          </p>
                          <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-1 sm:space-y-0 text-xs text-gray-600">
                            <div>
                              Period: {new Date(invoice.period_start).toLocaleDateString()} - {new Date(invoice.period_end).toLocaleDateString()}
                            </div>
                            <div>
                              Created: {invoice.created_at ? new Date(invoice.created_at).toLocaleDateString() : 'Unknown'}
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-between sm:justify-end sm:flex-col sm:text-right items-center sm:items-end space-y-2 sm:space-y-1">
                          <div className="text-lg font-bold text-gray-900">
                            €{invoice.amount_total?.toFixed(2) || '0.00'}
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="text-xs text-gray-600">
                              {invoice.currency || 'EUR'}
                            </div>
                            {invoice.event_count && (
                              <Badge variant="outline" className="text-xs">
                                {invoice.event_count} events
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      {invoice.notes && (
                        <div className="mt-4 pt-4 border-t">
                          <p className="text-sm text-gray-600 break-words">{invoice.notes}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </DataLoader>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Invoice Settings & Studios</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Manage your personal billing information and studio configurations.
            </p>
          </div>
          
          <InvoiceSettings userId={userId} />
        </TabsContent>
      </Tabs>

      {/* Invoice Creation Modal */}
      <InvoiceCreationModal
        isOpen={invoiceModalOpen}
        onClose={() => setInvoiceModalOpen(false)}
        userId={userId}
        studioId={selectedStudioId}
        eventIds={selectedEventIds}
        events={selectedEvents}
        onSuccess={handleInvoiceSuccess}
      />
    </div>
  )
} 