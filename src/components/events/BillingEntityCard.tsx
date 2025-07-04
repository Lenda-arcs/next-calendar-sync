'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { InfoItem } from '@/components/ui/info-section'
import { BillingEntity, RateConfig, RecipientInfo } from '@/lib/types'
import { Trash2, Edit } from 'lucide-react'

interface BillingEntityCardProps {
  entity: BillingEntity
  onEdit: (entity: BillingEntity) => void
  onDelete: (entity: BillingEntity) => void
  isDeleting?: boolean
}

export function BillingEntityCard({ entity, onEdit, onDelete, isDeleting = false }: BillingEntityCardProps) {
  const isTeacher = entity.entity_type === 'teacher'
  const rateConfig = entity.rate_config as RateConfig | null
  const recipientInfo = entity.recipient_info as RecipientInfo | null
  
  return (
    <Card className={`h-full ${isTeacher ? 'border-purple-200' : 'border-blue-200'}`}>
      <CardHeader className="pb-2 sm:pb-6 px-3 sm:px-6 pt-3 sm:pt-6">
        <div className="space-y-2 sm:space-y-0">
          {/* Title row - more compact on mobile */}
          <div className="flex justify-between items-start gap-2 sm:gap-3">
            <div className="flex items-center gap-1 sm:gap-2 min-w-0 flex-1">
              <CardTitle className="text-sm sm:text-lg min-w-0 truncate">
                {entity.entity_name}
              </CardTitle>
              {isTeacher && (
                <Badge variant="secondary" className="bg-purple-100 text-purple-800 text-xs flex-shrink-0">
                  Teacher
                </Badge>
              )}
            </div>
            {/* Compact action buttons */}
            <div className="flex space-x-1 flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(entity)}
                className="h-7 w-7 sm:h-9 sm:w-9 p-0 touch-manipulation"
              >
                <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(entity)}
                disabled={isDeleting}
                className="h-7 w-7 sm:h-9 sm:w-9 p-0 text-red-600 hover:text-red-700 touch-manipulation"
              >
                {isDeleting ? (
                  <span className="text-xs">...</span>
                ) : (
                  <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                )}
              </Button>
            </div>
          </div>
          
          {/* Location matches - more compact */}
          <div className="text-xs sm:text-sm text-gray-600">
            <span className="font-medium">Matches:</span>{' '}
            {entity.location_match && entity.location_match.length > 0 
              ? entity.location_match.map((location, index) => (
                  <span key={index}>
                    &quot;{location}&quot;
                    {entity.location_match && index < entity.location_match.length - 1 ? ', ' : ''}
                  </span>
                ))
              : 'No locations'
            }
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-2 sm:space-y-4 pt-0 sm:pt-6 px-3 sm:px-6 pb-3 sm:pb-6">
        {/* Teacher-specific fields */}
        {isTeacher && (
          <div className="space-y-2 sm:space-y-3">
            {recipientInfo?.email && (
              <InfoItem 
                label="Email" 
                value={recipientInfo.email}
                valueClassName="font-mono break-all text-xs sm:text-sm"
              />
            )}
            {recipientInfo?.phone && (
              <InfoItem 
                label="Phone" 
                value={recipientInfo.phone}
                valueClassName="text-xs sm:text-sm"
              />
            )}
          </div>
        )}

        {/* Studio-specific fields */}
        {!isTeacher && rateConfig && (
          <div className="space-y-2 sm:space-y-4">
            {/* Rate Information - stack on mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
              <InfoItem 
                label="Rate Type" 
                value={
                  rateConfig.type === "flat" ? "Flat Rate" : 
                  rateConfig.type === "per_student" ? "Per Student" :
                  rateConfig.type === "tiered" ? "Tiered Rates" : "Unknown"
                }
                valueClassName="font-medium text-xs sm:text-sm"
              />
              <InfoItem 
                label="Base Rate" 
                value={`€${
                  rateConfig.type === 'flat' ? rateConfig.base_rate?.toFixed(2) || "0.00" :
                  rateConfig.type === 'per_student' ? rateConfig.rate_per_student?.toFixed(2) || "0.00" :
                  "Tiered"
                }`}
                valueClassName="font-semibold text-xs sm:text-sm"
              />
            </div>

            {/* Contact Information */}
            {recipientInfo?.email && (
              <InfoItem 
                label="Billing Email" 
                value={recipientInfo.email}
                valueClassName="font-mono break-all text-xs sm:text-sm"
              />
            )}

            {recipientInfo?.address && (
              <InfoItem 
                label="Address" 
                value={recipientInfo.address}
                valueClassName="break-words text-xs sm:text-sm"
              />
            )}

            {/* Enhanced Rate Structure - more compact */}
            {rateConfig && (
              <InfoItem 
                label="Rate Structure" 
                value={
                  <div className="text-xs sm:text-sm text-gray-600 space-y-0.5 sm:space-y-1">
                    {/* Flat rate structure */}
                    {rateConfig.type === 'flat' && (
                      <>
                        {rateConfig.minimum_threshold && (
                          <div>Min. students: {rateConfig.minimum_threshold}</div>
                        )}
                        {rateConfig.bonus_threshold && (
                          <div>Bonus threshold: {rateConfig.bonus_threshold} students</div>
                        )}
                        {rateConfig.bonus_per_student && (
                          <div>Bonus rate: €{rateConfig.bonus_per_student.toFixed(2)}/student</div>
                        )}
                        {rateConfig.max_discount && (
                          <div>Max discount: €{rateConfig.max_discount.toFixed(2)}</div>
                        )}
                      </>
                    )}
                    
                    {/* Tiered rate structure */}
                    {rateConfig.type === 'tiered' && rateConfig.tiers && (
                      <>
                        <div className="font-medium">Rate Tiers:</div>
                        {rateConfig.tiers.map((tier, index) => (
                          <div key={index} className="flex justify-between">
                            <span>{tier.min}{tier.max ? `-${tier.max}` : '+'} students:</span>
                            <span className="font-medium">€{tier.rate.toFixed(2)}</span>
                          </div>
                        ))}
                      </>
                    )}
                    
                    {/* Online bonus (applies to all rate types) */}
                    {rateConfig.online_bonus_per_student && (
                      <div>
                        Online bonus: €{rateConfig.online_bonus_per_student.toFixed(2)}/student
                        {rateConfig.online_bonus_ceiling && ` (max ${rateConfig.online_bonus_ceiling})`}
                      </div>
                    )}
                  </div>
                }
              />
            )}
          </div>
        )}

        {/* No rate config for teachers */}
        {!isTeacher && !rateConfig && (
          <div className="text-xs text-gray-500 italic">
            No rate configuration set
          </div>
        )}
      </CardContent>
    </Card>
  )
} 