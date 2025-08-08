'use client'

import React from 'react'
import { EventTag, EventDisplayVariant } from '@/lib/event-types'
import { UnifiedDialog } from '@/components/ui/unified-dialog'
import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/form-field'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select } from '@/components/ui/select'
import { MultiSelect } from '@/components/ui/multi-select'
import { ColorPicker } from './ColorPicker'
import { useTagForm } from '@/lib/hooks/useTagForm'
import { useSupabaseQuery } from '@/lib/hooks/useQueryWithSupabase'
import { AUDIENCE_OPTIONS, PRIORITY_OPTIONS } from '@/lib/constants/tag-constants'
import ImageUpload from '@/components/ui/image-upload'
import { useKeywordSuggestions } from '@/lib/hooks/useKeywordSuggestions'
import { EventCard } from '@/components/events/EventCard'
import { EventCardVariantTabs } from '@/components/events/EventCardVariantTabs'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'

interface Props {
  isOpen: boolean
  isEditing: boolean
  initialTag: EventTag | null
  onSave: (tag: EventTag) => void
  onCancel: () => void
  userId: string
}

export const NewTagForm: React.FC<Props> = ({
  isOpen,
  isEditing,
  initialTag,
  onSave,
  onCancel,
  userId,
}) => {
  const {
    formData,
    updateField,
    updateCta,
    buildEventTag,
    isValid,
  } = useTagForm({ initialTag, isEditing, userId })
  // Load yoga styles from public.users (distinct across all users)
  const { data: yogaStyles } = useSupabaseQuery<string[]>(
    ['distinct-yoga-styles'],
    async (supabase) => {
      const { data, error } = await supabase
        .from('users')
        .select('yoga_styles')

      if (error) throw error
      // Normalize, trim and deduplicate case-insensitively; present as Title Case
      const normalizedToPretty = new Map<string, string>()
      const toTitleCase = (str: string) =>
        str
          .split(/\s+/)
          .map(w => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ')

      ;(data || []).forEach((row: { yoga_styles: string[] | null }) => {
        const styles = row.yoga_styles
        if (Array.isArray(styles)) {
          styles.forEach((s) => {
            if (!s) return
            const trimmed = s.trim()
            if (!trimmed) return
            const normalized = trimmed.toLowerCase()
            if (!normalizedToPretty.has(normalized)) {
              normalizedToPretty.set(normalized, toTitleCase(normalized))
            }
          })
        }
      })
      return Array.from(normalizedToPretty.values()).sort((a, b) => a.localeCompare(b))
    },
    { staleTime: 10 * 60 * 1000 }
  )

  // Keyword suggestions derived from user's events (titles)
  const { titleSuggestions } = useKeywordSuggestions({ userId, enabled: !!userId })

  const genericWords = new Set(['yoga','class','session','course','workshop','flow','open','morning','evening','studio'])
  const nameChips = (titleSuggestions || [])
    .map((s: { keyword: string }) => s.keyword)
    .filter((k) => k && k.length >= 3 && !genericWords.has(k.toLowerCase()))
    .slice(0, 8)
  const styleChips = (yogaStyles || []).slice(0, 8)

  // Fetch existing tag slugs to avoid suggesting blocked names
  const { data: existingTagSlugs } = useSupabaseQuery<string[]>(
    ['existing-tag-slugs', userId],
    async (supabase) => {
      const { data, error } = await supabase
        .from('tags')
        .select('slug')
      if (error) throw error
      const set = new Set<string>()
      ;(data || []).forEach((row: { slug: string | null }) => {
        if (row.slug) set.add(row.slug.toLowerCase())
      })
      return Array.from(set)
    },
    { staleTime: 5 * 60 * 1000 }
  )

  const slugify = (name: string) =>
    name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')

  // Merge style/name chips, dedupe by slug, exclude used slugs
  const availableNameSuggestions = React.useMemo(() => {
    const seen = new Set<string>()
    const result: string[] = []
    const candidates = [...styleChips, ...nameChips]
    candidates.forEach((label) => {
      const slug = slugify(label)
      if (!slug) return
      if (seen.has(slug)) return
      if (existingTagSlugs && existingTagSlugs.includes(slug)) return
      seen.add(slug)
      result.push(label)
    })
    return result
  }, [styleChips, nameChips, existingTagSlugs])


  const handleSubmit = () => {
    if (!isValid) return
    const tagData = buildEventTag()
    onSave(tagData)
  }

  // Live preview state for event card variant
  const [variant, setVariant] = React.useState<EventDisplayVariant>('compact')

  // Build a preview tag from current form data without mutating store
  const previewTag: EventTag = React.useMemo(() => ({
    id: formData.id || 'preview',
    slug: formData.name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, ''),
    name: formData.name || 'New Tag',
    color: formData.color,
    imageUrl: formData.imageUrl || undefined,
    classType: formData.classType,
    audience: formData.audience || undefined,
    cta: formData.cta?.label && formData.cta?.url ? formData.cta : null,
    priority: formData.priority,
    userId: undefined,
    chip: { color: formData.color },
  }), [formData])

  if (!isOpen) return null

  const footerContent = (
    <>
      <Button type="button" variant="secondary" onClick={onCancel}>
        Cancel
      </Button>
      <Button 
        type="button" 
        disabled={!isValid}
        onClick={handleSubmit}
      >
        {isEditing ? 'Update Tag' : 'Create Tag'}
      </Button>
    </>
  )

  return (
    <UnifiedDialog
      open={isOpen}
      onOpenChange={onCancel}
      title={isEditing ? 'Edit Tag' : 'Create New Tag'}
      description={isEditing 
              ? 'Update the tag information and settings below.' 
              : 'Create a new tag to enrich your events with custom styling and metadata.'
            }
      size="xl"
      footer={footerContent}
    >
      <div className="grid grid-cols-1 gap-4">
        {/* Left: Form */}
        <div className="space-y-4" aria-label="Tag settings">
          {/* Tag Name */}
          <FormField
            id="tagName"
            label="Tag Name"
            type="text"
            value={formData.name}
            onChange={(e) => updateField('name', e.target.value)}
            placeholder="e.g. Vinyasa Flow"
            required
            aria-describedby="tag-name-help"
          />
          {availableNameSuggestions.length > 0 && (
            <div className="space-y-1 -mt-2" id="tag-name-help">
              <p className="text-xs text-muted-foreground">Suggestions:</p>
              <div className="flex flex-wrap gap-1">
                {availableNameSuggestions.map((s) => (
                  <Button
                    key={`style-${s}`}
                    type="button"
                    size="sm"
                    variant="outline"
                    className="h-6 px-2 text-xs"
                    onClick={() => updateField('name', s)}
                    aria-label={`Use suggestion ${s}`}
                  >
                    {s}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Style (Class Type) - based on public.users.yoga_styles */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground" htmlFor="classType">
              Style (Class Type)
            </label>
            <MultiSelect
              id="classType"
              name="classType"
              label={undefined}
              options={(yogaStyles || []).map(s => ({ value: s, label: s }))}
              value={formData.classType}
              onChange={(values) => updateField('classType', values)}
              displayMode="compact"
              placeholder={
                (yogaStyles && yogaStyles.length > 0)
                  ? 'Select one or more styles'
                  : 'No styles found yet. Add styles in your profile.'
              }
              maxSelections={5}
              aria-describedby="class-type-desc"
            />
            <p id="class-type-desc" className="text-xs text-muted-foreground">
              Shown as badges on event cards.
            </p>
          </div>

          {/* Audience */}
          <Select
            id="audience"
            label="Target Audience"
            options={AUDIENCE_OPTIONS.map(audience => ({
              value: audience,
              label: audience
            }))}
            value={formData.audience?.[0] || ''}
            onChange={(value) => updateField('audience', value ? [value] : null)}
            placeholder="Select target audience..."
          />
          <p className="text-xs text-muted-foreground -mt-2">
            Improves discoverability and shows as a badge on event cards.
          </p>

          {/* Actions, Color & Media (compact grouped section) */}
          <Card variant="embedded" className="p-0">
            <CardHeader className="py-3">
              <div className="flex items-center justify-between gap-3">
                <CardTitle className="text-base">Actions, Color & Media</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 py-3">
              {/* Tag Image */}
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Tag Image (Optional)</label>
                <div className="flex justify-center">
                  <ImageUpload
                    currentImageUrl={formData.imageUrl || null}
                    onImageUrlChange={(url) => updateField('imageUrl', url || '')}
                    userId={userId}
                    aspectRatio={16/9}
                    bucketName="profile-assets"
                    folderPath="tag-images"
                    maxFileSize={5 * 1024 * 1024}
                    allowedTypes={['image/jpeg', 'image/png', 'image/webp']}
                    className="w-64 h-36 rounded-lg"
                    placeholderText="Add Tag Image"
                    maxImages={10}
                  />
                </div>
              </div>

              {/* Row: Color (CTA) + Priority */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-sm font-medium mb-2 text-foreground" htmlFor="tag-color">Color (CTA)</label>
                  <ColorPicker
                    selectedColor={formData.color}
                    onColorChange={(color) => updateField('color', color)}
                    variant="input"
                  />
                  <p id="tag-color" className="text-xs text-muted-foreground -mt-1">
                    Styles the CTA button for this tag.
                  </p>
                </div>
                <div className="space-y-1">
                  <Select
                    id="priority"
                    label="Priority"
                    options={PRIORITY_OPTIONS.map(option => ({
                      value: option.value.toString(),
                      label: option.label
                    }))}
                    value={formData.priority?.toString() || ''}
                    onChange={(value) => updateField('priority', value ? parseInt(value) : null)}
                    placeholder="Select priority..."
                  />
                  <p className="text-xs text-muted-foreground -mt-1">
                    Higher priority wins when multiple tags define CTAs.
                  </p>
                </div>
              </div>

              {/* Row: CTA fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FormField
                  id="ctaLabel"
                  label="Button Label"
                  type="text"
                  value={formData.cta?.label || ''}
                  onChange={(e) => updateCta('label', e.target.value)}
                  placeholder="e.g. Book Now"
                />
                <FormField
                  id="ctaUrl"
                  label="Button URL"
                  type="url"
                  value={formData.cta?.url || ''}
                  onChange={(e) => updateCta('url', e.target.value)}
                  error={formData.cta?.label && formData.cta?.url && !/^https?:\/\//i.test(formData.cta.url) ? 'Enter a valid URL (must start with http:// or https://)' : undefined}
                  placeholder="e.g. https://example.com/book"
                />
              </div>

              {/* Quick CTA label suggestions */}
              <div className="-mt-1">
                <div className="flex flex-wrap gap-1">
                  {['Book Now','Register','Learn More','Reserve Spot'].map((label) => (
                    <Button
                      key={label}
                      type="button"
                      size="sm"
                      variant="outline"
                      className="h-6 px-2 text-xs"
                      onClick={() => updateCta('label', label)}
                      aria-label={`Use CTA label ${label}`}
                    >
                      {label}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Live Preview (collapsed card header visible) */}
        <aside aria-label="Live preview" className="space-y-3">
          <Accordion type="single" collapsible>
            <AccordionItem value="preview">
              <Card variant="default" className="p-0">
                <CardHeader className="py-2">
                  <AccordionTrigger className="w-full px-1 text-left no-underline">
                    <div className="flex items-center justify-between w-full">
                      <span className="text-base font-medium">Live Preview</span>
                      <span className="text-xs text-muted-foreground mr-2">Click to expand</span>
                    </div>
                  </AccordionTrigger>
                </CardHeader>
                <AccordionContent>
                  <CardContent className="pb-4">
                    <div className="flex items-center justify-between pb-2">
                      <CardTitle className="text-base">Preview</CardTitle>
                      <EventCardVariantTabs value={variant} onValueChange={setVariant} size="sm" />
                    </div>
                    <div className="flex justify-center">
                      <div className="w-full max-w-md">
                        <EventCard
                          id="preview-event"
                          title={formData.name || 'Sample Yoga Class'}
                          dateTime="2024-12-20T09:00:00Z"
                          location="Studio A"
                          imageQuery="yoga class studio"
                          tags={[previewTag]}
                          variant={variant}
                        />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">The preview uses a sample event.</p>
                  </CardContent>
                </AccordionContent>
              </Card>
            </AccordionItem>
          </Accordion>
        </aside>
      </div>
    </UnifiedDialog>
  )
} 