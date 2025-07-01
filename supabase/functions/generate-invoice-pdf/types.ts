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
      base_rate?: number
      bonus_per_student?: number
      online_bonus_per_student?: number
      studio_penalty_per_student?: number
      rate_type?: string
    } | null
  }>
  user: {
    name: string
    email: string
  }
  user_invoice_settings?: {
    kleinunternehmerregelung: boolean
  } | null
}

export type Language = 'en' | 'de' | 'es'

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

export interface GeneratePDFResponse {
  success: boolean
  pdf_url: string
  message: string
} 