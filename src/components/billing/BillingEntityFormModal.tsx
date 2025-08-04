"use client";

import React, { useState, useEffect } from "react";
import { UnifiedDialog } from "../ui/unified-dialog";
import { Button } from "../ui/button";
import BillingEntityForm from "./BillingEntityForm";
import type { BillingEntity } from "../../lib/types";

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
  createTeacherForStudio?: BillingEntity | null; // NEW: Studio entity to create teacher for
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
  defaultLocationMatch,
  createTeacherForStudio
}) => {
  const isEditing = !!existingStudio;
  const [isLoading, setIsLoading] = useState(false);
  const [formInstance, setFormInstance] = useState<{ submit: () => void } | null>(null);
  const [selectedEntityType, setSelectedEntityType] = useState<EntityType>(
    defaultEntityType || (existingStudio?.entity_type as EntityType) || (createTeacherForStudio ? 'teacher' : 'studio')
  );
  // Reset state when modal opens or props change
  useEffect(() => {
    setSelectedEntityType(
      defaultEntityType || (existingStudio?.entity_type as EntityType) || (createTeacherForStudio ? 'teacher' : 'studio')
    );
    setFormInstance(null);
    setIsLoading(false);
  }, [isOpen, defaultEntityType, isEditing, existingStudio?.entity_type, createTeacherForStudio]);

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

  const getTitle = () => {
    if (isEditing) {
      const currentEntityType = existingStudio?.entity_type === 'teacher' ? 'Teacher' : 'Studio';
      return `Edit ${currentEntityType} Profile`;
    }
    return selectedEntityType === 'studio' ? "Create Studio Profile" : "Create Teacher Profile";
  };

  const footerContent = (
    <>
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
          defaultLocationMatch={createTeacherForStudio ? createTeacherForStudio.location_match || [] : defaultLocationMatch}
          createTeacherForStudio={createTeacherForStudio}
        />
    </UnifiedDialog>
  );
};

export default BillingEntityFormModal; 