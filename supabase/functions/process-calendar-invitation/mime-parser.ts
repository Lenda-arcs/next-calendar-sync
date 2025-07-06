// mime-parser.ts
// MIME message parsing utilities

import { CalendarInvitationPayload, MimeHeaders, ParsedMimeMessage } from './types.ts'

export async function parseRequestPayload(req: Request): Promise<CalendarInvitationPayload> {
  const contentType = req.headers.get('content-type') || ''
  
  console.log('Parsing request with content-type:', contentType)
  
  if (contentType.includes('application/json')) {
    return await req.json()
  } 
  
  if (contentType.includes('application/x-www-form-urlencoded') || 
      contentType.includes('multipart/form-data')) {
    return await parseFormData(req)
  }
  
  // Handle raw MIME message
  const rawMimeBody = await req.text()
  console.log('Parsing raw MIME message, length:', rawMimeBody.length)
  
  return await parseRawMimeMessage(rawMimeBody)
}

async function parseFormData(req: Request): Promise<CalendarInvitationPayload> {
  console.log('Parsing form data')
  const formData = await req.formData()
  
  const payload: CalendarInvitationPayload = {
    to: formData.get('to') as string,
    from: formData.get('from') as string,
    subject: formData.get('subject') as string,
    text: formData.get('text') as string,
    html: formData.get('html') as string,
    attachments: []
  }
  
  console.log('Parsed form data:', {
    to: payload.to,
    from: payload.from,
    subject: payload.subject,
    hasText: !!payload.text,
    hasHtml: !!payload.html
  })
  
  // Parse attachments if present
  const attachmentInfo = formData.get('attachment-info')
  if (attachmentInfo) {
    try {
      const attachments = JSON.parse(attachmentInfo as string)
      payload.attachments = Object.keys(attachments).map(key => ({
        filename: attachments[key].filename,
        contentType: attachments[key].type,
        content: formData.get(key) as string
      }))
      console.log('Parsed attachments:', payload.attachments?.length || 0)
    } catch (e) {
      console.error('Could not parse attachment info:', e)
    }
  }
  
  return payload
}

async function parseRawMimeMessage(rawMime: string): Promise<CalendarInvitationPayload> {
  const parsed = parseRawMime(rawMime)
  
  return {
    to: parsed.headers['to'] || '',
    from: parsed.headers['from'] || '',
    subject: parsed.headers['subject'] || '',
    text: parsed.text,
    html: parsed.html,
    attachments: parsed.attachments
  }
}

function parseRawMime(rawMime: string): ParsedMimeMessage {
  const lines = rawMime.split('\n')
  const headers: MimeHeaders = {}
  let bodyStart = 0
  
  // Parse headers
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (line.trim() === '') {
      bodyStart = i + 1
      break
    }
    
    if (line.startsWith(' ') || line.startsWith('\t')) {
      // Continuation of previous header
      continue
    }
    
    const colonIndex = line.indexOf(':')
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).toLowerCase().trim()
      const value = line.substring(colonIndex + 1).trim()
      headers[key] = value
    }
  }
  
  // Extract body
  const body = lines.slice(bodyStart).join('\n')
  
  // Parse multipart if present
  const contentType = headers['content-type'] || ''
  const result: ParsedMimeMessage = {
    headers,
    text: '',
    html: '',
    attachments: []
  }
  
  if (contentType.includes('multipart/')) {
    const boundaryMatch = contentType.match(/boundary=([^;]+)/)
    if (boundaryMatch) {
      const boundary = boundaryMatch[1].replace(/"/g, '')
      const parts = body.split(`--${boundary}`)
      
      for (const part of parts) {
        if (part.trim() === '' || part.includes('--')) continue
        
        const parsedPart = parseMimePart(part)
        const partContentType = parsedPart.headers['content-type'] || ''
        
        if (partContentType.includes('text/plain')) {
          result.text = parsedPart.body
        } else if (partContentType.includes('text/html')) {
          result.html = parsedPart.body
        } else if (partContentType.includes('text/calendar') || 
                   partContentType.includes('application/ics')) {
          const disposition = parsedPart.headers['content-disposition'] || ''
          const filenameMatch = disposition.match(/filename=([^;]+)/)
          const filename = filenameMatch ? filenameMatch[1].replace(/"/g, '') : 'calendar.ics'
          
          result.attachments.push({
            filename,
            content: parsedPart.body,
            contentType: partContentType
          })
        }
      }
    }
  } else {
    // Single part message
    if (contentType.includes('text/plain')) {
      result.text = body
    } else if (contentType.includes('text/html')) {
      result.html = body
    }
  }
  
  return result
}

function parseMimePart(part: string): { headers: MimeHeaders; body: string } {
  const lines = part.split('\n')
  const headers: MimeHeaders = {}
  let bodyStart = 0
  
  // Parse part headers
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (line.trim() === '') {
      bodyStart = i + 1
      break
    }
    
    const colonIndex = line.indexOf(':')
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).toLowerCase().trim()
      const value = line.substring(colonIndex + 1).trim()
      headers[key] = value
    }
  }
  
  const body = lines.slice(bodyStart).join('\n').trim()
  
  return { headers, body }
} 