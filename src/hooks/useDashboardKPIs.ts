import { useQuery } from "@tanstack/react-query";
import { dashboardService, type DashboardFilters } from "@/services/dashboard.service";
import type { Region, BloodGroup } from "@/types";

export function useDashboardKPIs(filters?: DashboardFilters) {
  return useQuery({
    queryKey: ["dashboard", "kpis", filters],
    queryFn: () => dashboardService.getKPIs(filters),
    refetchInterval: 60 * 1000,
  });
}

export function useMonthlyStats(year?: number, filters?: DashboardFilters) {
  return useQuery({
    queryKey: ["dashboard", "monthly-stats", year, filters],
    queryFn: () => dashboardService.getChartData({ 
      year,
      region: filters?.region,      // ✅ Déjà typé comme Region | undefined
      bloodGroup: filters?.bloodGroup, // ✅ Déjà typé comme BloodGroup | undefined
    }),
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

// ✅ Corrigé : utiliser les types stricts
export function useChartData(params?: {
  year?: number;
  region?: Region;      // ✅ Region au lieu de string
  bloodGroup?: BloodGroup; // ✅ BloodGroup au lieu de string
}) {
  return useQuery({
    queryKey: ["dashboard", "chart", params],
    queryFn: () => dashboardService.getChartData(params),
    refetchInterval: 5 * 60 * 1000,
  });
}