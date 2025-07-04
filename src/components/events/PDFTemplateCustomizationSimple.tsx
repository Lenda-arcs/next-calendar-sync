'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { ColorPicker } from './ColorPicker'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { UnifiedDialog } from '@/components/ui/unified-dialog'
import { PDFTemplateConfig, PDFTemplateTheme } from '@/lib/types'
import { Palette, FileText, Settings, Eye, Loader2 } from 'lucide-react'
import ImageUpload from '@/components/ui/image-upload'
import { generatePDFPreview } from '@/lib/invoice-utils'
import { toast } from 'sonner'

interface PDFTemplateCustomizationProps {
  isOpen: boolean
  onClose: () => void
  userId: string
  currentConfig: PDFTemplateConfig | null
  currentTheme: PDFTemplateTheme
  onConfigChange: (config: PDFTemplateConfig) => void
  onThemeChange: (theme: PDFTemplateTheme) => void
  onSave: (config: PDFTemplateConfig, theme: PDFTemplateTheme) => void // Pass current local state
  isLoading?: boolean
}

// Custom Checkbox component with proper controlled state handling
const Checkbox: React.FC<{
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
}> = ({ checked, onChange, label }) => (
  <div className="flex items-center space-x-2">
    <input
      type="checkbox"
      checked={Boolean(checked)} // Ensure boolean value
      onChange={(e) => onChange(e.target.checked)}
      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
    />
    <Label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
      {label}
    </Label>
  </div>
)

// Default configuration with all required fields
const getDefaultConfig = (): PDFTemplateConfig => ({
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
})

const themeOptions = [
  { value: 'professional', label: 'Professional', description: 'Dark gray headers, bordered tables, classic business layout' },
  { value: 'modern', label: 'Modern', description: 'Bright emerald green accents, minimal tables, spacious design' },
  { value: 'minimal', label: 'Minimal', description: 'Light gray tones, small fonts, compact narrow layout' },
  { value: 'creative', label: 'Creative', description: 'Purple headers & accents, large fonts, modern styling' },
  { value: 'custom', label: 'Custom', description: 'Full control over all colors, fonts, and layout options' }
]

