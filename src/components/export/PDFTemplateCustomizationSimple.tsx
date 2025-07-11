'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { ColorPicker } from '@/components/tags/ColorPicker'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { UnifiedDialog } from '@/components/ui/unified-dialog'
import { PDFTemplateConfig, PDFTemplateTheme } from '@/lib/types'
import { Palette, FileText, Settings, Eye, Loader2 } from 'lucide-react'
import ImageUpload from '@/components/ui/image-upload'
import { generatePDFPreview } from '@/lib/invoice-utils'
import { toast } from 'sonner'

// Constants
const THEME_OPTIONS = [
  { value: 'professional', label: 'Professional', description: 'Dark gray headers, bordered tables, classic business layout' },
  { value: 'modern', label: 'Modern', description: 'Bright emerald green accents, minimal tables, spacious design' },
  { value: 'minimal', label: 'Minimal', description: 'Light gray tones, small fonts, compact narrow layout' },
  { value: 'creative', label: 'Creative', description: 'Purple headers & accents, large fonts, modern styling' },
  { value: 'custom', label: 'Custom', description: 'Full control over all colors, fonts, and layout options' }
]

const FONT_FAMILY_OPTIONS = [
  { value: 'helvetica', label: 'Helvetica' },
  { value: 'times', label: 'Times' },
  { value: 'courier', label: 'Courier' },
  { value: 'arial', label: 'Arial' }
]

const FONT_SIZE_OPTIONS = [
  { value: 'small', label: 'Small' },
  { value: 'normal', label: 'Normal' },
  { value: 'large', label: 'Large' }
]

const LOGO_SIZE_OPTIONS = [
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' }
]

const LOGO_POSITION_OPTIONS = [
  { value: 'top-left', label: 'Top Left' },
  { value: 'top-center', label: 'Top Center' },
  { value: 'top-right', label: 'Top Right' },
  { value: 'header-left', label: 'Header Left' },
  { value: 'header-center', label: 'Header Center' },
  { value: 'header-right', label: 'Header Right' }
]

const PAGE_ORIENTATION_OPTIONS = [
  { value: 'portrait', label: 'Portrait' },
  { value: 'landscape', label: 'Landscape' }
]

const PAGE_SIZE_OPTIONS = [
  { value: 'a4', label: 'A4' },
  { value: 'letter', label: 'Letter' },
  { value: 'legal', label: 'Legal' }
]

interface PDFTemplateCustomizationProps {
  isOpen: boolean
  onClose: () => void
  userId: string
  currentConfig: PDFTemplateConfig | null
  currentTheme: PDFTemplateTheme
  onConfigChange: (config: PDFTemplateConfig) => void
  onThemeChange: (theme: PDFTemplateTheme) => void
  onSave: (config: PDFTemplateConfig, theme: PDFTemplateTheme) => void
  isLoading?: boolean
}

// Custom Checkbox component
const Checkbox: React.FC<{
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
}> = ({ checked, onChange, label }) => (
  <div className="flex items-center space-x-2">
    <input
      type="checkbox"
      checked={Boolean(checked)}
      onChange={(e) => onChange(e.target.checked)}
      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
    />
    <Label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
      {label}
    </Label>
  </div>
)

