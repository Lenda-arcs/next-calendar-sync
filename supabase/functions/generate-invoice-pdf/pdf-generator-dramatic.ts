// @deno-types="https://esm.sh/jspdf@2.5.1/types/index.d.ts"
import { jsPDF } from 'https://esm.sh/jspdf@2.5.1'
import { InvoiceData, Language, PDFTemplateConfig, PDFTemplateTheme, Translations } from './types.ts'
import { getTranslations } from './translations.ts'

/**
 * Enhanced PDF generator with DRAMATICALLY different themes
 */
export async function generateDramaticPDF(invoiceData: InvoiceData, language: Language = 'en'): Promise<ArrayBuffer> {
  console.log('Generating DRAMATIC PDF with language:', language)
  
  // Get template configuration
  const templateTheme = invoiceData.user_invoice_settings?.template_theme || 'professional'
  const templateConfig = getTemplateConfig(invoiceData, templateTheme)
  console.log('Using template theme:', templateTheme)
  
  // Get translations
  const t = getTranslations(language)
  
  // Create PDF with theme-specific orientation
  const doc = new jsPDF({
    orientation: templateConfig.page_orientation || 'portrait',
    format: templateConfig.page_size || 'a4'
  })
  
  const pageWidth = doc.internal.pageSize.width
  const pageHeight = doc.internal.pageSize.height
  
  // Apply theme-specific page background
  applyThemeBackground(doc, templateTheme, pageWidth, pageHeight, templateConfig)
  
  let yPosition = 20
  
  // Generate sections with dramatic theme differences
  yPosition = await addDramaticHeader(doc, t, pageWidth, yPosition, templateTheme, templateConfig)
  yPosition = addDramaticInvoiceDetails(doc, t, invoiceData, yPosition, templateTheme, templateConfig)
  yPosition = addDramaticBillingDetails(doc, t, invoiceData, yPosition, templateTheme, templateConfig)
  yPosition = addDramaticEventsTable(doc, t, invoiceData, yPosition, pageWidth, templateTheme, templateConfig)
  yPosition = addDramaticTotal(doc, t, invoiceData, pageWidth, yPosition, templateTheme, templateConfig)
  yPosition = addDramaticNotes(doc, t, invoiceData, yPosition, templateTheme, templateConfig)
  
  // Add theme-specific footer
  addDramaticFooter(doc, templateConfig, templateTheme, pageWidth, pageHeight)
  
  // Log final position for debugging
  console.log('Final yPosition:', yPosition)
  
  return doc.output('arraybuffer')
}

/**
 * Convert hex color to RGB values
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 }
}

/**
 * Determine if a color is light or dark based on luminance
 */
function isLightColor(hex: string): boolean {
  const rgb = hexToRgb(hex)
  // Calculate luminance using the formula: 0.299*R + 0.587*G + 0.114*B
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255
  return luminance > 0.5
}

/**
 * Get contrasting text color for a given background color
 */
function getContrastingTextColor(backgroundColor: string): { r: number; g: number; b: number } {
  return isLightColor(backgroundColor) 
    ? { r: 51, g: 51, b: 51 }     // Dark gray for light backgrounds
    : { r: 255, g: 255, b: 255 }  // White for dark backgrounds
}

/**
 * Apply theme-specific background and page styling
 * Subtle but distinct themes: Professional (clean gray accents), 
 * Modern (soft pastel green accents), Minimal (ultra-clean), Creative (subtle purple accents)
 */
