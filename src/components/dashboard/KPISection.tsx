"use client";

import { Heart, Clock, AlertTriangle, Users, Hospital } from "lucide-react";
import { KPICard } from "./KPICard";
import { useDashboardKPIs } from "@/lib/hooks/useDashboardKPIs";


type KPIVariant = "default" | "success" | "warning" | "danger";

function getStockVariant(value: number): KPIVariant {
  if (value > 3) return "danger";
  if (value > 0) return "warning";
  return "default";
}
export function KPISection() {
  const { data: kpis, isLoading } = useDashboardKPIs();

  const cards = [
    {
      title: "Vies sauvées",
      value: kpis?.livesSaved ?? 0,
      icon: Heart,
      description: "Alertes clôturées avec succès",
      variant: "success" as const,
    },
    {
      title: "Temps de réponse moyen",
      value: kpis?.avgResponseTimeMinutes
        ? `${kpis.avgResponseTimeMinutes} min`
        : "—",
      icon: Clock,
      description: "Délai national moyen",
      variant: "default" as const,
    },
    {
      title: "Régions en stock critique",
      value: kpis?.criticalStockRegions ?? 0,
      icon: AlertTriangle,
      description: "Régions nécessitant une attention urgente",
      variant: kpis ? getStockVariant(kpis.criticalStockRegions) : "default",
    },
    {
      title: "Jambaars actifs",
      value: kpis?.activeJambaars?.toLocaleString("fr-FR") ?? 0,
      icon: Users,
      description: "Donneurs disponibles dans le réseau",
      variant: "default" as const,
    },
    {
      title: "Structures certifiées",
      value: kpis?.totalStructures ?? 0,
      icon: Hospital,
      description: "Structures de santé validées",
      variant: "default" as const,
    },
  ];

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
