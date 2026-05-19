import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboard.service";

export function useDashboardKPIs() {
  return useQuery({
    queryKey: ["dashboard", "kpis"],
    queryFn: dashboardService.getKPIs,
    refetchInterval: 60 * 1000,
  });
}