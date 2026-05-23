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

interface RawJambaarUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  bloodType: string;
  isActive: boolean;
  isAvailable: boolean;
  createdAt: string;
  jambaarsProfile: {
    totalPoints: number;
    currentGrade: string;
    donationCount: number;
    noShowCount: number;
    city: string | null;
  };
}

interface RawApiResponse {
  success: boolean;
  users: RawJambaarUser[];
  total: number;
}

// "O-" → "O_NEG" | "A+" → "A_POS"
function serializeBloodGroup(bg: BloodGroup): string {
  return bg.replace("+", "_POS").replace("-", "_NEG");
}

// "O_NEG" → "O-" | "A_POS" → "A+"
function parseBloodType(raw: string): Jambaar["bloodGroup"] {
  return raw.replace("_POS", "+").replace("_NEG", "-") as Jambaar["bloodGroup"];
}

const GRADE_MAP: Record<string, Jambaar["grade"]> = {
  ASPIRANT: "ASPIRANT",
  SENTINELLE: "SENTINELLE",
  AMBASSADEUR: "AMBASSADEUR",

};

function mapUser(u: RawJambaarUser): Jambaar {
  const totalDonations = u.jambaarsProfile?.donationCount ?? 0;
  const noShow = u.jambaarsProfile?.noShowCount ?? 0;
  const total = totalDonations + noShow;

  return {
    id: u.id,
    firstName: u.firstName,
    lastName: u.lastName,
    email: u.email,
    phone: u.phone,
    bloodGroup: parseBloodType(u.bloodType),
    region: "Dakar",
    city: u.jambaarsProfile?.city ?? "—",
    grade: GRADE_MAP[u.jambaarsProfile?.currentGrade] ?? "ASPIRANT",
    status: u.isActive ? "ACTIVE" : "SUSPENDED",
    points: u.jambaarsProfile?.totalPoints ?? 0,
    totalDonations,
    commitmentRate: total > 0 ? Math.round((totalDonations / total) * 100) : 0,
    createdAt: u.createdAt,
  };
}

const BASE = "/admin/users";

export const jambaarService = {
  getAll: async (
    filters?: JambaarFilters,
    page = 1,
    limit = 20
  ): Promise<PaginatedResponse<Jambaar>> => {
    const params: Record<string, unknown> = {
      role: "DONOR",
      page,
      limit,
    };

    if (filters?.bloodGroup) {
      params.bloodType = serializeBloodGroup(filters.bloodGroup); 
    }
    // if (filters?.region)    params.region = filters.region;
    if (filters?.status)    params.status = filters.status;
    // if (filters?.search)    params.search = filters.search;
    // if (filters?.grade)     params.grade  = filters.grade;

    const raw = await api.get<RawApiResponse>(BASE, { params });

    return {
      data: raw.users.map(mapUser),
      total: raw.total,
      page,
      limit,
      totalPages: Math.ceil(raw.total / limit),
    };
  },

  getById: (id: string) =>
    api.get<ApiResponse<Jambaar>>(`${BASE}/${id}`),

  suspend: (id: string, reason?: string) =>
    api.patch<ApiResponse<Jambaar>>(`${BASE}/${id}/suspend`, reason ? { reason } : {}),

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