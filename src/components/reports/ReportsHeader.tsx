"use client";

import { ExportPanel } from "@/components/reports/ExportPanel";
import { FileBarChart } from "lucide-react";

export function ReportsHeader() {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
          <FileBarChart className="w-5 h-5 text-rose-600 dark:text-rose-400" />
        </div>
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight">
            Rapports & Statistiques
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5 max-w-xl">
            Données d'aide à la décision pour le Ministère de la Santé.
          </p>
        </div>
      </div>
      <div className="mt-3 sm:mt-0 flex-shrink-0">
        <ExportPanel />
      </div>
    </div>
  );
}