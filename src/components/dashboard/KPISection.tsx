"use client";

import { Heart, Clock, AlertTriangle, Users, Hospital } from "lucide-react";
import { KPICard } from "./KPICard";
import { useDashboardKPIs } from "@/lib/hooks/useDashboardKPIs";
import type { KPIVariant } from "./KPICard";

type KPICardData = {
  title: string;
  value: number | string;
  icon: any;
  description: string;
  variant: KPIVariant;
};

export function KPISection() {
  const { data: kpis, isLoading } = useDashboardKPIs();

  const cards: KPICardData[] = [
    {
      title: "Vies sauvées",
      value: kpis?.livesSaved ?? 0,
      icon: Heart,
      description: "Alertes clôturées avec succès",
      variant: "success",
    },
    {
      title: "Temps de réponse moyen",
      value: kpis?.avgResponseTimeMinutes
        ? `${kpis.avgResponseTimeMinutes} min`
        : "—",
      icon: Clock,
      description: "Délai national moyen",
      variant: "default",
    },
    {
      title: "Régions en stock critique",
      value: kpis?.criticalStockRegions ?? 0,
      icon: AlertTriangle,
      description: "Régions nécessitant une attention urgente",
      variant:
        kpis && kpis.criticalStockRegions > 3 ? "danger" : "warning",
    },
    {
      title: "Jambaars actifs",
      value: kpis?.activeJambaars?.toLocaleString("fr-FR") ?? 0,
      icon: Users,
      description: "Donneurs disponibles dans le réseau",
      variant: "default",
    },
    {
      title: "Structures certifiées",
      value: kpis?.totalStructures ?? 0,
      icon: Hospital,
      description: "Structures de santé validées",
      variant: "default",
    },
  ];

  return (
    <section>
      <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
        Indicateurs clés
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {cards.map((card) => (
          <KPICard
            key={card.title}
            title={card.title}
            value={card.value}
            icon={card.icon}
            description={card.description}
            variant={card.variant}
            isLoading={isLoading}
          />
        ))}
      </div>
    </section>
  );
}