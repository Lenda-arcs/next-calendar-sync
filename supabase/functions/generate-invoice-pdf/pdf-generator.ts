import { jsPDF } from 'https://esm.sh/jspdf@2.5.1'
import { InvoiceData, Language, Translations } from './types.ts'
import { getTranslations } from './translations.ts'
import { calculateEventRate, formatCurrency, formatStudentCount } from './calculations.ts'

/**
 * Generate PDF document for an invoice
 */
export function generateInvoicePDF(invoiceData: InvoiceData, language: Language = 'en'): ArrayBuffer {
  console.log('Generating PDF with language:', language)
  
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.width
  let yPosition = 20
  
  // Get translations for the selected language
  const t = getTranslations(language)
  console.log('Using translations for:', language)

  // Generate PDF sections
  yPosition = addHeader(doc, t, pageWidth, yPosition)
  yPosition = addInvoiceDetails(doc, t, invoiceData, yPosition)
  yPosition = addBillingDetails(doc, t, invoiceData, yPosition)
  yPosition = addEventsTable(doc, t, invoiceData, yPosition, pageWidth)
  yPosition = addTotal(doc, t, invoiceData, pageWidth, yPosition)
  yPosition = addNotes(doc, t, invoiceData, yPosition)
  addVATExemptNotice(doc, t, invoiceData, yPosition)

  return doc.output('arraybuffer')
}

/**
 * Add header section to PDF
 */
function addHeader(doc: jsPDF, t: Translations, pageWidth: number, yPosition: number): number {
  doc.setFontSize(20)
  doc.text(t.invoice, pageWidth / 2, yPosition, { align: 'center' })
  return yPosition + 20
}

/**
 * Add invoice details section
 */
function addInvoiceDetails(doc: jsPDF, t: Translations, invoiceData: InvoiceData, yPosition: number): number {
  doc.setFontSize(12)
  doc.text(`${t.invoiceNumber}: ${invoiceData.invoice_number}`, 20, yPosition)
  yPosition += 10
  doc.text(`${t.date}: ${new Date(invoiceData.created_at).toLocaleDateString()}`, 20, yPosition)
  yPosition += 10
  doc.text(
    `${t.period}: ${new Date(invoiceData.period_start).toLocaleDateString()} - ${new Date(invoiceData.period_end).toLocaleDateString()}`, 
    20, 
    yPosition
  )
  return yPosition + 20
}

/**
 * Add billing details section
 */
function addBillingDetails(doc: jsPDF, t: Translations, invoiceData: InvoiceData, yPosition: number): number {
  doc.setFontSize(14)
  doc.text(`${t.billTo}:`, 20, yPosition)
  yPosition += 10
  doc.setFontSize(12)
  doc.text(invoiceData.studio.entity_name, 20, yPosition)
  
  if (invoiceData.studio.address) {
    yPosition += 8
    doc.text(invoiceData.studio.address, 20, yPosition)
  }
  
  return yPosition + 20
}

/**
 * Add events table section
 */
function addEventsTable(doc: jsPDF, t: Translations, invoiceData: InvoiceData, yPosition: number, pageWidth: number): number {
  // Table header
  doc.setFontSize(12)
  doc.text(t.event, 20, yPosition)
  doc.text(t.dateCol, 75, yPosition)
  doc.text(t.studio, 115, yPosition)
  doc.text(t.students, 150, yPosition)
  doc.text(t.rate, 180, yPosition)
  yPosition += 10

  // Draw line under header
  doc.line(20, yPosition, pageWidth - 20, yPosition)
  yPosition += 5

  // Add legend for student count format
  doc.setFontSize(8)
  doc.text(t.studentLegend, 150, yPosition)
  yPosition += 8

  // Events list
  doc.setFontSize(10)
  invoiceData.events.forEach(event => {
    // Event title
    doc.text(event.title || t.untitledEvent, 20, yPosition)
    
    // Date
    doc.text(new Date(event.start_time).toLocaleDateString(), 75, yPosition)
    
    // Studio name (use event's studio if available, otherwise use invoice studio)
    const studioName = event.studio?.entity_name || invoiceData.studio.entity_name || 'N/A'
    doc.text(studioName, 115, yPosition)
    
    // Student counts
    const studentText = formatStudentCount(event.students_studio, event.students_online)
    doc.text(studentText, 150, yPosition)
    
    // Rate - calculate based on studio settings and student counts
    const calculatedRate = calculateEventRate(event)
    const rateText = calculatedRate > 0 ? formatCurrency(calculatedRate, invoiceData.currency) : 'N/A'
    doc.text(rateText, 180, yPosition)
    
    yPosition += 8
  })

  return yPosition + 20
}

/**
 * Add total section
 */
function addTotal(doc: jsPDF, t: Translations, invoiceData: InvoiceData, pageWidth: number, yPosition: number): number {
  doc.setFontSize(14)
  doc.text(
    `${t.total}: ${formatCurrency(invoiceData.amount_total, invoiceData.currency)}`, 
    pageWidth - 60, 
    yPosition, 
    { align: 'right' }
  )
  return yPosition + 20
}

/**
 * Add notes section if notes exist
 */
function addNotes(doc: jsPDF, t: Translations, invoiceData: InvoiceData, yPosition: number): number {
  if (!invoiceData.notes) return yPosition
  
  doc.setFontSize(10)
  doc.text(`${t.notes}:`, 20, yPosition)
  yPosition += 8
  doc.text(invoiceData.notes, 20, yPosition)
  return yPosition + 15
}

/**
 * Add VAT exempt notice if applicable
 */
function addVATExemptNotice(doc: jsPDF, t: Translations, invoiceData: InvoiceData, yPosition: number): void {
  if (!invoiceData.user_invoice_settings?.kleinunternehmerregelung) return
  
  yPosition += 15
  doc.setFontSize(9)
  doc.setFont('helvetica', 'italic')
  doc.text(t.vatExemptGerman, 20, yPosition)
  yPosition += 8
  doc.text(t.vatExemptEnglish, 20, yPosition)
} 