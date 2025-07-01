import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// PDF generation using jsPDF (lightweight option)
// For more advanced layouts, consider using Puppeteer or React-PDF
import { jsPDF } from 'https://esm.sh/jspdf@2.5.1'

interface InvoiceData {
  id: string
  invoice_number: string
  amount_total: number
  currency: string
  period_start: string
  period_end: string
  notes?: string
  created_at: string
  studio: {
    entity_name: string
    address?: string
    billing_email?: string
  }
  events: Array<{
    id: string
    title: string
    start_time: string
    location?: string
    students_studio?: number
    students_online?: number
    studio: {
      entity_name: string
      base_rate?: number
      bonus_per_student?: number
      online_bonus_per_student?: number
      studio_penalty_per_student?: number
      rate_type?: string
    } | null
  }>
  user: {
    name: string
    email: string
  }
  user_invoice_settings?: {
    kleinunternehmerregelung: boolean
  } | null
}

type Language = 'en' | 'de' | 'es'

interface Translations {
  invoice: string
  invoiceNumber: string
  date: string
  period: string
  billTo: string
  event: string
  dateCol: string
  studio: string
  students: string
  rate: string
  studentLegend: string
  total: string
  notes: string
  vatExemptGerman: string
  vatExemptEnglish: string
  untitledEvent: string
}

const translations: Record<Language, Translations> = {
  en: {
    invoice: 'INVOICE',
    invoiceNumber: 'Invoice #',
    date: 'Date',
    period: 'Period',
    billTo: 'Bill To',
    event: 'Event',
    dateCol: 'Date',
    studio: 'Studio',
    students: 'Students',
    rate: 'Rate',
    studentLegend: '(Studio/Online)',
    total: 'Total',
    notes: 'Notes',
    vatExemptGerman: 'According to § 19 UStG, no VAT is charged.',
    vatExemptEnglish: '(VAT exempt according to German small business regulation)',
    untitledEvent: 'Untitled Event'
  },
  de: {
    invoice: 'RECHNUNG',
    invoiceNumber: 'Rechnung #',
    date: 'Datum',
    period: 'Zeitraum',
    billTo: 'Rechnung an',
    event: 'Veranstaltung',
    dateCol: 'Datum',
    studio: 'Studio',
    students: 'Teilnehmer',
    rate: 'Tarif',
    studentLegend: '(Studio/Online)',
    total: 'Gesamt',
    notes: 'Notizen',
    vatExemptGerman: 'Gemäß § 19 UStG wird keine Umsatzsteuer berechnet.',
    vatExemptEnglish: '(MwSt.-befreit nach deutschem Kleinunternehmerrecht)',
    untitledEvent: 'Unbenannte Veranstaltung'
  },
  es: {
    invoice: 'FACTURA',
    invoiceNumber: 'Factura #',
    date: 'Fecha',
    period: 'Período',
    billTo: 'Facturar a',
    event: 'Evento',
    dateCol: 'Fecha',
    studio: 'Estudio',
    students: 'Estudiantes',
    rate: 'Tarifa',
    studentLegend: '(Estudio/Online)',
    total: 'Total',
    notes: 'Notas',
    vatExemptGerman: 'Según § 19 UStG, no se cobra IVA.',
    vatExemptEnglish: '(Exento de IVA según la regulación alemana de pequeñas empresas)',
    untitledEvent: 'Evento sin título'
  }
}

// Simple rate calculation function
function calculateEventRate(event: InvoiceData['events'][0]): number {
  if (!event.studio) return 0
  
  const baseRate = event.studio.base_rate || 0
  const studioStudents = event.students_studio || 0
  const onlineStudents = event.students_online || 0
  
  // Simple calculation - can be enhanced based on your business logic
  let rate = baseRate
  
  if (event.studio.bonus_per_student && studioStudents > 0) {
    rate += (event.studio.bonus_per_student * studioStudents)
  }
  
  if (event.studio.online_bonus_per_student && onlineStudents > 0) {
    rate += (event.studio.online_bonus_per_student * onlineStudents)
  }
  
  return rate
}

