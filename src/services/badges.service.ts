import { api } from "@/lib/api/client";

export interface Badge {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  criteria: string;
  isSeasonal: boolean;
  season: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface BadgesResponse {
  success: boolean;
  badges: Badge[];
}

export interface CreateBadgePayload {
  name: string;
  description: string;
  iconUrl: string;
  criteria: string;
  isSeasonal: boolean;
  season?: string;
}

export const badgesService = {
  getAll: () =>
    api.get<BadgesResponse>("/badges"),

  create: (data: CreateBadgePayload) =>
    api.post<{ success: boolean; badge: Badge }>("/badges", data),

  update: (id: string, data: Partial<CreateBadgePayload>) =>
    api.patch<{ success: boolean; badge: Badge }>(`/badges/${id}`, data),

  deactivate: (id: string) =>
    api.delete<{ success: boolean; badge: Badge }>(`/badges/${id}`),

  // ✅ Ajouter cette méthode pour la réactivation
  reactivate: (id: string) =>
    api.patch<{ success: boolean; badge: Badge }>(`/badges/${id}/reactivate`),
};