import React from "react";
import { cn } from "@/lib/utils";

interface ContainerProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "full";
  className?: string;
}

const Container: React.FC<ContainerProps> = ({
  children,
  title,
  subtitle,
  maxWidth = "xl",
  className = "",
}) => {
  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
    full: "max-w-full",
  };

  return (
    <div className={cn(
      "w-full mx-auto px-4 sm:px-6 lg:px-8",
      maxWidthClasses[maxWidth],
      className
    )}>
      {title && (
        <h1 className="text-4xl font-semibold font-serif text-foreground mb-4 mt-8 tracking-tight">
          {title}
        </h1>
      )}
      {subtitle && (
        <p className="text-muted-foreground mb-8 text-lg leading-relaxed font-sans">
          {subtitle}
        </p>
      )}
      {children}
    </div>
  );
};

export { Container }; 