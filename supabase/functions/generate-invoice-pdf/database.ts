import { createSupabaseAdminClient } from '../_shared/supabaseClient.ts'
import { InvoiceData } from './types.ts'

/**
 * Fetch invoice data with all related information needed for PDF generation
 */
export async function fetchInvoiceData(invoiceId: string): Promise<InvoiceData> {
  const supabase = createSupabaseAdminClient()
  
  // Fetch invoice data with related information
  const { data: invoice, error: fetchError } = await supabase
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
    throw new Error(`Invoice not found: ${fetchError?.message || 'Unknown error'}`)
  }

  // Fetch user invoice settings separately
  const { data: userSettings } = await supabase
    .from('user_invoice_settings')
    .select('kleinunternehmerregelung')
    .eq('user_id', invoice.user_id)
    .single()

  // Add user settings to invoice data
  invoice.user_invoice_settings = userSettings

  return invoice as InvoiceData
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