"use client";

import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { VARIANT_STYLES, TREND_CONFIG } from "./kpi-styles";
import type { KPICardProps } from "../../../types/kpi-types";

export function KPICard({
  title,
  value,
  icon: Icon,
  description,
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
    return <KPICardSkeleton />;
  }

  return (
    <Card
      onClick={onClick}
      className={cn(
        "relative overflow-hidden group transition-all duration-300",
        "border border-neutral-200 dark:border-neutral-800",
        "hover:shadow-xl hover:shadow-neutral-200/50 dark:hover:shadow-black/30",
        "hover:-translate-y-1",
        "bg-white dark:bg-neutral-900/80",
        "backdrop-blur-sm",
        onClick && "cursor-pointer"
      )}
    >
      {/* Barre d'accent colorée */}
      <div className={cn("absolute top-0 left-0 right-0 h-1", styles.accent)} />

      <CardContent className="p-6">
        {/* En-tête */}
        <div className="flex items-start justify-between mb-4">
          <div
            className={cn(
              "flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300",
              "group-hover:scale-110 group-hover:shadow-lg",
              styles.iconBg,
              styles.glow
            )}
          >
            <Icon className={cn("w-6 h-6 transition-transform duration-300 group-hover:rotate-12", styles.icon)} />
          </div>

          {trend && trendValue && trendConfig && TrendIcon && (
            <TrendBadge trendConfig={trendConfig} trendValue={trendValue} />
          )}
        </div>

        {/* Valeur */}
        <div className="space-y-1">
          <p className={cn("text-3xl font-bold tracking-tight tabular-nums", styles.value)}>
            {value}
          </p>
          <p className="text-sm font-semibold text-neutral-600 dark:text-neutral-400">
            {title}
          </p>
        </div>

        {/* Description et barre */}
        <div className="mt-4 space-y-2">
          {description && (
            <p className="text-xs text-neutral-500 dark:text-neutral-500 leading-relaxed">
              {description}
            </p>
          )}
          <ProgressBar accent={styles.accent} />
        </div>

        {/* Indicateur de tendance */}
        {trend && trendConfig && (
          <TrendIndicator trendConfig={trendConfig} />
        )}
      </CardContent>

      {/* Effet de survol */}
      <div className={cn(
        "absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none",
        "bg-gradient-to-t from-transparent via-transparent to-current",
        styles.icon
      )} />
    </Card>
  );
}

// Sous-composants internes
function KPICardSkeleton() {
  return (
    <Card className="relative overflow-hidden border-neutral-200 dark:border-neutral-800">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-start justify-between">
          <Skeleton className="h-12 w-12 rounded-2xl" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-3 w-full" />
      </CardContent>
    </Card>
  );
}

function TrendBadge({ trendConfig, trendValue }: { trendConfig: NonNullable<ReturnType<typeof getTrendConfig>>; trendValue: string }) {
  const TrendIcon = trendConfig.icon;
  return (
    <div className={cn(
      "flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold",
      "bg-neutral-100 dark:bg-neutral-800",
      "border border-neutral-200 dark:border-neutral-700"
    )}>
      <TrendIcon className={cn("w-3.5 h-3.5", trendConfig.color)} />
      <span className={trendConfig.color}>{trendValue}</span>
    </div>
  );
}

function ProgressBar({ accent }: { accent: string }) {
  return (
    <div className="w-full h-1 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
      <div
        className={cn("h-full rounded-full transition-all duration-500", accent, "opacity-30 dark:opacity-50")}
        style={{ width: "75%" }}
      />
    </div>
  );
}

function TrendIndicator({ trendConfig }: { trendConfig: NonNullable<ReturnType<typeof getTrendConfig>> }) {
  return (
    <div className="mt-3 flex items-center gap-1.5">
      <div className={cn("w-1.5 h-1.5 rounded-full", trendConfig.color.replace('text-', 'bg-'))} />
      <span className="text-[10px] font-medium text-neutral-400 dark:text-neutral-600 uppercase tracking-wider">
        {trendConfig.label}
      </span>
    </div>
  );
}

// Helper
function getTrendConfig(trend?: string) {
  return trend ? TREND_CONFIG[trend as keyof typeof TREND_CONFIG] : null;
}