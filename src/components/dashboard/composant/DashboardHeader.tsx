import { Droplet, Calendar, Download } from "lucide-react";

export function DashboardHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
            <Droplet className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Indicateurs Clés
            </h1>
            <p className="text-sm text-muted-foreground">
              Gestion des dons de sang • Sénégal
            </p>
          </div>
        </div>
      </div>
      

      <div className="flex items-center gap-3">
        <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-foreground bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
          <Calendar className="w-4 h-4" />
          <span className="hidden sm:inline">Période</span>
        </button>
        <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-xl hover:bg-primary/90 transition-colors">
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Exporter</span>
        </button>
      </div>
    </div>
  );
}