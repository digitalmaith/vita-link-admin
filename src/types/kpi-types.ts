import type { LucideIcon } from "lucide-react";

export type KPIVariant = "default" | "success" | "warning" | "danger" | "info";
export type KPITrend = "up" | "down" | "stable";

export interface KPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  variant?: KPIVariant;
  trend?: KPITrend;
  trendValue?: string;
  isLoading?: boolean;
  onClick?: () => void;
}

export interface VariantStyles {
  icon: string;
  iconBg: string;
  value: string;
  border: string;
  glow: string;
  accent: string;
}

export interface TrendConfig {
  icon: LucideIcon;
  color: string;
  label: string;
}