'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Studio, StudioInsert } from '@/lib/types'

// Types for tiered rate management
interface RateTier {
  min: number | ''
  max: number | null | ''
  rate: number | ''
}
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui'
import { Badge } from '@/components/ui/badge'
import { Select } from '@/components/ui/select'
import { UnifiedDialog } from '@/components/ui/unified-dialog'
import { X, Plus, MapPin, Globe, Instagram, Mail, Phone, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

interface StudioFormProps {
  studio?: Studio | null
  onSave: () => void
  onCancel: () => void
  isOpen?: boolean
}

export function StudioForm({ studio, onSave, onCancel, isOpen = true }: StudioFormProps) {
  const [formData, setFormData] = useState<StudioInsert>({
    name: '',
    slug: '',
    description: '',
    location_patterns: [],
    address: '',
    contact_info: {},
    default_rate_config: {
      type: 'flat',
      base_rate: 45,
      minimum_threshold: 3,
      bonus_threshold: 15,
      bonus_per_student: 3,
      online_bonus_per_student: 2.5,
      online_bonus_ceiling: 5
    },
    public_profile_enabled: false,
    website_url: '',
    instagram_url: '',
    profile_images: [],
    business_hours: {},
    amenities: [],
    created_by_user_id: '',
    verified: false,
    featured: false
  })

  // State for rate configuration
  const [rateType, setRateType] = useState<'flat' | 'per_student' | 'tiered'>('flat')
  const [rateTiers, setRateTiers] = useState<RateTier[]>([{ min: '', max: '', rate: '' }])

  const [locationPattern, setLocationPattern] = useState('')
  const [amenity, setAmenity] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const supabase = createClient()

  // Initialize form data with existing studio data
  useEffect(() => {
    if (studio) {
      setFormData(studio)
      
      // Initialize rate type and tiers from existing data
      const rateConfig = studio.default_rate_config as Record<string, unknown>
      if (rateConfig?.type) {
        setRateType(rateConfig.type as 'flat' | 'per_student' | 'tiered')
        
        // Initialize rate tiers if tiered type
        if (rateConfig.type === 'tiered' && rateConfig.tiers) {
          const tiers = rateConfig.tiers as Array<Record<string, unknown>>
          setRateTiers(tiers.map((tier) => ({
            min: tier.min as number | '',
            max: tier.max as number | null | '',
            rate: tier.rate as number | ''
          })))
        }
      }
    }
  }, [studio])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No authenticated user')

      const baseData = {
        ...formData,
        slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        contact_info: {
          email: (formData.contact_info as Record<string, unknown>)?.email as string || '',
          phone: (formData.contact_info as Record<string, unknown>)?.phone as string || '',
          website: formData.website_url || ''
        }
      }

      if (studio) {
        // Update existing studio - exclude fields that shouldn't be updated
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, created_at, updated_at, created_by_user_id, ...updateData } = baseData
        
        const { error } = await supabase
          .from('studios')
          .update(updateData)
          .eq('id', studio.id)

        if (error) throw error
      } else {
        // Create new studio - include created_by_user_id
        const submitData: StudioInsert = {
          ...baseData,
          created_by_user_id: user.id
        }

        const { error } = await supabase
          .from('studios')
          .insert([submitData])

        if (error) throw error
      }

      onSave()
    } catch (error) {
      console.error('Error saving studio:', error)
      toast.error('Failed to save studio')
    } finally {
      setIsSubmitting(false)
    }
  }

  const addLocationPattern = () => {
    if (locationPattern.trim()) {
      setFormData(prev => ({
        ...prev,
        location_patterns: [...(prev.location_patterns || []), locationPattern.trim()]
      }))
      setLocationPattern('')
    }
  }

  const removeLocationPattern = (index: number) => {
    setFormData(prev => ({
      ...prev,
      location_patterns: prev.location_patterns?.filter((_, i) => i !== index) || []
    }))
  }

  const addAmenity = () => {
    if (amenity.trim()) {
      setFormData(prev => ({
        ...prev,
        amenities: [...(prev.amenities || []), amenity.trim()]
      }))
      setAmenity('')
    }
  }

  const removeAmenity = (index: number) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities?.filter((_, i) => i !== index) || []
    }))
  }

  const updateContactInfo = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      contact_info: {
        ...((prev.contact_info as any) || {}),
        [field]: value
      }
    }))
  }

  const updateRateConfig = (field: string, value: any) => {
    setFormData(prev => {
      let newRateConfig = { ...((prev.default_rate_config as any) || {}) }
      
      // Handle rate type changes
      if (field === 'type') {
        newRateConfig = {
          type: value,
          // Keep common fields
          online_bonus_per_student: newRateConfig.online_bonus_per_student,
          online_bonus_ceiling: newRateConfig.online_bonus_ceiling,
        }
        
        // Add type-specific default values
        if (value === 'flat') {
          newRateConfig.base_rate = newRateConfig.base_rate || 45
          newRateConfig.minimum_threshold = newRateConfig.minimum_threshold || 3
          newRateConfig.bonus_threshold = newRateConfig.bonus_threshold || 15
          newRateConfig.bonus_per_student = newRateConfig.bonus_per_student || 3
        } else if (value === 'per_student') {
          newRateConfig.rate_per_student = newRateConfig.rate_per_student || 15
        } else if (value === 'tiered') {
          // Tiers will be handled separately through rateTiers state
          newRateConfig.tiers = []
        }
      } else {
        newRateConfig[field] = value
      }
      
      return {
        ...prev,
        default_rate_config: newRateConfig
      }
    })
  }

  // Update rate config when rate tiers change for tiered rates
  useEffect(() => {
    if (rateType === 'tiered') {
      const validTiers = rateTiers
        .filter(tier => tier.min !== '' && tier.rate !== '')
        .map(tier => ({
          min: Number(tier.min),
          max: tier.max === '' || tier.max === null ? null : Number(tier.max),
          rate: Number(tier.rate)
        }))
      
      updateRateConfig('tiers', validTiers)
    }
  }, [rateTiers, rateType])

  const handleFormSubmit = () => {
    const form = document.getElementById('studio-form') as HTMLFormElement
    if (form) {
      form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))
    }
  }

  const footerContent = (
    <>
      <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
        Cancel
      </Button>
      <Button 
        onClick={handleFormSubmit}
        disabled={isSubmitting}
        className="min-w-[120px]"
      >
        {isSubmitting ? 'Saving...' : (studio ? 'Update Studio' : 'Create Studio')}
      </Button>
    </>
  )

  return (
    <UnifiedDialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onCancel()
        }
      }}
      title={studio ? 'Edit Studio' : 'Create New Studio'}
      description="Configure studio details, location matching, and default rates for teachers."
      size="xl"
      footer={footerContent}
    >
      <form id="studio-form" onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Studio Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="slug">URL Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    placeholder="auto-generated-from-name"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Full studio address"
                />
              </div>
            </div>

            {/* Location Patterns */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Location Matching</h3>
              <p className="text-sm text-gray-600">
                Add location patterns to automatically match events to this studio
              </p>
              
              <div className="flex gap-2">
                <Input
                  value={locationPattern}
                  onChange={(e) => setLocationPattern(e.target.value)}
                  placeholder="e.g., Flow Studio, Studio Name"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLocationPattern())}
                />
                <Button type="button" onClick={addLocationPattern} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {formData.location_patterns?.map((pattern, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {pattern}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeLocationPattern(index)}
                      className="h-auto p-0 ml-1"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Contact Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={(formData.contact_info as any)?.email || ''}
                      onChange={(e) => updateContactInfo('email', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      id="phone"
                      value={(formData.contact_info as any)?.phone || ''}
                      onChange={(e) => updateContactInfo('phone', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="website">Website</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      id="website"
                      value={formData.website_url || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, website_url: e.target.value }))}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="instagram">Instagram</Label>
                  <div className="relative">
                    <Instagram className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      id="instagram"
                      value={formData.instagram_url || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, instagram_url: e.target.value }))}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Default Rate Configuration */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Default Rate Configuration</h3>
              <p className="text-sm text-gray-600">
                These rates will be used as defaults for new teachers joining this studio
              </p>
              
              {/* Rate Type Selection */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="rate_type">Rate Type</Label>
                  <Select
                    options={[
                      { value: "flat", label: "Flat Rate" },
                      { value: "per_student", label: "Per Student" },
                      { value: "tiered", label: "Tiered Rates" },
                    ]}
                    value={rateType}
                    onChange={(value) => {
                      setRateType(value as 'flat' | 'per_student' | 'tiered')
                      updateRateConfig('type', value)
                    }}
                  />
                </div>
                <div>
                  <Label htmlFor="base_rate">
                    Base Rate (€) {rateType === "per_student" ? "(per student)" : rateType === "tiered" ? "(disabled for tiered)" : ""}
                  </Label>
                  <Input
                    id="base_rate"
                    type="number"
                    step="0.01"
                    min="0"
                    value={rateType === 'flat' ? (formData.default_rate_config as any)?.base_rate || 45 : 
                           rateType === 'per_student' ? (formData.default_rate_config as any)?.rate_per_student || 15 : ''}
                    onChange={(e) => {
                      const field = rateType === 'per_student' ? 'rate_per_student' : 'base_rate'
                      updateRateConfig(field, parseFloat(e.target.value))
                    }}
                    disabled={rateType === 'tiered'}
                    placeholder={rateType === "per_student" ? "e.g., 15.00" : "e.g., 45.00"}
                  />
                </div>
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    options={[
                      { value: "EUR", label: "EUR (€)" },
                      { value: "USD", label: "USD ($)" },
                      { value: "GBP", label: "GBP (£)" },
                    ]}
                    value="EUR"
                    onChange={() => {}} // Currency can be handled later
                  />
                </div>
              </div>

              {/* Thresholds and Bonuses for Flat Rate */}
              {rateType === 'flat' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="minimum_threshold">Minimum Student Threshold</Label>
                    <Input
                      id="minimum_threshold"
                      type="number"
                      min="0"
                      value={(formData.default_rate_config as any)?.minimum_threshold || 3}
                      onChange={(e) => updateRateConfig('minimum_threshold', parseInt(e.target.value))}
                      placeholder="e.g., 3"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Below this count, reduced payments may apply
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="bonus_threshold">Bonus Student Threshold</Label>
                    <Input
                      id="bonus_threshold"
                      type="number"
                      min="0"
                      value={(formData.default_rate_config as any)?.bonus_threshold || 15}
                      onChange={(e) => updateRateConfig('bonus_threshold', parseInt(e.target.value))}
                      placeholder="e.g., 15"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Above this count, teacher gets bonus per additional student
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="bonus_per_student">Bonus per Student (€)</Label>
                    <Input
                      id="bonus_per_student"
                      type="number"
                      step="0.01"
                      min="0"
                      value={(formData.default_rate_config as any)?.bonus_per_student || 3}
                      onChange={(e) => updateRateConfig('bonus_per_student', parseFloat(e.target.value))}
                      placeholder="e.g., 3.00"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Amount paid per student above bonus threshold
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="max_discount">Max Discount (€)</Label>
                    <Input
                      id="max_discount"
                      type="number"
                      step="0.01"
                      min="0"
                      value={(formData.default_rate_config as any)?.max_discount || ''}
                      onChange={(e) => updateRateConfig('max_discount', parseFloat(e.target.value))}
                      placeholder="e.g., 10.00"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Maximum discount that can be applied
                    </p>
                  </div>
                </div>
              )}

              {/* Online Bonuses (applies to all rate types) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="online_bonus_per_student">Online Bonus per Student (€)</Label>
                  <Input
                    id="online_bonus_per_student"
                    type="number"
                    step="0.01"
                    min="0"
                    value={(formData.default_rate_config as any)?.online_bonus_per_student || 2.5}
                    onChange={(e) => updateRateConfig('online_bonus_per_student', parseFloat(e.target.value))}
                    placeholder="e.g., 2.50"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Bonus paid for each online student
                  </p>
                </div>
                <div>
                  <Label htmlFor="online_bonus_ceiling">Online Bonus Ceiling</Label>
                  <Input
                    id="online_bonus_ceiling"
                    type="number"
                    min="0"
                    value={(formData.default_rate_config as any)?.online_bonus_ceiling || 5}
                    onChange={(e) => updateRateConfig('online_bonus_ceiling', parseInt(e.target.value))}
                    placeholder="e.g., 5"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Maximum number of online students that receive bonuses
                  </p>
                </div>
              </div>

              {/* Tiered Rates Section */}
              {rateType === 'tiered' && (
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">Rate Tiers</h4>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setRateTiers(prev => [...prev, { min: '', max: '', rate: '' }])}
                      className="flex items-center gap-1"
                    >
                      <Plus className="h-4 w-4" />
                      Add Tier
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    {rateTiers.map((tier, index) => (
                      <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-2 items-end">
                        <div>
                          <Label>Min Students</Label>
                          <Input
                            type="number"
                            min="0"
                            value={tier.min}
                            onChange={(e) => {
                              const newTiers = [...rateTiers]
                              newTiers[index].min = e.target.value === '' ? '' : Number(e.target.value)
                              setRateTiers(newTiers)
                            }}
                            placeholder="e.g., 3"
                          />
                        </div>
                        <div>
                          <Label>Max Students (optional)</Label>
                          <Input
                            type="number"
                            min="0"
                            value={tier.max || ''}
                            onChange={(e) => {
                              const newTiers = [...rateTiers]
                              newTiers[index].max = e.target.value === '' ? null : Number(e.target.value)
                              setRateTiers(newTiers)
                            }}
                            placeholder="e.g., 10"
                          />
                        </div>
                        <div>
                          <Label>Rate (€)</Label>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            value={tier.rate}
                            onChange={(e) => {
                              const newTiers = [...rateTiers]
                              newTiers[index].rate = e.target.value === '' ? '' : Number(e.target.value)
                              setRateTiers(newTiers)
                            }}
                            placeholder="e.g., 45.00"
                          />
                        </div>
                        <div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setRateTiers(prev => prev.filter((_, i) => i !== index))}
                            disabled={rateTiers.length === 1}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="bg-yellow-50 p-3 rounded border-l-4 border-yellow-400">
                    <p className="text-sm text-yellow-800">
                      <strong>Note:</strong> When tiered rates are enabled, the base rate and threshold settings above are ignored. 
                      The system will use the tier rates based on total student count.
                    </p>
                  </div>
                </div>
              )}

              {/* Rate Structure Explanation */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-blue-800 mb-2">Rate Structure</h4>
                {rateType === 'tiered' ? (
                  <div>
                    <p className="text-sm text-blue-700 mb-2">
                      <strong>Tiered Rate System:</strong> Different rates apply based on student count tiers defined above.
                    </p>
                    <p className="text-xs text-blue-600">
                      Example: 3-9 students: €40, 10-15 students: €50, 16+ students: €55
                    </p>
                  </div>
                ) : rateType === 'per_student' ? (
                  <div>
                    <p className="text-sm text-blue-700 mb-2">
                      <strong>Per-Student Rate:</strong> Total payment = Base rate × Number of students
                    </p>
                    <p className="text-xs text-blue-600">
                      Example: €5 per student × 10 students = €50 total
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-blue-700 mb-2">
                      <strong>Flat Rate with Thresholds:</strong> Base rate with bonuses/penalties based on student count
                    </p>
                    <ul className="text-xs text-blue-600 space-y-1">
                      <li>• Below minimum: Base rate (no penalties in current system)</li>
                      <li>• Between thresholds: Base rate</li>
                      <li>• Above bonus threshold: Base rate + bonus per additional student</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Amenities */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Amenities</h3>
              
              <div className="flex gap-2">
                <Input
                  value={amenity}
                  onChange={(e) => setAmenity(e.target.value)}
                  placeholder="e.g., Heated, Props Included, Changing Rooms"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
                />
                <Button type="button" onClick={addAmenity} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {formData.amenities?.map((amenity, index) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-1">
                    {amenity}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAmenity(index)}
                      className="h-auto p-0 ml-1"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Options */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Options</h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="verified"
                    checked={formData.verified || false}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, verified: !!checked }))
                    }
                  />
                  <Label htmlFor="verified">Verified Studio</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="featured"
                    checked={formData.featured || false}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, featured: !!checked }))
                    }
                  />
                  <Label htmlFor="featured">Featured Studio</Label>
                </div>
              </div>
            </div>

        </form>
    </UnifiedDialog>
  )
}