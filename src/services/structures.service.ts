// =============================================
// VITA-LINK ADMIN — Structures Service
// Principe S : responsabilité unique = opérations CRUD sur les structures
// Principe D : dépend de l'abstraction `api`, pas d'axios
// =============================================

import { api } from "@/lib/api/client";
import type {
  HealthStructure,
  ApiResponse,
  PaginatedResponse,
  GlobalFilters,
  Status,
} from "@/types";

export interface StructuresFilters extends GlobalFilters {
  status?: Status;
}

const BASE = "/structures";

export const structuresService = {
  /**
   * Récupérer toutes les structures avec pagination et filtres
   */
  getAll: (filters?: StructuresFilters, page = 1, limit = 20) =>
    api.get<PaginatedResponse<HealthStructure>>(BASE, {
      params: { ...filters, page, limit },
    }),

  /**
   * Récupérer une structure par ID
   */
  getById: (id: string) =>
    api.get<ApiResponse<HealthStructure>>(`${BASE}/${id}`),

  /**
   * Valider (certifier) une structure
   */
  validate: (id: string) =>
    api.patch<ApiResponse<HealthStructure>>(`${BASE}/${id}/validate`),

  /**
   * Rejeter une structure avec motif
   */
  reject: (id: string, reason: string) =>
    api.patch<ApiResponse<HealthStructure>>(`${BASE}/${id}/reject`, { reason }),

  /**
   * Suspendre une structure
   */
  suspend: (id: string, reason: string) =>
    api.patch<ApiResponse<HealthStructure>>(`${BASE}/${id}/suspend`, { reason }),

  /**
   * Récupérer les logs d'activité d'une structure
   */
  getActivityLogs: (id: string, page = 1, limit = 50) =>
    api.get(`${BASE}/${id}/logs`, { params: { page, limit } }),
};
