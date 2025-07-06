import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createSupabaseAdminClient } from "../_shared/supabaseClient.ts"
import { createCorsResponse, createOptionsResponse } from "../_shared/cors.ts"
import { parseRequestPayload } from "./mime-parser.ts"
import { processCalendarInvitation } from "./invitation-processor.ts"
import { isValidWebhookRequest, requiresAuthentication, validatePayload } from "./validation.ts"
import { ProcessingResult } from "./types.ts"

/**
 * Main handler for calendar invitation processing
 */
async function handleCalendarInvitation(req: Request): Promise<Response> {
  const origin = req.headers.get('origin')
  
  try {
    console.log('Processing calendar invitation webhook')
    
    // Parse the webhook payload
    const payload = await parseRequestPayload(req)
    
    console.log('Parsed payload:', {
      to: payload.to,
      from: payload.from,
      subject: payload.subject,
      hasText: !!payload.text,
      hasHtml: !!payload.html,
      attachmentCount: payload.attachments?.length || 0
    })

    // Validate the payload
    const validation = validatePayload(payload)
    if (!validation.isValid) {
      console.error('Payload validation failed:', validation.error)
      return createCorsResponse(
        { success: false, error: validation.error },
        400,
        origin
      )
    }

    // Initialize Supabase client
    const supabase = createSupabaseAdminClient()

    // Process the calendar invitation
    const result = await processCalendarInvitation(supabase, payload)
    
    console.log('Calendar invitation processed successfully:', result)
    
    return createCorsResponse(result, 200, origin)

  } catch (error) {
    console.error('Error processing calendar invitation:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Internal server error'
    const statusCode = getErrorStatusCode(errorMessage)
    
    return createCorsResponse(
      { success: false, error: errorMessage },
      statusCode,
      origin
    )
  }
}

/**
 * Get appropriate HTTP status code based on error message
 */
function getErrorStatusCode(errorMessage: string): number {
  const lowerMessage = errorMessage.toLowerCase()
  
  if (lowerMessage.includes('not found') || lowerMessage.includes('expired')) {
    return 404
  }
  
  if (lowerMessage.includes('invalid') || lowerMessage.includes('missing')) {
    return 400
  }
  
  if (lowerMessage.includes('unauthorized')) {
    return 401
  }
  
  if (lowerMessage.includes('forbidden')) {
    return 403
  }
  
  return 500
}

/**
 * Handle authentication for non-webhook requests
 */
function handleAuthentication(req: Request): Response | null {
  if (!requiresAuthentication(req)) {
    return null // No authentication required for webhooks
  }
  
  const authHeader = req.headers.get('authorization')
  if (!authHeader) {
    return createCorsResponse(
      { error: 'Unauthorized' },
      401,
      req.headers.get('origin')
    )
  }
  
  return null // Authentication passed
}

/**
 * Main server handler
 */
serve(async (req: Request): Promise<Response> => {
  const origin = req.headers.get('origin')
  
  try {
    console.log(`${req.method} request to calendar invitation processor`)
    console.log('Origin:', origin)
    console.log('User-Agent:', req.headers.get('user-agent'))
    console.log('Is webhook request:', isValidWebhookRequest(req))
    
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
      console.log('Handling CORS preflight request')
      return createOptionsResponse(origin)
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
      console.log('Invalid method:', req.method)
      return createCorsResponse(
        { error: 'Method not allowed' },
        405,
        origin
      )
    }

    // Handle authentication if required
    const authError = handleAuthentication(req)
    if (authError) {
      console.log('Authentication failed')
      return authError
    }

    // Process the calendar invitation
    return await handleCalendarInvitation(req)
    
  } catch (error) {
    console.error('Unexpected error in main handler:', error)
    return createCorsResponse(
      { error: 'Internal server error' },
      500,
      origin
    )
  }
})