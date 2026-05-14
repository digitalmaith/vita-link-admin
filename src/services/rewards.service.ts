// =============================================
// VITA-LINK ADMIN — Rewards Service
// =============================================

import { api } from "@/lib/api/client";
import type { Partner, Reward, Badge, ApiResponse, PaginatedResponse } from "@/types";

const PARTNERS_BASE = "/partners";
const REWARDS_BASE = "/rewards";
const BADGES_BASE = "/badges";

export const rewardsService = {
  // --- Partenaires ---
  getPartners: (page = 1, limit = 20) =>
    api.get<PaginatedResponse<Partner>>(PARTNERS_BASE, { params: { page, limit } }),

  createPartner: (data: Omit<Partner, "id" | "createdAt" | "rewards">) =>
    api.post<ApiResponse<Partner>>(PARTNERS_BASE, data),

  updatePartner: (id: string, data: Partial<Partner>) =>
    api.patch<ApiResponse<Partner>>(`${PARTNERS_BASE}/${id}`, data),

  togglePartner: (id: string, isActive: boolean) =>
    api.patch<ApiResponse<Partner>>(`${PARTNERS_BASE}/${id}/toggle`, { isActive }),

  // --- Récompenses ---
  getRewards: (partnerId?: string) =>
    api.get<PaginatedResponse<Reward>>(REWARDS_BASE, {
      params: partnerId ? { partnerId } : {},
    }),

  createReward: (data: Omit<Reward, "id">) =>
    api.post<ApiResponse<Reward>>(REWARDS_BASE, data),

  updateReward: (id: string, data: Partial<Reward>) =>
    api.patch<ApiResponse<Reward>>(`${REWARDS_BASE}/${id}`, data),

  updatePointsCost: (id: string, pointsCost: number) =>
    api.patch<ApiResponse<Reward>>(`${REWARDS_BASE}/${id}/points`, { pointsCost }),

  // --- Badges ---
  getBadges: () =>
    api.get<PaginatedResponse<Badge>>(BADGES_BASE),

  createBadge: (data: Omit<Badge, "id" | "awardedCount">) =>
    api.post<ApiResponse<Badge>>(BADGES_BASE, data),

  toggleBadge: (id: string, isActive: boolean) =>
    api.patch<ApiResponse<Badge>>(`${BADGES_BASE}/${id}/toggle`, { isActive }),
};
