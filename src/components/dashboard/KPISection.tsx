"use client";

import { adaptDashboardKPIs } from "@/adapters/dashboard.adapter";
import { useDashboardKPIs } from "@/hooks/useDashboardKPIs";
import {
  Heart,
  Clock,
  AlertTriangle,
  Users,
  Hospital,
} from "lucide-react";

import type { KPIVariant } from "./KPICard";
import { KPICard } from "./KPICard";

export function KPISection() {
  const { data: rawKpis, isLoading } = useDashboardKPIs();

  const kpis = rawKpis ? adaptDashboardKPIs(rawKpis) : null;

  const cards = [
  {
    title: "Vies sauvées",
    value: kpis?.livesSaved ?? 0,
    icon: Heart,
    description: "Estimation des vies sauvées",
    variant: "success" as const,
  },
  {
    title: "Temps de réponse",
    value: kpis?.avgResponseTime ?? "—",
    icon: Clock,
    description: "Temps moyen",
    variant: "default" as const,
  },
  {
    title: "Régions critiques",
    value: kpis?.criticalRegions ?? 0,
    icon: AlertTriangle,
    description: "Zones en pénurie",
    variant:
      ((kpis?.criticalRegions ?? 0) > 3
        ? "danger"
        : "warning") as KPIVariant,
  },
  {
    title: "Donneurs actifs",
    value: kpis?.donors ?? 0,
    icon: Users,
    description: "Jambaars actifs",
    variant: "default" as const,
  },
  {
    title: "Structures",
    value: kpis?.structures ?? 0,
    icon: Hospital,
    description: "Structures de santé",
    variant: "default" as const,
  },
];

  // ✅ ICI LE RETURN MANQUANT
  return (
    <section>
      <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
        Indicateurs clés
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {cards.map((card) => (
          <KPICard key={card.title} {...card} isLoading={isLoading} />
        ))}
      </div>
    </section>
  );
}