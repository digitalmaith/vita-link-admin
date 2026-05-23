"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { badgesService, type Badge, type CreateBadgePayload } from "@/services/badges.service";
import { Button } from "@/components/ui/button";
import { Award, Plus } from "lucide-react";
import { toast } from "sonner";
import { AnimatePresence } from "framer-motion";

import { BadgeCard } from "./BadgeCard";
import { BadgeSkeleton } from "./BadgeSkeleton";
import { BadgeFormModal } from "./BadgeFormModal";
import { BadgeFilters } from "./BadgeFilters";
import { BadgeEmptyState } from "./BadgeEmptyState";
import { BadgeConfirmModals } from "./BadgeConfirmModals";

export function BadgesTab() {
  const queryClient = useQueryClient();
  const [badgeToEdit, setBadgeToEdit] = useState<Badge | null | undefined>(undefined);
  const [badgeToDeactivate, setBadgeToDeactivate] = useState<Badge | null>(null);
  const [badgeToReactivate, setBadgeToReactivate] = useState<Badge | null>(null);
  const [activeFilter, setActiveFilter] = useState<"all" | "active" | "inactive">("all");

  const { data, isLoading } = useQuery({
    queryKey: ["badges"],
    queryFn: () => badgesService.getAll(),
  });

  const create = useMutation({
    mutationFn: (payload: CreateBadgePayload) => badgesService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["badges"] });
      toast.success("Badge créé avec succès");
      setBadgeToEdit(undefined);
    },
    onError: (error: any) => toast.error(error?.message ?? "Erreur lors de la création"),
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateBadgePayload> }) =>
      badgesService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["badges"] });
      toast.success("Badge modifié avec succès");
      setBadgeToEdit(undefined);
    },
    onError: () => toast.error("Erreur lors de la modification"),
  });

  const deactivate = useMutation({
    mutationFn: (id: string) => badgesService.deactivate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["badges"] });
      toast.success("Badge désactivé avec succès");
      setBadgeToDeactivate(null);
    },
    onError: () => toast.error("Erreur lors de la désactivation"),
  });

  const reactivate = useMutation({
    mutationFn: (id: string) => badgesService.reactivate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["badges"] });
      toast.success("Badge réactivé avec succès");
      setBadgeToReactivate(null);
    },
    onError: () => toast.error("Erreur lors de la réactivation"),
  });

  const badges = data?.badges ?? [];

  const filteredBadges = useMemo(() => {
    return badges.filter((badge) => {
      if (activeFilter === "active") return badge.isActive;
      if (activeFilter === "inactive") return !badge.isActive;
      return true;
    });
  }, [badges, activeFilter]);

  const counts = useMemo(() => ({
    all: badges.length,
    active: badges.filter((b) => b.isActive).length,
    inactive: badges.filter((b) => !b.isActive).length,
  }), [badges]);

  const handleSubmit = (payload: CreateBadgePayload) => {
    if (badgeToEdit) {
      update.mutate({ id: badgeToEdit.id, data: payload });
    } else {
      create.mutate(payload);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            Gestion des badges
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {counts.all} badge{counts.all > 1 ? "s" : ""} au total
            {" · "}
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">{counts.active} actif{counts.active > 1 ? "s" : ""}</span>
            {" · "}
            <span className="text-gray-500 font-medium">{counts.inactive} inactif{counts.inactive > 1 ? "s" : ""}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <BadgeFilters activeFilter={activeFilter} onFilterChange={setActiveFilter} counts={counts} />
          <Button size="sm" className="gap-2 shadow-lg shadow-primary/20" onClick={() => setBadgeToEdit(null)}>
            <Plus className="w-4 h-4" /> Créer un badge
          </Button>
        </div>
      </div>

      {/* Contenu */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <BadgeSkeleton key={i} />
          ))}
        </div>
      ) : filteredBadges.length === 0 ? (
        <BadgeEmptyState filter={activeFilter} onCreateClick={() => setBadgeToEdit(null)} />
      ) : (
        <AnimatePresence mode="popLayout">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredBadges.map((badge) => (
              <BadgeCard
                key={badge.id}
                badge={badge}
                onEdit={setBadgeToEdit}
                onDeactivate={setBadgeToDeactivate}
                onReactivate={setBadgeToReactivate}
              />
            ))}
          </div>
        </AnimatePresence>
      )}

      {/* Modals */}
      <BadgeFormModal
        open={badgeToEdit !== undefined}
        badge={badgeToEdit}
        isLoading={create.isPending || update.isPending}
        onClose={() => setBadgeToEdit(undefined)}
        onSubmit={handleSubmit}
      />

      <BadgeConfirmModals
        badgeToDeactivate={badgeToDeactivate}
        badgeToReactivate={badgeToReactivate}
        isLoadingDeactivate={deactivate.isPending}
        isLoadingReactivate={reactivate.isPending}
        onCloseDeactivate={() => setBadgeToDeactivate(null)}
        onCloseReactivate={() => setBadgeToReactivate(null)}
        onConfirmDeactivate={() => { if (badgeToDeactivate) deactivate.mutate(badgeToDeactivate.id); }}
        onConfirmReactivate={() => { if (badgeToReactivate) reactivate.mutate(badgeToReactivate.id); }}
      />
    </div>
  );
}