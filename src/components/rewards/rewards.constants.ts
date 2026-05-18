import type { RewardType } from "@/services/rewards.service";

export const REWARD_TYPE_CONFIG: Record<RewardType, { label: string; color: string }> = {
  DISCOUNT_COUPON: { label: "Coupon réduction", color: "bg-blue-100 text-blue-700" },
  FREE_PRODUCT:    { label: "Produit gratuit",  color: "bg-green-100 text-green-700" },
  CASHBACK:        { label: "Cashback",          color: "bg-purple-100 text-purple-700" },
  GIFT_CARD:       { label: "Carte cadeau",      color: "bg-pink-100 text-pink-700" },
  OTHER:           { label: "Autre",             color: "bg-gray-100 text-gray-600" },
};

export const REWARD_TYPES: RewardType[] = [
  "DISCOUNT_COUPON",
  "FREE_PRODUCT",
  "CASHBACK",
  "GIFT_CARD",
  "OTHER",
];