function generateInvoicePDF(invoiceData: InvoiceData, language: Language = 'en'): ArrayBuffer {
  console.log('Generating PDF with language:', language)
  
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.width
  let yPosition = 20
  
  // Ensure language exists in translations
  const validLanguage: Language = translations[language] ? language : 'en'
  const t = translations[validLanguage]
  
  console.log('Using translations for:', validLanguage)

  // Header
  doc.setFontSize(20)
  doc.text(t.invoice, pageWidth / 2, yPosition, { align: 'center' })
  yPosition += 20

  // Invoice details
  doc.setFontSize(12)
  doc.text(`${t.invoiceNumber}: ${invoiceData.invoice_number}`, 20, yPosition)
  yPosition += 10
  doc.text(`${t.date}: ${new Date(invoiceData.created_at).toLocaleDateString()}`, 20, yPosition)
  yPosition += 10
  doc.text(`${t.period}: ${new Date(invoiceData.period_start).toLocaleDateString()} - ${new Date(invoiceData.period_end).toLocaleDateString()}`, 20, yPosition)
  yPosition += 20

  // Studio details
  doc.setFontSize(14)
  doc.text(`${t.billTo}:`, 20, yPosition)
  yPosition += 10
  doc.setFontSize(12)
  doc.text(invoiceData.studio.entity_name, 20, yPosition)
  if (invoiceData.studio.address) {
    yPosition += 8
    doc.text(invoiceData.studio.address, 20, yPosition)
  }
  yPosition += 20

  // Events table header
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
    const studioStudents = event.students_studio || 0
    const onlineStudents = event.students_online || 0
    const studentText = studioStudents > 0 || onlineStudents > 0 
      ? `${studioStudents}/${onlineStudents}` 
      : 'N/A'
    doc.text(studentText, 150, yPosition)
    
    // Rate - calculate based on studio settings and student counts
    const calculatedRate = calculateEventRate(event)
    const rateText = calculatedRate > 0 ? `${invoiceData.currency} ${calculatedRate.toFixed(2)}` : 'N/A'
    doc.text(rateText, 180, yPosition)
    
    yPosition += 8
  })

  yPosition += 20

  // Total
  doc.setFontSize(14)
  doc.text(`${t.total}: ${invoiceData.currency} ${invoiceData.amount_total.toFixed(2)}`, pageWidth - 60, yPosition, { align: 'right' })

  // Notes
  if (invoiceData.notes) {
    yPosition += 20
    doc.setFontSize(10)
    doc.text(`${t.notes}:`, 20, yPosition)
    yPosition += 8
    doc.text(invoiceData.notes, 20, yPosition)
    yPosition += 15
  }

  // Kleinunternehmerregelung notice (German small business regulation)
  if (invoiceData.user_invoice_settings?.kleinunternehmerregelung) {
    yPosition += 15
    doc.setFontSize(9)
    doc.setFont('helvetica', 'italic')
    doc.text(t.vatExemptGerman, 20, yPosition)
    yPosition += 8
    doc.text(t.vatExemptEnglish, 20, yPosition)
  }

  return doc.output('arraybuffer')
}

serve(async (req) => {
  try {
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    }

    if (req.method === 'OPTIONS') {
      return new Response('ok', { headers: corsHeaders })
    }

    // Get Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get request data
    const requestBody = await req.json()
    const { invoiceId, language } = requestBody

    console.log('Request body:', requestBody)

    if (!invoiceId) {
      return new Response(
        JSON.stringify({ error: 'Invoice ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validate language parameter - default to 'en' if not provided or invalid
    const validLanguages: Language[] = ['en', 'de', 'es']
    const selectedLanguage: Language = language && validLanguages.includes(language) ? language : 'en'
    
    console.log('Selected language:', selectedLanguage)

    // Fetch invoice data with related information
    const { data: invoice, error: fetchError } = await supabaseClient
      .from('invoices')
      .select(`
        *,
        studio:billing_entities!invoices_billing_entity_id_fkey(*),
        events(
          *,
          studio:billing_entities!events_billing_entity_id_fkey(entity_name, base_rate, bonus_per_student, online_bonus_per_student, studio_penalty_per_student, rate_type)
        ),
        user:users(name, email)
      `)
      .eq('id', invoiceId)
      .single()

    if (fetchError || !invoice) {
      console.error('Invoice fetch error:', fetchError)
      return new Response(
        JSON.stringify({ error: 'Invoice not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Fetch user invoice settings separately
    const { data: userSettings } = await supabaseClient
      .from('user_invoice_settings')
      .select('kleinunternehmerregelung')
      .eq('user_id', invoice.user_id)
      .single()

    // Add user settings to invoice data
    invoice.user_invoice_settings = userSettings

    // Generate PDF with selected language
    console.log('About to generate PDF with language:', selectedLanguage)
    const pdfBuffer = generateInvoicePDF(invoice as InvoiceData, selectedLanguage)
    console.log('PDF generated successfully')

    // Upload PDF to Supabase Storage
    const fileName = `invoice-${invoice.invoice_number}-${Date.now()}.pdf`
    const filePath = `invoices/${invoice.user_id}/${invoiceId}/${fileName}`

    const { error: uploadError } = await supabaseClient.storage
      .from('invoice-pdfs')
      .upload(filePath, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: true
      })

    if (uploadError) {
      console.error('Storage upload error:', uploadError)
      return new Response(
        JSON.stringify({ error: 'Failed to upload PDF' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get public URL
    const { data: { publicUrl } } = supabaseClient.storage
      .from('invoice-pdfs')
      .getPublicUrl(filePath)

    // Update invoice with PDF URL
    const { error: updateError } = await supabaseClient
      .from('invoices')
      .update({ pdf_url: publicUrl })
      .eq('id', invoiceId)

    if (updateError) {
      console.error('Invoice update error:', updateError)
      return new Response(
        JSON.stringify({ error: 'Failed to update invoice' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        pdf_url: publicUrl,
        message: 'PDF generated successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error generating PDF:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}) 