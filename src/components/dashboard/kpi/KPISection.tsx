"use client";

import { Activity, RefreshCw, TrendingUp, AlertTriangle } from "lucide-react";
import { KPICard } from "./KPICard";
import type { KPICardProps } from "./kpi-types";

interface KPISectionProps {
  cards?: KPICardProps[]; // ✅ Rendre optionnel
  isLoading?: boolean;
  onRefresh?: () => void;
  summary?: {
    coverageRate?: number;
    monthlyGoal?: number;
    progress?: number;
  };
}

export function KPISection({ 
  cards = [], // ✅ Valeur par défaut
  isLoading = false, 
  onRefresh,
  summary 
}: KPISectionProps) {
  return (
    <section className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
              Données en direct
            </span>
          </div>
          
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              title="Actualiser les données"
            >
              <RefreshCw className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
            </button>
          )}
        </div>
      </div>

      {/* Grille de KPIs */}
      {cards && cards.length > 0 ? ( // ✅ Vérification avant le map
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {cards.map((card, index) => (
            <div
              key={card.title || `kpi-${index}`} // ✅ Fallback pour la key
              className="animate-fade-in-up"
              style={{
                animationDelay: `${index * 100}ms`,
                animationFillMode: 'both'
              }}
            >
              <KPICard {...card} isLoading={isLoading} />
            </div>
          ))}
        </div>
      ) : (
        // ✅ Message si pas de cartes
        !isLoading && <EmptyState onRefresh={onRefresh} />
      )}

      {/* Résumé statistique */}
      {summary && !isLoading && cards.length > 0 && ( // ✅ Vérification supplémentaire
        <SummaryBar summary={summary} />
      )}
    </section>
  );
}

// Sous-composants
function EmptyState({ onRefresh }: { onRefresh?: () => void }) {
  return (
    <div className="flex items-center justify-center p-8 rounded-2xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800">
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950/50 mx-auto">
          <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
        </div>
        <div>
          <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
            Aucun indicateur disponible
          </p>
          <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
            Les données n'ont pas pu être chargées
          </p>
        </div>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-neutral-600 dark:text-neutral-400 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-750 transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            Réessayer
          </button>
        )}
      </div>
    </div>
  );
}

function SummaryBar({ summary }: { summary: NonNullable<KPISectionProps['summary']> }) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800">
      {summary.coverageRate !== undefined && (
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-500" />
          <span className="text-xs text-neutral-600 dark:text-neutral-400">
            Taux de couverture : <strong className="text-emerald-600 dark:text-emerald-400">{summary.coverageRate}%</strong>
          </span>
        </div>
      )}
      {summary.monthlyGoal !== undefined && (
        <>
          <div className="hidden sm:block w-px h-4 bg-neutral-200 dark:bg-neutral-700" />
          <span className="text-xs text-neutral-600 dark:text-neutral-400">
            Objectif mensuel : <strong className="text-foreground">{summary.monthlyGoal.toLocaleString()} dons</strong>
          </span>
        </>
      )}
      {summary.progress !== undefined && (
        <>
          <div className="hidden sm:block w-px h-4 bg-neutral-200 dark:bg-neutral-700" />
          <span className="text-xs text-neutral-600 dark:text-neutral-400">
            Progression : <strong className="text-emerald-600 dark:text-emerald-400">{summary.progress}%</strong>
          </span>
        </>
      )}
    </div>
  );
}