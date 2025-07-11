"use client";

import React, { useState, useCallback } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select } from "../ui/select";

import { PatternInput } from "@/components/tags/PatternInput";
import { Textarea } from "../ui/textarea";
import { toast } from 'sonner'
import { useSupabaseMutation } from "../../lib/hooks/useSupabaseMutation";
import { useTeacherStudioRelationships, getBestStudioSuggestion, extractBillingDefaultsFromStudio } from "../../lib/hooks/useTeacherStudioRelationships";
import { createStudio, updateStudio } from "../../lib/invoice-utils";
import { rematchUserStudios } from "../../lib/rematch-utils";
import type { BillingEntity, BillingEntityInsert, BillingEntityUpdate, RateConfig, RecipientInfo, BankingInfo } from "../../lib/types";
import { Plus, Trash2 } from "lucide-react";

// Types for tiered rate management
interface RateTier {
  min: number | '';
  max: number | null | '';
  rate: number | '';
}

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

// Form data interface
interface FormData {
  entity_name: string;
  location_match: string[];
  rate_type: string;
  base_rate: string;
  billing_email: string;
  address: string;
  notes: string;
  currency: string;
  max_discount: string;
  student_threshold: string;
  minimum_student_threshold: string;
  bonus_student_threshold: string;
  bonus_per_student: string;
  online_bonus_per_student: string;
  online_bonus_ceiling: string;
  rate_tiers: string; // JSON string representation
  separate_online_studio_calculation: boolean;
  recipient_name: string;
  recipient_email: string;
  recipient_phone: string;
}

// Helper function to extract form data from existing entity
function extractFormDataFromEntity(entity: BillingEntity | null | undefined, defaultLocationMatch: string[]): FormData {
  if (!entity) {
    return {
            entity_name: "",
      location_match: defaultLocationMatch,
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
      online_bonus_ceiling: "",
      rate_tiers: "",
      separate_online_studio_calculation: false,
            recipient_name: "",
            recipient_email: "",
            recipient_phone: "",
    };
  }

  const rateConfig = entity.rate_config as RateConfig | null;
  const recipientInfo = entity.recipient_info as RecipientInfo | null;

  return {
    entity_name: entity.entity_name || "",
    location_match: entity.location_match || defaultLocationMatch,
    rate_type: rateConfig?.type || "flat",
    base_rate: rateConfig?.type === 'flat' ? rateConfig.base_rate?.toString() || "" : 
               rateConfig?.type === 'per_student' ? rateConfig.rate_per_student?.toString() || "" : "",
    billing_email: recipientInfo?.email || "",
    address: recipientInfo?.address || "",
    notes: entity.notes || "",
    currency: entity.currency || "EUR",
    max_discount: rateConfig?.type === 'flat' ? rateConfig.max_discount?.toString() || "" : "",
    student_threshold: "", // Legacy field, not used in new schema
    minimum_student_threshold: rateConfig?.type === 'flat' ? rateConfig.minimum_threshold?.toString() || "" : "",
    bonus_student_threshold: rateConfig?.type === 'flat' ? rateConfig.bonus_threshold?.toString() || "" : "",
    bonus_per_student: rateConfig?.type === 'flat' ? rateConfig.bonus_per_student?.toString() || "" : "",
    online_bonus_per_student: rateConfig?.online_bonus_per_student?.toString() || "",
    online_bonus_ceiling: rateConfig?.online_bonus_ceiling?.toString() || "",
    rate_tiers: rateConfig?.type === 'tiered' ? JSON.stringify(rateConfig.tiers, null, 2) : "",
    separate_online_studio_calculation: false, // Legacy field, not used in new schema
    recipient_name: recipientInfo?.name || "",
    recipient_email: recipientInfo?.email || "",
    recipient_phone: recipientInfo?.phone || "",
  };
}

