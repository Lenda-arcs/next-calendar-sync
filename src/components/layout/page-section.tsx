import React from "react";
import { cn } from "@/lib/utils";

interface PageSectionProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  spacing?: "small" | "medium" | "large";
}

const PageSection: React.FC<PageSectionProps> = ({
  children,
  title,
  subtitle,
  className = "",
  spacing = "medium",
}) => {
  const spacingClasses = {
    small: "mb-4",
    medium: "mb-8",
    large: "mb-12",
  };

  return (
    <section className={cn(
      "py-8 sm:py-12",
      spacingClasses[spacing],
      className
    )}>
      {title && (
        <h2 className="text-2xl font-semibold font-serif text-foreground mb-4 tracking-tight">
          {title}
        </h2>
      )}
      {subtitle && (
        <p className="text-muted-foreground mb-4 leading-relaxed font-sans">
          {subtitle}
        </p>
      )}
      {children}
    </section>
  );
};

export { PageSection }; 