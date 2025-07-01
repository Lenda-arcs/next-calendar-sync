import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createCorsResponse, createOptionsResponse } from '../_shared/cors.ts'
import { GeneratePDFRequest, GeneratePDFResponse } from './types.ts'
import { validateLanguage } from './translations.ts'
import { fetchInvoiceData, uploadPDFToStorage, updateInvoiceWithPDFUrl } from './database.ts'
import { generateInvoicePDF } from './pdf-generator.ts'

/**
 * Main handler for PDF generation requests
 */
async function handlePDFGeneration(request: Request): Promise<Response> {
  try {
    const requestBody: GeneratePDFRequest = await request.json()
    const { invoiceId, language } = requestBody

    console.log('PDF generation request:', { invoiceId, language })

    // Validate input
    if (!invoiceId) {
      return createCorsResponse(
        { error: 'Invoice ID is required' },
        400,
        request.headers.get('origin')
      )
    }

    // Validate and set language
    const selectedLanguage = validateLanguage(language)
    console.log('Using language:', selectedLanguage)

    // Fetch invoice data
    const invoiceData = await fetchInvoiceData(invoiceId)
    console.log('Invoice data fetched successfully')

    // Generate PDF
    const pdfBuffer = generateInvoicePDF(invoiceData, selectedLanguage)
    console.log('PDF generated successfully')

    // Upload PDF to storage
    const publicUrl = await uploadPDFToStorage(pdfBuffer, invoiceData)
    console.log('PDF uploaded to storage:', publicUrl)

    // Update invoice record with PDF URL
    await updateInvoiceWithPDFUrl(invoiceId, publicUrl)
    console.log('Invoice updated with PDF URL')

    // Return success response
    const response: GeneratePDFResponse = {
      success: true,
      pdf_url: publicUrl,
      message: 'PDF generated successfully'
    }

    return createCorsResponse(response, 200, request.headers.get('origin'))

  } catch (error) {
    console.error('Error in PDF generation:', error)
    
    // Return appropriate error response
    const errorMessage = error instanceof Error ? error.message : 'Internal server error'
    const statusCode = errorMessage.includes('not found') ? 404 : 500
    
    return createCorsResponse(
      { error: errorMessage },
      statusCode,
      request.headers.get('origin')
    )
  }
}

/**
 * Main server handler
 */
serve(async (request: Request): Promise<Response> => {
  const origin = request.headers.get('origin')

  // Handle CORS preflight requests
  if (request.method === 'OPTIONS') {
    return createOptionsResponse(origin)
  }

  // Only allow POST requests for PDF generation
  if (request.method !== 'POST') {
    return createCorsResponse(
      { error: 'Method not allowed' },
      405,
      origin
    )
  }

  // Handle PDF generation request
  return handlePDFGeneration(request)
}) 