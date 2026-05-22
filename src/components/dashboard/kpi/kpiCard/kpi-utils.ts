import type { LucideIcon } from "lucide-react";
import { TREND_CONFIG } from "./kpi-styles";

export interface TrendConfig {
  icon: LucideIcon;
  color: string;
  label: string;
}

export function getTrendConfig(trend?: string): TrendConfig | null {
  return trend ? TREND_CONFIG[trend as keyof typeof TREND_CONFIG] : null;
}

export function getVariantStyles(variant: string, VARIANT_STYLES: Record<string, any>) {
  return VARIANT_STYLES[variant] || VARIANT_STYLES.default;
}