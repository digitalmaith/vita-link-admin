// src/app/(dashboard)/reports/page.tsx
import type { Metadata } from "next";
import { DonationTrendChart } from "@/components/reports/DonationTrendChart";
import { ReportsHeader } from "@/components/reports/ReportsHeader";
import { FilterBar } from "@/components/shared/FilterBar";

export const metadata: Metadata = { title: "Rapports & Statistiques" };

export default function ReportsPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <ReportsHeader />
      <div className="bg-card border rounded-xl p-4 shadow-sm">
        <FilterBar showRegion showDateRange />
      </div>
      <DonationTrendChart />
    </div>
  );
}