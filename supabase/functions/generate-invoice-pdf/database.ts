import { createSupabaseAdminClient } from '../_shared/supabaseClient.ts'
import { InvoiceData } from './types.ts'

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

  // Fetch billing entity (studio/teacher) for this invoice
  const { data: billingEntity, error: entityError } = await supabase
    .from('billing_entities')
    .select('*')
    .eq('id', invoice.billing_entity_id)
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

  // For each event, get its billing entity (studio) to calculate rates
  const eventsWithStudio = await Promise.all((events || []).map(async (event) => {
    if (event.billing_entity_id) {
      const { data: eventBillingEntity } = await supabase
        .from('billing_entities')
        .select('entity_name, rate_config')
        .eq('id', event.billing_entity_id)
        .single()
      
      // Extract rate config from JSON field
      const rateConfig = eventBillingEntity?.rate_config ? JSON.parse(JSON.stringify(eventBillingEntity.rate_config)) : null;
      
      return {
        ...event,
        studio: eventBillingEntity ? {
          entity_name: eventBillingEntity.entity_name,
          base_rate: rateConfig?.base_rate || 0,
          bonus_per_student: rateConfig?.bonus_per_student || 0,
          online_bonus_per_student: rateConfig?.online_bonus_per_student || 0,
          studio_penalty_per_student: rateConfig?.studio_penalty_per_student || 0,
          rate_type: rateConfig?.rate_type || 'flat'
        } : null
      }
    }
    return { ...event, studio: null }
  }))

  // Fetch user information
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('name, email')
    .eq('id', invoice.user_id)
    .single()

  if (userError || !user) {
    console.error('User fetch error:', userError)
    throw new Error(`User not found: ${userError?.message || 'Unknown error'}`)
  }

  // Fetch user invoice settings separately
  const { data: userSettings } = await supabase
    .from('user_invoice_settings')
    .select('kleinunternehmerregelung')
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