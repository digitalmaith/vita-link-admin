import type { Metadata } from "next";
import { DonationTrendChart } from "@/components/reports/DonationTrendChart";
import { ExportPanel } from "@/components/reports/ExportPanel";
import { FilterBar } from "@/components/shared/FilterBar";

export const metadata: Metadata = { title: "Rapports & Statistiques" };

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Rapports & Statistiques</h2>
          <p className="text-sm text-muted-foreground">
            Données d'aide à la décision pour le Ministère de la Santé
          </p>
        </div>
        <ExportPanel />
      </div>

      <FilterBar showRegion showDateRange />
      <DonationTrendChart />
    </div>
  );
}
