import { useQuery } from "@tanstack/react-query";
import { dashboardService, type DashboardFilters } from "@/services/dashboard.service";

export function useDashboardKPIs(filters?: DashboardFilters) {
  return useQuery({
    queryKey: ["dashboard", "kpis", filters],
    queryFn: () => dashboardService.getKPIs(filters),
    refetchInterval: 60 * 1000,
  });
}

export function useMonthlyStats(filters?: DashboardFilters) {
  return useQuery({
    queryKey: ["dashboard", "monthly-stats", filters],
    queryFn: () => dashboardService.getMonthlyStats(filters),
    refetchInterval: 5 * 60 * 1000,
  });
}

export function useRegionStats(filters?: DashboardFilters) {
  return useQuery({
    queryKey: ["dashboard", "region-stats", filters],
    queryFn: () => dashboardService.getRegionStats(filters),
    refetchInterval: 5 * 60 * 1000,
  });
}