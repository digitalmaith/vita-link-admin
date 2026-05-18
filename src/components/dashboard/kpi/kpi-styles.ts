import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { KPIVariant, KPITrend, VariantStyles, TrendConfig } from "../../../types/kpi-types";

export const VARIANT_STYLES: Record<KPIVariant, VariantStyles> = {
  default: {
    icon: "text-primary-600 dark:text-primary-400",
    iconBg: "bg-primary-50 dark:bg-primary-950/30",
    value: "text-foreground",
    border: "border-primary-100 dark:border-primary-900/30",
    glow: "shadow-primary-500/5 dark:shadow-primary-500/10",
    accent: "bg-primary-500",
  },
  success: {
    icon: "text-emerald-600 dark:text-emerald-400",
    iconBg: "bg-emerald-50 dark:bg-emerald-950/30",
    value: "text-emerald-700 dark:text-emerald-400",
    border: "border-emerald-100 dark:border-emerald-900/30",
    glow: "shadow-emerald-500/5 dark:shadow-emerald-500/10",
    accent: "bg-emerald-500",
  },
  warning: {
    icon: "text-amber-600 dark:text-amber-400",
    iconBg: "bg-amber-50 dark:bg-amber-950/30",
    value: "text-amber-700 dark:text-amber-400",
    border: "border-amber-100 dark:border-amber-900/30",
    glow: "shadow-amber-500/5 dark:shadow-amber-500/10",
    accent: "bg-amber-500",
  },
  danger: {
    icon: "text-red-600 dark:text-red-400",
    iconBg: "bg-red-50 dark:bg-red-950/30",
    value: "text-red-700 dark:text-red-400",
    border: "border-red-100 dark:border-red-900/30",
    glow: "shadow-red-500/5 dark:shadow-red-500/10",
    accent: "bg-red-500",
  },
  info: {
    icon: "text-blue-600 dark:text-blue-400",
    iconBg: "bg-blue-50 dark:bg-blue-950/30",
    value: "text-blue-700 dark:text-blue-400",
    border: "border-blue-100 dark:border-blue-900/30",
    glow: "shadow-blue-500/5 dark:shadow-blue-500/10",
    accent: "bg-blue-500",
  },
};

export const TREND_CONFIG: Record<KPITrend, TrendConfig> = {
  up: {
    icon: TrendingUp,
    color: "text-emerald-600 dark:text-emerald-400",
    label: "En hausse",
  },
  down: {
    icon: TrendingDown,
    color: "text-red-600 dark:text-red-400",
    label: "En baisse",
  },
  stable: {
    icon: Minus,
    color: "text-neutral-500 dark:text-neutral-400",
    label: "Stable",
  },
};