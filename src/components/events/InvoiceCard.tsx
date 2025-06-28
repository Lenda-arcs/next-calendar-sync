import React, { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { InvoiceWithDetails } from '@/lib/invoice-utils'
import { Edit3, Eye, FileText } from 'lucide-react'

interface InvoiceCardProps {
  invoice: InvoiceWithDetails
  onEdit?: (invoice: InvoiceWithDetails) => void
  onStatusChange?: (invoiceId: string, newStatus: 'sent' | 'paid' | 'overdue') => void
}

export const InvoiceCard: React.FC<InvoiceCardProps> = ({ invoice, onEdit, onStatusChange }) => {
  const getStatusBadge = (status: string) => {
    const variants = {
      draft: { variant: 'secondary' as const, text: 'Draft', color: 'bg-gray-100 text-gray-800' },
      sent: { variant: 'default' as const, text: 'Sent', color: 'bg-blue-100 text-blue-800' },
      paid: { variant: 'default' as const, text: 'Paid', color: 'bg-green-100 text-green-800' },
      overdue: { variant: 'destructive' as const, text: 'Overdue', color: 'bg-red-100 text-red-800' },
      cancelled: { variant: 'outline' as const, text: 'Cancelled', color: 'bg-gray-100 text-gray-500' }
    }
    const config = variants[status as keyof typeof variants] || variants.draft
    return (
      <Badge variant={config.variant} className={config.color}>
        {config.text}
      </Badge>
    )
  }

  const canEdit = invoice.status === 'draft'
  const ButtonIcon = canEdit ? Edit3 : Eye
  const buttonText = canEdit ? 'Edit' : 'View'

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-3 sm:space-y-0">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-semibold text-gray-900">
                {invoice.invoice_number || `Invoice ${invoice.id.slice(0, 8)}`}
              </h3>
              {getStatusBadge(invoice.status)}
            </div>
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
          <div className="flex justify-between sm:justify-end sm:flex-col sm:text-right items-center sm:items-end space-y-2 sm:space-y-2">
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
            {onEdit && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onEdit(invoice)}
                className="flex items-center gap-1"
              >
                <ButtonIcon className="w-3 h-3" />
                {buttonText}
              </Button>
            )}
          </div>
        </div>
        {invoice.notes && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-gray-600 break-words">{invoice.notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 