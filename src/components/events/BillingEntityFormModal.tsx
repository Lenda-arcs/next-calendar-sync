"use client";

import React, { useState, useEffect } from "react";
import { UnifiedDialog } from "../ui/unified-dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import BillingEntityForm from "./BillingEntityForm";
import type { BillingEntity } from "../../lib/types";
import { Building2, User } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  user: { id: string; email?: string | null };
  eventLocations?: string[];
  existingStudio?: BillingEntity | null;
  onStudioCreated?: (studio: BillingEntity) => void;
  onStudioUpdated?: (studio: BillingEntity) => void;
  defaultEntityType?: 'studio' | 'teacher';
  defaultLocationMatch?: string[];
}

type EntityType = 'studio' | 'teacher'

const BillingEntityFormModal: React.FC<Props> = ({
  isOpen,
  onClose,
  user,
  eventLocations = [],
  existingStudio,
  onStudioCreated,
  onStudioUpdated,
  defaultEntityType,
  defaultLocationMatch
}) => {
  const isEditing = !!existingStudio;
  const [isLoading, setIsLoading] = useState(false);
  const [formInstance, setFormInstance] = useState<{ submit: () => void } | null>(null);
  const [selectedEntityType, setSelectedEntityType] = useState<EntityType>(defaultEntityType || 'studio');
  const [showEntityTypeSelection, setShowEntityTypeSelection] = useState<boolean>(!isEditing && !defaultEntityType);

  // Reset state when modal opens or props change
  useEffect(() => {
    setSelectedEntityType(defaultEntityType || 'studio');
    setShowEntityTypeSelection(!isEditing && !defaultEntityType);
    setFormInstance(null);
    setIsLoading(false);
  }, [isOpen, defaultEntityType, isEditing]);

  const handleStudioCreated = (studio: BillingEntity) => {
    if (onStudioCreated) {
      onStudioCreated(studio);
    }
    onClose();
  };

  const handleStudioUpdated = (studio: BillingEntity) => {
    if (onStudioUpdated) {
      onStudioUpdated(studio);
    }
    onClose();
  };

  const handleFormSubmit = () => {
    if (formInstance) {
      formInstance.submit();
    }
  };

  const handleEntityTypeSelection = (entityType: EntityType) => {
    setSelectedEntityType(entityType);
    setShowEntityTypeSelection(false);
  };

  const handleBackToSelection = () => {
    setShowEntityTypeSelection(true);
  };

  const getTitle = () => {
    if (isEditing) return "Edit Studio Profile";
    if (showEntityTypeSelection) return "Create Billing Entity";
    return selectedEntityType === 'studio' ? "Create Studio Profile" : "Create Teacher Profile";
  };

  const footerContent = showEntityTypeSelection ? (
    <Button variant="outline" onClick={onClose}>
      Cancel
    </Button>
  ) : (
    <>
      {!isEditing && (
        <Button variant="outline" onClick={handleBackToSelection} disabled={isLoading}>
          Back
        </Button>
      )}
      <Button variant="outline" onClick={onClose} disabled={isLoading}>
        Cancel
      </Button>
      <Button 
        onClick={handleFormSubmit}
        disabled={isLoading}
        className="min-w-[120px]"
      >
        {isLoading ? "Saving..." : isEditing ? "Update Profile" : 
          selectedEntityType === 'studio' ? "Create Studio" : "Create Teacher"}
      </Button>
    </>
  );

  return (
    <UnifiedDialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
      title={getTitle()}
      size="xl"
      footer={footerContent}
    >
      {showEntityTypeSelection ? (
        <div className="space-y-6">
          <div className="space-y-3">
            <Label className="text-base font-medium">What type of billing entity would you like to create?</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleEntityTypeSelection('studio')}
                className="p-6 border-2 rounded-lg text-left transition-colors border-gray-200 hover:border-blue-300 hover:bg-blue-50"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Building2 className="w-6 h-6 text-blue-600" />
                  <span className="font-semibold text-lg">Studio</span>
                </div>
                <p className="text-sm text-gray-600">
                  Create a studio profile for venue-based billing. Use this for regular classes at studios or fitness centers.
                </p>
              </button>

              <button
                type="button"
                onClick={() => handleEntityTypeSelection('teacher')}
                className="p-6 border-2 rounded-lg text-left transition-colors border-gray-200 hover:border-purple-300 hover:bg-purple-50"
              >
                <div className="flex items-center gap-3 mb-3">
                  <User className="w-6 h-6 text-purple-600" />
                  <span className="font-semibold text-lg">Teacher</span>
                </div>
                <p className="text-sm text-gray-600">
                  Create a teacher profile for individual teacher billing. Use this for substitute teaching or direct teacher payments.
                </p>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <BillingEntityForm
          user={user}
          eventLocations={eventLocations}
          onStudioCreated={handleStudioCreated}
          existingStudio={existingStudio}
          onStudioUpdated={handleStudioUpdated}
          isEditing={isEditing}
          isModal={true}
          onLoadingChange={setIsLoading}
          onFormReady={setFormInstance}
          entityType={selectedEntityType}
          defaultLocationMatch={defaultLocationMatch}
        />
      )}
    </UnifiedDialog>
  );
};

export default BillingEntityFormModal; 