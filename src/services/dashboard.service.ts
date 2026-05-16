import type { DashboardKPIs } from "@/types";
import { api } from "@/lib/api/client";

export const dashboardService = {
  async getKPIs(): Promise<DashboardKPIs> {
    return api.get<DashboardKPIs>("/admin/dashboard").then(
      (res: any) => res.kpis
    );
  },
};