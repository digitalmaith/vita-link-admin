"use client";

import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export type KPIVariant = "default" | "success" | "warning" | "danger";

interface KPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  variant?: KPIVariant;
  isLoading?: boolean;
}

const VARIANT_STYLES: Record<KPIVariant, { icon: string; value: string }> = {
  default: {
    icon: "bg-primary/10 text-primary",
    value: "text-foreground",
  },
  success: {
    icon: "bg-green-100 text-green-600",
    value: "text-green-600",
  },
  warning: {
    icon: "bg-amber-100 text-amber-600",
    value: "text-amber-600",
  },
  danger: {
    icon: "bg-red-100 text-red-600",
    value: "text-red-600",
  },
};

export function KPICard({
  title,
  value,
  icon: Icon,
  description,
  variant = "default",
  isLoading = false,
}: KPICardProps) {
  const styles = VARIANT_STYLES[variant];

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-4 space-y-3">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-7 w-20" />
          <Skeleton className="h-4 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div
          className={cn(
            "inline-flex items-center justify-center w-8 h-8 rounded-lg mb-3",
            styles.icon
          )}
        >
          <Icon className="w-4 h-4" />
        </div>
        <p className={cn("text-2xl font-bold leading-none mb-1", styles.value)}>
          {value}
        </p>
        <p className="text-sm font-medium text-foreground">{title}</p>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
