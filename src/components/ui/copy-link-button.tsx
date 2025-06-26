'use client'

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { UnifiedDialog } from "@/components/ui/unified-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Share } from "lucide-react";
import { useOrigin } from "@/lib/hooks";

interface CopyLinkButtonProps {
  /** Full URL or path - if it starts with '/', origin will be prepended automatically */
  url: string;
  showLabel?: boolean;
  label?: string;
  className?: string;
  buttonText?: string;
  dialogTitle?: string;
  dialogDescription?: string;
}

const CopyLinkButton: React.FC<CopyLinkButtonProps> = ({ 
  url, 
  showLabel = false, 
  label = "Your public schedule:", 
  className = "",
  buttonText = "Share",
  dialogTitle = "Share link",
  dialogDescription = "Anyone who has this link will be able to view this."
}) => {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const origin = useOrigin();

  // Determine if we need to prepend origin
  const isRelativePath = url.startsWith('/');
  const finalUrl = isRelativePath && origin ? `${origin}${url}` : url;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(finalUrl);
      setCopied(true);
      
      // Reset copied state after 3 seconds
      setTimeout(() => {
        setCopied(false);
      }, 3000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  // Show loading state if we're waiting for origin on a relative path
  if (isRelativePath && !origin) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {showLabel && (
          <span className="text-sm text-muted-foreground whitespace-nowrap">{label}</span>
        )}
        <div className="w-[70px] h-8 bg-gray-200 animate-pulse rounded"></div>
      </div>
    );
  }

  const footerContent = (
    <Button type="button" variant="secondary" onClick={() => setIsOpen(false)}>
      Close
    </Button>
  )

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showLabel && (
        <span className="text-sm text-muted-foreground whitespace-nowrap">{label}</span>
      )}
      <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
            <Share className="w-4 h-4 mr-2" />
            {buttonText}
          </Button>
      
      <UnifiedDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        title={dialogTitle}
        description={dialogDescription}
        size="sm"
        footer={footerContent}
      >
          <div className="flex items-center gap-2">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="link" className="sr-only">
                Link
              </Label>
              <Input
                id="link"
                value={finalUrl}
                readOnly
                className="text-sm"
              />
            </div>
            <Button 
              size="sm" 
              onClick={handleCopy}
              variant={copied ? "default" : "secondary"}
            >
              <Copy className="w-4 h-4" />
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
      </UnifiedDialog>
    </div>
  );
};

export { CopyLinkButton }; 