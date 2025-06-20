'use client'

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Share } from "lucide-react";

interface CopyLinkButtonProps {
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

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      
      // Reset copied state after 3 seconds
      setTimeout(() => {
        setCopied(false);
      }, 3000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showLabel && (
        <span className="text-sm text-muted-foreground whitespace-nowrap">{label}</span>
      )}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Share className="w-4 h-4 mr-2" />
            {buttonText}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogDescription>
              {dialogDescription}
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-2">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="link" className="sr-only">
                Link
              </Label>
              <Input
                id="link"
                value={url}
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
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export { CopyLinkButton }; 