function applyThemeBackground(doc: jsPDF, theme: PDFTemplateTheme, pageWidth: number, pageHeight: number, config?: PDFTemplateConfig): void {
  console.log('Applying subtle theme background for:', theme)
  
  switch (theme) {
    case 'professional':
      // PROFESSIONAL: Clean business look with subtle gray header
      doc.setFillColor(248, 250, 252) // Very light gray-blue
      doc.rect(0, 0, pageWidth, 35, 'F') // Subtle header background
      break
      
    case 'modern':
      // MODERN: Clean with soft pastel green accent
      doc.setFillColor(245, 254, 249) // Very light pastel green background
      doc.rect(0, 0, pageWidth, pageHeight, 'F') // Subtle page background
      doc.setFillColor(167, 243, 208) // Soft pastel green header (much lighter)
      doc.rect(0, 0, pageWidth, 40, 'F') // Clean header
      break
      
    case 'minimal':
      // MINIMAL: Pure white - no background styling
      break
      
    case 'creative':
      // CREATIVE: Soft purple accent
      doc.setFillColor(250, 245, 255) // Very light purple background
      doc.rect(0, 0, pageWidth, pageHeight, 'F') // Subtle page background
      doc.setFillColor(139, 92, 246) // Softer purple header
      doc.rect(0, 0, pageWidth, 45, 'F') // Modern header
      break
      
    case 'custom':
      // CUSTOM: Use user-configured colors
      if (config?.background_color) {
        const bgColor = hexToRgb(config.background_color)
        doc.setFillColor(bgColor.r, bgColor.g, bgColor.b)
        doc.rect(0, 0, pageWidth, pageHeight, 'F')
      }
      if (config?.header_color) {
        const headerColor = hexToRgb(config.header_color)
        doc.setFillColor(headerColor.r, headerColor.g, headerColor.b)
        doc.rect(0, 0, pageWidth, 45, 'F')
      }
      break
  }
}

/**
 * Add theme-specific header with subtle differences
 */
async function addDramaticHeader(
  doc: jsPDF, 
  t: Translations, 
  pageWidth: number, 
  yPosition: number, 
  theme: PDFTemplateTheme, 
  config: PDFTemplateConfig
): Promise<number> {
  console.log('Adding subtle header for theme:', theme)
  
  // Handle logo if configured - position absolutely without affecting layout
  if (config.show_logo && config.logo_url) {
    try {
      console.log('Loading logo from URL:', config.logo_url)
      const logoImg = await loadImageFromUrl(config.logo_url)
      
      // Get logo dimensions - make them smaller
      const logoSize = getLogoSize(config.logo_size)
      const logoX = getLogoX(config.logo_position, pageWidth)
      const logoY = 15 // Fixed absolute position at top
      
      // Add logo to PDF without affecting layout flow
      doc.addImage(logoImg, 'JPEG', logoX, logoY, logoSize.width, logoSize.height)
      
      console.log('Logo added successfully at absolute position')
    } catch (error) {
      console.error('Failed to load logo:', error)
      // Continue without logo
    }
  }
  
  // Add letterhead text if configured - more compact
  if (config.letterhead_text) {
    doc.setFontSize(8) // Smaller font
    doc.setTextColor(128, 128, 128)
    doc.text(config.letterhead_text, pageWidth / 2, yPosition + 5, { align: 'center' })
    yPosition += 12 // Less spacing
  }
  
  // Set theme-specific styling for invoice title
  switch (theme) {
    case 'professional':
      doc.setTextColor(31, 41, 55) // Dark gray
      doc.setFontSize(16) // Smaller header
      doc.setFont('helvetica', 'bold')
      break
      
    case 'modern':
      doc.setTextColor(20, 83, 45) // Dark green text for better readability on pastel background
      doc.setFontSize(18) // Smaller header
      doc.setFont('helvetica', 'bold') // Make it bold for better visibility
      break
      
    case 'minimal':
      doc.setTextColor(107, 114, 128) // Medium gray
      doc.setFontSize(14) // Smaller header
      doc.setFont('helvetica', 'normal')
      break
      
    case 'creative':
      doc.setTextColor(255, 255, 255) // White text
      doc.setFontSize(17) // Smaller header
      doc.setFont('helvetica', 'bold')
      break
      
    case 'custom':
      // CUSTOM: Use contrasting text color based on header background
      if (config.header_color) {
        // Use contrast-based color for header text
        const contrastColor = getContrastingTextColor(config.header_color)
        doc.setTextColor(contrastColor.r, contrastColor.g, contrastColor.b)
      } else if (config.text_color) {
        const textColor = hexToRgb(config.text_color)
        doc.setTextColor(textColor.r, textColor.g, textColor.b)
      } else {
        // Default to dark gray for body text
        doc.setTextColor(51, 51, 51)
      }
      const fontSize = config.header_font_size || (config.font_size === 'large' ? 18 : config.font_size === 'small' ? 14 : 16)
      doc.setFontSize(fontSize)
      doc.setFont(config.font_family === 'arial' ? 'helvetica' : config.font_family, 'bold')
      break
  }
  
  // Add INVOICE title with better positioning - position within header background
  const titleY = theme === 'custom' && config.header_color ? yPosition + 30 : yPosition + 15
  doc.text(t.invoice, pageWidth / 2, titleY, { align: 'center' })
  
  return yPosition + 22 // Slightly more space for better visibility
}

