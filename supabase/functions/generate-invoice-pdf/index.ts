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
    studio_name: string
    address?: string
    billing_email?: string
  }
  events: Array<{
    id: string
    title: string
    start_time: string
    location?: string
  }>
  user: {
    name: string
    email: string
  }
}

function generateInvoicePDF(invoiceData: InvoiceData): Uint8Array {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.width
  let yPosition = 20

  // Header
  doc.setFontSize(20)
  doc.text('INVOICE', pageWidth / 2, yPosition, { align: 'center' })
  yPosition += 20

  // Invoice details
  doc.setFontSize(12)
  doc.text(`Invoice #: ${invoiceData.invoice_number}`, 20, yPosition)
  yPosition += 10
  doc.text(`Date: ${new Date(invoiceData.created_at).toLocaleDateString()}`, 20, yPosition)
  yPosition += 10
  doc.text(`Period: ${new Date(invoiceData.period_start).toLocaleDateString()} - ${new Date(invoiceData.period_end).toLocaleDateString()}`, 20, yPosition)
  yPosition += 20

  // Studio details
  doc.setFontSize(14)
  doc.text('Bill To:', 20, yPosition)
  yPosition += 10
  doc.setFontSize(12)
  doc.text(invoiceData.studio.studio_name, 20, yPosition)
  if (invoiceData.studio.address) {
    yPosition += 8
    doc.text(invoiceData.studio.address, 20, yPosition)
  }
  yPosition += 20

  // Events table header
  doc.setFontSize(12)
  doc.text('Event', 20, yPosition)
  doc.text('Date', 100, yPosition)
  doc.text('Location', 140, yPosition)
  yPosition += 10

  // Draw line under header
  doc.line(20, yPosition, pageWidth - 20, yPosition)
  yPosition += 10

  // Events list
  doc.setFontSize(10)
  invoiceData.events.forEach(event => {
    doc.text(event.title || 'Untitled Event', 20, yPosition)
    doc.text(new Date(event.start_time).toLocaleDateString(), 100, yPosition)
    doc.text(event.location || 'N/A', 140, yPosition)
    yPosition += 8
  })

  yPosition += 20

  // Total
  doc.setFontSize(14)
  doc.text(`Total: ${invoiceData.currency} ${invoiceData.amount_total.toFixed(2)}`, pageWidth - 60, yPosition, { align: 'right' })

  // Notes
  if (invoiceData.notes) {
    yPosition += 20
    doc.setFontSize(10)
    doc.text('Notes:', 20, yPosition)
    yPosition += 8
    doc.text(invoiceData.notes, 20, yPosition)
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
    const { invoiceId } = await req.json()

    if (!invoiceId) {
      return new Response(
        JSON.stringify({ error: 'Invoice ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Fetch invoice data with related information
    const { data: invoice, error: fetchError } = await supabaseClient
      .from('invoices')
      .select(`
        *,
        studio:studios(*),
        events(*),
        user:users(name, email)
      `)
      .eq('id', invoiceId)
      .single()

    if (fetchError || !invoice) {
      return new Response(
        JSON.stringify({ error: 'Invoice not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Generate PDF
    const pdfBuffer = generateInvoicePDF(invoice as InvoiceData)

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