// Helper function to extract rate tiers from entity
function extractRateTiersFromEntity(entity: BillingEntity | null | undefined): RateTier[] {
  if (!entity) {
    return [{ min: '', max: '', rate: '' }];
  }

  const rateConfig = entity.rate_config as RateConfig | null;
  if (rateConfig?.type === 'tiered' && rateConfig.tiers) {
    return rateConfig.tiers.map(tier => ({
      min: tier.min,
      max: tier.max,
      rate: tier.rate
    }));
  }

  return [{ min: '', max: '', rate: '' }];
}

// Custom hook for form logic
const useBillingEntityForm = (props: Props) => {
  const { user, existingStudio, onStudioCreated, onStudioUpdated, onLoadingChange, entityType = 'studio', defaultLocationMatch = [] } = props;

  // Fetch teacher-studio relationships if this is a teacher entity
  const { data: teacherRelationships } = useTeacherStudioRelationships({
    teacherId: entityType === 'teacher' ? user.id : null,
    enabled: entityType === 'teacher' && !existingStudio
  })

  // Get the best studio suggestion for pre-populating the form
  const bestStudioSuggestion = getBestStudioSuggestion(teacherRelationships || [])
  const studioDefaults = extractBillingDefaultsFromStudio(bestStudioSuggestion)

  // Use studio defaults if available, otherwise use the provided defaults
  const effectiveLocationMatch = studioDefaults.defaultLocationMatch.length > 0 
    ? studioDefaults.defaultLocationMatch 
    : defaultLocationMatch

  const [formData, setFormData] = useState<FormData>(() => 
    extractFormDataFromEntity(existingStudio, effectiveLocationMatch)
  );

  // State for managing tiered rates
  const [rateTiers, setRateTiers] = useState<RateTier[]>(() => 
    extractRateTiersFromEntity(existingStudio)
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Functions to manage rate tiers
  const addRateTier = useCallback(() => {
    setRateTiers(prev => [...prev, { min: '', max: '', rate: '' }]);
  }, []);

  const removeRateTier = useCallback((index: number) => {
    setRateTiers(prev => prev.filter((_, i) => i !== index));
  }, []);

  const updateRateTier = useCallback((index: number, field: keyof RateTier, value: string) => {
    setRateTiers(prev => prev.map((tier, i) => 
      i === index 
        ? { 
            ...tier, 
            [field]: field === 'max' && value === '' ? null : 
                     field === 'max' && value !== '' ? Number(value) || '' :
                     value === '' ? '' : Number(value) || ''
          }
        : tier
    ));
  }, []);

  // Convert rate tiers to JSON string for form data
  const updateFormDataWithTiers = useCallback(() => {
    if (formData.rate_type === 'tiered') {
      const validTiers = rateTiers
        .filter(tier => tier.min !== '' && tier.rate !== '')
        .map(tier => ({
          min: Number(tier.min),
          max: tier.max === '' || tier.max === null ? null : Number(tier.max),
          rate: Number(tier.rate)
        }));
      
      setFormData(prev => ({
        ...prev,
        rate_tiers: JSON.stringify(validTiers)
      }));
    }
  }, [rateTiers, formData.rate_type]);

  // Update form data when rate tiers change
  React.useEffect(() => {
    updateFormDataWithTiers();
  }, [updateFormDataWithTiers]);

  const handleInputChange = (field: string, value: string) => {
    // Handle boolean conversions for specific fields
    let processedValue: string | boolean = value;
    if (field === 'use_tiered_rates' || field === 'separate_online_studio_calculation') {
      processedValue = value === 'true';
    }
    
    setFormData(prev => ({ ...prev, [field]: processedValue }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (entityType === 'teacher' && !formData.recipient_name.trim()) {
      newErrors.recipient_name = "Teacher name is required";
    } else if (entityType === 'studio' && !formData.entity_name.trim()) {
      newErrors.entity_name = "Studio name is required";
    }

    if (!formData.location_match || formData.location_match.length === 0) {
      newErrors.location_match = "At least one location match is required";
    }

    if (entityType === 'teacher') {
      if (!formData.recipient_name.trim()) {
        newErrors.recipient_name = "Display name is required";
      }
      if (!formData.recipient_email.trim()) {
        newErrors.recipient_email = "Email is required";
      }
    }

    if (entityType === 'studio' && formData.rate_type !== 'tiered' && (!formData.base_rate || isNaN(Number(formData.base_rate)) || Number(formData.base_rate) <= 0)) {
      newErrors.base_rate = "Base rate must be a positive number";
    }

    // Validate rate tiers for tiered rate type
    if (entityType === 'studio' && formData.rate_type === 'tiered') {
      const validTiers = rateTiers.filter(tier => tier.min !== '' && tier.rate !== '');
      
      if (validTiers.length === 0) {
        newErrors.rate_tiers = "At least one rate tier is required";
      } else {
        // Validate each tier
        for (let i = 0; i < validTiers.length; i++) {
          const tier = validTiers[i];
          
          if (tier.min === '' || isNaN(Number(tier.min)) || Number(tier.min) < 0) {
            newErrors.rate_tiers = `Tier ${i + 1}: Minimum students must be a non-negative number`;
            break;
          }
          
          if (tier.max !== null && tier.max !== '' && (isNaN(Number(tier.max)) || Number(tier.max) < Number(tier.min))) {
            newErrors.rate_tiers = `Tier ${i + 1}: Maximum students must be greater than minimum`;
            break;
          }
          
          if (tier.rate === '' || isNaN(Number(tier.rate)) || Number(tier.rate) <= 0) {
            newErrors.rate_tiers = `Tier ${i + 1}: Rate must be a positive number`;
            break;
          }
        }
      }
    }

    // Additional validation logic...
    if (formData.max_discount && (isNaN(Number(formData.max_discount)) || Number(formData.max_discount) < 0)) {
      newErrors.max_discount = "Max discount must be a positive number or zero";
    }

    if (formData.minimum_student_threshold && formData.bonus_student_threshold) {
      const minThreshold = Number(formData.minimum_student_threshold);
      const bonusThreshold = Number(formData.bonus_student_threshold);
      if (!isNaN(minThreshold) && !isNaN(bonusThreshold) && bonusThreshold <= minThreshold) {
        newErrors.bonus_student_threshold = "Bonus threshold must be higher than minimum threshold";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, entityType, rateTiers]);

  // Helper function to convert form data to entity data
  const convertFormDataToEntityData = useCallback((): { entity: BillingEntityInsert | BillingEntityUpdate, isUpdate: boolean } => {
    const isUpdate = !!existingStudio;
    
    // Build rate config based on rate type
    let rateConfig: RateConfig | null = null;
    if (entityType === 'studio') {
      if (formData.rate_type === 'flat') {
        rateConfig = {
          type: 'flat',
          base_rate: Number(formData.base_rate),
          minimum_threshold: formData.minimum_student_threshold ? Number(formData.minimum_student_threshold) : undefined,
          bonus_threshold: formData.bonus_student_threshold ? Number(formData.bonus_student_threshold) : undefined,
          bonus_per_student: formData.bonus_per_student ? Number(formData.bonus_per_student) : undefined,
          online_bonus_per_student: formData.online_bonus_per_student ? Number(formData.online_bonus_per_student) : undefined,
          online_bonus_ceiling: formData.online_bonus_ceiling ? Number(formData.online_bonus_ceiling) : undefined,
          max_discount: formData.max_discount ? Number(formData.max_discount) : undefined,
        };
      } else if (formData.rate_type === 'per_student') {
        rateConfig = {
          type: 'per_student',
          rate_per_student: Number(formData.base_rate),
          online_bonus_per_student: formData.online_bonus_per_student ? Number(formData.online_bonus_per_student) : undefined,
          online_bonus_ceiling: formData.online_bonus_ceiling ? Number(formData.online_bonus_ceiling) : undefined,
        };
      } else if (formData.rate_type === 'tiered' && formData.rate_tiers.trim()) {
        try {
          const tiers = JSON.parse(formData.rate_tiers);
          rateConfig = {
            type: 'tiered',
            tiers: tiers,
            online_bonus_per_student: formData.online_bonus_per_student ? Number(formData.online_bonus_per_student) : undefined,
            online_bonus_ceiling: formData.online_bonus_ceiling ? Number(formData.online_bonus_ceiling) : undefined,
          };
        } catch (error) {
          console.error('Invalid rate tiers JSON:', error);
        }
      }
    }

    // Build recipient info
    const recipientInfo: RecipientInfo | null = entityType === 'teacher' ? {
      type: 'external_teacher',
      name: formData.recipient_name,
      email: formData.recipient_email,
      phone: formData.recipient_phone || undefined,
      address: formData.address || undefined,
    } : (formData.billing_email ? {
      type: 'studio',
      name: formData.entity_name,
      email: formData.billing_email,
      address: formData.address || undefined,
    } : null);

    // Build banking info (currently empty, but structure is ready)
    const bankingInfo: BankingInfo | null = null;

    // Base entity data
    const baseData = {
          entity_name: entityType === 'teacher' ? formData.recipient_name : formData.entity_name,
      entity_type: entityType,
          location_match: formData.location_match,
      rate_config: rateConfig,
      recipient_info: recipientInfo,
      banking_info: bankingInfo,
      currency: formData.currency || "EUR",
          notes: formData.notes || null,
        };

    if (isUpdate) {
      return { entity: baseData as BillingEntityUpdate, isUpdate: true };
      } else {
      return { 
        entity: { 
          ...baseData, 
          user_id: user.id 
        } as BillingEntityInsert, 
        isUpdate: false 
      };
    }
  }, [formData, user.id, entityType, existingStudio]);

  const createMutation = useSupabaseMutation({
    mutationFn: (supabase, data: BillingEntityInsert) => createStudio(data),
    onSuccess: async (data) => {
      try {
        const rematchResult = await rematchUserStudios(user.id);
        
        const entityName = (data as BillingEntity).entity_name || 'New Entity';
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
        
        // Reset form if not editing
        if (!props.isEditing) {
          setFormData(extractFormDataFromEntity(null, defaultLocationMatch));
      }
    } catch (error) {
        console.error("Error rematching events:", error);
        toast.error('Failed to apply matching', {
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
        const rematchResult = await rematchUserStudios(user.id);
        
        const entityName = (data as BillingEntity).entity_name || 'Updated Entity';
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
        console.error("Error rematching events:", error);
        toast.error('Failed to apply updated matching', {
          description: `The ${entityType} was updated but changes could not be applied to existing events.`,
          duration: 5000,
        });
      onLoadingChange?.(false);
        onStudioUpdated?.(data as BillingEntity);
    }
    },
  });

  return {
    formData,
    setFormData,
    errors,
    handleInputChange,
    validateForm,
    createMutation,
    updateMutation,
    convertFormDataToEntityData,
    isLoading: createMutation.isLoading || updateMutation.isLoading,
    rateTiers,
    addRateTier,
    removeRateTier,
    updateRateTier,
    studioDefaults,
  };
};

// Teacher Form Component
const TeacherForm: React.FC<{
  formData: FormData;
  errors: Record<string, string>;
  userId: string;
  onInputChange: (field: string, value: string) => void;
  onLocationChange: (values: string[]) => void;
  currentStudioId?: string;
  studioDefaults?: {
    suggestedStudioName: string | null;
    defaultLocationMatch: string[];
  } | null;
}> = ({ formData, errors, userId, onInputChange, onLocationChange, currentStudioId, studioDefaults }) => (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Basic Information</h3>
          
          {/* Studio defaults notification */}
          {studioDefaults?.suggestedStudioName && studioDefaults.defaultLocationMatch.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-800 mb-2">Studio Configuration Applied</h4>
              <p className="text-sm text-blue-700">
                This form has been pre-populated with default settings from <strong>{studioDefaults.suggestedStudioName}</strong> 
                based on your approved teacher request. You can modify these settings as needed.
              </p>
            </div>
          )}
          
    <div className="space-y-4">
      {/* Row 1: Teacher Name and Location Match */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
          <Label htmlFor="entity_name">Teacher Name *</Label>
              <Input
                id="entity_name"
                value={formData.entity_name}
            onChange={(e) => onInputChange("entity_name", e.target.value)}
            placeholder="Enter teacher name"
                className={errors.entity_name ? "border-red-500" : ""}
              />
              {errors.entity_name && (
                <p className="text-sm text-red-500 mt-1">{errors.entity_name}</p>
              )}
            </div>
            <div>
              <PatternInput
                label="Location Match *"
                patterns={formData.location_match}
                onChange={onLocationChange}
                userId={userId}
                currentStudioId={currentStudioId}
                placeholder="e.g., Flow Studio, Yoga Works, Downtown"
                required
                error={errors.location_match}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Patterns to match locations where this teacher provides substitute classes
              </p>
        </div>
            </div>

      {/* Row 2: Display Name and Email */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="recipient_name">Display Name *</Label>
                  <Input
                    id="recipient_name"
                    value={formData.recipient_name}
            onChange={(e) => onInputChange("recipient_name", e.target.value)}
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
            onChange={(e) => onInputChange("recipient_email", e.target.value)}
                    placeholder="teacher@example.com"
                    className={errors.recipient_email ? "border-red-500" : ""}
                  />
                  {errors.recipient_email && (
                    <p className="text-sm text-red-500 mt-1">{errors.recipient_email}</p>
                  )}
        </div>
                </div>

      {/* Row 3: Phone and Billing Email */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="recipient_phone">Phone</Label>
                  <Input
                    id="recipient_phone"
                    type="tel"
                    value={formData.recipient_phone}
            onChange={(e) => onInputChange("recipient_phone", e.target.value)}
                    placeholder="+31 6 12 34 56 78"
                  />
        </div>
        <div>
          <Label htmlFor="billing_email">Billing Email</Label>
          <Input
            id="billing_email"
            type="email"
            value={formData.billing_email}
            onChange={(e) => onInputChange("billing_email", e.target.value)}
            placeholder="billing@teacher.com"
          />
        </div>
                </div>

      {/* Teacher Entity Information */}
      <div className="bg-purple-50 p-4 rounded-lg">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-purple-800 mb-2">Teacher Entity</h4>
            <p className="text-sm text-purple-700">
              Track substitute teaching locations and help match the right teacher when converting events from studio to teacher invoicing.
                  </p>
                </div>
          <div>
            <h4 className="text-sm font-medium text-purple-800 mb-2">Payment Recipient Only</h4>
            <p className="text-sm text-purple-700">
              Rate calculations are always based on the <strong>original studio&apos;s rates</strong> where the substitute teaching occurs.
                  </p>
              </div>
              </div>
      </div>
    </div>

    {/* Additional Information for Teachers */}
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Additional Information</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="address">Address</Label>
          <Textarea
            id="address"
            value={formData.address}
            onChange={(e) => onInputChange("address", e.target.value)}
            placeholder="Teacher address"
            rows={4}
          />
        </div>
        <div>
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => onInputChange("notes", e.target.value)}
            placeholder="Additional notes about this teacher"
            rows={4}
          />
        </div>
      </div>
    </div>
  </div>
);

// Studio Form Component
const StudioForm: React.FC<{
  formData: FormData;
  errors: Record<string, string>;
  onInputChange: (field: string, value: string) => void;
  onLocationChange: (values: string[]) => void;
  rateTiers: RateTier[];
  addRateTier: () => void;
  removeRateTier: (index: number) => void;
  updateRateTier: (index: number, field: keyof RateTier, value: string) => void;
  userId: string;
  currentStudioId?: string;
}> = ({ formData, errors, onInputChange, onLocationChange, rateTiers, addRateTier, removeRateTier, updateRateTier, userId, currentStudioId }) => {
  const rateTypeOptions = [
    { value: "flat", label: "Flat Rate" },
    { value: "per_student", label: "Per Student" },
    { value: "tiered", label: "Tiered Rates" },
  ];

  const currencyOptions = [
    { value: "EUR", label: "EUR (€)" },
    { value: "USD", label: "USD ($)" },
    { value: "GBP", label: "GBP (£)" },
  ];

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="entity_name">Studio Name *</Label>
            <Input
              id="entity_name"
              value={formData.entity_name}
              onChange={(e) => onInputChange("entity_name", e.target.value)}
              placeholder="Enter studio name"
              className={errors.entity_name ? "border-red-500" : ""}
            />
            {errors.entity_name && (
              <p className="text-sm text-red-500 mt-1">{errors.entity_name}</p>
            )}
          </div>
          <div>
            <PatternInput
              label="Location Patterns"
              patterns={formData.location_match}
              onChange={onLocationChange}
              userId={userId}
              currentStudioId={currentStudioId}
              placeholder="Enter location patterns (e.g., 'Flow Studio', 'Yoga Works')"
              required
              error={errors.location_match}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Events matching these patterns will be automatically assigned to this studio
            </p>
          </div>
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
              onChange={(value) => onInputChange("rate_type", value)}
              />
            </div>
            <div>
              <Label htmlFor="base_rate">
              Base Rate * {formData.rate_type === "per_student" ? "(per student)" : formData.rate_type === "tiered" ? "(disabled for tiered rates)" : `(${formData.currency})`}
              </Label>
              <Input
                id="base_rate"
                type="number"
                step="0.01"
                min="0"
                value={formData.base_rate}
              onChange={(e) => onInputChange("base_rate", e.target.value)}
                placeholder={formData.rate_type === "per_student" ? "e.g., 15.00" : "e.g., 45.00"}
                className={errors.base_rate ? "border-red-500" : ""}
              disabled={formData.rate_type === "tiered"}
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
              onChange={(value) => onInputChange("currency", value)}
              />
            </div>
          </div>
        </div>

        {/* Enhanced Rate Structure */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Rate Structure & Student Thresholds</h3>
          
        {formData.rate_type !== 'tiered' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="minimum_student_threshold">Minimum Student Threshold</Label>
              <Input
                id="minimum_student_threshold"
                type="number"
                min="0"
                value={formData.minimum_student_threshold}
                onChange={(e) => onInputChange("minimum_student_threshold", e.target.value)}
                placeholder="e.g., 3"
                className={errors.minimum_student_threshold ? "border-red-500" : ""}
              />
              {errors.minimum_student_threshold && (
                <p className="text-sm text-red-500 mt-1">{errors.minimum_student_threshold}</p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Below this count, reduced payments may apply
              </p>
            </div>
            <div>
              <Label htmlFor="bonus_student_threshold">Bonus Student Threshold</Label>
              <Input
                id="bonus_student_threshold"
                type="number"
                min="0"
                value={formData.bonus_student_threshold}
                onChange={(e) => onInputChange("bonus_student_threshold", e.target.value)}
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
        )}

        {formData.rate_type === 'tiered' && (
          <div className="bg-blue-50 p-3 rounded border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>Tiered Rate Mode:</strong> Student thresholds and rates are defined in the rate tiers below. 
              The base rate and threshold settings above are disabled.
            </p>
          </div>
        )}

        {formData.rate_type !== 'tiered' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="bonus_per_student">Bonus per Student ({formData.currency})</Label>
              <Input
                id="bonus_per_student"
                type="number"
                step="0.01"
                min="0"
                value={formData.bonus_per_student}
                onChange={(e) => onInputChange("bonus_per_student", e.target.value)}
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
              <Label htmlFor="online_bonus_per_student">Online Bonus per Student ({formData.currency})</Label>
              <Input
                id="online_bonus_per_student"
                type="number"
                step="0.01"
                min="0"
                value={formData.online_bonus_per_student}
                onChange={(e) => onInputChange("online_bonus_per_student", e.target.value)}
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
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="online_bonus_ceiling">Online Bonus Ceiling</Label>
            <Input
              id="online_bonus_ceiling"
              type="number"
              min="0"
              value={formData.online_bonus_ceiling}
              onChange={(e) => onInputChange("online_bonus_ceiling", e.target.value)}
              placeholder="e.g., 5"
              className={errors.online_bonus_ceiling ? "border-red-500" : ""}
            />
            {errors.online_bonus_ceiling && (
              <p className="text-sm text-red-500 mt-1">{errors.online_bonus_ceiling}</p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Maximum number of online students that receive bonuses
            </p>
          </div>
          {formData.rate_type === 'tiered' && (
            <div>
              <Label htmlFor="online_bonus_per_student">Online Bonus per Student ({formData.currency})</Label>
              <Input
                id="online_bonus_per_student"
                type="number"
                step="0.01"
                min="0"
                value={formData.online_bonus_per_student}
                onChange={(e) => onInputChange("online_bonus_per_student", e.target.value)}
                placeholder="e.g., 2.50"
                className={errors.online_bonus_per_student ? "border-red-500" : ""}
              />
              {errors.online_bonus_per_student && (
                <p className="text-sm text-red-500 mt-1">{errors.online_bonus_per_student}</p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Bonus paid for each online student (works with tiered rates)
              </p>
            </div>
          )}
          </div>

        {formData.rate_type === 'tiered' && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-800">Tiered Rate Configuration</h4>
            <div>
              <Label htmlFor="rate_tiers">Rate Tiers (JSON)</Label>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Rate Tiers</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addRateTier}
                    className="flex items-center gap-1"
                  >
                    <Plus className="h-4 w-4" />
                    Add Tier
                  </Button>
                </div>
                
                {rateTiers.map((tier, index) => (
                  <div key={index} className="flex items-end gap-3 p-3 border rounded-lg bg-gray-50">
                    <div className="flex-1 space-y-1">
                      <Label htmlFor={`tier-${index}-min`} className="text-xs">
                        Min Students
                      </Label>
                      <Input
                        id={`tier-${index}-min`}
                        type="number"
                        min="0"
                        value={tier.min}
                        onChange={(e) => updateRateTier(index, 'min', e.target.value)}
                        placeholder="0"
                        className="text-sm"
                      />
                    </div>
                    
                    <div className="flex-1 space-y-1">
                      <Label htmlFor={`tier-${index}-max`} className="text-xs">
                        Max Students
                      </Label>
                      <Input
                        id={`tier-${index}-max`}
                        type="number"
                        min="0"
                        value={tier.max || ''}
                        onChange={(e) => updateRateTier(index, 'max', e.target.value)}
                        placeholder="Unlimited"
                        className="text-sm"
                      />
                    </div>
                    
                    <div className="flex-1 space-y-1">
                      <Label htmlFor={`tier-${index}-rate`} className="text-xs">
                        Rate (€)
                      </Label>
                      <Input
                        id={`tier-${index}-rate`}
                        type="number"
                        min="0"
                        step="0.01"
                        value={tier.rate}
                        onChange={(e) => updateRateTier(index, 'rate', e.target.value)}
                        placeholder="25.00"
                        className="text-sm"
                      />
                    </div>
                    
                    {rateTiers.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeRateTier(index)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                
                {errors.rate_tiers && (
                  <p className="text-sm text-red-500 mt-1">{errors.rate_tiers}</p>
                )}
                
                <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
                  <p className="font-medium mb-1">How tiered rates work:</p>
                  <p>• Each tier defines a student count range and the rate for that range</p>
                                     <p>• Leave &quot;Max Students&quot; empty for unlimited (e.g., &quot;6 or more students&quot;)</p>
                   <p>• Example: 0-5 students = €25, 6+ students = €35</p>
                </div>
              </div>
            </div>
            <div className="bg-yellow-50 p-3 rounded border-l-4 border-yellow-400">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> When tiered rates are enabled, the base rate and threshold settings above are ignored. 
                The system will use the tier rates based on total student count.
              </p>
            </div>
          </div>
        )}

          <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-blue-800 mb-2">Rate Structure</h4>
          {formData.rate_type === 'tiered' ? (
            <div>
            <p className="text-sm text-blue-700 mb-2">
                <strong>Tiered Rate System:</strong> Different rates apply based on student count tiers defined in the JSON configuration above.
              </p>
              <p className="text-xs text-blue-600">
                Example: 3-9 students: €40, 10-15 students: €50, 16+ students: €55
              </p>
            </div>
          ) : formData.rate_type === 'per_student' ? (
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
          {formData.online_bonus_per_student && (
            <p className="text-xs text-blue-600 mt-2">
              + Online bonus: €{formData.online_bonus_per_student} per online student
              {formData.online_bonus_ceiling && ` (max ${formData.online_bonus_ceiling} students)`}
            </p>
          )}
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
              onChange={(e) => onInputChange("billing_email", e.target.value)}
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
              onChange={(e) => onInputChange("max_discount", e.target.value)}
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
            onChange={(e) => onInputChange("address", e.target.value)}
              placeholder="Studio address"
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
            onChange={(e) => onInputChange("notes", e.target.value)}
              placeholder="Additional notes about this studio"
              rows={3}
            />
          </div>
        </div>
    </div>
  );
};

// Main Component
const BillingEntityForm: React.FC<Props> = (props) => {
  const {
    user,
    isEditing = false,
    isModal = false,
    onSubmit,
    onFormReady,
    entityType = 'studio',
    existingStudio,
    onLoadingChange
  } = props;

  const {
    formData,
    setFormData,
    errors,
    handleInputChange,
    validateForm,
    createMutation,
    updateMutation,
    convertFormDataToEntityData,
    isLoading,
    rateTiers,
    addRateTier,
    removeRateTier,
    updateRateTier,
    studioDefaults,
  } = useBillingEntityForm(props);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      onLoadingChange?.(true);
      
      const { entity, isUpdate } = convertFormDataToEntityData();
      
      if (isUpdate && existingStudio) {
        await updateMutation.mutateAsync({ id: existingStudio.id, data: entity as BillingEntityUpdate });
      } else {
        await createMutation.mutateAsync(entity as BillingEntityInsert);
      }
    } catch (error) {
      console.error("Error saving entity:", error);
      onLoadingChange?.(false);
    }
  }, [
    validateForm,
    onLoadingChange,
    convertFormDataToEntityData,
    existingStudio,
    updateMutation,
    createMutation
  ]);

  // Expose form submit for modal usage
  const handleSubmitRef = React.useRef(handleSubmit);
  handleSubmitRef.current = handleSubmit;

  const stableSubmit = React.useCallback(() => {
    const syntheticEvent = { preventDefault: () => {} } as React.FormEvent;
    handleSubmitRef.current(syntheticEvent);
  }, []);

  React.useEffect(() => {
    if (isModal && onFormReady) {
      onFormReady({ submit: stableSubmit });
    }
  }, [isModal, onFormReady, stableSubmit]);

  const handleLocationChange = (values: string[]) => {
    setFormData(prev => ({ ...prev, location_match: values }));
  };

  const formContent = (
    <form onSubmit={onSubmit || handleSubmit} className="space-y-6">
      {entityType === 'teacher' ? (
        <TeacherForm
          formData={formData}
          errors={errors}
          userId={user.id}
          onInputChange={handleInputChange}
          onLocationChange={handleLocationChange}
          currentStudioId={existingStudio?.id}
          studioDefaults={studioDefaults}
        />
      ) : (
        <StudioForm
          formData={formData}
          errors={errors}
          onInputChange={handleInputChange}
          onLocationChange={handleLocationChange}
          rateTiers={rateTiers}
          addRateTier={addRateTier}
          removeRateTier={removeRateTier}
          updateRateTier={updateRateTier}
          userId={user.id}
          currentStudioId={existingStudio?.id}
        />
      )}

        {!isModal && (
          <div className="flex justify-end space-x-2">
            <Button
              type="submit"
              disabled={isLoading}
              className="min-w-[120px]"
            >
            {isLoading ? "Saving..." : isEditing ? `Update ${entityType === 'teacher' ? 'Teacher' : 'Studio'}` : `Create ${entityType === 'teacher' ? 'Teacher' : 'Studio'}`}
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