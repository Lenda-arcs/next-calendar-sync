"use client";

import React, { useState, useCallback } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select } from "../ui/select";
import FormMultiSelect from "../ui/form-multi-select";
import { Textarea } from "../ui/textarea";
import { toast } from 'sonner'
import { useSupabaseMutation } from "../../lib/hooks/useSupabaseMutation";
import { createStudio, updateStudio } from "../../lib/invoice-utils";
import { rematchUserStudios } from "../../lib/rematch-utils";
import type { BillingEntity, BillingEntityInsert, BillingEntityUpdate } from "../../lib/types";

interface Props {
  user: { id: string; email?: string | null };
  eventLocations?: string[];
  existingStudio?: BillingEntity | null;
  onStudioCreated?: (studio: BillingEntity) => void;
  onStudioUpdated?: (studio: BillingEntity) => void;
  isEditing?: boolean;
  isModal?: boolean;
  onSubmit?: (e: React.FormEvent) => void;
  onLoadingChange?: (isLoading: boolean) => void;
  onFormReady?: (formInstance: { submit: () => void }) => void;
  entityType?: 'studio' | 'teacher';
  defaultLocationMatch?: string[];
}

const BillingEntityForm: React.FC<Props> = ({
  user,
  eventLocations = [],
  existingStudio,
  onStudioCreated,
  onStudioUpdated,
  isEditing = false,
  isModal = false,
  onSubmit,
  onLoadingChange,
  onFormReady,
  entityType = 'studio',
  defaultLocationMatch = [],
}) => {
  const [formData, setFormData] = useState({
    entity_name: existingStudio?.entity_name || "",
    location_match: existingStudio?.location_match || defaultLocationMatch,
    rate_type: existingStudio?.rate_type || "flat",
    base_rate: existingStudio?.base_rate?.toString() || "",
    billing_email: existingStudio?.billing_email || "",
    address: existingStudio?.address || "",
    notes: existingStudio?.notes || "",
    currency: existingStudio?.currency || "EUR",
    max_discount: existingStudio?.max_discount?.toString() || "",
    // Legacy field for backwards compatibility
    student_threshold: existingStudio?.student_threshold?.toString() || "",
    // New enhanced threshold fields
    minimum_student_threshold: existingStudio?.minimum_student_threshold?.toString() || "",
    bonus_student_threshold: existingStudio?.bonus_student_threshold?.toString() || "",
    bonus_per_student: existingStudio?.bonus_per_student?.toString() || "",
    online_bonus_per_student: existingStudio?.online_bonus_per_student?.toString() || "",
    studio_penalty_per_student: existingStudio?.studio_penalty_per_student?.toString() || "",
    // Teacher-specific fields
    recipient_name: existingStudio?.recipient_name || "",
    recipient_email: existingStudio?.recipient_email || "",
    recipient_phone: existingStudio?.recipient_phone || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const createMutation = useSupabaseMutation({
    mutationFn: (supabase, data: BillingEntityInsert) => createStudio(data),
    onSuccess: async (data) => {
      try {
        // 🚀 USE REMATCH FUNCTION INSTEAD OF HEAVY DATABASE OPERATION
        const rematchResult = await rematchUserStudios(user.id);
        
        // Show success toast
        const entityName = (data as BillingEntity).entity_name || 'New Studio';
        if (rematchResult.updated_count > 0) {
          toast.success(`${entityType === 'teacher' ? 'Teacher' : 'Studio'} Created!`, {
            description: `${entityName} was created and ${rematchResult.updated_count} event${rematchResult.updated_count !== 1 ? 's' : ''} were matched.`,
            duration: 4000,
          });
        } else {
          toast.success(`${entityType === 'teacher' ? 'Teacher' : 'Studio'} Created!`, {
            description: `${entityName} was created. No unassigned events were found matching the location pattern.`,
            duration: 4000,
          });
        }
        
        onLoadingChange?.(false);
        onStudioCreated?.(data as BillingEntity);
        
        if (!isEditing) {
          // Reset form
          setFormData({
            entity_name: "",
            location_match: [],
            rate_type: "flat",
            base_rate: "",
            billing_email: "",
            address: "",
            notes: "",
            currency: "EUR",
            max_discount: "",
            student_threshold: "",
            minimum_student_threshold: "",
            bonus_student_threshold: "",
            bonus_per_student: "",
            online_bonus_per_student: "",
            studio_penalty_per_student: "",
            recipient_name: "",
            recipient_email: "",
            recipient_phone: "",
          });
        }
      } catch (error) {
        console.error("Error rematching events to studios:", error);
        toast.error('Failed to apply studio matching', {
          description: `The ${entityType} was created but changes could not be applied to existing events.`,
          duration: 5000,
        });
        onLoadingChange?.(false);
        onStudioCreated?.(data as BillingEntity);
      }
    },
  });

  const updateMutation = useSupabaseMutation({
    mutationFn: (supabase, { id, data }: { id: string; data: BillingEntityUpdate }) => updateStudio(id, data),
    onSuccess: async (data) => {
      try {
        // 🚀 USE REMATCH FUNCTION INSTEAD OF HEAVY DATABASE OPERATION
        const rematchResult = await rematchUserStudios(user.id);
        
        // Show success toast
        const entityName = (data as BillingEntity).entity_name || 'Updated Studio';
        if (rematchResult.updated_count > 0) {
          toast.success(`${entityType === 'teacher' ? 'Teacher' : 'Studio'} Updated!`, {
            description: `${entityName} was updated and ${rematchResult.updated_count} event${rematchResult.updated_count !== 1 ? 's' : ''} were re-matched.`,
            duration: 4000,
          });
        } else {
          toast.success(`${entityType === 'teacher' ? 'Teacher' : 'Studio'} Updated!`, {
            description: `${entityName} was updated. No additional events needed re-matching.`,
            duration: 4000,
          });
        }
        
        onLoadingChange?.(false);
        onStudioUpdated?.(data as BillingEntity);
      } catch (error) {
        console.error("Error rematching events to studios:", error);
        toast.error('Failed to apply updated studio matching', {
          description: `The ${entityType} was updated but changes could not be applied to existing events.`,
          duration: 5000,
        });
        onLoadingChange?.(false);
        onStudioUpdated?.(data as BillingEntity);
      }
    },
  });

  // Validation
  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (entityType === 'teacher' && !formData.recipient_name.trim()) {
      newErrors.recipient_name = "Teacher name is required";
    } else if (entityType === 'studio' && !formData.entity_name.trim()) {
      newErrors.entity_name = "Studio name is required";
    }

    // Location matching is required for both studios and teachers
    if (!formData.location_match || formData.location_match.length === 0) {
      newErrors.location_match = "At least one location match is required";
    }

    // Teacher fields validation
    if (entityType === 'teacher') {
      if (!formData.recipient_name.trim()) {
        newErrors.recipient_name = "Display name is required";
      }
      if (!formData.recipient_email.trim()) {
        newErrors.recipient_email = "Email is required";
      }
    }

    if (!formData.base_rate || isNaN(Number(formData.base_rate)) || Number(formData.base_rate) <= 0) {
      newErrors.base_rate = "Base rate must be a positive number";
    }

    if (formData.max_discount && (isNaN(Number(formData.max_discount)) || Number(formData.max_discount) < 0)) {
      newErrors.max_discount = "Max discount must be a positive number or zero";
    }

    if (formData.student_threshold && (isNaN(Number(formData.student_threshold)) || Number(formData.student_threshold) <= 0)) {
      newErrors.student_threshold = "Student threshold must be a positive number";
    }

    if (formData.minimum_student_threshold && (isNaN(Number(formData.minimum_student_threshold)) || Number(formData.minimum_student_threshold) <= 0)) {
      newErrors.minimum_student_threshold = "Minimum student threshold must be a positive number";
    }

    if (formData.bonus_student_threshold && (isNaN(Number(formData.bonus_student_threshold)) || Number(formData.bonus_student_threshold) <= 0)) {
      newErrors.bonus_student_threshold = "Bonus student threshold must be a positive number";
    }

    if (formData.bonus_per_student && (isNaN(Number(formData.bonus_per_student)) || Number(formData.bonus_per_student) < 0)) {
      newErrors.bonus_per_student = "Bonus per student must be a positive number or zero";
    }

    // Validate that bonus threshold is higher than minimum threshold
    if (formData.minimum_student_threshold && formData.bonus_student_threshold) {
      const minThreshold = Number(formData.minimum_student_threshold);
      const bonusThreshold = Number(formData.bonus_student_threshold);
      if (!isNaN(minThreshold) && !isNaN(bonusThreshold) && bonusThreshold <= minThreshold) {
        newErrors.bonus_student_threshold = "Bonus threshold must be higher than minimum threshold";
      }
    }

    if (formData.online_bonus_per_student && (isNaN(Number(formData.online_bonus_per_student)) || Number(formData.online_bonus_per_student) < 0)) {
      newErrors.online_bonus_per_student = "Online bonus must be a positive number or zero";
    }

    if (formData.studio_penalty_per_student && (isNaN(Number(formData.studio_penalty_per_student)) || Number(formData.studio_penalty_per_student) < 0)) {
      newErrors.studio_penalty_per_student = "Studio penalty must be a positive number or zero";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, entityType]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      onLoadingChange?.(true);
      
      if (isEditing && existingStudio) {
        // Update existing entity
        const updateData: BillingEntityUpdate = {
          entity_name: entityType === 'teacher' ? formData.recipient_name : formData.entity_name,
          location_match: formData.location_match,
          rate_type: formData.rate_type,
          base_rate: formData.base_rate ? Number(formData.base_rate) : null,
          student_threshold: formData.student_threshold ? Number(formData.student_threshold) : null,
          minimum_student_threshold: formData.minimum_student_threshold ? Number(formData.minimum_student_threshold) : null,
          bonus_student_threshold: formData.bonus_student_threshold ? Number(formData.bonus_student_threshold) : null,
          bonus_per_student: formData.bonus_per_student ? Number(formData.bonus_per_student) : null,
          studio_penalty_per_student: formData.studio_penalty_per_student ? Number(formData.studio_penalty_per_student) : null,
          online_bonus_per_student: formData.online_bonus_per_student ? Number(formData.online_bonus_per_student) : null,
          max_discount: formData.max_discount ? Number(formData.max_discount) : null,
          billing_email: formData.billing_email || null,
          address: formData.address || null,
          notes: formData.notes || null,
          recipient_type: entityType === 'teacher' ? 'external_teacher' : 'studio',
          // Teacher-specific fields
          recipient_name: entityType === 'teacher' ? formData.recipient_name || null : null,
          recipient_email: entityType === 'teacher' ? formData.recipient_email || null : null,
          recipient_phone: entityType === 'teacher' ? formData.recipient_phone || null : null,
        };

        await updateMutation.mutateAsync({ id: existingStudio.id, data: updateData });
      } else {
        // Create new entity
        const entityData: BillingEntityInsert = {
          user_id: user.id,
          entity_name: entityType === 'teacher' ? formData.recipient_name : formData.entity_name,
          location_match: formData.location_match,
          rate_type: formData.rate_type,
          base_rate: formData.base_rate ? Number(formData.base_rate) : null,
          student_threshold: formData.student_threshold ? Number(formData.student_threshold) : null,
          minimum_student_threshold: formData.minimum_student_threshold ? Number(formData.minimum_student_threshold) : null,
          bonus_student_threshold: formData.bonus_student_threshold ? Number(formData.bonus_student_threshold) : null,
          bonus_per_student: formData.bonus_per_student ? Number(formData.bonus_per_student) : null,
          studio_penalty_per_student: formData.studio_penalty_per_student ? Number(formData.studio_penalty_per_student) : null,
          online_bonus_per_student: formData.online_bonus_per_student ? Number(formData.online_bonus_per_student) : null,
          max_discount: formData.max_discount ? Number(formData.max_discount) : null,
          billing_email: formData.billing_email || null,
          address: formData.address || null,
          notes: formData.notes || null,
          currency: "EUR", // Default currency //TODO: make this dynamic
          recipient_type: entityType === 'teacher' ? 'external_teacher' : 'studio',
          // Teacher-specific fields
          recipient_name: entityType === 'teacher' ? formData.recipient_name || null : null,
          recipient_email: entityType === 'teacher' ? formData.recipient_email || null : null,
          recipient_phone: entityType === 'teacher' ? formData.recipient_phone || null : null,
        };

        await createMutation.mutateAsync(entityData);
      }
    } catch (error) {
      console.error("Error saving studio:", error);
      onLoadingChange?.(false);
    }
  }, [
    formData,
    user.id,
    isEditing,
    existingStudio,
    updateMutation,
    createMutation,
    onLoadingChange,
    validateForm,
    entityType
  ]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const isLoading = createMutation.isLoading || updateMutation.isLoading;

  // Store the latest handleSubmit in a ref to avoid stale closures
  const handleSubmitRef = React.useRef(handleSubmit);
  handleSubmitRef.current = handleSubmit;

  // Create a stable submit function that always calls the latest handleSubmit
  const stableSubmit = React.useCallback(() => {
    const syntheticEvent = {
      preventDefault: () => {},
    } as React.FormEvent;
    handleSubmitRef.current(syntheticEvent);
  }, []);

  // Expose form submit method to parent when in modal mode
  React.useEffect(() => {
    if (isModal && onFormReady) {
      onFormReady({
        submit: stableSubmit
      });
    }
  }, [isModal, onFormReady, stableSubmit]);

  const rateTypeOptions = [
    { value: "flat", label: "Flat Rate" },
    { value: "per_student", label: "Per Student" },
  ];

  const currencyOptions = [
    { value: "EUR", label: "EUR (€)" },
    { value: "USD", label: "USD ($)" },
    { value: "GBP", label: "GBP (£)" },
  ];

  const formContent = (
    <form onSubmit={onSubmit || handleSubmit} className="space-y-6">


        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Basic Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="entity_name">
                {entityType === 'teacher' ? 'Teacher Name' : 'Studio Name'} *
              </Label>
              <Input
                id="entity_name"
                value={formData.entity_name}
                onChange={(e) => handleInputChange("entity_name", e.target.value)}
                placeholder={entityType === 'teacher' ? 'Enter teacher name' : 'Enter studio name'}
                className={errors.entity_name ? "border-red-500" : ""}
              />
              {errors.entity_name && (
                <p className="text-sm text-red-500 mt-1">{errors.entity_name}</p>
              )}
            </div>

            <div>
              <FormMultiSelect
                id="location_match"
                name="location_match"
                label="Location Match"
                options={eventLocations.map(location => ({ value: location, label: location }))}
                value={formData.location_match}
                onChange={(values) => setFormData(prev => ({ ...prev, location_match: values }))}
                placeholder="Select locations to match"
                required
                error={errors.location_match}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {entityType === 'teacher' 
                  ? 'Locations where this teacher provides substitute classes'
                  : 'Events matching these locations will be automatically assigned to this studio'
                }
              </p>
            </div>

            {entityType === 'teacher' && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="recipient_name">Display Name *</Label>
                  <Input
                    id="recipient_name"
                    value={formData.recipient_name}
                    onChange={(e) => handleInputChange("recipient_name", e.target.value)}
                    placeholder="Teacher display name"
                    className={errors.recipient_name ? "border-red-500" : ""}
                  />
                  {errors.recipient_name && (
                    <p className="text-sm text-red-500 mt-1">{errors.recipient_name}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="recipient_email">Email *</Label>
                  <Input
                    id="recipient_email"
                    type="email"
                    value={formData.recipient_email}
                    onChange={(e) => handleInputChange("recipient_email", e.target.value)}
                    placeholder="teacher@example.com"
                    className={errors.recipient_email ? "border-red-500" : ""}
                  />
                  {errors.recipient_email && (
                    <p className="text-sm text-red-500 mt-1">{errors.recipient_email}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="recipient_phone">Phone</Label>
                  <Input
                    id="recipient_phone"
                    type="tel"
                    value={formData.recipient_phone}
                    onChange={(e) => handleInputChange("recipient_phone", e.target.value)}
                    placeholder="+31 6 12 34 56 78"
                  />
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-blue-800 mb-2">Teacher Entity</h4>
                  <p className="text-sm text-blue-700">
                    Teacher entities track substitute teaching locations and help match the right teacher when converting events from studio to teacher invoicing.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Rate Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Rate Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="rate_type">Rate Type</Label>
              <Select
                options={rateTypeOptions}
                value={formData.rate_type}
                onChange={(value) => handleInputChange("rate_type", value)}
              />
            </div>

            <div>
              <Label htmlFor="base_rate">
                Base Rate * {formData.rate_type === "per_student" ? "(per student)" : `(${formData.currency})`}
              </Label>
              <Input
                id="base_rate"
                type="number"
                step="0.01"
                min="0"
                value={formData.base_rate}
                onChange={(e) => handleInputChange("base_rate", e.target.value)}
                placeholder={formData.rate_type === "per_student" ? "e.g., 15.00" : "e.g., 45.00"}
                className={errors.base_rate ? "border-red-500" : ""}
              />
              {errors.base_rate && (
                <p className="text-sm text-red-500 mt-1">{errors.base_rate}</p>
              )}
            </div>

            <div>
              <Label htmlFor="currency">Currency</Label>
              <Select
                options={currencyOptions}
                value={formData.currency}
                onChange={(value) => handleInputChange("currency", value)}
              />
            </div>
          </div>
        </div>

        {/* Enhanced Rate Structure */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Rate Structure & Student Thresholds</h3>
          
          {/* Threshold Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="minimum_student_threshold">Minimum Student Threshold</Label>
              <Input
                id="minimum_student_threshold"
                type="number"
                min="0"
                value={formData.minimum_student_threshold}
                onChange={(e) => handleInputChange("minimum_student_threshold", e.target.value)}
                placeholder="e.g., 3"
                className={errors.minimum_student_threshold ? "border-red-500" : ""}
              />
              {errors.minimum_student_threshold && (
                <p className="text-sm text-red-500 mt-1">{errors.minimum_student_threshold}</p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Below this count, penalties may apply or no payment
              </p>
            </div>

            <div>
              <Label htmlFor="bonus_student_threshold">Bonus Student Threshold</Label>
              <Input
                id="bonus_student_threshold"
                type="number"
                min="0"
                value={formData.bonus_student_threshold}
                onChange={(e) => handleInputChange("bonus_student_threshold", e.target.value)}
                placeholder="e.g., 15"
                className={errors.bonus_student_threshold ? "border-red-500" : ""}
              />
              {errors.bonus_student_threshold && (
                <p className="text-sm text-red-500 mt-1">{errors.bonus_student_threshold}</p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Above this count, teacher gets bonus per additional student
              </p>
            </div>
          </div>

          {/* Bonus and Penalty Rates */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="bonus_per_student">Bonus per Student ({formData.currency})</Label>
              <Input
                id="bonus_per_student"
                type="number"
                step="0.01"
                min="0"
                value={formData.bonus_per_student}
                onChange={(e) => handleInputChange("bonus_per_student", e.target.value)}
                placeholder="e.g., 3.00"
                className={errors.bonus_per_student ? "border-red-500" : ""}
              />
              {errors.bonus_per_student && (
                <p className="text-sm text-red-500 mt-1">{errors.bonus_per_student}</p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Amount paid per student above bonus threshold
              </p>
            </div>

            <div>
              <Label htmlFor="studio_penalty_per_student">Penalty per Missing Student ({formData.currency})</Label>
              <Input
                id="studio_penalty_per_student"
                type="number"
                step="0.01"
                min="0"
                value={formData.studio_penalty_per_student}
                onChange={(e) => handleInputChange("studio_penalty_per_student", e.target.value)}
                placeholder="e.g., 5.00"
                className={errors.studio_penalty_per_student ? "border-red-500" : ""}
              />
              {errors.studio_penalty_per_student && (
                <p className="text-sm text-red-500 mt-1">{errors.studio_penalty_per_student}</p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Penalty for each student below minimum threshold
              </p>
            </div>

            <div>
              <Label htmlFor="online_bonus_per_student">Online Bonus per Student ({formData.currency})</Label>
              <Input
                id="online_bonus_per_student"
                type="number"
                step="0.01"
                min="0"
                value={formData.online_bonus_per_student}
                onChange={(e) => handleInputChange("online_bonus_per_student", e.target.value)}
                placeholder="e.g., 2.50"
                className={errors.online_bonus_per_student ? "border-red-500" : ""}
              />
              {errors.online_bonus_per_student && (
                <p className="text-sm text-red-500 mt-1">{errors.online_bonus_per_student}</p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Bonus paid for each online student
              </p>
            </div>
          </div>

          {/* Rate Structure Explanation */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-blue-800 mb-2">Rate Structure Example</h4>
            <p className="text-sm text-blue-700 mb-2">
              With Base Rate: €45, Min Threshold: 3, Bonus Threshold: 15, Bonus Rate: €3
            </p>
            <ul className="text-xs text-blue-600 space-y-1">
              <li>• 2 students: €45 - €5 penalty = €40 (if penalty per missing student is €5)</li>
              <li>• 10 students: €45 (base rate, between thresholds)</li>
              <li>• 17 students: €45 + (2 × €3) = €51 (base + 2 bonus students)</li>
            </ul>
          </div>
        </div>

        {/* Additional Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Additional Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="billing_email">Billing Email</Label>
              <Input
                id="billing_email"
                type="email"
                value={formData.billing_email}
                onChange={(e) => handleInputChange("billing_email", e.target.value)}
                placeholder="billing@studio.com"
              />
            </div>

            <div>
              <Label htmlFor="max_discount">Max Discount ({formData.currency})</Label>
              <Input
                id="max_discount"
                type="number"
                step="0.01"
                min="0"
                value={formData.max_discount}
                onChange={(e) => handleInputChange("max_discount", e.target.value)}
                placeholder="e.g., 10.00"
                className={errors.max_discount ? "border-red-500" : ""}
              />
              {errors.max_discount && (
                <p className="text-sm text-red-500 mt-1">{errors.max_discount}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              placeholder="Studio address"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              placeholder="Additional notes about this studio"
              rows={3}
            />
          </div>
        </div>

        {/* Submit Button - only show when not in modal */}
        {!isModal && (
          <div className="flex justify-end space-x-2">
            <Button
              type="submit"
              disabled={isLoading}
              className="min-w-[120px]"
            >
              {isLoading ? "Saving..." : isEditing ? "Update Studio" : "Create Studio"}
            </Button>
          </div>
        )}
    </form>
  );

  if (isModal) {
    return formContent;
  }

  return (
    <Card className="p-6">
      {formContent}
    </Card>
  );
};

export default BillingEntityForm; 