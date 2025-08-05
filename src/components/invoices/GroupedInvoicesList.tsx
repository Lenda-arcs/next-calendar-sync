'use client'

import React, { useState, useCallback, useMemo } from 'react'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import { Select, SelectOption } from '@/components/ui/select'
import { InvoiceCard } from './InvoiceCard'
import { InvoiceWithDetails } from '@/lib/invoice-utils'
import { 
  Building2, 
  Trash2,
  FileText
} from 'lucide-react'

interface GroupedInvoicesListProps {
  invoices: InvoiceWithDetails[]
  onEdit?: (invoice: InvoiceWithDetails) => void
  onStatusChange?: (invoiceId: string, newStatus: 'sent' | 'paid' | 'overdue') => void
  onViewPDF?: (pdfUrl: string) => void
  onDelete?: (invoiceId: string) => void

}

interface InvoiceGroup {
  studioId: string
  studioName: string
  invoices: InvoiceWithDetails[]
  totalAmount: number
  statusCounts: Record<string, number>
}

export function GroupedInvoicesList({ 
  invoices, 
  onEdit, 
  onStatusChange, 
  onViewPDF, 
  onDelete
}: GroupedInvoicesListProps) {
  // ==================== STATE MANAGEMENT ====================
  const [selectedInvoices, setSelectedInvoices] = useState<Record<string, string[]>>({})

  // ==================== SELECTION MANAGEMENT ====================
  const handleToggleInvoice = useCallback((studioId: string, invoiceId: string) => {
    setSelectedInvoices(prev => {
      const studioInvoices = prev[studioId] || []
      const isSelected = studioInvoices.includes(invoiceId)
      
      if (isSelected) {
        return {
          ...prev,
          [studioId]: studioInvoices.filter(id => id !== invoiceId)
        }
      } else {
        return {
          ...prev,
          [studioId]: [...studioInvoices, invoiceId]
        }
      }
    })
  }, [])

  const handleSelectAllStudio = useCallback((studioId: string, studioInvoices: InvoiceWithDetails[]) => {
    const allInvoiceIds = studioInvoices.map(invoice => invoice.id)
    const currentSelected = selectedInvoices[studioId] || []
    const allSelected = allInvoiceIds.every(id => currentSelected.includes(id))
    
    setSelectedInvoices(prev => ({
      ...prev,
      [studioId]: allSelected ? [] : allInvoiceIds
    }))
  }, [selectedInvoices])

  // ==================== BULK ACTIONS ====================
  const handleBulkStatusChange = useCallback((studioId: string, newStatus: 'sent' | 'paid' | 'overdue') => {
    const selectedInvoiceIds = selectedInvoices[studioId] || []
    selectedInvoiceIds.forEach(invoiceId => {
      onStatusChange?.(invoiceId, newStatus)
    })
    // Clear selections for this studio only
    setSelectedInvoices(prev => ({
      ...prev,
      [studioId]: []
    }))
  }, [selectedInvoices, onStatusChange])

  const handleBulkDelete = useCallback((studioId: string) => {
    const selectedInvoiceIds = selectedInvoices[studioId] || []
    if (confirm(`Are you sure you want to delete ${selectedInvoiceIds.length} invoices?`)) {
      selectedInvoiceIds.forEach(invoiceId => {
        onDelete?.(invoiceId)
      })
      // Clear selections for this studio only
      setSelectedInvoices(prev => ({
        ...prev,
        [studioId]: []
      }))
    }
  }, [selectedInvoices, onDelete])

  // ==================== MEMOIZED CALCULATIONS ====================
  // Group invoices by studio
  const groupedInvoices = useMemo(() => {
    const groups: Record<string, InvoiceGroup> = {}
    
    invoices.forEach(invoice => {
      const studioId = invoice.studio_id
      const studioName = invoice.studio?.entity_name || 'Unknown Studio'
      
      if (!groups[studioId]) {
        groups[studioId] = {
          studioId,
          studioName,
          invoices: [],
          totalAmount: 0,
          statusCounts: {}
        }
      }
      
      groups[studioId].invoices.push(invoice)
      groups[studioId].totalAmount += invoice.amount_total || 0
      groups[studioId].statusCounts[invoice.status] = (groups[studioId].statusCounts[invoice.status] || 0) + 1
    })
    
    return Object.values(groups).sort((a, b) => a.studioName.localeCompare(b.studioName))
  }, [invoices])

  // Calculate selected totals for each studio
  const selectedTotals = useMemo(() => {
    const totals: Record<string, number> = {}
    
    groupedInvoices.forEach(group => {
      const selectedInvoiceIds = selectedInvoices[group.studioId] || []
      if (selectedInvoiceIds.length === 0) {
        totals[group.studioId] = 0
        return
      }
      
      const selectedInvoicesData = group.invoices.filter(invoice => 
        selectedInvoiceIds.includes(invoice.id)
      )
      totals[group.studioId] = selectedInvoicesData.reduce((sum, invoice) => sum + (invoice.amount_total || 0), 0)
    })
    
    return totals
  }, [groupedInvoices, selectedInvoices])

  const getSelectedTotal = useCallback((studioId: string): number => {
    return selectedTotals[studioId] || 0
  }, [selectedTotals])

  // ==================== UTILITY FUNCTIONS ====================
  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case 'sent':
        return 'text-blue-600 bg-blue-50'
      case 'paid':
        return 'text-green-600 bg-green-50'
      case 'overdue':
        return 'text-orange-600 bg-orange-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }, [])

  // Status options for the select dropdown
  const statusOptions: SelectOption[] = [
    { value: 'sent', label: 'Mark as Sent' },
    { value: 'paid', label: 'Mark as Paid' },
    { value: 'overdue', label: 'Mark as Overdue' }
  ]

  // ==================== COMPONENT RENDERS ====================
  const renderEmptyState = () => (
    <Card>
      <CardContent className="py-8 sm:py-12 px-4 sm:px-6 text-center">
        <div className="w-10 sm:w-12 h-10 sm:h-12 mx-auto mb-3 sm:mb-4 text-gray-300">
          <FileText className="w-full h-full" />
        </div>
        <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No invoices found</h3>
        <p className="text-sm text-gray-600 mb-3 sm:mb-4 max-w-sm mx-auto">
          Create your first invoice from uninvoiced events to get started.
        </p>
      </CardContent>
    </Card>
  )

  const renderStudioHeader = (group: InvoiceGroup) => {
    const selectedInvoiceIds = selectedInvoices[group.studioId] || []
    const allInvoicesSelected = group.invoices.length > 0 && 
      group.invoices.every((invoice) => selectedInvoiceIds.includes(invoice.id))
    const someInvoicesSelected = selectedInvoiceIds.length > 0
    const selectedTotal = getSelectedTotal(group.studioId)

    return (
      <AccordionItem value={group.studioId} key={group.studioId}>
        <Card variant="outlined" className="overflow-hidden">
          <AccordionTrigger className="px-3 sm:px-6 py-3 sm:py-4 hover:no-underline cursor-pointer group">
            <div className="flex flex-col sm:grid sm:grid-cols-[1fr_auto] gap-2 sm:gap-4 w-full mr-2 sm:mr-4 group-hover:text-blue-600 transition-colors">
              {/* Studio Info - Stack vertically on mobile */}
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4 min-w-0">
                <div className="flex items-center gap-2 min-w-0">
                  <Building2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <CardTitle className="text-sm sm:text-lg group-hover:text-blue-600 transition-colors overflow-hidden text-ellipsis whitespace-nowrap min-w-0">
                    {group.studioName}
                  </CardTitle>
                </div>
                {/* Status badges - Wrap on mobile */}
                <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                  <span className="text-gray-600">
                    {group.invoices.length} invoice{group.invoices.length !== 1 ? 's' : ''}
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(group.statusCounts).map(([status, count]) => (
                      <span 
                        key={status} 
                        className={`text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full ${getStatusColor(status)}`}
                      >
                        {status}: {count}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Amount - Right aligned on desktop, full width on mobile */}
              <div className="text-left sm:text-right flex-shrink-0">
                <div className="text-lg sm:text-xl font-bold text-gray-900">
                  €{group.totalAmount.toFixed(2)}
                </div>
                <div className="text-xs text-gray-600">
                  Total Amount
                </div>
              </div>
            </div>
          </AccordionTrigger>

          <AccordionContent className="px-0 pb-0 overflow-hidden">
            <CardContent className="pt-0 px-2 sm:px-4 pb-3 sm:pb-4 overflow-hidden">
              {/* Studio Actions */}
              <div className="mb-3 sm:mb-4 p-3 sm:p-4 bg-blue-50/50 rounded-lg">
                {/* Selection Controls - Stack vertically on mobile */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  {/* Left side: Select controls and info */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                    <Button
                      onClick={() => handleSelectAllStudio(group.studioId, group.invoices)}
                      variant="outline"
                      className="w-full sm:w-auto h-10 sm:h-9"
                    >
                      {allInvoicesSelected ? 'Deselect All' : 'Select All'}
                    </Button>
                    
                    {someInvoicesSelected && (
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 text-sm">
                        <span className="text-gray-600 text-center sm:text-left">
                          {selectedInvoiceIds.length}/{group.invoices.length} selected
                        </span>
                        <div className="text-center sm:text-right">
                          <div className="font-bold text-blue-600 text-lg">
                            €{selectedTotal.toFixed(2)}
                          </div>
                          <div className="text-xs text-gray-500">Selected Total</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right side: Action controls - Stack vertically on mobile */}
                  {someInvoicesSelected && (
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <Select
                        options={statusOptions}
                        value=""
                        onChange={(value) => handleBulkStatusChange(group.studioId, value as 'sent' | 'paid' | 'overdue')}
                        placeholder="Change Status"
                        className="w-full sm:w-40 h-10"
                      />
                      <Button
                        size="default"
                        onClick={() => handleBulkDelete(group.studioId)}
                        variant="outline"
                        className="w-full sm:w-auto h-10 border-red-300 text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete ({selectedInvoiceIds.length})
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Invoices List */}
              <div className="space-y-1 sm:space-y-2 overflow-hidden">
                {group.invoices.map((invoice) => (
                  <InvoiceCard
                    key={invoice.id}
                    invoice={invoice}
                    selected={selectedInvoiceIds.includes(invoice.id)}
                    onToggleSelect={(invoiceId) => handleToggleInvoice(group.studioId, invoiceId)}
                    showCheckbox={true}
                    onEdit={onEdit}
                    onViewPDF={onViewPDF}
                    onDelete={onDelete}

                  />
                ))}
              </div>
            </CardContent>
          </AccordionContent>
        </Card>
      </AccordionItem>
    )
  }

  // ==================== MAIN RENDER ====================
  if (invoices.length === 0) {
    return renderEmptyState()
  }

  return (
    <div className="space-y-4">
      {/* Grouped Invoices */}
      <Accordion type="multiple" className="w-full space-y-3 sm:space-y-4">
        {groupedInvoices.map(renderStudioHeader)}
      </Accordion>
    </div>
  )
} 