"use client";

import React, { useState } from "react";
import { UnifiedDialog } from "../ui/unified-dialog";
import { Button } from "../ui/button";
import StudioForm from "./StudioForm";
import type { Studio } from "../../lib/types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  user: { id: string; email?: string | null };
  eventLocations?: string[];
  existingStudio?: Studio | null;
  onStudioCreated?: (studio: Studio) => void;
  onStudioUpdated?: (studio: Studio) => void;
}

const StudioFormModal: React.FC<Props> = ({
  isOpen,
  onClose,
  user,
  eventLocations = [],
  existingStudio,
  onStudioCreated,
  onStudioUpdated
}) => {
  const isEditing = !!existingStudio;
  const [isLoading, setIsLoading] = useState(false);
  const [formInstance, setFormInstance] = useState<{ submit: () => void } | null>(null);

  const handleStudioCreated = (studio: Studio) => {
    if (onStudioCreated) {
      onStudioCreated(studio);
    }
    onClose();
  };

  const handleStudioUpdated = (studio: Studio) => {
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
        {isLoading ? "Saving..." : isEditing ? "Update Studio" : "Create Studio"}
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
      title={isEditing ? "Edit Studio Profile" : "Create Studio Profile"}
      size="xl"
      footer={footerContent}
    >
        <StudioForm
          user={user}
          eventLocations={eventLocations}
          onStudioCreated={handleStudioCreated}
          existingStudio={existingStudio}
          onStudioUpdated={handleStudioUpdated}
          isEditing={isEditing}
          isModal={true}
        onLoadingChange={setIsLoading}
        onFormReady={setFormInstance}
        />
    </UnifiedDialog>
  );
};

export default StudioFormModal; 