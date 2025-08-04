import { Language, Translations } from './types.ts'

export const translations: Record<Language, Translations> = {
  en: {
    // Basic invoice fields
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
    untitledEvent: 'Untitled Event',
    
    // German compliance fields
    contractor: 'Contractor',
    recipient: 'Recipient',
    serviceDescription: 'Service Description',
    serviceNote: 'Professional yoga instruction services as per individual contract',
    avoidEmploymentTerms: 'Independent contractor services',
    feeCalculation: 'Fee Calculation',
    hourlyRate: 'Hourly Rate',
    totalHours: 'Total Hours in Period',
    netAmount: 'Net Amount',
    bonusPayments: 'Bonus Payments',
    subtotal: 'Subtotal',
    vatRate: 'VAT Rate',
    vatAmount: 'VAT Amount',
    grossTotal: 'Gross Total',
    vatExemptNote: 'According to § 19 UStG, no VAT is charged.',
    paymentTerms: 'Payment Terms',
    payableWithin: 'Payable within {days} days from invoice date',
    bankDetails: 'Bank Details',
    iban: 'IBAN',
    bic: 'BIC',
    servicesPeriod: 'Services Period',
    taxId: 'Tax ID',
    vatId: 'VAT ID'
  },
  de: {
    // Basic invoice fields
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
    untitledEvent: 'Unbenannte Veranstaltung',
    
    // German compliance fields
    contractor: 'Rechnungssteller',
    recipient: 'Rechnungsempfänger',
    serviceDescription: 'Leistungsbeschreibung',
    serviceNote: 'Professionelle Yoga-Unterrichtsdienste gemäß Einzelbeauftragung',
    avoidEmploymentTerms: 'Freiberufliche Dienstleistungen',
    feeCalculation: 'Honorarberechnung',
    hourlyRate: 'Stundensatz',
    totalHours: 'Gesamtzeit im Leistungszeitraum',
    netAmount: 'Nettohonorar',
    bonusPayments: 'Bonuszahlungen',
    subtotal: 'Zwischensumme',
    vatRate: 'Umsatzsteuer',
    vatAmount: 'USt-Betrag',
    grossTotal: 'Gesamtbetrag (Brutto)',
    vatExemptNote: 'Gemäß § 19 UStG wird keine Umsatzsteuer erhoben.',
    paymentTerms: 'Zahlungsbedingungen',
    payableWithin: 'Zahlbar innerhalb von {days} Tagen ab Rechnungsdatum',
    bankDetails: 'Bankverbindung',
    iban: 'IBAN',
    bic: 'BIC',
    servicesPeriod: 'Leistungszeitraum',
    taxId: 'Steuernummer',
    vatId: 'USt-IdNr'
  },
  es: {
    // Basic invoice fields
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
    untitledEvent: 'Evento sin título',
    
    // German compliance fields
    contractor: 'Emisor de Factura',
    recipient: 'Destinatario',
    serviceDescription: 'Descripción del Servicio',
    serviceNote: 'Servicios profesionales de instrucción de yoga según contrato individual',
    avoidEmploymentTerms: 'Servicios de contratista independiente',
    feeCalculation: 'Cálculo de Honorarios',
    hourlyRate: 'Tarifa por Hora',
    totalHours: 'Horas Totales en el Período',
    netAmount: 'Importe Neto',
    bonusPayments: 'Pagos de Bonificación',
    subtotal: 'Subtotal',
    vatRate: 'Tasa de IVA',
    vatAmount: 'Importe de IVA',
    grossTotal: 'Total Bruto',
    vatExemptNote: 'Según § 19 UStG, no se cobra IVA.',
    paymentTerms: 'Términos de Pago',
    payableWithin: 'Pagadero dentro de {days} días desde la fecha de factura',
    bankDetails: 'Detalles Bancarios',
    iban: 'IBAN',
    bic: 'BIC',
    servicesPeriod: 'Período de Servicios',
    taxId: 'ID Fiscal',
    vatId: 'ID de IVA'
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