"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { rewardsService, partnersService, type Reward, type CreateRewardPayload } from "@/services/rewards.service";
import { RewardFormModal } from "./RewardFormModal";
import { ConfirmModal } from "@/components/shared/ConfirmModal";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal, Plus, Gift,
  PowerOff, Pencil,
} from "lucide-react";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";
import { REWARD_TYPE_CONFIG } from "./rewards.constants";

export function RewardsTab() {
  const queryClient = useQueryClient();
  const [rewardToDeactivate, setRewardToDeactivate] = useState<Reward | null>(null);
  const [rewardToEdit, setRewardToEdit] = useState<Reward | null | undefined>(undefined);
  const [partnerFilter, setPartnerFilter] = useState<string>("ALL");

  const { data: rewardsData, isLoading } = useQuery({
    queryKey: ["rewards"],
    queryFn: () => rewardsService.getAll(),
  });

  const { data: partnersData } = useQuery({
    queryKey: ["partners"],
    queryFn: () => partnersService.getAll(),
  });

  const create = useMutation({
  mutationFn: (data: CreateRewardPayload) => rewardsService.create(data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["rewards"] });
    toast.success("Récompense ajoutée avec succès");
    setRewardToEdit(undefined);
  },
  onError: (error: any) => {
    console.log("Erreur détaillée:", error);
    toast.error(error?.message ?? "Erreur lors de l'ajout");
  },
});

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateRewardPayload> }) =>
      rewardsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rewards"] });
      toast.success("Récompense modifiée avec succès");
      setRewardToEdit(undefined);
    },
    onError: () => toast.error("Erreur lors de la modification"),
  });

  const deactivate = useMutation({
    mutationFn: (id: string) => rewardsService.deactivate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rewards"] });
      toast.success("Récompense désactivée");
      setRewardToDeactivate(null);
    },
    onError: () => toast.error("Erreur lors de la désactivation"),
  });

  const rewards = rewardsData?.rewards ?? [];
  const partners = partnersData?.partners ?? [];

  const filtered = partnerFilter === "ALL"
    ? rewards
    : rewards.filter((r) => r.partner.id === partnerFilter);

  const handleSubmit = (data: CreateRewardPayload) => {
    if (rewardToEdit) {
      update.mutate({ id: rewardToEdit.id, data });
    } else {
      create.mutate(data);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        {/* Filtre par partenaire */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setPartnerFilter("ALL")}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              partnerFilter === "ALL"
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-muted-foreground border-border hover:border-primary hover:text-primary"
            }`}
          >
            Tous ({rewards.length})
          </button>
          {partners.map((p) => (
            <button
              key={p.id}
              onClick={() => setPartnerFilter(p.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                partnerFilter === p.id
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-muted-foreground border-border hover:border-primary hover:text-primary"
              }`}
            >
              {p.name} ({rewards.filter((r) => r.partner.id === p.id).length})
            </button>
          ))}
        </div>

        <Button size="sm" className="gap-2 shrink-0" onClick={() => setRewardToEdit(null)}>
          <Plus className="w-4 h-4" />
          Ajouter une récompense
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-lg" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Gift className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>Aucune récompense trouvée.</p>
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Récompense</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Partenaire</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Type</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Points</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Stock</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Statut</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Expire le</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((r) => {
                  const typeConfig = REWARD_TYPE_CONFIG[r.rewardType];
                  return (
                    <tr key={r.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium">{r.title}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {r.description}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {r.partner.name}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${typeConfig.color}`}>
                          {typeConfig.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-semibold text-primary">
                          {r.pointsCost} pts
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {r.isUnlimited ? (
                          <span className="text-green-600">∞ Illimité</span>
                        ) : (
                          <span className={r.stockQuantity < 10 ? "text-red-600 font-medium" : ""}>
                            {r.stockQuantity}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={r.isActive ? "default" : "secondary"}>
                          {r.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {r.expiresAt ? formatDate(r.expiresAt) : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setRewardToEdit(r)}>
                              <Pencil className="mr-2 h-4 w-4" /> Modifier
                            </DropdownMenuItem>
                            {r.isActive && (
                              <DropdownMenuItem
                                className="text-amber-600"
                                onClick={() => setRewardToDeactivate(r)}
                              >
                                <PowerOff className="mr-2 h-4 w-4" /> Désactiver
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* Modal ajout / modification */}
      <RewardFormModal
        open={rewardToEdit !== undefined}
        reward={rewardToEdit}
        partners={partners}
        isLoading={create.isPending || update.isPending}
        onClose={() => setRewardToEdit(undefined)}
        onSubmit={handleSubmit}
      />

      {/* Modal confirmation désactivation */}
      <ConfirmModal
        open={!!rewardToDeactivate}
        variant="warning"
        title="Désactiver la récompense"
        description={`Vous êtes sur le point de désactiver "${rewardToDeactivate?.title}".`}
        confirmLabel="Désactiver"
        isLoading={deactivate.isPending}
        onClose={() => setRewardToDeactivate(null)}
        onConfirm={() => {
          if (rewardToDeactivate) deactivate.mutate(rewardToDeactivate.id);
        }}
      />
    </div>
  );
}