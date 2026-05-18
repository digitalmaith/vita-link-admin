// =============================================
// VITA-LINK ADMIN — Jambaars Service
// =============================================

import { api } from "@/lib/api/client";
import {
  MOCK_JAMBAARS,
  MOCK_DONATION_HISTORY,
  paginateMock,
} from "@/lib/mock/jambaars.mock";
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

// ⚙️  Mettre USE_MOCK=true pour utiliser les données locales
//     quand le backend n'est pas encore déployé.
const USE_MOCK = true;

// Délai simulé pour imiter un vrai appel réseau (ms)
const MOCK_DELAY = 400;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const BASE = "/users"; // endpoint backend réel

export const jambaarService = {
  getAll: async (
    filters?: JambaarFilters & { sort?: string; limit?: number },
    page = 1,
    limit = 20
  ): Promise<PaginatedResponse<Jambaar>> => {
    if (USE_MOCK) {
      await sleep(MOCK_DELAY);
      let results = [...MOCK_JAMBAARS];

      // Appliquer les filtres
      if (filters?.search) {
        const q = filters.search.toLowerCase();
        results = results.filter(
          (j) =>
            j.firstName.toLowerCase().includes(q) ||
            j.lastName.toLowerCase().includes(q) ||
            j.phone.includes(q) ||
            j.email?.toLowerCase().includes(q)
        );
      }
      if (filters?.bloodGroup) {
        results = results.filter((j) => j.bloodGroup === filters.bloodGroup);
      }
      if (filters?.region) {
        results = results.filter((j) => j.region === filters.region);
      }
      if (filters?.status) {
        results = results.filter((j) => j.status === filters.status);
      }
      if (filters?.grade) {
        results = results.filter((j) => j.grade === filters.grade);
      }

      // Trier par points si demandé
      if (filters?.sort === "points") {
        results.sort((a, b) => b.points - a.points);
      }

      const pageLimit = filters?.limit ?? limit;
      return paginateMock(results, page, pageLimit);
    }

    // --- Appel réel backend ---
    return api.get<PaginatedResponse<Jambaar>>(BASE, {
      params: {
        ...filters,
        page,
        limit,
      },
    });
  },

  getById: async (id: string): Promise<ApiResponse<Jambaar>> => {
    if (USE_MOCK) {
      await sleep(MOCK_DELAY);
      const jambaar = MOCK_JAMBAARS.find((j) => j.id === id);
      if (!jambaar) throw new Error("Jambaar introuvable");
      return { data: jambaar, success: true };
    }
    return api.get<ApiResponse<Jambaar>>(`${BASE}/${id}`);
  },

  suspend: async (
    id: string,
    reason: string,
    durationDays?: number
  ): Promise<ApiResponse<Jambaar>> => {
    if (USE_MOCK) {
      await sleep(MOCK_DELAY);
      const jambaar = MOCK_JAMBAARS.find((j) => j.id === id);
      if (!jambaar) throw new Error("Jambaar introuvable");
      jambaar.status = "SUSPENDED";
      return { data: jambaar, success: true, message: "Jambaar suspendu avec succès" };
    }
    return api.patch<ApiResponse<Jambaar>>(`${BASE}/${id}/suspend`, {
      reason,
      durationDays,
    });
  },

  reactivate: async (id: string): Promise<ApiResponse<Jambaar>> => {
    if (USE_MOCK) {
      await sleep(MOCK_DELAY);
      const jambaar = MOCK_JAMBAARS.find((j) => j.id === id);
      if (!jambaar) throw new Error("Jambaar introuvable");
      jambaar.status = "ACTIVE";
      return { data: jambaar, success: true, message: "Jambaar réactivé avec succès" };
    }
    return api.patch<ApiResponse<Jambaar>>(`${BASE}/${id}/reactivate`);
  },

  adjustPoints: async (
    id: string,
    points: number,
    reason: string
  ): Promise<ApiResponse<Jambaar>> => {
    if (USE_MOCK) {
      await sleep(MOCK_DELAY);
      const jambaar = MOCK_JAMBAARS.find((j) => j.id === id);
      if (!jambaar) throw new Error("Jambaar introuvable");
      jambaar.points = Math.max(0, jambaar.points + points);
      // Recalculer le grade selon les points
      if (jambaar.points >= 1500) jambaar.grade = "AMBASSADEUR";
      else if (jambaar.points >= 600) jambaar.grade = "SENTINELLE";
      else jambaar.grade = "ASPIRANT";
      return { data: jambaar, success: true, message: `Points ajustés : ${points > 0 ? "+" : ""}${points} pts` };
    }
    return api.patch<ApiResponse<Jambaar>>(`${BASE}/${id}/points`, {
      points,
      reason,
    });
  },

  getDonationHistory: async (id: string) => {
    if (USE_MOCK) {
      await sleep(MOCK_DELAY);
      const history = MOCK_DONATION_HISTORY[id] ?? [];
      return { data: history, success: true };
    }
    return api.get(`${BASE}/${id}/donations`);
  },
};
