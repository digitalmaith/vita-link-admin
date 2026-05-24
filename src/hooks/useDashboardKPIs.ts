import { useQuery } from "@tanstack/react-query";
import { dashboardService, type DashboardFilters } from "@/services/dashboard.service";
import type { Region, BloodGroup } from "@/types";

export function useDashboardKPIs(filters?: DashboardFilters) {
  return useQuery({
    queryKey: ["dashboard", "kpis", filters],
    queryFn: () => dashboardService.getKPIs(filters),
    refetchInterval: 60 * 1000, // 1 minute
  });
}

// ✅ Corrigé : premier paramètre = year (number), deuxième = filters (optionnel)
export function useMonthlyStats(year?: number, filters?: DashboardFilters) {
  return useQuery({
    queryKey: ["dashboard", "monthly-stats", year, filters],
    queryFn: () => dashboardService.getChartData({ 
      year: year || new Date().getFullYear(),
      region: filters?.region,
      bloodGroup: filters?.bloodGroup,
    }),
    refetchInterval: 5 * 60 * 1000, // 5 minutes
  });
}

export function useRegionStats(filters?: DashboardFilters) {
  return useQuery({
    queryKey: ["dashboard", "region-stats", filters],
    queryFn: () => dashboardService.getRegionStats(filters),
    refetchInterval: 5 * 60 * 1000, // 5 minutes
  });
}

export function useChartData(params?: {
  year?: number;
  region?: Region;
  bloodGroup?: BloodGroup;
}) {
  return useQuery({
    queryKey: ["dashboard", "chart", params],
    queryFn: () => dashboardService.getChartData(params),
    refetchInterval: 5 * 60 * 1000, // 5 minutes
  });
}