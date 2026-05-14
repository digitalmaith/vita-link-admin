import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboard.service";
import { useFiltersStore } from "@/store/filters.store";

export function useDashboardKPIs() {
  const { filters } = useFiltersStore();

  return useQuery({
    queryKey: ["dashboard", "kpis", filters],
    queryFn: () =>
      dashboardService.getKPIs({
        region: filters.region,
        bloodGroup: filters.bloodGroup,
        dateFrom: filters.dateFrom,
        dateTo: filters.dateTo,
      }),
    refetchInterval: 60 * 1000, // Rafraîchissement auto toutes les 60s
  });
}
