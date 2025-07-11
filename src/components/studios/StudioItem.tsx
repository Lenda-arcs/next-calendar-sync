'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from 'react'
import { Studio, StudioWithStats } from '@/lib/types'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { MapPin, Users, Star, Check, ChevronDown, ChevronUp } from 'lucide-react'
import { StudioActions } from './StudioActions'
import { StudioContactInfo } from './StudioContactInfo'
import { StudioRateConfig } from './StudioRateConfig'

interface StudioItemProps {
  studio: StudioWithStats
  userRole: 'admin' | 'moderator' | 'user'
  onEdit: (studio: Studio) => void
  onDelete: (studio: Studio) => void
  onRefresh: () => void
}

export function StudioItem({ studio, userRole, onEdit, onDelete, onRefresh }: StudioItemProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-lg truncate">{studio.name}</h3>
              <div className="flex gap-1 flex-shrink-0">
                {studio.verified && (
                  <Badge variant="secondary" className="text-green-600 px-2 py-0.5">
                    <Check className="w-3 h-3 mr-1" />
                    <span className="hidden sm:inline">Verified</span>
                  </Badge>
                )}
                {studio.featured && (
                  <Badge variant="secondary" className="text-yellow-600 px-2 py-0.5">
                    <Star className="w-3 h-3 mr-1" />
                    <span className="hidden sm:inline">Featured</span>
                  </Badge>
                )}
              </div>
            </div>
            
            {studio.address && (
              <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{studio.address}</span>
              </div>
            )}

            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{studio.teacher_count} teachers</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{studio.location_patterns?.length || 0} patterns</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-2">
            <StudioActions
              studio={studio}
              userRole={userRole}
              onEdit={onEdit}
              onDelete={onDelete}
              onRefresh={onRefresh}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Always visible: Description and Rate Config */}
        <div className="space-y-3">
          {studio.description && (
            <p className="text-sm text-gray-600 line-clamp-2">{studio.description}</p>
          )}

                     {studio.default_rate_config && (
             <div className="bg-gray-50 p-3 rounded-lg">
               <div className="flex items-center justify-between mb-2">
                 <span className="text-sm font-medium">Default Rate</span>
               </div>
               <StudioRateConfig config={studio.default_rate_config as any} compact />
             </div>
           )}

           {/* Compact contact info */}
           <StudioContactInfo
             contactInfo={studio.contact_info as any}
             websiteUrl={studio.website_url || undefined}
             instagramUrl={studio.instagram_url || undefined}
             compact
           />
        </div>

        {/* Expandable details */}
        <Collapsible open={expanded} onOpenChange={setExpanded}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-full mt-3 p-2 h-auto">
              <div className="flex items-center justify-center gap-2">
                <span className="text-sm text-gray-600">
                  {expanded ? 'Show less' : 'Show more details'}
                </span>
                {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </Button>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="space-y-4 mt-3">
            {/* Location Patterns */}
            {studio.location_patterns && studio.location_patterns.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Location Patterns</h4>
                <div className="flex flex-wrap gap-1">
                  {studio.location_patterns.map((pattern, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {pattern}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

                         {/* Detailed contact information */}
             <StudioContactInfo
               contactInfo={studio.contact_info as any}
               websiteUrl={studio.website_url || undefined}
               instagramUrl={studio.instagram_url || undefined}
             />

             {/* Amenities */}
             {studio.amenities && studio.amenities.length > 0 && (
               <div>
                 <h4 className="text-sm font-medium mb-2">Amenities</h4>
                 <div className="flex flex-wrap gap-1">
                   {studio.amenities.map((amenity, index) => (
                     <Badge key={index} variant="outline" className="text-xs">
                       {amenity}
                     </Badge>
                   ))}
                 </div>
               </div>
             )}

             {/* Detailed rate configuration */}
             {studio.default_rate_config && (
               <div>
                 <h4 className="text-sm font-medium mb-2">Detailed Rate Configuration</h4>
                 <div className="bg-gray-50 p-3 rounded-lg">
                   <StudioRateConfig config={studio.default_rate_config as any} />
                 </div>
               </div>
             )}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  )
} 