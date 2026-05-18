"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { partnersService, type Partner } from "@/services/rewards.service";
import { PartnerCard } from "./PartnerCard";
import { PartnerFormModal } from "./PartnerFormModal";
import { ConfirmModal } from "@/components/shared/ConfirmModal";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Building2 } from "lucide-react";
import { toast } from "sonner";

export function PartnersTab() {
  const queryClient = useQueryClient();
  const [partnerToToggle, setPartnerToToggle] = useState<Partner | null>(null);
  const [partnerToEdit, setPartnerToEdit] = useState<Partner | null | undefined>(undefined);
  // undefined = modal fermé, null = création, Partner = modification

  const { data, isLoading } = useQuery({
    queryKey: ["partners"],
    queryFn: () => partnersService.getAll(),
  });

  const create = useMutation({
    mutationFn: (formData: FormData) => partnersService.create(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partners"] });
      toast.success("Partenaire ajouté avec succès");
      setPartnerToEdit(undefined);
    },
    onError: () => toast.error("Erreur lors de l'ajout"),
  });

  const update = useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      partnersService.update(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partners"] });
      toast.success("Partenaire modifié avec succès");
      setPartnerToEdit(undefined);
    },
    onError: () => toast.error("Erreur lors de la modification"),
  });

  const toggle = useMutation({
    mutationFn: (p: Partner) => partnersService.toggle(p.id, !p.isActive),
    onSuccess: (_, p) => {
      queryClient.invalidateQueries({ queryKey: ["partners"] });
      toast.success(`Partenaire ${p.isActive ? "désactivé" : "activé"}`);
      setPartnerToToggle(null);
    },
    onError: () => toast.error("Erreur lors de la mise à jour"),
  });

  const partners = data?.partners ?? [];

  const handleSubmit = (formData: FormData) => {
    if (partnerToEdit) {
      update.mutate({ id: partnerToEdit.id, formData });
    } else {
      create.mutate(formData);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button size="sm" className="gap-2" onClick={() => setPartnerToEdit(null)}>
          <Plus className="w-4 h-4" />
          Ajouter un partenaire
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-lg" />
          ))}
        </div>
      ) : partners.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Building2 className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>Aucun partenaire configuré.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {partners.map((partner) => (
            <PartnerCard
              key={partner.id}
              partner={partner}
              rewardsCount={0}
              onEdit={(p) => setPartnerToEdit(p)}
              onToggle={setPartnerToToggle}
              onSelect={() => {}}
            />
          ))}
        </div>
      )}

      {/* Modal ajout / modification */}
      <PartnerFormModal
        open={partnerToEdit !== undefined}
        partner={partnerToEdit}
        isLoading={create.isPending || update.isPending}
        onClose={() => setPartnerToEdit(undefined)}
        onSubmit={handleSubmit}
      />

      {/* Modal confirmation toggle */}
      <ConfirmModal
        open={!!partnerToToggle}
        variant={partnerToToggle?.isActive ? "warning" : "info"}
        title={partnerToToggle?.isActive ? "Désactiver le partenaire" : "Activer le partenaire"}
        description={
          partnerToToggle?.isActive
            ? `Vous êtes sur le point de désactiver ${partnerToToggle?.name}.`
            : `Vous êtes sur le point d'activer ${partnerToToggle?.name}.`
        }
        confirmLabel={partnerToToggle?.isActive ? "Désactiver" : "Activer"}
        isLoading={toggle.isPending}
        onClose={() => setPartnerToToggle(null)}
        onConfirm={() => {
          if (partnerToToggle) toggle.mutate(partnerToToggle);
        }}
      />
    </div>
  );
}