/**
 * Load image from URL and convert to base64
 */
async function loadImageFromUrl(url: string): Promise<string> {
  console.log('Fetching image from URL:', url)
  
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`)
    }
    
    const arrayBuffer = await response.arrayBuffer()
    const uint8Array = new Uint8Array(arrayBuffer)
    
    // Convert to base64
    let binary = ''
    for (let i = 0; i < uint8Array.byteLength; i++) {
      binary += String.fromCharCode(uint8Array[i])
    }
    const base64String = btoa(binary)
    
    console.log('Image loaded successfully, base64 length:', base64String.length)
    return `data:image/jpeg;base64,${base64String}`
  } catch (error) {
    console.error('Error loading image:', error)
    throw error
  }
}

/**
 * Get logo size based on configuration - make smaller
 */
function getLogoSize(size: 'small' | 'medium' | 'large'): { width: number; height: number } {
  switch (size) {
    case 'small':
      return { width: 20, height: 15 } // Smaller
    case 'medium':
      return { width: 30, height: 20 } // Smaller
    case 'large':
      return { width: 40, height: 25 } // Smaller
    default:
      return { width: 30, height: 20 }
  }
}

/**
 * Get logo X position based on configuration
 */
function getLogoX(position: string, pageWidth: number): number {
  switch (position) {
    case 'top-center':
    case 'header-center':
      return pageWidth / 2 - 15 // Center minus half logo width
    case 'top-right':
    case 'header-right':
      return pageWidth - 50 // Right aligned
    default:
      return 20 // Left aligned
  }
}

/**
 * Add invoice details with subtle theme styling
 */
function addDramaticInvoiceDetails(
  doc: jsPDF, 
  t: Translations, 
  invoiceData: InvoiceData, 
  yPosition: number, 
  theme: PDFTemplateTheme,
  config?: PDFTemplateConfig
): number {
  // Reset to normal text color for content
  switch (theme) {
    case 'professional':
      doc.setTextColor(31, 41, 55) // Dark gray
      doc.setFontSize(10) // Smaller font
      break
    case 'modern':
      doc.setTextColor(21, 128, 61) // Medium green (darker for readability)
      doc.setFontSize(10)
      break
    case 'minimal':
      doc.setTextColor(107, 114, 128) // Medium gray
      doc.setFontSize(9) // Smaller
      break
    case 'creative':
      doc.setTextColor(79, 70, 229) // Medium purple
      doc.setFontSize(10)
      break
    case 'custom':
      // CUSTOM: Use dark gray for body text (better readability)
      doc.setTextColor(51, 51, 51) // Dark gray for body text
      const fontSize = config?.body_font_size || (config?.font_size === 'large' ? 11 : config?.font_size === 'small' ? 9 : 10)
      doc.setFontSize(fontSize)
      break
  }
  
  doc.setFont('helvetica', 'normal')
  
  // Add invoice details with compact spacing
  doc.text(`${t.invoiceNumber}: ${invoiceData.invoice_number}`, 20, yPosition)
  doc.text(`${t.date}: ${new Date(invoiceData.created_at).toLocaleDateString()}`, 20, yPosition + 12)
  doc.text(`${t.period}: ${new Date(invoiceData.period_start).toLocaleDateString()} - ${new Date(invoiceData.period_end).toLocaleDateString()}`, 20, yPosition + 24)
  
  return yPosition + 35 // More compact
}

/**
 * Add billing details with subtle theme differences
 */
function addDramaticBillingDetails(
  doc: jsPDF, 
  t: Translations, 
  invoiceData: InvoiceData, 
  yPosition: number, 
  theme: PDFTemplateTheme, 
  config: PDFTemplateConfig
): number {
  // Theme-specific styling for section headers
  switch (theme) {
    case 'professional':
      doc.setTextColor(31, 41, 55)
      doc.setFontSize(12) // Smaller
      break
    case 'modern':
      doc.setTextColor(21, 128, 61) // Darker green for headers
      doc.setFontSize(12)
      break
    case 'minimal':
      doc.setTextColor(156, 163, 175)
      doc.setFontSize(10)
      break
    case 'creative':
      doc.setTextColor(124, 58, 237)
      doc.setFontSize(12)
      break
    case 'custom':
      // CUSTOM: Use dark gray for section headers (better readability)
      doc.setTextColor(51, 51, 51) // Dark gray for headers
      const fontSize = config.header_font_size || 12
      doc.setFontSize(fontSize)
      break
  }
  
  doc.setFont('helvetica', 'bold')
  doc.text(t.billTo, 20, yPosition)
  
  // Reset for content
  doc.setFont('helvetica', 'normal')
  const bodyFontSize = theme === 'custom' ? (config.body_font_size || 9) : 9
  doc.setFontSize(bodyFontSize)
  
  // Add studio details with compact spacing
  const lines = [
    invoiceData.studio.entity_name,
    ...(invoiceData.studio.address ? invoiceData.studio.address.split('\n') : []),
    invoiceData.studio.billing_email || ''
  ].filter(line => line.trim())
  
  lines.forEach((line, index) => {
    doc.text(line, 20, yPosition + 12 + (index * 10)) // Compact spacing
  })
  
  return yPosition + 12 + (lines.length * 10) + 8 // More compact
}

/**
 * Add events table with subtle theme differences
 */
function addDramaticEventsTable(
  doc: jsPDF, 
  t: Translations, 
  invoiceData: InvoiceData, 
  yPosition: number, 
  pageWidth: number, 
  theme: PDFTemplateTheme,
  config?: PDFTemplateConfig
): number {
  // Fixed column widths that fit within page width (A4 = ~210mm = ~595px)
  // Total width should be around 170 (595 - 40 for margins)
  const colWidths = [70, 35, 45, 25] // Event, Date, Studio, Students - total 175 to fit properly
  const rowHeight = theme === 'minimal' ? 12 : 14 // More compact rows
  
  // Add table header
  yPosition = addDramaticTableHeader(doc, t, yPosition, colWidths, theme, rowHeight, config)
  
  // Add table rows
  invoiceData.events.forEach((event, index) => {
    yPosition = addDramaticTableRow(doc, event, invoiceData, yPosition, colWidths, theme, rowHeight, index, config)
  })
  
  return yPosition + 10 // More compact
}

/**
 * Add table header with subtle theme styling
 */
function addDramaticTableHeader(
  doc: jsPDF, 
  t: Translations, 
  yPosition: number, 
  colWidths: number[], 
  theme: PDFTemplateTheme, 
  rowHeight: number,
  config?: PDFTemplateConfig
): number {
  const headers = [t.event, t.dateCol, t.studio, t.students]
  
  switch (theme) {
    case 'professional':
      // PROFESSIONAL: Clean gray header with border
      doc.setFillColor(249, 250, 251) // Light gray background
      doc.rect(20, yPosition, colWidths.reduce((a, b) => a + b), rowHeight, 'F')
      doc.setTextColor(31, 41, 55) // Dark gray text
      doc.setFontSize(10)
      doc.setFont('helvetica', 'bold')
      // Add border
      doc.setLineWidth(0.5)
      doc.setDrawColor(209, 213, 219)
      doc.rect(20, yPosition, colWidths.reduce((a, b) => a + b), rowHeight)
      break
      
    case 'modern':
      // MODERN: Soft pastel green header
      doc.setFillColor(209, 250, 229) // Light pastel green background
      doc.rect(20, yPosition, colWidths.reduce((a, b) => a + b), rowHeight, 'F')
      doc.setTextColor(21, 128, 61) // Darker green text for readability
      doc.setFontSize(10)
      doc.setFont('helvetica', 'bold')
      break
      
    case 'minimal':
      // MINIMAL: Just a subtle line
      doc.setTextColor(107, 114, 128) // Medium gray
      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')
      // Just a line
      doc.setLineWidth(0.3)
      doc.setDrawColor(229, 231, 235)
      doc.line(20, yPosition + rowHeight, 20 + colWidths.reduce((a, b) => a + b), yPosition + rowHeight)
      break
      
    case 'creative':
      // CREATIVE: Soft purple header
      doc.setFillColor(237, 233, 254) // Light purple background
      doc.rect(20, yPosition, colWidths.reduce((a, b) => a + b), rowHeight, 'F')
      doc.setTextColor(124, 58, 237) // Medium purple text
      doc.setFontSize(10)
      doc.setFont('helvetica', 'bold')
      break
      
    case 'custom':
      // CUSTOM: Use user-configured colors with proper contrast
      if (config?.accent_color) {
        const accentColor = hexToRgb(config.accent_color)
        doc.setFillColor(accentColor.r, accentColor.g, accentColor.b)
        doc.rect(20, yPosition, colWidths.reduce((a, b) => a + b), rowHeight, 'F')
        // Use contrast-based text color for table header
        const contrastColor = getContrastingTextColor(config.accent_color)
        doc.setTextColor(contrastColor.r, contrastColor.g, contrastColor.b)
      } else {
        // No accent color, use dark gray for text
        doc.setTextColor(51, 51, 51)
      }
      if (config?.border_color) {
        const borderColor = hexToRgb(config.border_color)
        doc.setLineWidth(0.5)
        doc.setDrawColor(borderColor.r, borderColor.g, borderColor.b)
        doc.rect(20, yPosition, colWidths.reduce((a, b) => a + b), rowHeight)
      }
      const fontSize = config?.body_font_size || 10
      doc.setFontSize(fontSize)
      doc.setFont('helvetica', 'bold')
      break
  }
  
  // Add header text
  let xPosition = 20
  headers.forEach((header, index) => {
    doc.text(header, xPosition + 5, yPosition + (rowHeight * 0.7))
    xPosition += colWidths[index]
  })
  
  return yPosition + rowHeight
}

/**
 * Add table row with subtle theme styling
 */
function addDramaticTableRow(
  doc: jsPDF, 
  event: InvoiceData['events'][0], 
  invoiceData: InvoiceData, 
  yPosition: number, 
  colWidths: number[], 
  theme: PDFTemplateTheme, 
  rowHeight: number, 
  index: number,
  config?: PDFTemplateConfig
): number {
  const eventDate = new Date(event.start_time).toLocaleDateString()
  const studioName = event.studio?.entity_name || invoiceData.studio.entity_name
  const studentCount = `${(event.students_studio || 0) + (event.students_online || 0)}`
  
  // Truncate long names to fit in columns
  const truncatedStudioName = studioName.length > 8 ? studioName.substring(0, 8) + '...' : studioName
  
  const rowData = [
    event.title || 'Untitled Event',
    eventDate,
    truncatedStudioName,
    studentCount
  ]
  
  // Apply subtle theme styling
  switch (theme) {
    case 'professional':
      // PROFESSIONAL: Alternating light gray rows
      if (index % 2 === 0) {
        doc.setFillColor(249, 250, 251)
        doc.rect(20, yPosition, colWidths.reduce((a, b) => a + b), rowHeight, 'F')
      }
      doc.setTextColor(55, 65, 81)
      doc.setFontSize(9)
      break
      
    case 'modern':
      // MODERN: Clean with soft green text
      doc.setTextColor(6, 78, 59)
      doc.setFontSize(9)
      break
      
    case 'minimal':
      // MINIMAL: Very subtle gray text
      doc.setTextColor(107, 114, 128)
      doc.setFontSize(8)
      break
      
    case 'creative':
      // CREATIVE: Alternating purple-tinted rows
      if (index % 2 === 0) {
        doc.setFillColor(250, 245, 255)
        doc.rect(20, yPosition, colWidths.reduce((a, b) => a + b), rowHeight, 'F')
      }
      doc.setTextColor(88, 28, 135)
      doc.setFontSize(9)
      break
      
    case 'custom':
      // CUSTOM: Use dark gray for table row text (better readability)
      doc.setTextColor(51, 51, 51) // Dark gray for table rows
      if (config?.background_color && index % 2 === 0) {
        const bgColor = hexToRgb(config.background_color)
        doc.setFillColor(bgColor.r, bgColor.g, bgColor.b)
        doc.rect(20, yPosition, colWidths.reduce((a, b) => a + b), rowHeight, 'F')
      }
      const fontSize = config?.body_font_size || 9
      doc.setFontSize(fontSize)
      break
  }
  
  // Add row data
  let xPosition = 20
  rowData.forEach((data, colIndex) => {
    // Adjust max length based on column width
    const maxLengths = [20, 10, 8, 4] // Adjusted for smaller columns
    const maxLength = maxLengths[colIndex]
    const text = data.length > maxLength ? data.substring(0, maxLength) + '...' : data
    doc.text(text, xPosition + 2, yPosition + (rowHeight * 0.7))
    xPosition += colWidths[colIndex]
  })
  
  return yPosition + rowHeight
}

/**
 * Add total section with subtle theme styling
 */
function addDramaticTotal(
  doc: jsPDF, 
  t: Translations, 
  invoiceData: InvoiceData, 
  pageWidth: number, 
  yPosition: number, 
  theme: PDFTemplateTheme,
  config?: PDFTemplateConfig
): number {
  // Theme-specific styling for total
  switch (theme) {
    case 'professional':
      doc.setTextColor(31, 41, 55)
      doc.setFontSize(12) // Smaller
      break
    case 'modern':
      doc.setTextColor(21, 128, 61) // Darker green for better readability
      doc.setFontSize(12)
      break
    case 'minimal':
      doc.setTextColor(75, 85, 99)
      doc.setFontSize(11) // Smaller
      break
    case 'creative':
      doc.setTextColor(124, 58, 237)
      doc.setFontSize(12)
      break
    case 'custom':
      // CUSTOM: Use dark gray for total text (better readability)
      doc.setTextColor(51, 51, 51) // Dark gray for total
      const fontSize = config?.header_font_size || 12
      doc.setFontSize(fontSize)
      break
  }
  
  doc.setFont('helvetica', 'bold')
  
  const totalText = `${t.total}: ${invoiceData.amount_total.toFixed(2)} ${invoiceData.currency}`
  doc.text(totalText, pageWidth - 20, yPosition, { align: 'right' })
  
  return yPosition + 15 // More compact
}

/**
 * Add notes section with subtle theme styling
 */
function addDramaticNotes(
  doc: jsPDF, 
  t: Translations, 
  invoiceData: InvoiceData, 
  yPosition: number, 
  theme: PDFTemplateTheme,
  config?: PDFTemplateConfig
): number {
  if (!invoiceData.notes) return yPosition
  
  // Theme-specific styling for notes
  switch (theme) {
    case 'professional':
      doc.setTextColor(31, 41, 55)
      doc.setFontSize(9) // Smaller
      break
    case 'modern':
      doc.setTextColor(21, 128, 61)
      doc.setFontSize(9)
      break
    case 'minimal':
      doc.setTextColor(107, 114, 128)
      doc.setFontSize(8) // Smallest
      break
    case 'creative':
      doc.setTextColor(124, 58, 237)
      doc.setFontSize(9)
      break
    case 'custom':
      // CUSTOM: Use dark gray for notes text (better readability)
      doc.setTextColor(51, 51, 51) // Dark gray for notes
      const fontSize = config?.body_font_size || 9
      doc.setFontSize(fontSize)
      break
  }
  
  doc.setFont('helvetica', 'normal')
  doc.text(`${t.notes}: ${invoiceData.notes}`, 20, yPosition)
  
  return yPosition + 15 // More compact
}

/**
 * Add footer with subtle theme styling
 */
function addDramaticFooter(
  doc: jsPDF, 
  config: PDFTemplateConfig, 
  theme: PDFTemplateTheme, 
  pageWidth: number, 
  pageHeight: number
): void {
  if (!config.footer_text) return
  
  const footerY = pageHeight - 20
  
  // Subtle theme colors for footer
  switch (theme) {
    case 'professional':
      doc.setTextColor(107, 114, 128)
      break
    case 'modern':
      doc.setTextColor(34, 197, 94)
      break
    case 'minimal':
      doc.setTextColor(156, 163, 175)
      break
    case 'creative':
      doc.setTextColor(139, 92, 246)
      break
    case 'custom':
      // CUSTOM: Use dark gray for footer text (better readability)
      doc.setTextColor(51, 51, 51) // Dark gray for footer
      break
  }
  
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.text(config.footer_text, pageWidth / 2, footerY, { align: 'center' })
}

/**
 * Get template configuration with theme defaults
 */
function getTemplateConfig(invoiceData: InvoiceData, theme: PDFTemplateTheme): PDFTemplateConfig {
  const userConfig = invoiceData.user_invoice_settings?.pdf_template_config
  const themeDefaults = getThemeDefaults(theme)
  
  const baseConfig: PDFTemplateConfig = {
    template_type: 'default',
    logo_url: null,
    logo_size: 'medium',
    logo_position: 'top-left',
    header_color: '#000000',
    accent_color: '#3B82F6',
    font_family: 'helvetica',
    font_size: 'normal',
    show_company_address: true,
    show_invoice_notes: true,
    footer_text: null,
    date_format: 'locale',
    currency_position: 'before',
    table_style: 'default',
    page_margins: 'normal',
    letterhead_text: null,
    custom_css: null,
    show_logo: true,
    show_company_info: true,
    show_payment_terms: true,
    show_tax_info: true,
    page_orientation: 'portrait',
    page_size: 'a4',
    background_color: null,
    text_color: null,
    border_color: null,
    header_font_size: null,
    body_font_size: null,
    line_height: null
  }
  
  // For custom theme, prioritize user config over theme defaults
  if (theme === 'custom') {
    return { ...baseConfig, ...userConfig }
  }
  
  // For other themes, use theme defaults with user config overrides
  return { ...baseConfig, ...themeDefaults, ...userConfig }
}

/**
 * Get theme-specific defaults
 */
function getThemeDefaults(theme: PDFTemplateTheme): Partial<PDFTemplateConfig> {
  switch (theme) {
    case 'professional':
      return {
        header_color: '#1F2937',
        accent_color: '#374151',
        font_family: 'helvetica',
        font_size: 'normal',
        table_style: 'bordered',
        page_margins: 'normal'
      }
    case 'modern':
      return {
        header_color: '#059669',
        accent_color: '#10B981',
        font_family: 'helvetica',
        font_size: 'normal',
        table_style: 'minimal',
        page_margins: 'wide'
      }
    case 'minimal':
      return {
        header_color: '#9CA3AF',
        accent_color: '#9CA3AF',
        font_family: 'helvetica',
        font_size: 'small',
        table_style: 'minimal',
        page_margins: 'narrow'
      }
    case 'creative':
      return {
        header_color: '#7C3AED',
        accent_color: '#8B5CF6',
        font_family: 'helvetica',
        font_size: 'large',
        table_style: 'modern',
        page_margins: 'wide'
      }
    default:
      return {}
  }
}

/**
 * Generate preview PDF with sample data
 */
export async function generatePreviewPDF(
  templateConfig: PDFTemplateConfig | null,
  templateTheme: PDFTemplateTheme,
  userSettings: { kleinunternehmerregelung: boolean } | null,
  language: Language = 'en'
): Promise<ArrayBuffer> {
  console.log('Generating preview PDF with theme:', templateTheme)
  
  // Create sample invoice data
  const sampleData = createSampleInvoiceData(templateConfig, templateTheme, userSettings)
  
  // Generate PDF using the dramatic generator
  return await generateDramaticPDF(sampleData, language)
}

/**
 * Create sample invoice data for preview
 */
function createSampleInvoiceData(
  templateConfig: PDFTemplateConfig | null,
  templateTheme: PDFTemplateTheme,
  userSettings: { kleinunternehmerregelung: boolean } | null
): InvoiceData {
  const currentDate = new Date()
  
  return {
    id: 'SAMPLE-001',
    invoice_number: 'INV-2024-001',
    amount_total: 250.00,
    currency: 'EUR',
    period_start: new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    period_end: currentDate.toISOString(),
    notes: 'Thank you for your business!',
    created_at: currentDate.toISOString(),
    studio: {
      entity_name: 'Sample Yoga Studio',
      address: '123 Yoga Street\n12345 Wellness City\nGermany',
      billing_email: 'studio@example.com'
    },
    events: [
      {
        id: 'event-1',
        title: 'Hatha Yoga Class',
        start_time: new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        location: 'Main Studio',
        students_studio: 12,
        students_online: 3,
        studio: {
          entity_name: 'Sample Yoga Studio',
          rate_config: {
            type: 'flat',
            base_rate: 80.00
          }
        }
      },
      {
        id: 'event-2',
        title: 'Vinyasa Flow',
        start_time: new Date(currentDate.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        location: 'Studio B',
        students_studio: 8,
        students_online: 2,
        studio: {
          entity_name: 'Sample Yoga Studio',
          rate_config: {
            type: 'per_student',
            rate_per_student: 8.50
          }
        }
      },
      {
        id: 'event-3',
        title: 'Restorative Yoga',
        start_time: new Date(currentDate.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        location: 'Quiet Room',
        students_studio: 6,
        students_online: 1,
        studio: {
          entity_name: 'Sample Yoga Studio',
          rate_config: {
            type: 'flat',
            base_rate: 85.00
          }
        }
      }
    ],
    user: {
      name: 'Sample Yoga Teacher',
      email: 'teacher@example.com'
    },
    user_invoice_settings: {
      kleinunternehmerregelung: userSettings?.kleinunternehmerregelung || false,
      template_theme: templateTheme,
      pdf_template_config: templateConfig
    }
  }
} 