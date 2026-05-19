import type { DashboardKPIs } from "@/types";

/**
 * Normalise les données backend vers un format UI stable
 */
export type DashboardUIKPIs = {
  livesSaved: number;
  avgResponseTime: string;
  criticalRegions: number;
  donors: number;
  structures: number;
  totalDonations?: number;
  totalAlerts?: number;
};

export function adaptDashboardKPIs(
  kpis: DashboardKPIs
): DashboardUIKPIs {
  return {
    livesSaved: kpis.livesSavedEstimate ?? 0,

    avgResponseTime: kpis.avgResponseTimeMinutes
      ? `${kpis.avgResponseTimeMinutes} min`
      : "—",

    criticalRegions: kpis.criticalStocksCount ?? 0,

    donors: kpis.totalDonors ?? 0,

    structures: kpis.totalStructures ?? 0,
  };
}