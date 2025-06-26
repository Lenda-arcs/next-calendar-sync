'use client'

import React, { useState, useEffect } from 'react'
import { UnifiedDialog } from '@/components/ui/unified-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useSupabaseQuery } from '@/lib/hooks/useSupabaseQuery'
import { useSupabaseMutation } from '@/lib/hooks/useSupabaseMutation'
import {
  getUserStudios,
  createInvoice,
  linkEventsToInvoice,
  generateInvoiceNumber,
  calculateEventPayout,
  EventWithStudio
} from '@/lib/invoice-utils'
import { InvoiceInsert } from '@/lib/types'
import { Loader2, CheckCircle } from 'lucide-react'

interface InvoiceCreationModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string
  studioId: string
  eventIds: string[]
  events?: EventWithStudio[]
  onSuccess?: () => void
}

export function InvoiceCreationModal({
  isOpen,
  onClose,
  userId,
  studioId,
  eventIds,
  events = [],
  onSuccess
}: InvoiceCreationModalProps) {
  const [invoiceNumber, setInvoiceNumber] = useState('')
  const [notes, setNotes] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)

  // Get studio details
  const { data: studios } = useSupabaseQuery({
    queryKey: ['user-studios', userId],
    fetcher: () => getUserStudios(userId),
    enabled: !!userId && isOpen
  })

  const studio = studios?.find((s) => s.id === studioId)
  const selectedEvents = events.filter(event => eventIds.includes(event.id))
  const totalAmount = selectedEvents.reduce((sum, event) => {
    return sum + (event.studio ? calculateEventPayout(event, event.studio) : 0)
  }, 0)

  // Generate invoice number on open
  useEffect(() => {
    if (isOpen && !invoiceNumber) {
      setInvoiceNumber(generateInvoiceNumber('INV'))
    }
  }, [isOpen, invoiceNumber])

  // Invoice creation mutation
  const createInvoiceMutation = useSupabaseMutation({
    mutationFn: async (supabase, invoiceData: InvoiceInsert) => {
      return await createInvoice(invoiceData)
    },
    onSuccess: async (invoice) => {
      await linkEventsToInvoice(eventIds, invoice.id)
      setShowSuccess(true)
    }
  })

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setShowSuccess(false)
      setNotes('')
      setInvoiceNumber('')
    }
  }, [isOpen])

  const handleCreateInvoice = async () => {
    if (!studio || selectedEvents.length === 0) return
    
    try {
      const eventDates = selectedEvents.map(e => new Date(e.start_time!))
      const periodStart = new Date(Math.min(...eventDates.map(d => d.getTime()))).toISOString()
      const periodEnd = new Date(Math.max(...eventDates.map(d => d.getTime()))).toISOString()

      const invoiceData: InvoiceInsert = {
        user_id: userId,
        studio_id: studioId,
        invoice_number: invoiceNumber,
        amount_total: totalAmount,
        currency: studio.currency || 'EUR',
        period_start: periodStart,
        period_end: periodEnd,
        notes: notes || null,
      }

      await createInvoiceMutation.mutateAsync(invoiceData)
    } catch (error) {
      console.error('Failed to create invoice:', error)
    }
  }

  if (!isOpen) return null

  const footerContent = !showSuccess ? (
    <>
      <Button variant="outline" onClick={onClose} disabled={createInvoiceMutation.isLoading}>
        Cancel
      </Button>
      <Button 
        onClick={handleCreateInvoice} 
        disabled={createInvoiceMutation.isLoading || !studio || selectedEvents.length === 0}
      >
        {createInvoiceMutation.isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Creating Invoice...
          </>
        ) : (
          `Create Invoice (€${totalAmount.toFixed(2)})`
        )}
      </Button>
    </>
  ) : undefined

  return (
    <UnifiedDialog
      open={isOpen}
      onOpenChange={onClose}
      title={`Create Invoice - ${studio?.studio_name || 'Unknown Studio'}`}
      size="lg"
      footer={footerContent}
    >
        {showSuccess ? (
          <div className="text-center py-8">
            <div className="mb-6">
              <div className="mx-auto flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-green-800 mb-2">Invoice Created Successfully!</h3>
              <p className="text-lg text-gray-700 mb-4">
                Invoice <strong>{invoiceNumber}</strong> has been created for <strong>€{totalAmount.toFixed(2)}</strong>
              </p>
            </div>

            <div className="flex justify-center space-x-4">
              <Button 
                onClick={() => {
                  onClose()
                  if (onSuccess) onSuccess()
                }}
              >
                View All Invoices
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Invoice Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="invoice_number">Invoice Number</Label>
                  <Input
                    id="invoice_number"
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    disabled={createInvoiceMutation.isLoading}
                  />
                </div>
                <div>
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <textarea
                    id="notes"
                    value={notes}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNotes(e.target.value)}
                    placeholder="Add any additional notes for this invoice..."
                    rows={3}
                    disabled={createInvoiceMutation.isLoading}
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Events ({selectedEvents.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {selectedEvents.map(event => (
                    <div key={event.id} className="flex justify-between items-center py-2 border-b">
                      <div>
                        <div className="font-medium">{event.title || 'Untitled Event'}</div>
                        <div className="text-sm text-gray-600">
                          {event.start_time ? new Date(event.start_time).toLocaleDateString() : 'No date'}
                        </div>
                      </div>
                      <div className="font-bold">
                        €{event.studio ? calculateEventPayout(event, event.studio).toFixed(2) : '0.00'}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total:</span>
                    <span>€{totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
    </UnifiedDialog>
  )
} 