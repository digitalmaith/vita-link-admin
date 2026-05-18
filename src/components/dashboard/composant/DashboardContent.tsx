"use client";

import { FilterBar } from "@/components/shared/FilterBar";
import { ChartAreaInteractive } from "@/components/dashboard/ChartAreaInteractive";
import { DashboardKPISection } from "./DashboardKPISection";
import { TrendsAndAlertsSection } from "../sections/TrendsAndAlertsSection";
import { HeatmapAndFiltersSection } from "../sections/HeatmapAndFiltersSection";

export function DashboardContent() {
  return (
    <>
      {/* Filtres globaux */}
      <FilterBar showRegion showBloodGroup showDateRange />

      {/* KPIs */}
      <DashboardKPISection />

      {/* Graphique des tendances + Alertes */}
      <TrendsAndAlertsSection />

      {/* Heatmap + Filtres additionnels */}
      <HeatmapAndFiltersSection />

      {/* Graphique interactif */}
      <ChartAreaInteractive />
    </>
  );
}