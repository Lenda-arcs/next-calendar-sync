'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Studio, StudioInsert, StudioUpdate } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { X, Plus, MapPin, Globe, Instagram, Mail, Phone } from 'lucide-react'
import { toast } from 'sonner'

interface StudioFormProps {
  studio?: Studio | null
  onSave: () => void
  onCancel: () => void
}

export function StudioForm({ studio, onSave, onCancel }: StudioFormProps) {
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

  const [locationPattern, setLocationPattern] = useState('')
  const [amenity, setAmenity] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const supabase = createClient()

  // Initialize form data with existing studio data
  useEffect(() => {
    if (studio) {
      setFormData(studio)
    }
  }, [studio])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No authenticated user')

      const submitData: StudioInsert = {
        ...formData,
        created_by_user_id: user.id,
        slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        contact_info: {
          email: (formData.contact_info as any)?.email || '',
          phone: (formData.contact_info as any)?.phone || '',
          website: formData.website_url || ''
        }
      }

      if (studio) {
        // Update existing studio
        const { error } = await supabase
          .from('studios')
          .update(submitData)
          .eq('id', studio.id)

        if (error) throw error
        toast.success('Studio updated successfully')
      } else {
        // Create new studio
        const { error } = await supabase
          .from('studios')
          .insert([submitData])

        if (error) throw error
        toast.success('Studio created successfully')
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
    setFormData(prev => ({
      ...prev,
      default_rate_config: {
        ...((prev.default_rate_config as any) || {}),
        [field]: value
      }
    }))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {studio ? 'Edit Studio' : 'Create New Studio'}
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="w-4 h-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="base_rate">Base Rate (€)</Label>
                  <Input
                    id="base_rate"
                    type="number"
                    step="0.01"
                    value={(formData.default_rate_config as any)?.base_rate || 45}
                    onChange={(e) => updateRateConfig('base_rate', parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="minimum_threshold">Minimum Students</Label>
                  <Input
                    id="minimum_threshold"
                    type="number"
                    value={(formData.default_rate_config as any)?.minimum_threshold || 3}
                    onChange={(e) => updateRateConfig('minimum_threshold', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="bonus_threshold">Bonus Threshold</Label>
                  <Input
                    id="bonus_threshold"
                    type="number"
                    value={(formData.default_rate_config as any)?.bonus_threshold || 15}
                    onChange={(e) => updateRateConfig('bonus_threshold', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="bonus_per_student">Bonus per Student (€)</Label>
                  <Input
                    id="bonus_per_student"
                    type="number"
                    step="0.01"
                    value={(formData.default_rate_config as any)?.bonus_per_student || 3}
                    onChange={(e) => updateRateConfig('bonus_per_student', parseFloat(e.target.value))}
                  />
                </div>
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

            {/* Submit Buttons */}
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : (studio ? 'Update Studio' : 'Create Studio')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}