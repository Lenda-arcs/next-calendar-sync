import { Language, Translations } from './types.ts'

export const translations: Record<Language, Translations> = {
  en: {
    invoice: 'INVOICE',
    invoiceNumber: 'Invoice #',
    date: 'Date',
    period: 'Period',
    billTo: 'Bill To',
    event: 'Event',
    dateCol: 'Date',
    studio: 'Studio',
    students: 'Students',
    rate: 'Rate',
    studentLegend: '(Studio/Online)',
    total: 'Total',
    notes: 'Notes',
    vatExemptGerman: 'According to § 19 UStG, no VAT is charged.',
    vatExemptEnglish: '(VAT exempt according to German small business regulation)',
    untitledEvent: 'Untitled Event'
  },
  de: {
    invoice: 'RECHNUNG',
    invoiceNumber: 'Rechnung #',
    date: 'Datum',
    period: 'Zeitraum',
    billTo: 'Rechnung an',
    event: 'Veranstaltung',
    dateCol: 'Datum',
    studio: 'Studio',
    students: 'Teilnehmer',
    rate: 'Tarif',
    studentLegend: '(Studio/Online)',
    total: 'Gesamt',
    notes: 'Notizen',
    vatExemptGerman: 'Gemäß § 19 UStG wird keine Umsatzsteuer berechnet.',
    vatExemptEnglish: '(MwSt.-befreit nach deutschem Kleinunternehmerrecht)',
    untitledEvent: 'Unbenannte Veranstaltung'
  },
  es: {
    invoice: 'FACTURA',
    invoiceNumber: 'Factura #',
    date: 'Fecha',
    period: 'Período',
    billTo: 'Facturar a',
    event: 'Evento',
    dateCol: 'Fecha',
    studio: 'Estudio',
    students: 'Estudiantes',
    rate: 'Tarifa',
    studentLegend: '(Estudio/Online)',
    total: 'Total',
    notes: 'Notas',
    vatExemptGerman: 'Según § 19 UStG, no se cobra IVA.',
    vatExemptEnglish: '(Exento de IVA según la regulación alemana de pequeñas empresas)',
    untitledEvent: 'Evento sin título'
  }
}

export function getTranslations(language: Language): Translations {
  // Validate language and fallback to English if invalid
  return translations[language] || translations['en']
}

export function validateLanguage(language: string | undefined): Language {
  const validLanguages: Language[] = ['en', 'de', 'es']
  return language && validLanguages.includes(language as Language) 
    ? (language as Language) 
    : 'en'
} 