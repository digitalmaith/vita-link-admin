// =============================================
// VITA-LINK ADMIN — Dashboard Service
// =============================================

import { api } from "@/lib/api/client";
import type { DashboardKPIs, HeatmapPoint, Alert, Region, BloodGroup } from "@/types";

export interface DashboardFilters {
  region?: Region;
  bloodGroup?: BloodGroup;
  dateFrom?: string;
  dateTo?: string;
}

export const dashboardService = {
  getKPIs: (filters?: DashboardFilters) =>
    api.get<DashboardKPIs>("/dashboard/kpis", { params: filters }),

  getHeatmapData: (filters?: DashboardFilters) =>
    api.get<HeatmapPoint[]>("/dashboard/heatmap", { params: filters }),

  getSystemAlerts: () =>
    api.get<Alert[]>("/dashboard/alerts"),

  getRecentAlerts: (limit = 10) =>
    api.get<Alert[]>("/alerts", { params: { limit, sort: "createdAt:desc" } }),
};
