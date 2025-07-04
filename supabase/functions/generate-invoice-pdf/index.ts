import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createCorsResponse, createOptionsResponse } from '../_shared/cors.ts'
import { GeneratePDFRequest, GeneratePDFResponse, PDFPreviewRequest } from './types.ts'
import { validateLanguage } from './translations.ts'
import { fetchInvoiceData, uploadPDFToStorage, updateInvoiceWithPDFUrl } from './database.ts'
import { generateDramaticPDF, generatePreviewPDF } from './pdf-generator-dramatic.ts'

/**
 * Main handler for PDF generation requests
 */
async function handlePDFGeneration(request: Request): Promise<Response> {
  try {
    const requestBody: GeneratePDFRequest | PDFPreviewRequest = await request.json()
    const { language } = requestBody

    console.log('PDF generation request:', { language })

    // Validate and set language
    const selectedLanguage = validateLanguage(language)
    console.log('Using language:', selectedLanguage)

    // Check if this is a preview request
    if ('isPreview' in requestBody && requestBody.isPreview) {
      console.log('Generating PDF preview with template')
      
      try {
        // Generate preview PDF with sample data
        const pdfBuffer = await generatePreviewPDF(
          requestBody.templateConfig,
          requestBody.templateTheme,
          requestBody.userSettings || null,
          selectedLanguage
        )
        
        console.log('Preview PDF generated successfully, buffer size:', pdfBuffer.byteLength)
        
        // Convert ArrayBuffer to Uint8Array for proper base64 encoding
        const uint8Array = new Uint8Array(pdfBuffer)
        
        // Create a proper base64 string
        let binary = ''
        for (let i = 0; i < uint8Array.byteLength; i++) {
          binary += String.fromCharCode(uint8Array[i])
        }
        const base64Pdf = btoa(binary)
        
        console.log('Base64 conversion completed, length:', base64Pdf.length)
        
        const response: GeneratePDFResponse = {
          success: true,
          pdf_url: `data:application/pdf;base64,${base64Pdf}`,
          message: 'PDF preview generated successfully'
        }

        return createCorsResponse(response, 200, request.headers.get('origin'))
      } catch (previewError) {
        console.error('Error generating PDF preview:', previewError)
        return createCorsResponse(
          { error: `Preview generation failed: ${previewError instanceof Error ? previewError.message : 'Unknown error'}` },
          500,
          request.headers.get('origin')
        )
      }
    }

    // Handle regular invoice PDF generation
    const { invoiceId } = requestBody as GeneratePDFRequest
    
    // Validate input
    if (!invoiceId) {
      return createCorsResponse(
        { error: 'Invoice ID is required' },
        400,
        request.headers.get('origin')
      )
    }

    console.log('Generating PDF for invoice:', invoiceId)

    // Fetch invoice data
    const invoiceData = await fetchInvoiceData(invoiceId)
    console.log('Invoice data fetched successfully')

    // Generate PDF using dramatic generator (supports all themes)
    const pdfBuffer = await generateDramaticPDF(invoiceData, selectedLanguage)
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
  
  try {
    console.log(`${request.method} request to PDF generation function`)
    console.log('Origin:', origin)
    
    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      console.log('Handling CORS preflight request')
      return createOptionsResponse(origin)
    }

    // Only allow POST requests for PDF generation
    if (request.method !== 'POST') {
      console.log('Invalid method:', request.method)
      return createCorsResponse(
        { error: 'Method not allowed' },
        405,
        origin
      )
    }

    // Handle PDF generation request
    console.log('Processing PDF generation request')
    return await handlePDFGeneration(request)
  } catch (error) {
    console.error('Unexpected error in main handler:', error)
    return createCorsResponse(
      { error: 'Internal server error' },
      500,
      origin
    )
  }
}) 