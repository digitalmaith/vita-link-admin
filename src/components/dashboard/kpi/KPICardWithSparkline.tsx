"use client";

import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { VARIANT_STYLES, TREND_CONFIG } from "./kpi-styles";
import type { KPICardProps } from "./kpi-types";

export function KPICardWithSparkline({
  title,
  value,
  icon: Icon,
  variant = "default",
  trend,
  trendValue,
  isLoading = false,
}: KPICardProps) {
  const styles = VARIANT_STYLES[variant];
  const trendConfig = trend ? TREND_CONFIG[trend] : null;

  if (isLoading) {
    return (
      <Card className="border-neutral-200 dark:border-neutral-800">
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <Skeleton className="h-5 w-16" />
          </div>
          <Skeleton className="h-12 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn(
      "group transition-all duration-300",
      "border border-neutral-200 dark:border-neutral-800",
      "hover:shadow-xl hover:shadow-neutral-200/50 dark:hover:shadow-black/30",
      "bg-white dark:bg-neutral-900/80",
      "backdrop-blur-sm"
    )}>
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={cn("flex items-center justify-center w-10 h-10 rounded-xl", styles.iconBg)}>
              <Icon className={cn("w-5 h-5", styles.icon)} />
            </div>
            <p className="text-sm font-semibold text-neutral-600 dark:text-neutral-400">
              {title}
            </p>
          </div>
          {trend && trendValue && trendConfig && (
            <span className={cn(
              "text-xs font-bold px-2 py-1 rounded-lg",
              "bg-neutral-100 dark:bg-neutral-800",
              trendConfig.color
            )}>
              {trendValue}
            </span>
          )}
        </div>

        <p className={cn("text-3xl font-bold mb-4", styles.value)}>
          {value}
        </p>

        <div className="flex items-end gap-1 h-8">
          {[40, 60, 45, 80, 55, 75, 65, 85, 70, 90].map((height, i) => (
            <div
              key={i}
              className={cn(
                "flex-1 rounded-sm transition-all duration-300",
                "group-hover:opacity-80",
                styles.accent,
                "dark:opacity-80"
              )}
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}