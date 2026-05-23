// DashboardKPISection.tsx
import { KPISection } from "@/components/dashboard/kpi/KPISection";
import { useDashboardKPIs } from "@/hooks/useDashboardKPIs";
import { adaptDashboardKPIs } from "@/adapters/dashboard.adapter";
import { Heart, Clock, AlertTriangle, Users, Hospital, Activity } from "lucide-react";
import type { KPICardProps, KPIVariant } from "@/types/kpi-types";
import { useMemo } from "react";

export function DashboardKPISection() {
  const { data: rawKpis, isLoading, refetch } = useDashboardKPIs();
  const kpis = rawKpis ? adaptDashboardKPIs(rawKpis) : null;

  const cards: KPICardProps[] = useMemo(() => {
    if (!kpis) return [];

    return [
      {
        title: "Vies sauvées",
        value: kpis.livesSaved,
        icon: Heart,
        variant: "success" as KPIVariant,
        trend: kpis.livesSavedTrend >= 0 ? "up" : "down",
        trendValue: `${kpis.livesSavedTrend >= 0 ? "+" : ""}${kpis.livesSavedTrend}%`,
        
      },
      {
        title: "Temps de réponse",
        value: kpis.avgResponseTimeFormatted,
        icon: Clock,
        variant: getResponseTimeVariant(kpis.avgResponseTime),
        trend: kpis.responseTimeTrend <= 0 ? "down" : "up",
        trendValue: `${kpis.responseTimeTrend > 0 ? "+" : ""}${kpis.responseTimeTrend} min`,
        
      },
      {
        title: "Donneurs actifs",
        value: kpis.donors,
        icon: Users,
        variant: "default" as KPIVariant,
        trend: kpis.donorsTrend >= 0 ? "up" : "down",
        trendValue: `${kpis.donorsTrend >= 0 ? "+" : ""}${kpis.donorsTrend}%`,
      },
      {
        title: "Structures",
        value: kpis.structures,
        icon: Hospital,
        variant: getStructuresVariant(kpis.criticalRegions),
        trend: kpis.structuresTrend >= 0 ? "up" : "down",
        trendValue: `${kpis.structuresTrend >= 0 ? "+" : ""}${kpis.structuresTrend}%`,
      },
      // {
      //   title: "Alertes en cours",
      //   value: kpis.openAlerts,
      //   icon: AlertTriangle,
      //   variant: getAlertsVariant(kpis.openAlerts),
      //   trend: kpis.openAlertsTrend <= 0 ? "down" : "up",
      //   trendValue: `${kpis.openAlertsTrend >= 0 ? "+" : ""}${kpis.openAlertsTrend}%`,
      // },
    ];
  }, [kpis]);

  const summary = useMemo(() => {
    if (!kpis) return undefined;
    
    return {
      coverageRate: kpis.coverageRate,
      monthlyGoal: kpis.monthlyGoal,
      progress: kpis.monthlyProgress,
      lastUpdated: kpis.lastUpdated,
    };
  }, [kpis]);

  return (
    <KPISection
      cards={cards}
      isLoading={isLoading}
      onRefresh={() => refetch?.()}
      summary={summary}
    />
  );
}

// Fonctions utilitaires pour les variants
function getResponseTimeVariant(minutes: number): KPIVariant {
  if (minutes <= 15) return "success";
  if (minutes <= 30) return "info";
  if (minutes <= 60) return "warning";
  return "danger";
}

function getStructuresVariant(criticalRegions: number): KPIVariant {
  if (criticalRegions === 0) return "success";
  if (criticalRegions <= 2) return "info";
  if (criticalRegions <= 5) return "warning";
  return "danger";
}

function getAlertsVariant(openAlerts: number): KPIVariant {
  if (openAlerts === 0) return "success";
  if (openAlerts <= 5) return "info";
  if (openAlerts <= 10) return "warning";
  return "danger";
}