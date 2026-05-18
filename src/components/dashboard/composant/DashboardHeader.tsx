"use client";

import { Droplet, Calendar, Download, RefreshCw } from "lucide-react";

// ✅ Interface pour les props
interface DashboardHeaderProps {
  onRefresh?: () => void;
  onExport?: () => void;
  onPeriodChange?: () => void;
}

// ✅ Déstructuration correcte des props
export function DashboardHeader({ 
  onRefresh, 
  onExport, 
  onPeriodChange 
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      {/* Titre et description */}
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
            <Droplet className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Tableau de Bord
            </h1>
            <p className="text-sm text-muted-foreground">
              Gestion des dons de sang • Sénégal
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        {/* Indicateur Live + Refresh */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
            En direct
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

        {/* Bouton Période */}
        {onPeriodChange && (
          <button 
            onClick={onPeriodChange}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-foreground bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
          >
            <Calendar className="w-4 h-4" />
            <span className="hidden sm:inline">Période</span>
          </button>
        )}

        {/* Bouton Export */}
        {onExport && (
          <button 
            onClick={onExport}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-xl hover:bg-primary/90 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Exporter</span>
          </button>
        )}
      </div>
    </div>
  );
}