"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, FileText, Table2, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function ExportPanel() {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format: "pdf" | "excel") => {
    setIsExporting(true);
    try {
      // TODO: brancher sur l'endpoint API d'export quand disponible
      await new Promise((r) => setTimeout(r, 1500)); // simulation
      toast.success(
        `Rapport ${format.toUpperCase()} généré avec succès`,
        { description: "Le téléchargement va démarrer automatiquement." }
      );
    } catch {
      toast.error("Erreur lors de la génération du rapport");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={isExporting} className="gap-2">
          {isExporting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          Exporter
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport("pdf")}>
          <FileText className="mr-2 h-4 w-4 text-red-500" />
          Rapport PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("excel")}>
          <Table2 className="mr-2 h-4 w-4 text-green-600" />
          Export Excel
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}