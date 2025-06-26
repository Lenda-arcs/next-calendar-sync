"use client";

import React, { useState, useCallback } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { useSupabaseMutation } from "../../lib/hooks/useSupabaseMutation";
import { createStudio, updateStudio, matchEventsToStudios } from "../../lib/invoice-utils";
import type { Studio, StudioInsert, StudioUpdate } from "../../lib/types";

interface Props {
  user: { id: string; email?: string | null };
  eventLocations?: string[];
  existingStudio?: Studio | null;
  onStudioCreated?: (studio: Studio) => void;
  onStudioUpdated?: (studio: Studio) => void;
  isEditing?: boolean;
  isModal?: boolean;
  onSubmit?: (e: React.FormEvent) => void;
  onLoadingChange?: (isLoading: boolean) => void;
  onFormReady?: (formInstance: { submit: () => void }) => void;
}

const StudioForm: React.FC<Props> = ({
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
}) => {
  const [formData, setFormData] = useState({
    studio_name: existingStudio?.studio_name || "",
    location_match: existingStudio?.location_match || "",
    rate_type: existingStudio?.rate_type || "flat",
    base_rate: existingStudio?.base_rate?.toString() || "",
    billing_email: existingStudio?.billing_email || "",
    address: existingStudio?.address || "",
    notes: existingStudio?.notes || "",
    currency: existingStudio?.currency || "EUR",
    max_discount: existingStudio?.max_discount?.toString() || "",
    student_threshold: existingStudio?.student_threshold?.toString() || "",
    online_penalty_per_student: existingStudio?.online_penalty_per_student?.toString() || "",
    studio_penalty_per_student: existingStudio?.studio_penalty_per_student?.toString() || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [matchingResults, setMatchingResults] = useState<{
    matchedEvents: number;
    studios: { studioId: string; studioName: string; matchedCount: number }[];
  } | null>(null);

  const createMutation = useSupabaseMutation({
    mutationFn: (supabase, data: StudioInsert) => createStudio(data),
    onSuccess: async (data) => {
      try {
        // Match events to the new studio
        const matchResults = await matchEventsToStudios(user.id);
        setMatchingResults(matchResults);
        
        onLoadingChange?.(false);
        onStudioCreated?.(data);
        
        if (!isEditing) {
          // Reset form
          setFormData({
            studio_name: "",
            location_match: "",
            rate_type: "flat",
            base_rate: "",
            billing_email: "",
            address: "",
            notes: "",
            currency: "EUR",
            max_discount: "",
            student_threshold: "",
            online_penalty_per_student: "",
            studio_penalty_per_student: "",
          });
        }
      } catch (error) {
        console.error("Error matching events to studios:", error);
        onLoadingChange?.(false);
        onStudioCreated?.(data);
      }
    },
  });

  const updateMutation = useSupabaseMutation({
    mutationFn: (supabase, { id, data }: { id: string; data: StudioUpdate }) => updateStudio(id, data),
    onSuccess: async (data) => {
      try {
        // Match events to studios after update
        const matchResults = await matchEventsToStudios(user.id);
        setMatchingResults(matchResults);
        
        onLoadingChange?.(false);
        onStudioUpdated?.(data);
      } catch (error) {
        console.error("Error matching events to studios:", error);
        onLoadingChange?.(false);
        onStudioUpdated?.(data);
      }
    },
  });

  // Validation
  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (!formData.studio_name.trim()) {
      newErrors.studio_name = "Studio name is required";
    }

    if (!formData.location_match.trim()) {
      newErrors.location_match = "Location match is required";
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

    if (formData.online_penalty_per_student && (isNaN(Number(formData.online_penalty_per_student)) || Number(formData.online_penalty_per_student) < 0)) {
      newErrors.online_penalty_per_student = "Online penalty must be a positive number or zero";
    }

    if (formData.studio_penalty_per_student && (isNaN(Number(formData.studio_penalty_per_student)) || Number(formData.studio_penalty_per_student) < 0)) {
      newErrors.studio_penalty_per_student = "Studio penalty must be a positive number or zero";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      onLoadingChange?.(true);
      
      if (isEditing && existingStudio) {
        // Update existing studio
        const updateData: StudioUpdate = {
          studio_name: formData.studio_name,
          location_match: formData.location_match,
          rate_type: formData.rate_type,
          base_rate: formData.base_rate ? Number(formData.base_rate) : null,
          student_threshold: formData.student_threshold ? Number(formData.student_threshold) : null,
          studio_penalty_per_student: formData.studio_penalty_per_student ? Number(formData.studio_penalty_per_student) : null,
          online_penalty_per_student: formData.online_penalty_per_student ? Number(formData.online_penalty_per_student) : null,
          max_discount: formData.max_discount ? Number(formData.max_discount) : null,
          billing_email: formData.billing_email || null,
          address: formData.address || null,
          notes: formData.notes || null,
        };

        await updateMutation.mutateAsync({ id: existingStudio.id, data: updateData });
      } else {
        // Create new studio
        const studioData: StudioInsert = {
          user_id: user.id,
          studio_name: formData.studio_name,
          location_match: formData.location_match,
          rate_type: formData.rate_type,
          base_rate: formData.base_rate ? Number(formData.base_rate) : null,
          student_threshold: formData.student_threshold ? Number(formData.student_threshold) : null,
          studio_penalty_per_student: formData.studio_penalty_per_student ? Number(formData.studio_penalty_per_student) : null,
          online_penalty_per_student: formData.online_penalty_per_student ? Number(formData.online_penalty_per_student) : null,
          max_discount: formData.max_discount ? Number(formData.max_discount) : null,
          billing_email: formData.billing_email || null,
          address: formData.address || null,
          notes: formData.notes || null,
          currency: "EUR", // Default currency
        };

        await createMutation.mutateAsync(studioData);
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
    validateForm
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
        {/* Event Matching Results */}
        {matchingResults && matchingResults.matchedEvents > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-green-800 mb-2">
              ✅ Events Matched Successfully!
            </h4>
            <p className="text-sm text-green-700 mb-2">
              {matchingResults.matchedEvents} event{matchingResults.matchedEvents !== 1 ? 's' : ''} matched to studio{matchingResults.studios.length !== 1 ? 's' : ''}:
            </p>
            <ul className="text-sm text-green-700 space-y-1">
              {matchingResults.studios.map((studio) => (
                <li key={studio.studioId}>
                  • <strong>{studio.studioName}</strong>: {studio.matchedCount} event{studio.matchedCount !== 1 ? 's' : ''}
                </li>
              ))}
            </ul>
          </div>
        )}

        {matchingResults && matchingResults.matchedEvents === 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-yellow-800 mb-1">
              ℹ️ No events matched
            </h4>
                         <p className="text-sm text-yellow-700">
               No unassigned events were found matching the location pattern. Events will be automatically matched when they&apos;re imported.
             </p>
          </div>
        )}

        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Basic Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="studio_name">Studio Name *</Label>
              <Input
                id="studio_name"
                value={formData.studio_name}
                onChange={(e) => handleInputChange("studio_name", e.target.value)}
                placeholder="Enter studio name"
                className={errors.studio_name ? "border-red-500" : ""}
              />
              {errors.studio_name && (
                <p className="text-sm text-red-500 mt-1">{errors.studio_name}</p>
              )}
            </div>

            <div>
              <Label htmlFor="location_match">Location Match *</Label>
              <Select
                options={eventLocations.map(location => ({ value: location, label: location }))}
                value={formData.location_match}
                onChange={(value) => handleInputChange("location_match", value)}
                placeholder="Select location to match"
                className={errors.location_match ? "border-red-500" : ""}
              />
              {errors.location_match && (
                <p className="text-sm text-red-500 mt-1">{errors.location_match}</p>
              )}
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

        {/* Penalty Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Penalty Settings</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="student_threshold">Student Threshold</Label>
              <Input
                id="student_threshold"
                type="number"
                min="0"
                value={formData.student_threshold}
                onChange={(e) => handleInputChange("student_threshold", e.target.value)}
                placeholder="e.g., 3"
                className={errors.student_threshold ? "border-red-500" : ""}
              />
              {errors.student_threshold && (
                <p className="text-sm text-red-500 mt-1">{errors.student_threshold}</p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Minimum students required to avoid penalties
              </p>
            </div>

            <div>
              <Label htmlFor="online_penalty_per_student">Online Penalty per Student ({formData.currency})</Label>
              <Input
                id="online_penalty_per_student"
                type="number"
                step="0.01"
                min="0"
                value={formData.online_penalty_per_student}
                onChange={(e) => handleInputChange("online_penalty_per_student", e.target.value)}
                placeholder="e.g., 2.50"
                className={errors.online_penalty_per_student ? "border-red-500" : ""}
              />
              {errors.online_penalty_per_student && (
                <p className="text-sm text-red-500 mt-1">{errors.online_penalty_per_student}</p>
              )}
            </div>

            <div>
              <Label htmlFor="studio_penalty_per_student">Studio Penalty per Student ({formData.currency})</Label>
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
            </div>
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

export default StudioForm; 