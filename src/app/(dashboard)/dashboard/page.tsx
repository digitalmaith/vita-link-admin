import type { Metadata } from "next";
import { KPISection } from "@/components/dashboard/KPISection";
import { AlertsPanel } from "@/components/dashboard/AlertsPanel";
import { RegionHeatmap } from "@/components/dashboard/RegionHeatmap";
import { FilterBar } from "@/components/shared/FilterBar";
import { DonationTrendChart } from "@/components/reports/DonationTrendChart";
import { ChartAreaInteractive } from "@/components/dashboard/ChartAreaInteractive";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Filtres globaux */}
      <FilterBar showRegion showBloodGroup showDateRange />

      {/* KPIs */}
      <KPISection />

      {/* Heatmap + Alertes en colonnes */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <RegionHeatmap />
        </div>
        <div>
          <AlertsPanel />
        </div>
      </div>
      <FilterBar showRegion showDateRange />
      <ChartAreaInteractive />
    </div>
  );
}
