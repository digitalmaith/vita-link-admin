import { api } from "@/lib/api/client";

export interface DashboardKPIs {
  totalDonors: number;
  totalStructures: number;
  totalDonations: number;
  totalAlerts: number;
  avgResponseTimeMinutes: number | null;
  criticalStocksCount: number;
  livesSavedEstimate: number;
  pendingStructures: number;
}

export interface MonthlyStats {
  month: string;
  donations: number;
  alerts: number;
  livesSaved: number;
}

export interface RegionStats {
  region: string;
  total: number;
  verified: number;
  pending: number;
}

export interface DashboardResponse {
  success: boolean;
  kpis: DashboardKPIs;
}

export interface MonthlyStatsResponse {
  success: boolean;
  data: MonthlyStats[];
}

export interface RegionStatsResponse {
  success: boolean;
  data: RegionStats[];
}

export const dashboardService = {
  getKPIs: () =>
    api.get<DashboardResponse>("/admin/dashboard"),

  getMonthlyStats: (year: number) =>
    api.get<MonthlyStatsResponse>("/admin/stats/monthly", {
      params: { year },
    }),

  getRegionStats: () =>
    api.get<RegionStatsResponse>("/admin/stats/regions"),
};