export function PDFTemplateCustomization({
  isOpen,
  onClose,
  userId,
  currentConfig,
  currentTheme,
  onConfigChange,
  onThemeChange,
  onSave,
  isLoading = false
}: PDFTemplateCustomizationProps) {
  const [activeTab, setActiveTab] = useState('theme')
  const [localConfig, setLocalConfig] = useState<PDFTemplateConfig>(getDefaultConfig())
  const [localTheme, setLocalTheme] = useState<PDFTemplateTheme>(currentTheme)
  const [isPreviewLoading, setIsPreviewLoading] = useState(false)

  // Initialize local state when modal opens or props change
  useEffect(() => {
    if (isOpen) {
      console.log('Initializing modal with:', { currentConfig, currentTheme })
      setLocalConfig(currentConfig || getDefaultConfig())
      setLocalTheme(currentTheme)
      setActiveTab('theme')
    }
  }, [isOpen, currentConfig, currentTheme])

  const updateConfig = (updates: Partial<PDFTemplateConfig>) => {
    const newConfig = { ...localConfig, ...updates }
    setLocalConfig(newConfig)
  }

  const handleSave = () => {
    // Pass the current local state directly to save
    onSave(localConfig, localTheme)
    // Update parent state for next time modal opens
    onConfigChange(localConfig)
    onThemeChange(localTheme)
  }

  const handlePreview = async () => {
    setIsPreviewLoading(true)
    try {
      console.log('Generating preview with:', { 
        theme: localTheme, 
        config: localConfig,
        logoUrl: localConfig?.logo_url 
      })

      const { pdf_url } = await generatePDFPreview(
        localConfig,
        localTheme,
        null, // No user settings for preview
        'en' // Default to English for preview
      )
      
      // Convert data URI to blob URL for better browser compatibility
      if (pdf_url.startsWith('data:application/pdf;base64,')) {
        try {
          // Extract base64 data
          const base64Data = pdf_url.split(',')[1]
          
          // Convert base64 to byte array
          const byteCharacters = atob(base64Data)
          const byteNumbers = new Array(byteCharacters.length)
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i)
          }
          const byteArray = new Uint8Array(byteNumbers)
          
          // Create blob and URL
          const blob = new Blob([byteArray], { type: 'application/pdf' })
          const blobUrl = URL.createObjectURL(blob)
          
          // Open PDF in new tab
          const newWindow = window.open(blobUrl, '_blank')
          
          // Clean up blob URL after a delay (when PDF is likely loaded)
          if (newWindow) {
            setTimeout(() => {
              URL.revokeObjectURL(blobUrl)
            }, 1000)
          }
        } catch (blobError) {
          console.warn('Failed to create blob URL, falling back to data URI:', blobError)
          window.open(pdf_url, '_blank')
        }
      } else {
        // For regular URLs, open directly
        window.open(pdf_url, '_blank')
      }
      
      toast.success('PDF preview generated successfully!')
    } catch (error) {
      console.error('Failed to generate PDF preview:', error)
      toast.error(`Failed to generate PDF preview: ${error instanceof Error ? error.message : 'Please try again.'}`)
    } finally {
      setIsPreviewLoading(false)
    }
  }

  const handleClose = () => {
    // Reset to original values on cancel (discard local changes)
    setLocalConfig(currentConfig || getDefaultConfig())
    setLocalTheme(currentTheme)
    onClose()
  }

  const footerContent = (
    <>
      <Button variant="outline" onClick={handleClose} disabled={isLoading || isPreviewLoading}>
        Cancel
      </Button>
      <Button
        variant="outline"
        onClick={handlePreview}
        disabled={isLoading || isPreviewLoading}
        className="flex items-center gap-2"
      >
        {isPreviewLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            Generating...
          </>
        ) : (
          <>
            <Eye className="h-4 w-4" />
            Preview PDF
          </>
        )}
      </Button>
      <Button
        onClick={handleSave}
        disabled={isLoading || isPreviewLoading}
        className="flex items-center gap-2"
        loading={isLoading}
      >
        {isLoading ? 'Saving...' : 'Save Template'}
      </Button>
    </>
  )

  return (
    <UnifiedDialog
      open={isOpen}
      onOpenChange={onClose}
      title={
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          PDF Template Customization
        </div>
      }
      description="Customize the appearance of your invoice PDFs with logos, colors, and layout options"
      size="xl"
      footer={footerContent}
    >
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="theme" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Theme
          </TabsTrigger>
          <TabsTrigger value="branding" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Branding
          </TabsTrigger>
          <TabsTrigger value="layout" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Layout
          </TabsTrigger>
        </TabsList>

        <TabsContent value="theme" className="space-y-6">
          <div className="space-y-4">
            <Label className="text-base font-medium">Template Theme</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {themeOptions.map((theme) => (
                <div
                  key={theme.value}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    localTheme === theme.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setLocalTheme(theme.value as PDFTemplateTheme)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{theme.label}</h3>
                      <p className="text-sm text-gray-600">{theme.description}</p>
                    </div>
                    {localTheme === theme.value && (
                      <Badge variant="secondary">Selected</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="branding" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Label className="text-base font-medium">Logo & Branding</Label>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Logo Upload</Label>
                  <p className="text-xs text-gray-600 mb-2">Upload your company logo for invoice headers</p>
                  <div className="flex justify-center">
                    <ImageUpload
                      currentImageUrl={localConfig.logo_url}
                      onImageUrlChange={(url) => {
                        console.log('Logo URL changed:', url)
                        updateConfig({ logo_url: url })
                      }}
                      userId={userId}
                      aspectRatio={2} // 2:1 aspect ratio for logo
                      bucketName="profile-assets"
                      folderPath="logos"
                      maxFileSize={2 * 1024 * 1024} // 2MB max
                      allowedTypes={['image/jpeg', 'image/png', 'image/webp']}
                      className="w-32 h-20 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50"
                      placeholderText="Upload Logo"
                      maxImages={1}
                    />
                  </div>
                  {localConfig.logo_url && (
                    <p className="text-xs text-gray-500 text-center">
                      Current logo: {localConfig.logo_url}
                    </p>
                  )}
                </div>
                
                {localConfig.logo_url && (
                  <>
                    <div>
                      <Label className="text-sm font-medium">Logo Size</Label>
                      <Select
                        value={localConfig.logo_size || 'medium'}
                        onChange={(value) => updateConfig({ logo_size: value as 'small' | 'medium' | 'large' })}
                        options={[
                          { value: 'small', label: 'Small' },
                          { value: 'medium', label: 'Medium' },
                          { value: 'large', label: 'Large' }
                        ]}
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Logo Position</Label>
                      <Select
                        value={localConfig.logo_position || 'top-left'}
                        onChange={(value) => updateConfig({ logo_position: value as 'top-left' | 'top-center' | 'top-right' | 'header-left' | 'header-center' | 'header-right' })}
                        options={[
                          { value: 'top-left', label: 'Top Left' },
                          { value: 'top-center', label: 'Top Center' },
                          { value: 'top-right', label: 'Top Right' },
                          { value: 'header-left', label: 'Header Left' },
                          { value: 'header-center', label: 'Header Center' },
                          { value: 'header-right', label: 'Header Right' }
                        ]}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            {localTheme === 'custom' && (
              <div className="space-y-4">
                <Label className="text-base font-medium">Colors</Label>
                <p className="text-sm text-gray-600">Customize colors for your template</p>
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium">Header Color</Label>
                    <ColorPicker
                      selectedColor={localConfig.header_color || '#000000'}
                      onColorChange={(color: string) => updateConfig({ header_color: color })}
                      label="Header Color"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Accent Color</Label>
                    <ColorPicker
                      selectedColor={localConfig.accent_color || '#3B82F6'}
                      onColorChange={(color: string) => updateConfig({ accent_color: color })}
                      label="Accent Color"
                    />
                  </div>
                </div>
              </div>
            )}
            
            {localTheme !== 'custom' && (
              <div className="space-y-4">
                <Label className="text-base font-medium">Colors</Label>
                <div className="p-4 bg-gray-50 rounded-lg border">
                  <p className="text-sm text-gray-600 text-center">
                    Color customization is only available with the <strong>Custom</strong> theme.
                    <br />
                    Select &quot;Custom&quot; theme to modify colors.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Letterhead Text</Label>
            <Textarea
              placeholder="Enter letterhead text (e.g., company name, tagline)"
              value={localConfig.letterhead_text || ''}
              onChange={(e) => updateConfig({ letterhead_text: e.target.value })}
              rows={2}
            />
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Footer Text</Label>
            <Textarea
              placeholder="Enter footer text (e.g., contact information, legal notices)"
              value={localConfig.footer_text || ''}
              onChange={(e) => updateConfig({ footer_text: e.target.value })}
              rows={2}
            />
          </div>
        </TabsContent>

        <TabsContent value="layout" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Label className="text-base font-medium">Typography</Label>
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">Font Family</Label>
                  <Select
                    value={localConfig.font_family || 'helvetica'}
                    onChange={(value) => updateConfig({ font_family: value as 'helvetica' | 'times' | 'courier' | 'arial' | 'custom' })}
                    options={[
                      { value: 'helvetica', label: 'Helvetica' },
                      { value: 'times', label: 'Times' },
                      { value: 'courier', label: 'Courier' },
                      { value: 'arial', label: 'Arial' }
                    ]}
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Font Size</Label>
                  <Select
                    value={localConfig.font_size || 'normal'}
                    onChange={(value) => updateConfig({ font_size: value as 'small' | 'normal' | 'large' })}
                    options={[
                      { value: 'small', label: 'Small' },
                      { value: 'normal', label: 'Normal' },
                      { value: 'large', label: 'Large' }
                    ]}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-base font-medium">Page Settings</Label>
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">Page Orientation</Label>
                  <Select
                    value={localConfig.page_orientation || 'portrait'}
                    onChange={(value) => updateConfig({ page_orientation: value as 'portrait' | 'landscape' })}
                    options={[
                      { value: 'portrait', label: 'Portrait' },
                      { value: 'landscape', label: 'Landscape' }
                    ]}
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Page Size</Label>
                  <Select
                    value={localConfig.page_size || 'a4'}
                    onChange={(value) => updateConfig({ page_size: value as 'a4' | 'letter' | 'legal' | 'a3' })}
                    options={[
                      { value: 'a4', label: 'A4' },
                      { value: 'letter', label: 'Letter' },
                      { value: 'legal', label: 'Legal' }
                    ]}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-base font-medium">Content Options</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <Checkbox
                  checked={localConfig.show_company_info ?? true}
                  onChange={(checked) => updateConfig({ show_company_info: checked })}
                  label="Show Company Information"
                />
                <Checkbox
                  checked={localConfig.show_company_address ?? true}
                  onChange={(checked) => updateConfig({ show_company_address: checked })}
                  label="Show Company Address"
                />
                <Checkbox
                  checked={localConfig.show_logo ?? true}
                  onChange={(checked) => updateConfig({ show_logo: checked })}
                  label="Show Logo"
                />
              </div>
              <div className="space-y-3">
                <Checkbox
                  checked={localConfig.show_invoice_notes ?? true}
                  onChange={(checked) => updateConfig({ show_invoice_notes: checked })}
                  label="Show Invoice Notes"
                />
                <Checkbox
                  checked={localConfig.show_tax_info ?? true}
                  onChange={(checked) => updateConfig({ show_tax_info: checked })}
                  label="Show Tax Information"
                />
                <Checkbox
                  checked={localConfig.show_payment_terms ?? true}
                  onChange={(checked) => updateConfig({ show_payment_terms: checked })}
                  label="Show Payment Terms"
                />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </UnifiedDialog>
  )
} 