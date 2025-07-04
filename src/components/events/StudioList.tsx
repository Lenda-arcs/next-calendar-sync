'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Studio, StudioWithStats } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Edit, Trash2, MapPin, Users, Star, Check, X, Globe, Instagram, Mail, Phone } from 'lucide-react'
import { toast } from 'sonner'

interface StudioListProps {
  studios: StudioWithStats[]
  onEdit: (studio: Studio) => void
  onDelete: () => void
  userRole: 'admin' | 'moderator' | 'user'
}

export function StudioList({ studios, onEdit, onDelete, userRole }: StudioListProps) {
  const [deletingStudio, setDeletingStudio] = useState<Studio | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const supabase = createClient()

  const handleDelete = async () => {
    if (!deletingStudio) return
    
    setIsDeleting(true)
    try {
      // First check if studio has any billing entities
      const { data: billingEntities } = await supabase
        .from('billing_entities')
        .select('id')
        .eq('studio_id', deletingStudio.id)

      if (billingEntities && billingEntities.length > 0) {
        toast.error('Cannot delete studio with active billing entities')
        return
      }

      const { error } = await supabase
        .from('studios')
        .delete()
        .eq('id', deletingStudio.id)

      if (error) throw error

      toast.success('Studio deleted successfully')
      onDelete()
    } catch (error) {
      console.error('Error deleting studio:', error)
      toast.error('Failed to delete studio')
    } finally {
      setIsDeleting(false)
      setDeletingStudio(null)
    }
  }

  const toggleVerification = async (studio: Studio) => {
    try {
      const { error } = await supabase
        .from('studios')
        .update({ verified: !studio.verified })
        .eq('id', studio.id)

      if (error) throw error

      toast.success(`Studio ${studio.verified ? 'unverified' : 'verified'} successfully`)
      onDelete() // Refresh the list
    } catch (error) {
      console.error('Error updating studio verification:', error)
      toast.error('Failed to update studio verification')
    }
  }

  const toggleFeatured = async (studio: Studio) => {
    try {
      const { error } = await supabase
        .from('studios')
        .update({ featured: !studio.featured })
        .eq('id', studio.id)

      if (error) throw error

      toast.success(`Studio ${studio.featured ? 'unfeatured' : 'featured'} successfully`)
      onDelete() // Refresh the list
    } catch (error) {
      console.error('Error updating studio featured status:', error)
      toast.error('Failed to update studio featured status')
    }
  }

  if (studios.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center text-gray-500">
            <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No studios found</p>
            <p className="text-sm">Create your first studio to get started</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {studios.map((studio) => (
        <Card key={studio.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <CardTitle className="text-lg">{studio.name}</CardTitle>
                  <div className="flex gap-1">
                    {studio.verified && (
                      <Badge variant="secondary" className="text-green-600">
                        <Check className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                    {studio.featured && (
                      <Badge variant="secondary" className="text-yellow-600">
                        <Star className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                  </div>
                </div>
                
                {studio.description && (
                  <p className="text-sm text-gray-600 mb-2">{studio.description}</p>
                )}
                
                {studio.address && (
                  <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
                    <MapPin className="w-4 h-4" />
                    {studio.address}
                  </div>
                )}

                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {studio.teacher_count} teachers
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {studio.location_patterns?.length || 0} location patterns
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {userRole === 'admin' && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleVerification(studio)}
                      className={studio.verified ? 'text-green-600' : 'text-gray-400'}
                    >
                      {studio.verified ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleFeatured(studio)}
                      className={studio.featured ? 'text-yellow-600' : 'text-gray-400'}
                    >
                      <Star className="w-4 h-4" />
                    </Button>
                  </>
                )}
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(studio)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                
                {userRole === 'admin' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeletingStudio(studio)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            {/* Location Patterns */}
            {studio.location_patterns && studio.location_patterns.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2">Location Patterns</h4>
                <div className="flex flex-wrap gap-2">
                  {studio.location_patterns.map((pattern, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {pattern}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {studio.contact_info && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Contact</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    {(studio.contact_info as any)?.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-3 h-3" />
                        {(studio.contact_info as any).email}
                      </div>
                    )}
                    {(studio.contact_info as any)?.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-3 h-3" />
                        {(studio.contact_info as any).phone}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {(studio.website_url || studio.instagram_url) && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Social</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    {studio.website_url && (
                      <div className="flex items-center gap-2">
                        <Globe className="w-3 h-3" />
                        <a href={studio.website_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          Website
                        </a>
                      </div>
                    )}
                    {studio.instagram_url && (
                      <div className="flex items-center gap-2">
                        <Instagram className="w-3 h-3" />
                        <a href={studio.instagram_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          Instagram
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Amenities */}
            {studio.amenities && studio.amenities.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Amenities</h4>
                <div className="flex flex-wrap gap-2">
                  {studio.amenities.map((amenity, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Default Rate Config */}
            {studio.default_rate_config && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Default Rate</h4>
                <div className="text-sm text-gray-600">
                  Base: €{(studio.default_rate_config as any)?.base_rate || 0} • 
                  Min: {(studio.default_rate_config as any)?.minimum_threshold || 0} students • 
                  Bonus: €{(studio.default_rate_config as any)?.bonus_per_student || 0}/student
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingStudio} onOpenChange={() => setDeletingStudio(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Studio</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingStudio?.name}"? This action cannot be undone.
              {deletingStudio && (
                <div className="mt-2 text-sm text-gray-600">
                  This studio currently has {deletingStudio.teacher_count} teachers associated with it.
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? 'Deleting...' : 'Delete Studio'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}