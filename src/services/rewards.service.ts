import { api } from "@/lib/api/client";

// --- Types ---

export interface PartnerManager {
  id: string;
  firstName: string;
  lastName: string;
}

export interface Partner {
  id: string;
  name: string;
  description: string;
  logoUrl: string;
  websiteUrl: string;
  isActive: boolean;
  managedBy: PartnerManager;
  createdAt: string;
  updatedAt: string;
}

export interface PartnersResponse {
  success: boolean;
  partners: Partner[];
}

export interface RewardPartner {
  id: string;
  name: string;
}

export type RewardType =
  | "DISCOUNT_COUPON"
  | "TRANSPORT_TICKET"
  | "HEALTH_CHECKUP"
  | "DATA_BUNDLE"
  | "OTHER";
  
export interface Reward {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  rewardType: RewardType;
  isUnlimited: boolean;
  expiresAt: string | null;
  partner: RewardPartner;
  stockQuantity: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RewardsResponse {
  success: boolean;
  rewards: Reward[];
}

export interface CreatePartnerPayload {
  name: string;
  description: string;
  logoUrl?: string;
  websiteUrl?: string;
}

export interface CreateRewardPayload {
  partnerId: string;
  title: string;
  description: string;
  pointsCost: number;
  rewardType: RewardType;
  stockQuantity: number;
  isUnlimited: boolean;
  expiresAt?: string;
}

// --- Service ---

export const partnersService = {
  getAll: () =>
    api.get<PartnersResponse>("/partners"),

  getById: (id: string) =>
    api.get<{ success: boolean; partner: Partner }>(`/partners/${id}`),

  create: (formData: FormData) =>
  api.post<{ success: boolean; partner: Partner }>("/partners", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  }),

  update: (id: string, formData: FormData) =>
    api.patch<{ success: boolean; partner: Partner }>(`/partners/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  deactivate: (id: string) =>
  api.delete<{ success: boolean; partner: Partner }>(`/partners/${id}`),
};

export const rewardsService = {
  getAll: (partnerId?: string) =>
    api.get<RewardsResponse>("/rewards", {
      params: partnerId ? { partnerId } : {},
    }),

  create: (data: CreateRewardPayload) =>
    api.post<{ success: boolean; reward: Reward }>("/rewards", data),

  update: (id: string, data: Partial<CreateRewardPayload>) =>
    api.patch<{ success: boolean; reward: Reward }>(`/rewards/${id}`, data),

  deactivate: (id: string) =>
    api.delete<{ success: boolean; reward: Reward }>(`/rewards/${id}`),
};