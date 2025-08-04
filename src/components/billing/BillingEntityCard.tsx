'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { InfoItem } from '@/components/ui/info-section'
import { BillingEntity, RateConfig, RecipientInfo } from '@/lib/types'
import { Trash2, Edit, ChevronDown, ChevronUp } from 'lucide-react'

interface BillingEntityCardProps {
  entity: BillingEntity
  onEdit: (entity: BillingEntity) => void
  onDelete: (entity: BillingEntity) => void
  onCreateTeacher?: (studioEntity: BillingEntity) => void
  isDeleting?: boolean
}

export function BillingEntityCard({ entity, onEdit, onDelete, onCreateTeacher, isDeleting = false }: BillingEntityCardProps) {
  const [expanded, setExpanded] = useState(false)
  const isTeacher = entity.entity_type === 'teacher'
  const rateConfig = entity.rate_config as RateConfig | null
  const recipientInfo = entity.recipient_info as RecipientInfo | null
  
  return (
    <Card className={`h-full w-full ${isTeacher ? 'border-purple-200' : 'border-blue-200'} overflow-hidden transition-all duration-200 hover:shadow-md`}>
      <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-4 pt-3 sm:pt-4">
        <div className="space-y-2">
          {/* Title row - compact */}
          <div className="flex justify-between items-start gap-2 min-w-0">
            <div className="flex items-center gap-1 sm:gap-2 min-w-0 flex-1 overflow-hidden">
              <CardTitle className="text-sm sm:text-base min-w-0 truncate max-w-full" title={entity.entity_name}>
                {entity.entity_name}
              </CardTitle>
              {isTeacher && (
                <Badge variant="secondary" className="bg-purple-100 text-purple-800 text-xs flex-shrink-0 whitespace-nowrap">
                  Teacher
                </Badge>
              )}
              {!isTeacher && entity.substitution_billing_enabled && (
                <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs flex-shrink-0 whitespace-nowrap">
                  Substitution Enabled
                </Badge>
              )}
            </div>
            {/* Compact action buttons */}
            <div className="flex space-x-1 flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(entity)}
                className="h-7 w-7 sm:h-8 sm:w-8 p-0 touch-manipulation hover:bg-gray-100"
              >
                <Edit className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(entity)}
                disabled={isDeleting}
                className="h-7 w-7 sm:h-8 sm:w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 touch-manipulation"
              >
                {isDeleting ? (
                  <span className="text-xs">...</span>
                ) : (
                  <Trash2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                )}
              </Button>
            </div>
          </div>
          
          {/* Location matches - compact */}
          <div className="text-xs text-gray-600 leading-relaxed break-words">
            <span className="font-medium">Matches:</span>{' '}
            {entity.location_match && entity.location_match.length > 0 
              ? entity.location_match.map((location, index) => (
                  <span key={index} className="inline-block break-all">
                    &quot;{location}&quot;
                    {entity.location_match && index < entity.location_match.length - 1 ? ', ' : ''}
                  </span>
                ))
              : 'No locations'
            }
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 px-3 sm:px-4 pb-3 sm:pb-4 space-y-3 overflow-hidden">
        {/* Always visible: Essential information */}
        <div className="space-y-2">
          {/* Teacher essential info */}
          {isTeacher && recipientInfo?.email && (
            <InfoItem 
              label="Email" 
              value={recipientInfo.email}
              valueClassName="font-mono break-all text-xs overflow-hidden"
            />
          )}

          {/* Studio essential info */}
          {!isTeacher && rateConfig && (
            <div className="bg-gray-50 p-2 sm:p-3 rounded-lg">
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <InfoItem 
                  label="Rate Type" 
                  value={
                    rateConfig.type === "flat" ? "Flat" : 
                    rateConfig.type === "per_student" ? "Per Student" :
                    rateConfig.type === "tiered" ? "Tiered" : "Unknown"
                  }
                  valueClassName="font-medium text-xs truncate"
                />
                <InfoItem 
                  label="Base Rate" 
                  value={`€${
                    rateConfig.type === 'flat' ? rateConfig.base_rate?.toFixed(2) || "0.00" :
                    rateConfig.type === 'per_student' ? rateConfig.rate_per_student?.toFixed(2) || "0.00" :
                    "Tiered"
                  }`}
                  valueClassName="font-semibold text-xs truncate"
                />
              </div>
            </div>
          )}

          {/* Compact contact info for studios */}
          {!isTeacher && recipientInfo?.email && (
            <InfoItem 
              label="Email" 
              value={recipientInfo.email}
              valueClassName="font-mono break-all text-xs overflow-hidden"
            />
          )}

          {/* No rate config message */}
          {!isTeacher && !rateConfig && (
            <div className="text-xs text-gray-500 italic bg-gray-50 p-2 rounded">
              No rate configuration set
            </div>
          )}

          {/* Create Teacher button for studios with substitution billing enabled */}
          {!isTeacher && entity.substitution_billing_enabled && onCreateTeacher && (
            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onCreateTeacher(entity)}
                className="w-full text-xs bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100 hover:border-purple-300"
              >
                + Create Teacher Profile
              </Button>
              <p className="text-xs text-gray-500 mt-1 text-center">
                For substitute teaching at this studio
              </p>
            </div>
          )}
        </div>

        {/* Expandable details */}
        <Collapsible open={expanded} onOpenChange={setExpanded}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-full p-2 h-auto">
              <div className="flex items-center justify-center gap-2">
                <span className="text-xs text-gray-600">
                  {expanded ? 'Show less' : 'Show more details'}
                </span>
                {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </div>
            </Button>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="space-y-3 mt-2">
            {/* Teacher detailed info */}
            {isTeacher && (
              <div className="space-y-2">
                {recipientInfo?.phone && (
                  <InfoItem 
                    label="Phone" 
                    value={recipientInfo.phone}
                    valueClassName="text-xs break-all"
                  />
                )}
              </div>
            )}

            {/* Studio detailed info */}
            {!isTeacher && (
              <div className="space-y-3">
                {/* Address */}
                {recipientInfo?.address && (
                  <InfoItem 
                    label="Address" 
                    value={recipientInfo.address}
                    valueClassName="break-words text-xs leading-relaxed overflow-hidden"
                  />
                )}

                {/* Phone */}
                {recipientInfo?.phone && (
                  <InfoItem 
                    label="Phone" 
                    value={recipientInfo.phone}
                    valueClassName="text-xs break-all"
                  />
                )}

                {/* Detailed Rate Structure */}
                {rateConfig && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h4 className="text-sm font-medium mb-2">Detailed Rate Structure</h4>
                    <div className="text-xs text-gray-600 space-y-2 min-w-0">
                      {/* Flat rate structure */}
                      {rateConfig.type === 'flat' && (
                        <div className="space-y-1">
                          {rateConfig.minimum_threshold && (
                            <div className="flex justify-between">
                              <span>Min. students:</span>
                              <span className="font-medium">{rateConfig.minimum_threshold}</span>
                            </div>
                          )}
                          {rateConfig.bonus_threshold && (
                            <div className="flex justify-between">
                              <span>Bonus threshold:</span>
                              <span className="font-medium">{rateConfig.bonus_threshold} students</span>
                            </div>
                          )}
                          {rateConfig.bonus_per_student && (
                            <div className="flex justify-between">
                              <span>Bonus rate:</span>
                              <span className="font-medium">€{rateConfig.bonus_per_student.toFixed(2)}/student</span>
                            </div>
                          )}
                          {rateConfig.max_discount && (
                            <div className="flex justify-between">
                              <span>Max discount:</span>
                              <span className="font-medium">€{rateConfig.max_discount.toFixed(2)}</span>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* Tiered rate structure */}
                      {rateConfig.type === 'tiered' && rateConfig.tiers && (
                        <div className="space-y-1">
                          <div className="font-medium text-xs">Rate Tiers:</div>
                          {rateConfig.tiers.map((tier, index) => (
                            <div key={index} className="flex justify-between bg-white p-2 rounded border">
                              <span>{tier.min}{tier.max ? `-${tier.max}` : '+'} students:</span>
                              <span className="font-medium">€{tier.rate.toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* Online bonus */}
                      {rateConfig.online_bonus_per_student && (
                        <div className="bg-blue-50 p-2 rounded border-l-2 border-blue-200">
                          <div className="flex justify-between">
                            <span>Online bonus:</span>
                            <span className="font-medium">
                              €{rateConfig.online_bonus_per_student.toFixed(2)}/student
                              {rateConfig.online_bonus_ceiling && ` (max ${rateConfig.online_bonus_ceiling})`}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  )
} 