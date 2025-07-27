'use client'

import { useState } from 'react'
import { toast } from 'sonner'
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

interface CalendarImportStepProps {
  onComplete: () => void
  onSkip: () => void
}

type ImportStep = 'choose' | 'select-google' | 'upload-ics' | 'preview' | 'importing' | 'complete'

export function CalendarImportStep({ onComplete, onSkip }: CalendarImportStepProps) {
  const [step, setStep] = useState<ImportStep>('choose')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [availableCalendars, setAvailableCalendars] = useState<CalendarSource[]>([])
  const [selectedCalendar, setSelectedCalendar] = useState<CalendarSource | null>(null)
  const [previewData, setPreviewData] = useState<ImportPreviewResult | null>(null)
  const [importResult, setImportResult] = useState<{
    imported: number
    skipped: number
    errors: string[]
  } | null>(null)

  const handleChooseGoogle = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/calendar/import')
      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch calendars')
      }
      
      setAvailableCalendars(data.calendars)
      setStep('select-google')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to fetch calendars')
    } finally {
      setLoading(false)
    }
  }

  const handleSelectGoogleCalendar = async (calendar: CalendarSource) => {
    setLoading(true)
    setError(null)
    setSelectedCalendar(calendar)
    
    try {
      const response = await fetch('/api/calendar/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'preview',
          source: 'google',
          sourceCalendarId: calendar.id
        })
      })
      
      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to preview events')
      }
      
      setPreviewData(data.preview)
      setStep('preview')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to preview events')
    } finally {
      setLoading(false)
    }
  }

  const handleICSUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setLoading(true)
    setError(null)
    
    try {
      const icsContent = await file.text()
      
      const response = await fetch('/api/calendar/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'preview',
          source: 'ics',
          icsContent
        })
      })
      
      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to parse ICS file')
      }
      
      setPreviewData(data.preview)
      setStep('preview')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to process ICS file')
    } finally {
      setLoading(false)
    }
  }

  const handleImport = async (selectedEvents: ImportableEvent[]) => {
    setStep('importing')
    setError(null)
    
    try {
      const response = await fetch('/api/calendar/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'import',
          source: selectedEvents[0]?.source || 'google',
          events: selectedEvents
        })
      })
      
      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to import events')
      }
      
      setImportResult({
        imported: data.imported,
        skipped: data.skipped,
        errors: data.errors || []
      })
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
      title="Import Existing Events"
      subtitle="Quickly populate your yoga calendar with events from your existing calendar"
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
                  Import from Google Calendar
                </CardTitle>
                <CardDescription>
                  Import events from your other Google Calendars (recommended)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={handleChooseGoogle}
                  disabled={loading}
                  className="w-full"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Loading calendars...
                    </>
                  ) : (
                    <>
                      <Calendar className="w-4 h-4 mr-2" />
                      Choose Google Calendar
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Upload ICS File
                </CardTitle>
                <CardDescription>
                  Import from Apple Calendar, Outlook, or any calendar app that exports .ics files
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ics-upload">Select .ics file</Label>
                  <Input
                    id="ics-upload"
                    type="file"
                    accept=".ics,.ical"
                    onChange={handleICSUpload}
                    disabled={loading}
                  />
                </div>
                <InfoSection title="How to export your calendar">
                  <InfoItem 
                    label="Apple Calendar"
                    value="File → Export → Export..."
                  />
                  <InfoItem 
                    label="Outlook"
                    value="File → Save Calendar → iCalendar Format"
                  />
                  <InfoItem 
                    label="Google Calendar"
                    value="Settings → Import & Export → Export"
                  />
                </InfoSection>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" onClick={onSkip}>
                Skip for now
              </Button>
              <Button variant="ghost" onClick={onComplete}>
                I&apos;ll add events manually
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
                availableCalendars.map((calendar) => (
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