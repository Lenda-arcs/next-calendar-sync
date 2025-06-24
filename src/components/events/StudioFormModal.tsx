"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Studio Profile" : "Create Studio Profile"}
          </DialogTitle>
        </DialogHeader>

        <StudioForm
          user={user}
          eventLocations={eventLocations}
          onStudioCreated={handleStudioCreated}
          existingStudio={existingStudio}
          onStudioUpdated={handleStudioUpdated}
          isEditing={isEditing}
          isModal={true}
        />
      </DialogContent>
    </Dialog>
  );
};

export default StudioFormModal; 