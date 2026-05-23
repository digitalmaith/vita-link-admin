"use client";

import { Activity, RefreshCw, TrendingUp, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { KPICard } from "./KPICard";
import { KPICardSkeleton } from "./KPICardSkeleton";
import type { KPICardProps } from "../../../types/kpi-types";
import { TooltipProvider } from "@/components/ui/tooltip";

interface KPISectionProps {
  cards?: KPICardProps[];
  isLoading?: boolean;
  onRefresh?: () => void;
  summary?: {
    coverageRate?: number;
    monthlyGoal?: number;
    progress?: number;
  };
}

export function KPISection({
  cards = [],
  isLoading = false,
  onRefresh,
  summary,
}: KPISectionProps) {
  return (
    <section className="space-y-6">
      {/* En-tête avec indicateur de chargement */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 ring-1 ring-primary/10">
            <Activity className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Tableau de bord</h2>
            <p className="text-xs text-muted-foreground">
              {isLoading ? (
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  Chargement des indicateurs...
                </span>
              ) : (
                `${cards.length} indicateur${cards.length > 1 ? "s" : ""} disponible${cards.length > 1 ? "s" : ""}`
              )}
            </p>
          </div>
        </div>

        {onRefresh && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRefresh}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-xl
              bg-white dark:bg-neutral-800 
              border border-neutral-200 dark:border-neutral-700
              hover:bg-neutral-50 dark:hover:bg-neutral-750
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all shadow-sm hover:shadow-md"
          >
            <RefreshCw className={cn("w-3.5 h-3.5", isLoading && "animate-spin")} />
            Actualiser
          </motion.button>
        )}
      </div>

      {/* Grille de KPIs avec squelettes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {isLoading ? (
          // Squelettes de chargement
          <>
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className="animate-fade-in-up"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: "both",
                }}
              >
                <KPICardSkeleton />
              </div>
            ))}
          </>
        ) : cards.length > 0 ? (
          // Cartes de données
          <>
            {cards.map((card, index) => (
              <div
                key={card.title || `kpi-${index}`}
                className="animate-fade-in-up"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: "both",
                }}
              >
                <TooltipProvider>
                  <KPICard {...card} isLoading={false} />
                </TooltipProvider>
              </div>
            ))}
          </>
        ) : (
          // État vide
          <div className="col-span-full">
            <EmptyState onRefresh={onRefresh} />
          </div>
        )}
      </div>

      {/* Résumé statistique avec squelette */}
      {summary && !isLoading && cards.length > 0 && (
        <SummaryBar summary={summary} />
      )}
      
      {isLoading && summary && (
        <SummaryBarSkeleton />
      )}
    </section>
  );
}

// État vide
function EmptyState({ onRefresh }: { onRefresh?: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-center p-12 rounded-2xl 
        bg-gradient-to-br from-neutral-50 to-neutral-100 
        dark:from-neutral-900/50 dark:to-neutral-800/50 
        border border-neutral-200 dark:border-neutral-800"
    >
      <div className="text-center space-y-4">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex items-center justify-center w-16 h-16 rounded-2xl 
            bg-amber-100 dark:bg-amber-950/50 mx-auto"
        >
          <AlertTriangle className="w-8 h-8 text-amber-600 dark:text-amber-400" />
        </motion.div>
        <div>
          <p className="text-base font-semibold text-neutral-700 dark:text-neutral-300">
            Aucun indicateur disponible
          </p>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 max-w-md">
            Les données n'ont pas pu être chargées. Vérifiez votre connexion
            ou réessayez plus tard.
          </p>
        </div>
        {onRefresh && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRefresh}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium 
              text-neutral-700 dark:text-neutral-300 
              bg-white dark:bg-neutral-800 
              border border-neutral-200 dark:border-neutral-700 
              rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-750 
              transition-all shadow-sm hover:shadow-md"
          >
            <RefreshCw className="w-4 h-4" />
            Réessayer
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

// Barre de résumé
function SummaryBar({
  summary,
}: {
  summary: NonNullable<KPISectionProps["summary"]>;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="flex flex-col sm:flex-row items-start sm:items-center gap-3 
        px-5 py-4 rounded-xl 
        bg-gradient-to-r from-neutral-50 to-white 
        dark:from-neutral-900/50 dark:to-neutral-800/50 
        border border-neutral-200 dark:border-neutral-800
        shadow-sm"
    >
      {summary.coverageRate !== undefined && (
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/50">
            <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <p className="text-[10px] text-neutral-500 dark:text-neutral-400 uppercase tracking-wider font-medium">
              Taux de couverture
            </p>
            <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
              {summary.coverageRate}%
            </p>
          </div>
        </div>
      )}

      {summary.monthlyGoal !== undefined && (
        <>
          <div className="hidden sm:block w-px h-10 bg-neutral-200 dark:bg-neutral-700" />
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-950/50">
              <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-[10px] text-neutral-500 dark:text-neutral-400 uppercase tracking-wider font-medium">
                Objectif mensuel
              </p>
              <p className="text-sm font-bold text-foreground">
                {summary.monthlyGoal.toLocaleString()} dons
              </p>
            </div>
          </div>
        </>
      )}

      {summary.progress !== undefined && (
        <>
          <div className="hidden sm:block w-px h-10 bg-neutral-200 dark:bg-neutral-700" />
          <div className="flex items-center gap-3 flex-1">
            <div className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-950/50">
              <TrendingUp className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <p className="text-[10px] text-neutral-500 dark:text-neutral-400 uppercase tracking-wider font-medium">
                  Progression
                </p>
                <p className="text-xs font-bold text-purple-600 dark:text-purple-400">
                  {summary.progress}%
                </p>
              </div>
              <div className="w-full h-2 rounded-full bg-neutral-200 dark:bg-neutral-700 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${summary.progress}%` }}
                  transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                  className="h-full rounded-full bg-gradient-to-r from-purple-500 to-purple-600"
                />
              </div>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}

// Squelette pour la barre de résumé
function SummaryBarSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 
      px-5 py-4 rounded-xl 
      bg-neutral-50 dark:bg-neutral-900/50 
      border border-neutral-200 dark:border-neutral-800
      animate-pulse"
    >
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-neutral-200 dark:bg-neutral-700" />
        <div className="space-y-2">
          <div className="w-20 h-3 rounded bg-neutral-200 dark:bg-neutral-700" />
          <div className="w-12 h-4 rounded bg-neutral-200 dark:bg-neutral-700" />
        </div>
      </div>
      <div className="hidden sm:block w-px h-10 bg-neutral-200 dark:bg-neutral-700" />
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-neutral-200 dark:bg-neutral-700" />
        <div className="space-y-2">
          <div className="w-20 h-3 rounded bg-neutral-200 dark:bg-neutral-700" />
          <div className="w-16 h-4 rounded bg-neutral-200 dark:bg-neutral-700" />
        </div>
      </div>
      <div className="hidden sm:block w-px h-10 bg-neutral-200 dark:bg-neutral-700" />
      <div className="flex items-center gap-3 flex-1">
        <div className="w-9 h-9 rounded-lg bg-neutral-200 dark:bg-neutral-700" />
        <div className="flex-1 space-y-2">
          <div className="flex justify-between">
            <div className="w-20 h-3 rounded bg-neutral-200 dark:bg-neutral-700" />
            <div className="w-10 h-3 rounded bg-neutral-200 dark:bg-neutral-700" />
          </div>
          <div className="w-full h-2 rounded-full bg-neutral-200 dark:bg-neutral-700" />
        </div>
      </div>
    </div>
  );
}

// Utilitaire pour joindre les classes
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}