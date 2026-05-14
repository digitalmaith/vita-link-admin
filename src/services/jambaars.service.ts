// =============================================
// VITA-LINK ADMIN — Jambaars Service
// =============================================

import { api } from "@/lib/api/client";
import type {
  Jambaar,
  ApiResponse,
  PaginatedResponse,
  BloodGroup,
  Region,
  Status,
} from "@/types";

export interface JambaarFilters {
  bloodGroup?: BloodGroup;
  region?: Region;
  status?: Status;
  grade?: string;
  search?: string;
}

const BASE = "/users"; // endpoint selon l'API backend

export const jambaarService = {
  getAll: (filters?: JambaarFilters, page = 1, limit = 20) =>
    api.get<PaginatedResponse<Jambaar>>(BASE, {
      params: { ...filters, page, limit },
    }),

  getById: (id: string) =>
    api.get<ApiResponse<Jambaar>>(`${BASE}/${id}`),

  suspend: (id: string, reason: string, durationDays?: number) =>
    api.patch<ApiResponse<Jambaar>>(`${BASE}/${id}/suspend`, {
      reason,
      durationDays,
    }),

  reactivate: (id: string) =>
    api.patch<ApiResponse<Jambaar>>(`${BASE}/${id}/reactivate`),

  adjustPoints: (id: string, points: number, reason: string) =>
    api.patch<ApiResponse<Jambaar>>(`${BASE}/${id}/points`, {
      points,
      reason,
    }),

  getDonationHistory: (id: string) =>
    api.get(`${BASE}/${id}/donations`),
};
