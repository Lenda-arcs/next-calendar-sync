import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { InvoiceWithDetails } from '@/lib/invoice-utils'

interface InvoiceCardProps {
  invoice: InvoiceWithDetails
}

export const InvoiceCard: React.FC<InvoiceCardProps> = ({ invoice }) => {
  return (
    <Card>
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
  )
} 