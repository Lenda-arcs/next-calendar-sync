export interface InvoiceData {
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
      rate_config?: {
        type: 'flat' | 'per_student' | 'tiered'
        base_rate?: number
        minimum_threshold?: number
        bonus_threshold?: number
        bonus_per_student?: number
        online_bonus_per_student?: number
        online_bonus_ceiling?: number
        max_discount?: number
        rate_per_student?: number
        tiers?: Array<{
          min: number
          max: number | null
          rate: number
        }>
      } | null
    } | null
  }>
  user: {
    name: string
    email: string
  }
  user_invoice_settings?: {
    kleinunternehmerregelung: boolean
    pdf_template_config?: PDFTemplateConfig | null
    template_theme?: PDFTemplateTheme | null
  } | null
}

export type Language = 'en' | 'de' | 'es'

export type PDFTemplateTheme = 'professional' | 'modern' | 'minimal' | 'creative' | 'custom'

export interface PDFTemplateConfig {
  template_type: 'default' | 'modern' | 'minimal' | 'letterhead' | 'custom'
  logo_url?: string | null
  logo_size: 'small' | 'medium' | 'large'
  logo_position: 'top-left' | 'top-center' | 'top-right' | 'header-left' | 'header-center' | 'header-right'
  header_color: string // hex color code
  accent_color: string // hex color code
  font_family: 'helvetica' | 'times' | 'courier' | 'arial' | 'custom'
  font_size: 'small' | 'normal' | 'large'
  show_company_address: boolean
  show_invoice_notes: boolean
  footer_text?: string | null
  date_format: 'locale' | 'us' | 'eu' | 'iso' | 'custom'
  currency_position: 'before' | 'after' | 'symbol'
  table_style: 'default' | 'minimal' | 'bordered' | 'striped' | 'modern'
  page_margins: 'narrow' | 'normal' | 'wide' | 'custom'
  letterhead_text?: string | null
  custom_css?: string | null
  // Advanced layout options
  show_logo: boolean
  show_company_info: boolean
  show_payment_terms: boolean
  show_tax_info: boolean
  page_orientation: 'portrait' | 'landscape'
  page_size: 'a4' | 'letter' | 'legal' | 'a3'
  // Color scheme
  background_color?: string | null
  text_color?: string | null
  border_color?: string | null
  // Typography
  header_font_size?: number | null
  body_font_size?: number | null
  line_height?: number | null
}

export interface Translations {
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

export interface GeneratePDFRequest {
  invoiceId: string
  language?: Language
}

export interface PDFPreviewRequest {
  isPreview: true
  templateConfig: PDFTemplateConfig | null
  templateTheme: PDFTemplateTheme
  userSettings?: {
    kleinunternehmerregelung: boolean
  } | null
  language?: Language
}

export interface GeneratePDFResponse {
  success: boolean
  pdf_url: string
  message: string
} 