// Theme Selector Component
const ThemeSelector: React.FC<{
  selectedTheme: PDFTemplateTheme
  onThemeChange: (theme: PDFTemplateTheme) => void
}> = ({ selectedTheme, onThemeChange }) => (
  <div className="space-y-4">
    <Label className="text-base font-medium">Template Theme</Label>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {THEME_OPTIONS.map((theme) => (
        <div
          key={theme.value}
          className={`p-4 border rounded-lg cursor-pointer transition-all ${
            selectedTheme === theme.value
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => onThemeChange(theme.value as PDFTemplateTheme)}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">{theme.label}</h3>
              <p className="text-sm text-gray-600">{theme.description}</p>
            </div>
            {selectedTheme === theme.value && (
              <Badge variant="secondary">Selected</Badge>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
)

// Logo Upload Section Component
const LogoUploadSection: React.FC<{
  config: PDFTemplateConfig
  userId: string
  onConfigChange: (updates: Partial<PDFTemplateConfig>) => void
}> = ({ config, userId, onConfigChange }) => (
  <div className="space-y-4">
    <Label className="text-base font-medium">Logo & Branding</Label>
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium">Logo Upload</Label>
        <p className="text-xs text-gray-600 mb-2">Upload your company logo for invoice headers</p>
        <div className="flex justify-center">
          <ImageUpload
            currentImageUrl={config.logo_url}
            onImageUrlChange={(url) => onConfigChange({ logo_url: url })}
            userId={userId}
            aspectRatio={2}
            bucketName="profile-assets"
            folderPath="logos"
            maxFileSize={2 * 1024 * 1024}
            allowedTypes={['image/jpeg', 'image/png', 'image/webp']}
            className="w-32 h-20 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50"
            placeholderText="Upload Logo"
            maxImages={1}
          />
        </div>
        {config.logo_url && (
          <p className="text-xs text-gray-500 text-center">
            Current logo: {config.logo_url}
          </p>
        )}
      </div>
      
      {config.logo_url && (
        <>
          <div>
            <Label className="text-sm font-medium">Logo Size</Label>
            <Select
              value={config.logo_size || 'medium'}
              onChange={(value) => onConfigChange({ logo_size: value as 'small' | 'medium' | 'large' })}
              options={LOGO_SIZE_OPTIONS}
            />
          </div>
          <div>
            <Label className="text-sm font-medium">Logo Position</Label>
            <Select
              value={config.logo_position || 'top-left'}
              onChange={(value) => onConfigChange({ logo_position: value as 'top-left' | 'top-center' | 'top-right' | 'header-left' | 'header-center' | 'header-right' })}
              options={LOGO_POSITION_OPTIONS}
            />
          </div>
        </>
      )}
    </div>
  </div>
)

// Color Customization Component
const ColorCustomization: React.FC<{
  config: PDFTemplateConfig
  isCustomTheme: boolean
  onConfigChange: (updates: Partial<PDFTemplateConfig>) => void
}> = ({ config, isCustomTheme, onConfigChange }) => {
  if (!isCustomTheme) {
    return (
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
    )
  }

  return (
    <div className="space-y-4">
      <Label className="text-base font-medium">Colors</Label>
      <p className="text-sm text-gray-600">Customize colors for your template</p>
      <div className="space-y-3">
        <div>
          <Label className="text-sm font-medium">Header Color</Label>
          <ColorPicker
            selectedColor={config.header_color || '#000000'}
            onColorChange={(color: string) => onConfigChange({ header_color: color })}
            label="Header Color"
          />
        </div>
        <div>
          <Label className="text-sm font-medium">Accent Color</Label>
          <ColorPicker
            selectedColor={config.accent_color || '#3B82F6'}
            onColorChange={(color: string) => onConfigChange({ accent_color: color })}
            label="Accent Color"
          />
        </div>
      </div>
    </div>
  )
}

// Text Fields Component
const TextFields: React.FC<{
  config: PDFTemplateConfig
  onConfigChange: (updates: Partial<PDFTemplateConfig>) => void
}> = ({ config, onConfigChange }) => (
  <>
    <div className="space-y-3">
      <Label className="text-sm font-medium">Letterhead Text</Label>
      <Textarea
        placeholder="Enter letterhead text (e.g., company name, tagline)"
        value={config.letterhead_text || ''}
        onChange={(e) => onConfigChange({ letterhead_text: e.target.value })}
        rows={2}
      />
    </div>

    <div className="space-y-3">
      <Label className="text-sm font-medium">Footer Text</Label>
      <Textarea
        placeholder="Enter footer text (e.g., contact information, legal notices)"
        value={config.footer_text || ''}
        onChange={(e) => onConfigChange({ footer_text: e.target.value })}
        rows={2}
      />
    </div>
  </>
)

// Typography Settings Component
const TypographySettings: React.FC<{
  config: PDFTemplateConfig
  onConfigChange: (updates: Partial<PDFTemplateConfig>) => void
}> = ({ config, onConfigChange }) => (
  <div className="space-y-4">
    <Label className="text-base font-medium">Typography</Label>
    <div className="space-y-3">
      <div>
        <Label className="text-sm font-medium">Font Family</Label>
        <Select
          value={config.font_family || 'helvetica'}
          onChange={(value) => onConfigChange({ font_family: value as 'helvetica' | 'times' | 'courier' | 'arial' | 'custom' })}
          options={FONT_FAMILY_OPTIONS}
        />
      </div>
      <div>
        <Label className="text-sm font-medium">Font Size</Label>
        <Select
          value={config.font_size || 'normal'}
          onChange={(value) => onConfigChange({ font_size: value as 'small' | 'normal' | 'large' })}
          options={FONT_SIZE_OPTIONS}
        />
      </div>
    </div>
  </div>
)

// Page Settings Component
const PageSettings: React.FC<{
  config: PDFTemplateConfig
  onConfigChange: (updates: Partial<PDFTemplateConfig>) => void
}> = ({ config, onConfigChange }) => (
  <div className="space-y-4">
    <Label className="text-base font-medium">Page Settings</Label>
    <div className="space-y-3">
      <div>
        <Label className="text-sm font-medium">Page Orientation</Label>
        <Select
          value={config.page_orientation || 'portrait'}
          onChange={(value) => onConfigChange({ page_orientation: value as 'portrait' | 'landscape' })}
          options={PAGE_ORIENTATION_OPTIONS}
        />
      </div>
      <div>
        <Label className="text-sm font-medium">Page Size</Label>
        <Select
          value={config.page_size || 'a4'}
          onChange={(value) => onConfigChange({ page_size: value as 'a4' | 'letter' | 'legal' | 'a3' })}
          options={PAGE_SIZE_OPTIONS}
        />
      </div>
    </div>
  </div>
)

// Content Options Component
const ContentOptions: React.FC<{
  config: PDFTemplateConfig
  onConfigChange: (updates: Partial<PDFTemplateConfig>) => void
}> = ({ config, onConfigChange }) => (
  <div className="space-y-4">
    <Label className="text-base font-medium">Content Options</Label>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-3">
        <Checkbox
          checked={config.show_company_info ?? true}
          onChange={(checked) => onConfigChange({ show_company_info: checked })}
          label="Show Company Information"
        />
        <Checkbox
          checked={config.show_company_address ?? true}
          onChange={(checked) => onConfigChange({ show_company_address: checked })}
          label="Show Company Address"
        />
        <Checkbox
          checked={config.show_logo ?? true}
          onChange={(checked) => onConfigChange({ show_logo: checked })}
          label="Show Logo"
        />
      </div>
      <div className="space-y-3">
        <Checkbox
          checked={config.show_invoice_notes ?? true}
          onChange={(checked) => onConfigChange({ show_invoice_notes: checked })}
          label="Show Invoice Notes"
        />
        <Checkbox
          checked={config.show_tax_info ?? true}
          onChange={(checked) => onConfigChange({ show_tax_info: checked })}
          label="Show Tax Information"
        />
        <Checkbox
          checked={config.show_payment_terms ?? true}
          onChange={(checked) => onConfigChange({ show_payment_terms: checked })}
          label="Show Payment Terms"
        />
      </div>
    </div>
  </div>
)

// Default configuration
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

// Main Component
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
    onSave(localConfig, localTheme)
    onConfigChange(localConfig)
    onThemeChange(localTheme)
  }

  const handlePreview = async () => {
    setIsPreviewLoading(true)
    try {
      const { pdf_url } = await generatePDFPreview(
        localConfig,
        localTheme,
        null,
        'en'
      )
      
      if (pdf_url.startsWith('data:application/pdf;base64,')) {
        try {
          const base64Data = pdf_url.split(',')[1]
          const byteCharacters = atob(base64Data)
          const byteNumbers = new Array(byteCharacters.length)
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i)
          }
          const byteArray = new Uint8Array(byteNumbers)
          const blob = new Blob([byteArray], { type: 'application/pdf' })
          const blobUrl = URL.createObjectURL(blob)
          const newWindow = window.open(blobUrl, '_blank')
          
          if (newWindow) {
            setTimeout(() => URL.revokeObjectURL(blobUrl), 1000)
          }
        } catch (blobError) {
          console.warn('Failed to create blob URL, falling back to data URI:', blobError)
          window.open(pdf_url, '_blank')
        }
      } else {
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
          <ThemeSelector 
            selectedTheme={localTheme} 
            onThemeChange={setLocalTheme} 
          />
        </TabsContent>

        <TabsContent value="branding" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <LogoUploadSection 
              config={localConfig}
              userId={userId}
              onConfigChange={updateConfig}
            />
            <ColorCustomization 
              config={localConfig}
              isCustomTheme={localTheme === 'custom'}
              onConfigChange={updateConfig}
            />
          </div>
          <TextFields 
            config={localConfig}
            onConfigChange={updateConfig}
          />
        </TabsContent>

        <TabsContent value="layout" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TypographySettings 
              config={localConfig}
              onConfigChange={updateConfig}
            />
            <PageSettings 
              config={localConfig}
              onConfigChange={updateConfig}
            />
          </div>
          <ContentOptions 
            config={localConfig}
            onConfigChange={updateConfig}
          />
        </TabsContent>
      </Tabs>
    </UnifiedDialog>
  )
} 