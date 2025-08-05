import { InvoiceWithDetails, calculateEventPayout } from './invoice-utils'

/**
 * Formats invoice data as a tab-separated table for easy pasting into Excel/Google Sheets
 */
export function formatInvoiceForClipboard(invoice: InvoiceWithDetails): string {
  const lines: string[] = []
  
  // Header
  lines.push('Invoice Details')
  lines.push('')
  
  // Basic invoice info
  lines.push(`Invoice Number:\t${invoice.invoice_number}`)
  lines.push(`Total Amount:\t€${(invoice.amount_total || 0).toFixed(2)}`)
  lines.push(`Currency:\t${invoice.currency || 'EUR'}`)
  lines.push(`Status:\t${invoice.status || 'draft'}`)
  lines.push(`Created:\t${invoice.created_at ? new Date(invoice.created_at).toLocaleDateString() : 'Unknown'}`)
  
  if (invoice.period_start && invoice.period_end) {
    lines.push(`Period Start:\t${new Date(invoice.period_start).toLocaleDateString()}`)
    lines.push(`Period End:\t${new Date(invoice.period_end).toLocaleDateString()}`)
  }
  
  if (invoice.notes) {
    lines.push(`Notes:\t${invoice.notes}`)
  }
  
  if (invoice.studio) {
    lines.push('')
    lines.push('Studio Information')
    lines.push(`Studio Name:\t${invoice.studio.entity_name}`)
    if (invoice.studio.recipient_info?.address) {
      lines.push(`Address:\t${invoice.studio.recipient_info.address}`)
    }
    if (invoice.studio.recipient_info?.email) {
      lines.push(`Email:\t${invoice.studio.recipient_info.email}`)
    }
  }
  
  // Events table
  if (invoice.events && invoice.events.length > 0) {
    lines.push('')
    lines.push('Events')
    lines.push('Event\tDate\tTime\tLocation\tStudents (Studio)\tStudents (Online)\tRate\tTotal')
    
    invoice.events.forEach(event => {
      const eventDate = new Date(event.start_time!)
      const dateStr = eventDate.toLocaleDateString()
      const timeStr = eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      
      const studentsStudio = event.students_studio || 0
      const studentsOnline = event.students_online || 0
      const rate = invoice.studio ? calculateEventPayout(event, invoice.studio) : 0
      const total = rate
      
      lines.push(
        `${event.title}\t${dateStr}\t${timeStr}\t${event.location || 'N/A'}\t${studentsStudio}\t${studentsOnline}\t€${rate.toFixed(2)}\t€${total.toFixed(2)}`
      )
    })
    
    // Summary
    const totalEvents = invoice.events.length
    const totalStudentsStudio = invoice.events.reduce((sum, event) => sum + (event.students_studio || 0), 0)
    const totalStudentsOnline = invoice.events.reduce((sum, event) => sum + (event.students_online || 0), 0)
    
    lines.push('')
    lines.push('Summary')
    lines.push(`Total Events:\t${totalEvents}`)
    lines.push(`Total Students (Studio):\t${totalStudentsStudio}`)
    lines.push(`Total Students (Online):\t${totalStudentsOnline}`)
    lines.push(`Total Amount:\t€${(invoice.amount_total || 0).toFixed(2)}`)
  }
  
  return lines.join('\n')
}

/**
 * Copies invoice data to clipboard with fallback support
 */
export async function copyInvoiceToClipboard(invoice: InvoiceWithDetails): Promise<boolean> {
  try {
    const formattedData = formatInvoiceForClipboard(invoice)
    
    // Try modern clipboard API first
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(formattedData)
      return true
    }
    
    // Fallback for older browsers or non-secure contexts
    const textArea = document.createElement('textarea')
    textArea.value = formattedData
    textArea.style.position = 'fixed'
    textArea.style.left = '-999999px'
    textArea.style.top = '-999999px'
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    
    const successful = document.execCommand('copy')
    document.body.removeChild(textArea)
    
    return successful
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
    return false
  }
}

/**
 * Creates a simple text summary of the invoice for quick sharing
 */
export function formatInvoiceSummary(invoice: InvoiceWithDetails): string {
  const eventCount = invoice.events?.length || 0
  const totalAmount = invoice.amount_total || 0
  
  let summary = `Invoice ${invoice.invoice_number} - €${totalAmount.toFixed(2)}`
  
  if (invoice.studio) {
    summary += ` for ${invoice.studio.entity_name}`
  }
  
  summary += ` (${eventCount} event${eventCount !== 1 ? 's' : ''})`
  
  if (invoice.period_start && invoice.period_end) {
    const startDate = new Date(invoice.period_start).toLocaleDateString()
    const endDate = new Date(invoice.period_end).toLocaleDateString()
    summary += ` - Period: ${startDate} to ${endDate}`
  }
  
  return summary
} 