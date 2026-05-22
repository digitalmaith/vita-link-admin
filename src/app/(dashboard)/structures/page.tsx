"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { structuresService, type HealthStructure } from "@/services/structures.service";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, LayoutGrid, LayoutList } from "lucide-react";
import { StructuresTableView } from "@/components/structures/StructuresTableView";
import { StructuresCardView } from "@/components/structures/StructuresCardView";
import { StructureDetailModal } from "@/components/structures/StructureDetailModal";
import { STATUS_FILTERS } from "@/lib/constants/structures.constants";
import { SuspendConfirmModal } from "@/components/structures";
import { ConfirmModal } from "@/components/shared/ConfirmModal";

export default function StructuresPage() {
  const queryClient = useQueryClient();
  const [view, setView] = useState<"table" | "card">("table");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("PENDING_REVIEW");
  const [selectedStructure, setSelectedStructure] = useState<HealthStructure | null>(null);
  const [structureToSuspend, setStructureToSuspend] = useState<HealthStructure | null>(null);
  const { data, isLoading } = useQuery({
    queryKey: ["structures"],
    queryFn: () => structuresService.getAll(),
  });
  const [structureToReactivate, setStructureToReactivate] = useState<HealthStructure | null>(null);

  const verify = useMutation({
    mutationFn: (id: string) => structuresService.verify(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["structures"] }); toast.success("Structure certifiée"); },
    onError: () => toast.error("Erreur lors de la certification"),
  });

  const suspend = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      structuresService.suspend(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["structures"] });
      toast.success("Structure suspendue");
      setStructureToSuspend(null);
    },
    onError: () => toast.error("Erreur lors de la suspension"),
  });

  const reject = useMutation({
    mutationFn: (id: string) => structuresService.reject(id, "Documents insuffisants"),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["structures"] }); toast.success("Structure rejetée"); },
    onError: () => toast.error("Erreur lors du rejet"),
  });

  const reactivate = useMutation({
    mutationFn: (id: string) => structuresService.reactivate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["structures"] });
      toast.success("Structure réactivée avec succès");
      setStructureToReactivate(null);
    },
    onError: () => toast.error("Erreur lors de la réactivation"),
  });

  const filtered = useMemo(() => {
    let list = data?.structures ?? [];
    if (statusFilter !== "ALL") list = list.filter((s) => s.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((s) =>
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.registrationNumber.toLowerCase().includes(q) ||
        s.address.toLowerCase().includes(q)
      );
    }
    return list;
  }, [data, statusFilter, search]);

  const counts = useMemo(() => {
    const all = data?.structures ?? [];
    return {
      ALL: all.length,
      PENDING_REVIEW: all.filter((s) => s.status === "PENDING_REVIEW").length,
      VERIFIED: all.filter((s) => s.status === "VERIFIED").length,
      SUSPENDED: all.filter((s) => s.status === "SUSPENDED").length,
      REJECTED: all.filter((s) => s.status === "REJECTED").length,
    };
  }, [data]);

  const actions = {
    onSelect: setSelectedStructure,
    onVerify: (id: string) => verify.mutate(id),
    onSuspend: (id: string) => {
      const s = data?.structures.find((s) => s.id === id) ?? null;
      setStructureToSuspend(s);
    },
    onReject: (id: string) => reject.mutate(id),
    onReactivate: (id: string) => {
    const s = data?.structures.find((s) => s.id === id) ?? null;
      setStructureToReactivate(s);
    },
  };

  return (
    <div className="space-y-6">

      {/* Header */}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Structures de Santé</h2>
          <p className="text-sm text-muted-foreground">
            Validation et certification des établissements
          </p>
        </div>
        <div className="flex items-center gap-1 border border-border rounded-lg p-1">
          <Button variant={view === "table" ? "default" : "ghost"} size="icon" className="h-7 w-7"
            onClick={() => setView("table")} title="Vue tableau">
            <LayoutList className="w-4 h-4" />
          </Button>
          <Button variant={view === "card" ? "default" : "ghost"} size="icon" className="h-7 w-7"
            onClick={() => setView("card")} title="Vue carte">
            <LayoutGrid className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Filtres statut */}
      <div className="flex flex-wrap items-center gap-2">
        {STATUS_FILTERS.map((f) => (
          <button key={f.value} onClick={() => setStatusFilter(f.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${statusFilter === f.value
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-muted-foreground border-border hover:border-primary hover:text-primary"
              }`}>
            {f.label}
            <span className="ml-1.5 opacity-70">
              {counts[f.value as keyof typeof counts]}
            </span>
          </button>
        ))}
      </div>

      {/* Recherche */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input type="text" placeholder="Rechercher une structure..."
          value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-sm border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
      </div>

      {/* Contenu */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      ) : view === "table" ? (
        <StructuresTableView structures={filtered} {...actions} />
      ) : (
        <StructuresCardView structures={filtered} {...actions} />
      )}

      {/* Résumé */}
      {!isLoading && (
        <p className="text-xs text-muted-foreground">
          {filtered.length} structure{filtered.length > 1 ? "s" : ""} affichée{filtered.length > 1 ? "s" : ""}
          {search && ` pour "${search}"`}
        </p>
      )}

      {/* Modal */}
      <StructureDetailModal
        structure={selectedStructure}
        open={!!selectedStructure}
        onClose={() => setSelectedStructure(null)}
        {...actions}
      />

      <ConfirmModal
        open={!!structureToSuspend}
        variant="warning"
        title="Suspendre la structure"
        description={
          <span>
            Vous êtes sur le point de suspendre{" "}
            <span className="font-semibold text-foreground">
              {structureToSuspend?.name}
            </span>
            . Cette action empêchera la structure d'émettre des alertes.
          </span>
        }
        confirmLabel="Confirmer la suspension"
        isLoading={suspend.isPending}
        onClose={() => setStructureToSuspend(null)}
        reasonConfig={{
          label: "Motif de suspension",
          required: true,
          options: [
            "Abus détecté — alertes infondées répétées",
            "Documents expirés ou invalides",
            "Non-conformité aux protocoles Vita-Link",
            "Signalement d'utilisateurs",
            "Autre",
          ],
        }}
        onConfirm={(reason) => {
          if (structureToSuspend) {
            suspend.mutate({ id: structureToSuspend.id, reason: reason ?? "" });
          }
        }}
      />

      <ConfirmModal
        open={!!structureToReactivate}
        variant="info"
        title="Réactiver la structure"
        description={
          <span>
            Vous êtes sur le point de réactiver{" "}
            <span className="font-semibold text-foreground">
              {structureToReactivate?.name}
            </span>
            . Elle pourra à nouveau émettre des alertes.
          </span>
        }
        confirmLabel="Confirmer la réactivation"
        isLoading={reactivate.isPending}
        onClose={() => setStructureToReactivate(null)}
        onConfirm={() => {
          if (structureToReactivate) {
            reactivate.mutate(structureToReactivate.id);
          }
        }}
/>
    </div>
  );
}