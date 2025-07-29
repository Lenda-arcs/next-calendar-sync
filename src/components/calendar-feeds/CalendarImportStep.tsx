'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { useGetAvailableCalendars, usePreviewCalendarImport, useImportCalendarEvents } from '@/lib/hooks/useAppQuery'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Container } from '@/components/layout/container'
import { InfoSection, InfoItem } from '@/components/ui/info-section'
import { Upload, Calendar, Download, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { EventImportPreview } from './EventImportPreview'
import { CalendarSource, ImportableEvent, ImportPreviewResult } from '@/lib/calendar-import-service'
import { useTranslation } from '@/lib/i18n/context'

interface CalendarImportStepProps {
  onComplete: () => void
  onSkip: () => void
}

type ImportStep = 'choose' | 'select-google' | 'upload-ics' | 'preview' | 'importing' | 'complete'

export function CalendarImportStep({ onComplete, onSkip }: CalendarImportStepProps) {
  const { t } = useTranslation()
  const [step, setStep] = useState<ImportStep>('choose')
  const [error, setError] = useState<string | null>(null)
  const [selectedCalendar, setSelectedCalendar] = useState<CalendarSource | null>(null)
  const [previewData, setPreviewData] = useState<ImportPreviewResult | null>(null)
  const [importResult, setImportResult] = useState<{
    imported: number
    skipped: number
    errors: string[]
  } | null>(null)

  // ✨ NEW: Use unified hooks for calendar import operations
  const { data: availableCalendars = [], isLoading: calendarsLoading } = useGetAvailableCalendars({ enabled: step === 'select-google' })
  const previewMutation = usePreviewCalendarImport()
  const importMutation = useImportCalendarEvents()

  const handleChooseGoogle = async () => {
    setError(null)
    // ✨ NEW: Just move to the next step - the query will automatically fetch calendars
    setStep('select-google')
  }

  const handleSelectGoogleCalendar = async (calendar: CalendarSource) => {
    setError(null)
    setSelectedCalendar(calendar)
    
    try {
      // ✨ NEW: Use unified mutation for preview
      const preview = await previewMutation.mutateAsync({
        source: 'google',
        sourceCalendarId: calendar.id
      })
      //TODO: fix this linting error
      setPreviewData(preview)
      setStep('preview')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to preview events')
    }
  }

  const handleICSUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setError(null)
    
    try {
      const icsContent = await file.text()
      
      // ✨ NEW: Use unified mutation for ICS preview
      const preview = await previewMutation.mutateAsync({
        source: 'ics',
        icsContent
      })

      //TODO: fix this linting error
      setPreviewData(preview)
      setStep('preview')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to process ICS file')
    }
  }

  const handleImport = async (selectedEvents: ImportableEvent[]) => {
    setStep('importing')
    setError(null)
    
    try {
      // ✨ NEW: Use unified mutation for import
      const result = await importMutation.mutateAsync({
        source: selectedEvents[0]?.source as 'google' | 'ics' || 'google',
        events: selectedEvents
      })
      
      setImportResult(result)
      setStep('complete')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to import events')
      setStep('preview') // Go back to preview on error
    }
  }

  const handleCancel = () => {
    setStep('choose')
    setError(null)
    setPreviewData(null)
    setSelectedCalendar(null)
  }

  if ((step === 'preview' || step === 'importing') && previewData) {
    return (
      <EventImportPreview
        previewData={previewData}
        sourceName={selectedCalendar?.name || 'Uploaded Calendar'}
        onImport={handleImport}
        onCancel={handleCancel}
        isImporting={step === 'importing'}
      />
    )
  }

  return (
    <Container 
      title={t('calendar.yogaOnboarding.import.title')}
      subtitle={t('calendar.yogaOnboarding.import.subtitle')}
      maxWidth="2xl"
    >
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {step === 'choose' && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                {t('calendar.yogaOnboarding.import.choose.googleCard.title')}
              </CardTitle>
              <CardDescription>
                {t('calendar.yogaOnboarding.import.choose.googleCard.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleChooseGoogle}
                disabled={calendarsLoading}
                className="w-full"
                size="lg"
              >
                {calendarsLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t('calendar.yogaOnboarding.import.choose.googleCard.loading')}
                  </>
                ) : (
                  <>
                    <Calendar className="w-4 h-4 mr-2" />
                    {t('calendar.yogaOnboarding.import.choose.googleCard.button')}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                {t('calendar.yogaOnboarding.import.choose.icsCard.title')}
              </CardTitle>
              <CardDescription>
                {t('calendar.yogaOnboarding.import.choose.icsCard.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ics-upload">{t('calendar.yogaOnboarding.import.choose.icsCard.fileLabel')}</Label>
                <Input
                  id="ics-upload"
                  type="file"
                  accept=".ics,.ical"
                  onChange={handleICSUpload}
                  disabled={previewMutation.isPending}
                />
              </div>
              <InfoSection title={t('calendar.yogaOnboarding.import.choose.icsCard.exportGuide.title')}>
                <InfoItem 
                  label="Apple Calendar"
                  value={t('calendar.yogaOnboarding.import.choose.icsCard.exportGuide.apple')}
                />
                <InfoItem 
                  label="Outlook"
                  value={t('calendar.yogaOnboarding.import.choose.icsCard.exportGuide.outlook')}
                />
                <InfoItem 
                  label="Google Calendar"
                  value={t('calendar.yogaOnboarding.import.choose.icsCard.exportGuide.google')}
                />
              </InfoSection>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button variant="outline" onClick={onSkip}>
              {t('calendar.yogaOnboarding.import.choose.actions.skip')}
            </Button>
            <Button variant="ghost" onClick={onComplete}>
              {t('calendar.yogaOnboarding.import.choose.actions.manual')}
            </Button>
          </div>
        </div>
      )}

      {step === 'select-google' && (
        <Card>
          <CardHeader>
            <CardTitle>Choose Calendar to Import From</CardTitle>
            <CardDescription>
              Select one of your Google Calendars to import events from
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {availableCalendars.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No additional calendars found to import from
              </p>
            ) : (
              availableCalendars.map((calendar: CalendarSource) => (
                <div
                  key={calendar.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleSelectGoogleCalendar(calendar)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{calendar.name}</h4>
                      {calendar.description && (
                        <p className="text-sm text-muted-foreground">{calendar.description}</p>
                      )}
                      {calendar.primary && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          Primary
                        </span>
                      )}
                    </div>
                    <Download className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              ))
            )}
            <div className="pt-4 border-t">
              <Button variant="outline" onClick={() => setStep('choose')} className="w-full">
                Back to import options
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 'importing' && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <Loader2 className="w-8 h-8 animate-spin mx-auto" />
              <div>
                <h3 className="font-medium">Importing Events</h3>
                <p className="text-sm text-muted-foreground">
                  Adding selected events to your yoga calendar...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 'complete' && importResult && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              {importResult.errors.length === 0 ? (
                <>
                  <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto" />
                  <div>
                    <h3 className="font-medium text-green-900">Import Complete!</h3>
                    <p className="text-sm text-muted-foreground">
                      All {importResult.imported} event{importResult.imported !== 1 ? 's' : ''} imported successfully
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-yellow-900">Import Mostly Complete!</h3>
                    <p className="text-sm text-muted-foreground">
                      {importResult.imported} event{importResult.imported !== 1 ? 's' : ''} imported successfully
                      {importResult.skipped > 0 && `, ${importResult.skipped} failed`}
                    </p>
                  </div>
                </>
              )}

              {importResult.errors.length > 0 && (
                <Alert className="text-left">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-2">
                      <p className="font-medium">Events that couldn&apos;t be imported:</p>
                      <ul className="text-sm space-y-1">
                        {importResult.errors.slice(0, 3).map((error, index) => (
                          <li key={index} className="text-muted-foreground">• {error}</li>
                        ))}
                        {importResult.errors.length > 3 && (
                          <li className="text-muted-foreground">• ...and {importResult.errors.length - 3} more</li>
                        )}
                      </ul>
                      <p className="text-xs text-muted-foreground mt-2">
                        Common issues: missing timezone, duplicate events, or calendar permissions.
                      </p>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex flex-col gap-2">
                <Button onClick={onComplete} size="lg">
                  Continue to Dashboard
                </Button>
                {importResult.errors.length > 0 && (
                  <Button variant="outline" onClick={() => setStep('choose')} size="sm">
                    Import More Events
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </Container>
  )
} 