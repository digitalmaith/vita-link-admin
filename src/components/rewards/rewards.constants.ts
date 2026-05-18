import type { RewardType } from "@/services/rewards.service";

export const REWARD_TYPE_CONFIG: Record<RewardType, { label: string; color: string }> = {
  DISCOUNT_COUPON:   { label: "Coupon réduction",  color: "bg-blue-100 text-blue-700" },
  TRANSPORT_TICKET:  { label: "Ticket transport",   color: "bg-purple-100 text-purple-700" },
  HEALTH_CHECKUP:    { label: "Bilan de santé",     color: "bg-green-100 text-green-700" },
  DATA_BUNDLE:       { label: "Forfait data",       color: "bg-amber-100 text-amber-700" },
  OTHER:             { label: "Autre",              color: "bg-gray-100 text-gray-600" },
};

export const REWARD_TYPES: RewardType[] = [
  "DISCOUNT_COUPON",
  "TRANSPORT_TICKET",
  "HEALTH_CHECKUP",
  "DATA_BUNDLE",
  "OTHER",
];