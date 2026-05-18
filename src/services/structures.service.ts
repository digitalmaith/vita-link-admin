import { api } from "@/lib/api/client";

export interface StructureCount {
  staffMembers: number;
  alerts: number;
  donations: number;
}

export interface HealthStructure {
  id: string;
  name: string;
  registrationNumber: string;
  address: string;
  latitude: number;
  longitude: number;
  phone: string;
  email: string;
  isVerified: boolean;
  status: "VERIFIED" | "PENDING" | "SUSPENDED" | "REJECTED";
  verifiedAt: string | null;
  createdAt: string;
  _count: StructureCount;
}

export interface StructuresResponse {
  success: boolean;
  structures: HealthStructure[];
}

export interface StructuresFilters {
  status?: string;
  search?: string;
}

export const structuresService = {
  getAll: (filters?: StructuresFilters) =>
    api.get<StructuresResponse>("/health-structures", { params: filters }),

  getById: (id: string) =>
    api.get<{ success: boolean; structure: HealthStructure }>(`/health-structures/${id}`),

  verify: (id: string) =>
    api.patch<{ success: boolean; structure: HealthStructure }>(`/admin/health-structures/${id}/verify`),

  suspend: (id: string, reason: string) =>
    api.patch<{ success: boolean; structure: HealthStructure }>(`/admin/health-structures/${id}/suspend`, { reason }),

  reject: (id: string, reason: string) =>
    api.patch<{ success: boolean; structure: HealthStructure }>(`/admin/health-structures/${id}/reject`, { reason }),

  reactivate: (id: string) =>
    api.patch<{ success: boolean; structure: HealthStructure }>(`/admin/health-structures/${id}/verify`),
};
