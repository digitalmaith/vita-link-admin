"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, FileText, Table2, Loader2, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { useDashboardKPIs } from "@/hooks/useDashboardKPIs";
import { generatePdfReport, generateExcelReport } from "@/lib/export/generatePdfReport";
import { useSession } from "next-auth/react";
import { useFiltersStore } from "@/store/filters.store";

export function ExportPanel() {
  const [isExporting, setIsExporting] = useState<"pdf" | "excel" | null>(null);
  const { filters } = useFiltersStore();
  const activeFilters = useMemo(() => ({
    region: filters.region,
    bloodGroup: filters.bloodGroup,
    dateFrom: filters.dateFrom,
    dateTo: filters.dateTo,
  }), [filters.region, filters.bloodGroup, filters.dateFrom, filters.dateTo]);
  const { data: kpis } = useDashboardKPIs(activeFilters);
  const { data: session } = useSession();

  // Construction du libellé de période pour les exports
  const periodLabel = useMemo(() => {
    const fmt = (d: string) =>
      new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
    if (filters.dateFrom && filters.dateTo) return `Du ${fmt(filters.dateFrom)} au ${fmt(filters.dateTo)}`;
    if (filters.dateFrom) return `À partir du ${fmt(filters.dateFrom)}`;
    if (filters.dateTo) return `Jusqu'au ${fmt(filters.dateTo)}`;
    return undefined;
  }, [filters.dateFrom, filters.dateTo]);

  const handleExport = async (format: "pdf" | "excel") => {
    if (!kpis) {
      toast.error("Données non disponibles", {
        description: "Attendez que les KPIs soient chargés.",
      });
      return;
    }

    setIsExporting(format);
    try {
      if (format === "pdf") {
        await generatePdfReport({
          kpis,
          period: periodLabel,
          generatedBy: session?.user?.name ?? "Administrateur",
        });
        toast.success("Rapport PDF généré", {
          description: periodLabel ? `Période : ${periodLabel}` : "Le téléchargement a démarré.",
        });
      } else {
        await generateExcelReport(kpis, periodLabel);
        toast.success("Export Excel généré", {
          description: periodLabel ? `Période : ${periodLabel}` : "Le téléchargement a démarré.",
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la génération", {
        description: "Installez les dépendances : npm install jspdf jspdf-autotable xlsx",
      });
    } finally {
      setIsExporting(null);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={!!isExporting || !kpis}
          className="gap-2 h-9 px-4 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/30"
        >
          {isExporting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          {isExporting ? "Génération..." : "Exporter"}
          <ChevronDown className="w-3.5 h-3.5 opacity-60" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
          Format du rapport
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => handleExport("pdf")}
          disabled={!!isExporting}
          className="gap-2 cursor-pointer"
        >
          {isExporting === "pdf" ? (
            <Loader2 className="h-4 w-4 animate-spin text-rose-500" />
          ) : (
            <FileText className="h-4 w-4 text-rose-500" />
          )}
          <div>
            <p className="text-sm font-medium">Rapport PDF</p>
            <p className="text-[10px] text-muted-foreground">KPIs + Impact + Recommandations</p>
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => handleExport("excel")}
          disabled={!!isExporting}
          className="gap-2 cursor-pointer"
        >
          {isExporting === "excel" ? (
            <Loader2 className="h-4 w-4 animate-spin text-green-600" />
          ) : (
            <Table2 className="h-4 w-4 text-green-600" />
          )}
          <div>
            <p className="text-sm font-medium">Export Excel</p>
            <p className="text-[10px] text-muted-foreground">Données brutes analysables</p>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}