"use client";

import { FilterBar } from "@/components/shared/FilterBar";
import { ChartAreaInteractive } from "@/components/dashboard/ChartAreaInteractive";
import { DashboardKPISection } from "./DashboardKPISection";
import { TrendsAndAlertsSection } from "../sections/TrendsAndAlertsSection";
import { HeatmapAndFiltersSection } from "../sections/HeatmapAndFiltersSection";
import { StructuresMap } from "../StructuresMap";

export function DashboardContent() {
  return (
    <>
      {/* Filtres globaux */}
      {/* <FilterBar showRegion showBloodGroup showDateRange /> */}
      {/* carte map */}
      <StructuresMap />

      {/* KPIs */}
      <DashboardKPISection />

      

      {/* Heatmap + Filtres additionnels */}
      <HeatmapAndFiltersSection />


      {/* Graphique des tendances + Alertes */}
      {/* <TrendsAndAlertsSection /> */}

      
      {/* Graphique interactif */}
      <ChartAreaInteractive />
    </>
  );
}