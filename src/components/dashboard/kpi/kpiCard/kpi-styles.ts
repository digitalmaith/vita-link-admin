// kpi-styles.ts
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Users,
  Droplets,
  Building2,
  AlertCircle,
  type LucideIcon 
} from "lucide-react";

export interface TrendConfig {
  icon: LucideIcon;
  color: string;
  label: string;
}

export const TREND_CONFIG: Record<string, TrendConfig> = {
  up: {
    icon: TrendingUp,
    color: "text-green-600 dark:text-green-400",
    label: "En hausse",
  },
  down: {
    icon: TrendingDown,
    color: "text-red-600 dark:text-red-400",
    label: "En baisse",
  },
  stable: {
    icon: Minus,
    color: "text-neutral-600 dark:text-neutral-400",
    label: "Stable",
  },
};

export interface VariantStyles {
  accent: string;
  iconBg: string;
  icon: string;
  value: string;
  glow: string;
}

export const VARIANT_STYLES: Record<string, VariantStyles> = {
  default: {
    accent: "bg-blue-500",
    iconBg: "bg-blue-100 dark:bg-blue-900/30",
    icon: "text-blue-600 dark:text-blue-400",
    value: "text-blue-700 dark:text-blue-300",
    glow: "shadow-blue-500/20",
  },
  success: {
    accent: "bg-green-500",
    iconBg: "bg-green-100 dark:bg-green-900/30",
    icon: "text-green-600 dark:text-green-400",
    value: "text-green-700 dark:text-green-300",
    glow: "shadow-green-500/20",
  },
  warning: {
    accent: "bg-orange-500",
    iconBg: "bg-orange-100 dark:bg-orange-900/30",
    icon: "text-orange-600 dark:text-orange-400",
    value: "text-orange-700 dark:text-orange-300",
    glow: "shadow-orange-500/20",
  },
  danger: {
    accent: "bg-red-500",
    iconBg: "bg-red-100 dark:bg-red-900/30",
    icon: "text-red-600 dark:text-red-400",
    value: "text-red-700 dark:text-red-300",
    glow: "shadow-red-500/20",
  },
  info: {
    accent: "bg-cyan-500",
    iconBg: "bg-cyan-100 dark:bg-cyan-900/30",
    icon: "text-cyan-600 dark:text-cyan-400",
    value: "text-cyan-700 dark:text-cyan-300",
    glow: "shadow-cyan-500/20",
  },
  purple: {
    accent: "bg-purple-500",
    iconBg: "bg-purple-100 dark:bg-purple-900/30",
    icon: "text-purple-600 dark:text-purple-400",
    value: "text-purple-700 dark:text-purple-300",
    glow: "shadow-purple-500/20",
  },
};