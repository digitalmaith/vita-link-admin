"use client";

import { KPISection } from "@/components/dashboard/kpi/KPISection";
import { useDashboardKPIs } from "@/hooks/useDashboardKPIs";
import { adaptDashboardKPIs } from "@/adapters/dashboard.adapter";
import { Heart, Clock, AlertTriangle, Users, Hospital, Hourglass } from "lucide-react";
import type { KPICardProps, KPIVariant } from "@/types/kpi-types";

export function DashboardKPISection() {
  const { data: rawKpis, isLoading, refetch } = useDashboardKPIs();
  const kpis = rawKpis?.kpis ? adaptDashboardKPIs(rawKpis.kpis) : null;
  const raw = rawKpis?.kpis;

  // Calcul dynamique du summary depuis les KPIs réels
  const totalStructures = raw?.totalStructures ?? 0;
  const totalDonors = raw?.totalDonors ?? 0;
  const totalDonations = raw?.totalDonations ?? 0;
  const pendingStructures = raw?.pendingStructures ?? 0;

  // Taux de couverture = structures vérifiées / total structures * 100
  const verifiedStructures = totalStructures - pendingStructures;
  const coverageRate = totalStructures > 0
    ? Math.round((verifiedStructures / totalStructures) * 100)
    : 0;

  // Objectif mensuel basé sur le nombre de donneurs (1 don par donneur par mois)
  const monthlyGoal = totalDonors > 0 ? totalDonors : 0;

  // Progression = dons réalisés / objectif mensuel * 100
  const progress = monthlyGoal > 0
    ? Math.min(Math.round((totalDonations / monthlyGoal) * 100), 100)
    : 0;

  const cards: KPICardProps[] = [
    {
      title: "Vies sauvées",
      value: kpis?.livesSaved ?? 0,
      icon: Heart,
      description: "Estimation des vies sauvées",
      variant: "success" as KPIVariant,
      trend: (raw?.livesSavedEstimate ?? 0) > 0 ? "up" : "stable",
      trendValue: raw?.livesSavedEstimate
        ? `+${raw.livesSavedEstimate}`
        : "0",
    },
    {
      title: "Régions critiques",
      value: kpis?.criticalRegions ?? 0,
      icon: AlertTriangle,
      description: "Zones en pénurie de sang",
      variant: ((raw?.criticalStocksCount ?? 0) > 3 ? "danger" : "warning") as KPIVariant,
      trend: ((raw?.criticalStocksCount ?? 0) > 3 ? "up" : "down") as "up" | "down",
      trendValue: `${raw?.criticalStocksCount ?? 0}`,
    },
    {
  title: "Jambaars",
  value: kpis?.donors ?? 0,
  icon: Users,
  description: "Donneurs inscrits sur la plateforme",
  variant: (totalDonors > 100 ? "success" : "info") as KPIVariant,
  trend: (raw?.totalDonors ?? 0) > 0 ? "up" : "stable",
  trendValue: `${raw?.totalDonors ?? 0}`,
    },
    {
      title: "Structures",
      value: kpis?.structures ?? 0,
      icon: Hospital,
      description: "Structures de santé certifiées",
      variant: (verifiedStructures > 0 ? "success" : "info") as KPIVariant,
      trend: verifiedStructures > 0 ? "up" : "stable",
      trendValue: `${verifiedStructures} `,
    },
    {
      title: "En attente",
      value: pendingStructures ?? "—",
      icon: Clock,
      description: "Structures en cours de vérification",
      variant: (pendingStructures > 3 ? "danger" : pendingStructures > 0 ? "warning" : "info") as KPIVariant,
      trend: pendingStructures > 0 ? "up" : "stable",
      trendValue: `${pendingStructures}`,
    },
  ];

  return (
    <KPISection
      cards={cards}
      isLoading={isLoading}
      onRefresh={() => refetch?.()}
      summary={{
        coverageRate,
        monthlyGoal,
        progress,
      }}
    />
  );
}