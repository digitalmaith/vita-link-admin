"use client";

import { KPISection } from "@/components/dashboard/kpi/KPISection";
import { useDashboardKPIs } from "@/hooks/useDashboardKPIs";
import { adaptDashboardKPIs } from "@/adapters/dashboard.adapter";
import { Heart, Clock, AlertTriangle, Users, Hospital } from "lucide-react";
import type { KPICardProps, KPIVariant } from "@/components/dashboard/kpi/kpi-types";

export function DashboardKPISection() {
  const { data: rawKpis, isLoading, refetch } = useDashboardKPIs();
  const kpis = rawKpis ? adaptDashboardKPIs(rawKpis) : null;

  const cards: KPICardProps[] = [
    {
      title: "Vies sauvées",
      value: kpis?.livesSaved ?? 0,
      icon: Heart,
      description: "Estimation des vies sauvées grâce aux dons",
      variant: "success" as KPIVariant,
      trend: "up",
      trendValue: "+12%",
    },
    {
      title: "Temps de réponse",
      value: kpis?.avgResponseTime ?? "—",
      icon: Clock,
      description: "Délai moyen de prise en charge",
      variant: "info" as KPIVariant,
      trend: "down",
      trendValue: "-2.5min",
    },
    {
      title: "Régions critiques",
      value: kpis?.criticalRegions ?? 0,
      icon: AlertTriangle,
      description: "Zones en pénurie de sang",
      variant: ((kpis?.criticalRegions ?? 0) > 3 ? "danger" : "warning") as KPIVariant,
      trend: ((kpis?.criticalRegions ?? 0) > 3 ? "up" : "down") as "up" | "down",
      trendValue: ((kpis?.criticalRegions ?? 0) > 3 ? "+2" : "-1"),
    },
    {
      title: "Donneurs actifs",
      value: kpis?.donors ?? 0,
      icon: Users,
      description: "Jambaars actifs ce mois",
      variant: "default" as KPIVariant,
      trend: "up",
      trendValue: "+156",
    },
    {
      title: "Structures",
      value: kpis?.structures ?? 0,
      icon: Hospital,
      description: "Structures de santé partenaires",
      variant: "default" as KPIVariant,
    },
  ];

  return (
    <KPISection
      cards={cards}
      isLoading={isLoading}
      onRefresh={() => refetch?.()}
      summary={{
        coverageRate: 87,
        monthlyGoal: 1200,
        progress: 72,
      }}
    />
  );
}