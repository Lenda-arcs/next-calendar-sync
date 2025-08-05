import { createSupabaseAdminClient } from '../_shared/supabaseClient.ts'
import { InvoiceData } from './types.ts'

// Type for studio data from database
interface StudioData {
  id: string
  entity_name: string
  rate_config: unknown
}

/**
 * Fetch invoice data with all related information needed for PDF generation
 */
export async function fetchInvoiceData(invoiceId: string): Promise<InvoiceData> {
  const supabase = createSupabaseAdminClient()
  
  // First fetch the invoice
  const { data: invoice, error: fetchError } = await supabase
    .from('invoices')
    .select('*')
    .eq('id', invoiceId)
    .single()

  if (fetchError || !invoice) {
    console.error('Invoice fetch error:', fetchError)
    throw new Error(`Invoice not found: ${fetchError?.message || 'Unknown error'}`)
  }

  // Fetch billing entity (studio) for this invoice using studio_id
  const { data: billingEntity, error: entityError } = await supabase
    .from('billing_entities')
    .select(`
      id, entity_name, entity_type,
      individual_billing_email,
      recipient_info, banking_info,
      rate_config
    `)
    .eq('id', invoice.studio_id)
    .single()

  if (entityError || !billingEntity) {
    console.error('Billing entity fetch error:', entityError)
    throw new Error(`Billing entity not found: ${entityError?.message || 'Unknown error'}`)
  }

  // Fetch events for this invoice
  const { data: events, error: eventsError } = await supabase
    .from('events')
    .select('*')
    .eq('invoice_id', invoice.id)

  if (eventsError) {
    console.error('Events fetch error:', eventsError)
    throw new Error(`Events not found: ${eventsError?.message || 'Unknown error'}`)
  }

  // Get unique studio IDs from events for rate calculations
  const studioIds = [...new Set(events?.map(event => event.studio_id).filter((id): id is string => id !== null) || [])]
  
  // Fetch all studios needed for rate calculations
  const { data: studios, error: studiosError } = await supabase
    .from('billing_entities')
    .select('id, entity_name, rate_config')
    .in('id', studioIds)

  if (studiosError) {
    console.error('Studios fetch error:', studiosError)
    throw new Error(`Studios not found: ${studiosError?.message || 'Unknown error'}`)
  }

  // Create studio lookup map
  const studioMap = new Map((studios as StudioData[])?.map(studio => [studio.id, studio]) || [])

  // For each event, attach its studio for rate calculations
  const eventsWithStudio = (events || []).map(event => {
    const studio = event.studio_id ? studioMap.get(event.studio_id) : null
    
    return {
      ...event,
      studio: studio ? {
        entity_name: studio.entity_name,
        rate_config: studio.rate_config // Pass the full rate_config object
      } : null
    }
  })

  // Fetch user information
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('name, email, timezone')
    .eq('id', invoice.user_id)
    .single()

  if (userError || !user) {
    console.error('User fetch error:', userError)
    throw new Error(`User not found: ${userError?.message || 'Unknown error'}`)
  }

  // Fetch user invoice settings separately
  const { data: userSettings } = await supabase
    .from('user_invoice_settings')
    .select(`
      full_name, email, phone, address, 
      tax_id, vat_id, iban, bic, country,
      payment_terms_days, invoice_number_prefix, 
      business_signature, kleinunternehmerregelung,
      pdf_template_config, template_theme
    `)
    .eq('user_id', invoice.user_id)
    .single()

  // Combine all data
  const invoiceData = {
    ...invoice,
    studio: billingEntity,
    events: eventsWithStudio,
    user: user,
    user_invoice_settings: userSettings
  }

  return invoiceData as InvoiceData
}

/**
 * Upload PDF to Supabase Storage and return public URL
 */
export async function uploadPDFToStorage(
  pdfBuffer: ArrayBuffer,
  invoiceData: InvoiceData
): Promise<string> {
  const supabase = createSupabaseAdminClient()
  
  const fileName = `invoice-${invoiceData.invoice_number}-${Date.now()}.pdf`
  const filePath = `invoices/${invoiceData.user.email}/${invoiceData.id}/${fileName}`

  const { error: uploadError } = await supabase.storage
    .from('invoice-pdfs')
    .upload(filePath, pdfBuffer, {
      contentType: 'application/pdf',
      upsert: true
    })

  if (uploadError) {
    console.error('Storage upload error:', uploadError)
    throw new Error(`Failed to upload PDF: ${uploadError.message}`)
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('invoice-pdfs')
    .getPublicUrl(filePath)

  return publicUrl
}

/**
 * Update invoice record with PDF URL
 */
export async function updateInvoiceWithPDFUrl(
  invoiceId: string,
  pdfUrl: string
): Promise<void> {
  const supabase = createSupabaseAdminClient()
  
  const { error: updateError } = await supabase
    .from('invoices')
    .update({ pdf_url: pdfUrl })
    .eq('id', invoiceId)

  if (updateError) {
    console.error('Invoice update error:', updateError)
    throw new Error(`Failed to update invoice: ${updateError.message}`)
  }
} 