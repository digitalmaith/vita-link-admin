import type { RewardType } from "@/services/rewards.service";
import { Gift, Tag, Ticket, Stethoscope, Wifi, HelpCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface RewardTypeConfig {
  label: string;
  color: string;
  bgColor: string;
  iconColor: string;
  icon: LucideIcon;
}

export const REWARD_TYPE_CONFIG: Record<RewardType, RewardTypeConfig> = {
  DISCOUNT_COUPON: {
    label: "Coupon réduction",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 border-blue-200 dark:border-blue-800",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
    iconColor: "text-blue-600 dark:text-blue-400",
    icon: Tag,
  },
  TRANSPORT_TICKET: {
    label: "Ticket transport",
    color: "bg-purple-100 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400 border-purple-200 dark:border-purple-800",
    bgColor: "bg-purple-50 dark:bg-purple-950/30",
    iconColor: "text-purple-600 dark:text-purple-400",
    icon: Ticket,
  },
  HEALTH_CHECKUP: {
    label: "Bilan de santé",
    color: "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400 border-green-200 dark:border-green-800",
    bgColor: "bg-green-50 dark:bg-green-950/30",
    iconColor: "text-green-600 dark:text-green-400",
    icon: Stethoscope,
  },
  DATA_BUNDLE: {
    label: "Forfait data",
    color: "bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border-amber-200 dark:border-amber-800",
    bgColor: "bg-amber-50 dark:bg-amber-950/30",
    iconColor: "text-amber-600 dark:text-amber-400",
    icon: Wifi,
  },
  OTHER: {
    label: "Autre",
    color: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700",
    bgColor: "bg-gray-50 dark:bg-gray-800/30",
    iconColor: "text-gray-600 dark:text-gray-400",
    icon: HelpCircle,
  },
};

export const REWARD_TYPES: RewardType[] = [
  "DISCOUNT_COUPON",
  "TRANSPORT_TICKET",
  "HEALTH_CHECKUP",
  "DATA_BUNDLE",
  "OTHER",
] as const;

// Type utilitaire pour l'utilisation dans les composants
export type RewardTypeKey = keyof typeof REWARD_TYPE_CONFIG;