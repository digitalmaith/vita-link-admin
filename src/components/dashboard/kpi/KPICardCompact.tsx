"use client";

import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { VARIANT_STYLES, TREND_CONFIG } from "./kpi-styles";
import type { KPICardProps } from "./kpi-types";

export function KPICardCompact({
  title,
  value,
  icon: Icon,
  variant = "default",
  trend,
  trendValue,
  isLoading = false,
  onClick,
}: KPICardProps) {
  const styles = VARIANT_STYLES[variant];
  const trendConfig = trend ? TREND_CONFIG[trend] : null;
  const TrendIcon = trendConfig ? trendConfig.icon : null;

  if (isLoading) {
    return (
      <Card className="border-neutral-200 dark:border-neutral-800">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      onClick={onClick}
      className={cn(
        "group transition-all duration-300",
        "border border-neutral-200 dark:border-neutral-800",
        "hover:shadow-lg hover:shadow-neutral-200/50 dark:hover:shadow-black/30",
        "hover:-translate-y-0.5",
        "bg-white dark:bg-neutral-900/80",
        "backdrop-blur-sm",
        onClick && "cursor-pointer"
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div
            className={cn(
              "flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300",
              "group-hover:scale-110",
              styles.iconBg
            )}
          >
            <Icon className={cn("w-5 h-5", styles.icon)} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2">
              <p className={cn("text-lg font-bold tabular-nums", styles.value)}>
                {value}
              </p>
              {trend && trendValue && trendConfig && TrendIcon && (
                <div className={cn("flex items-center gap-0.5 text-xs font-semibold", trendConfig.color)}>
                  <TrendIcon className="w-3 h-3" />
                  {trendValue}
                </div>
              )}
            </div>
            <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 truncate">
              {title}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}