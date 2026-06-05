import { api } from "@/lib/api/client";

export type DonationDayStatus =
  | "DRAFT"
  | "PUBLISHED"
  | "CANCELLED"
  | "COMPLETED";

export interface DonationDay {
  id: string;
  title: string;
  description?: string;

  scheduledDate: string;
  startTime: string;
  endTime: string;

  address: string;
  latitude?: number;
  longitude?: number;

  status: DonationDayStatus;

  targetDonors?: number;
  bloodTypesNeeded?: string[];

  healthStructure?: {
    id: string;
    name: string;
    address: string;
  };

  createdAt: string;
}

export interface DonationDayFilters {
  page?: number;
  limit?: number;
  status?: DonationDayStatus;
  startDate?: string;
  endDate?: string;
}

export interface DonationDaysResponse {
  success: boolean;
  data: DonationDay[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface SuspendDonationDayResponse {
  success: boolean;
  message?: string;
  data?: DonationDay;
}

const BASE = "/donation-days/admin";

export const donationDayService = {
  getAll(
    filters?: DonationDayFilters
  ): Promise<DonationDaysResponse> {
    return api.get<DonationDaysResponse>(`${BASE}/all`, {
      params: filters,
    });
  },

  suspend(
    id: string
  ): Promise<SuspendDonationDayResponse> {
    return api.patch<SuspendDonationDayResponse>(
      `${BASE}/${id}/suspend`
    );
  },
};