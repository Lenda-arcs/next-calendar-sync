'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { InfoItem } from '@/components/ui/info-section'
import { BillingEntity } from '@/lib/types'
import { Trash2, Edit } from 'lucide-react'

interface BillingEntityCardProps {
  entity: BillingEntity
  onEdit: (entity: BillingEntity) => void
  onDelete: (entity: BillingEntity) => void
  isDeleting?: boolean
}

export function BillingEntityCard({ entity, onEdit, onDelete, isDeleting = false }: BillingEntityCardProps) {
  const isTeacher = entity.recipient_type === 'internal_teacher' || entity.recipient_type === 'external_teacher'
  
  return (
    <Card className={`h-full ${isTeacher ? 'border-purple-200' : 'border-blue-200'}`}>
      <CardHeader className="pb-3 sm:pb-6">
        <div className="space-y-3 sm:space-y-0">
          {/* Title row */}
          <div className="flex justify-between items-start gap-3">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <CardTitle className="text-base sm:text-lg min-w-0 truncate">
                {entity.entity_name}
              </CardTitle>
              {isTeacher && (
                <Badge variant="secondary" className="bg-purple-100 text-purple-800 text-xs flex-shrink-0">
                  Teacher
                </Badge>
              )}
            </div>
            <div className="flex space-x-1 flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(entity)}
                className="h-8 w-8 p-0"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(entity)}
                disabled={isDeleting}
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
              >
                {isDeleting ? (
                  <span className="text-xs">...</span>
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          
          {/* Location matches */}
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

      <CardContent className="space-y-3 sm:space-y-4 pt-3 sm:pt-6">
        {/* Teacher-specific fields */}
        {isTeacher && (
          <div className="space-y-3">
            {entity.recipient_email && (
              <InfoItem 
                label="Email" 
                value={entity.recipient_email}
                valueClassName="font-mono break-all"
              />
            )}
            {entity.recipient_phone && (
              <InfoItem 
                label="Phone" 
                value={entity.recipient_phone}
              />
            )}
          </div>
        )}

        {/* Studio-specific fields */}
        {!isTeacher && (
          <div className="space-y-3 sm:space-y-4">
            {/* Rate Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <InfoItem 
                label="Rate Type" 
                value={entity.rate_type === "flat" ? "Flat Rate" : "Per Student"}
                valueClassName="font-medium"
              />
              <InfoItem 
                label="Base Rate" 
                value={`€${entity.base_rate?.toFixed(2) || "0.00"}`}
                valueClassName="font-semibold"
              />
            </div>

            {/* Contact Information */}
            {entity.billing_email && (
              <InfoItem 
                label="Billing Email" 
                value={entity.billing_email}
                valueClassName="font-mono break-all"
              />
            )}

            {entity.address && (
              <InfoItem 
                label="Address" 
                value={entity.address}
                valueClassName="break-words"
              />
            )}

            {/* Enhanced Rate Structure */}
            {(entity.minimum_student_threshold || entity.bonus_student_threshold || entity.bonus_per_student || 
              entity.studio_penalty_per_student || entity.online_penalty_per_student || entity.student_threshold) && (
              <InfoItem 
                label="Rate Structure" 
                value={
                  <div className="text-xs sm:text-sm text-gray-600 space-y-1">
                    {/* New enhanced thresholds */}
                    {entity.minimum_student_threshold && (
                      <div>Min. students: {entity.minimum_student_threshold}</div>
                    )}
                    {entity.bonus_student_threshold && (
                      <div>Bonus threshold: {entity.bonus_student_threshold} students</div>
                    )}
                    {entity.bonus_per_student && (
                      <div>Bonus rate: €{entity.bonus_per_student.toFixed(2)}/student</div>
                    )}
                    
                    {/* Penalties */}
                    {entity.studio_penalty_per_student && (
                      <div>Missing student penalty: €{entity.studio_penalty_per_student.toFixed(2)}</div>
                    )}
                    {entity.online_penalty_per_student && (
                      <div>Online penalty: €{entity.online_penalty_per_student.toFixed(2)}/student</div>
                    )}
                    
                    {/* Legacy threshold for backwards compatibility */}
                    {entity.student_threshold && !entity.minimum_student_threshold && (
                      <div>Student threshold (legacy): {entity.student_threshold}</div>
                    )}
                    
                    {/* Max discount limit */}
                    {entity.max_discount && (
                      <div>Max discount: €{entity.max_discount.toFixed(2)}</div>
                    )}
                  </div>
                }
              />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 