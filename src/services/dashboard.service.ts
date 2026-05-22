import { api } from "@/lib/api/client";
import type { DashboardKPIs, Alert, Region, BloodGroup , HeatmapPoint, RegionStats} from "@/types";

export interface DashboardFilters {
  region?: Region;
  bloodGroup?: BloodGroup;
  dateFrom?: string;
  dateTo?: string;
}

export const dashboardService = {
  async getKPIs(filters?: DashboardFilters): Promise<DashboardKPIs> {
    const res = await api.get<{ success: boolean; kpis: DashboardKPIs }>(
      "/admin/dashboard",
      { params: filters }
    );
    return res.kpis;
  },

  async getMonthlyStats(filters?: DashboardFilters): Promise<any[]> {
    try {
      const res = await api.get<{ success: boolean; data: any[] } | any[]>(
        "/admin/stats/monthly",
        { params: filters }
      );
      return Array.isArray(res) ? res : (res as any).data || (res as any).stats || [];
    } catch (error) {
      console.error("Erreur lors de la récupération des stats mensuelles :", error);
      return [];
    }
  },

  async getRegionStats(filters?: DashboardFilters): Promise<any[]> {
    try {
      const res = await api.get<{ success: boolean; data: any[] } | any[]>(
        "/admin/stats/regions",
        { params: filters }
      );
      return Array.isArray(res) ? res : (res as any).data || (res as any).stats || [];
    } catch (error) {
      console.error("Erreur lors de la récupération des stats régionales :", error);
      return [];
    }
  },

  getHeatmapData: async (filters?: DashboardFilters): Promise<HeatmapPoint[]> => {
    const res = await api.get<{ data: HeatmapPoint[] }>("/dashboard/heatmap", {
      params: filters,
    });
    return res.data;
  },

  getSystemAlerts: () =>
    api.get<Alert[]>("/dashboard/alerts"),

  getRecentAlerts: (limit = 10) =>
    api.get<Alert[]>("/alerts", {
      params: { limit, sort: "createdAt:desc" },
    }),

  async getRegionsStats(filters?: any): Promise<RegionStats[]> {
    const res = await api.get<{ success: boolean; data: RegionStats[] }>(
      '/admin/stats/regions', 
      { params: filters }
    );
    return res.data;
  }
};