import { api } from "@/lib/api/client";
import { GlobalFilters, HeatmapDataPoint, Alert } from "@/types";

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

export interface RecentAlertsResponse {
  success: boolean;
  data: Alert[];
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

  getHeatmapData: async (filters?: GlobalFilters): Promise<HeatmapDataPoint[]> => {
    try {
      const response: any = await api.get("/admin/stats/heatmap", {
        params: filters,
      });
      return response.data || response;
    } catch {
      const response: any = await api.get("/admin/stats/regions");
      const regionStats = response.data || response;
      
      return regionStats.map((stat: any) => ({
        region: stat.region,
        demandLevel: stat.demandLevel || 0
      }));
    }
  },

  // ✅ Ajoutez cette méthode
  getRecentAlerts: async (limit?: number): Promise<Alert[]> => {
    try {
      const response: any = await api.get("/admin/alerts/recent", {
        params: { limit: limit || 5 }
      });
      return response.data || response;
    } catch (error) {
      console.error("Erreur lors du chargement des alertes récentes:", error);
      return [];
    }
  }
};