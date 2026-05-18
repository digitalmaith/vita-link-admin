"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { rewardsService, partnersService, type Reward, type CreateRewardPayload } from "@/services/rewards.service";
import { RewardFormModal } from "./RewardFormModal";
import { ConfirmModal } from "@/components/shared/ConfirmModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal, Plus, Gift, Search,
  PowerOff, Pencil, Filter, LayoutGrid,
  List, Package, TrendingUp, Clock, Infinity,
  AlertCircle, Trash2, Eye, Copy,
} from "lucide-react";
import { toast } from "sonner";
import { formatDate, cn } from "@/lib/utils";
import { REWARD_TYPE_CONFIG } from "./rewards.constants";
import { Input } from "@/components/ui/input";

export function RewardsTab() {
  const queryClient = useQueryClient();
  const [rewardToDeactivate, setRewardToDeactivate] = useState<Reward | null>(null);
  const [rewardToEdit, setRewardToEdit] = useState<Reward | null | undefined>(undefined);
  const [partnerFilter, setPartnerFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

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

  // Filtrage combiné
  const filtered = rewards
    .filter((r) => partnerFilter === "ALL" || r.partner.id === partnerFilter)
    .filter((r) => 
      searchQuery === "" || 
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const activeRewards = rewards.filter(r => r.isActive).length;
  const totalStock = rewards.reduce((acc, r) => acc + (r.stockQuantity || 0), 0);

  const handleSubmit = (data: CreateRewardPayload) => {
    if (rewardToEdit) {
      update.mutate({ id: rewardToEdit.id, data });
    } else {
      create.mutate(data);
    }
  };

  return (
    <div className="space-y-6">
      {/* Barre d'actions principale */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 space-y-4">
          {/* Filtres partenaires */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setPartnerFilter("ALL")}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200",
                partnerFilter === "ALL"
                  ? "bg-primary text-primary-foreground border-primary shadow-sm shadow-primary/20"
                  : "bg-background hover:bg-muted border-border hover:border-primary/50"
              )}
            >
              <Filter className="w-3 h-3 inline mr-1" />
              Tous
              <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-white/20 text-[10px]">
                {rewards.length}
              </span>
            </button>
            {partners.map((p) => (
              <button
                key={p.id}
                onClick={() => setPartnerFilter(p.id)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200",
                  partnerFilter === p.id
                    ? "bg-primary text-primary-foreground border-primary shadow-sm shadow-primary/20"
                    : "bg-background hover:bg-muted border-border hover:border-primary/50"
                )}
              >
                {p.name}
                <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-white/20 text-[10px]">
                  {rewards.filter((r) => r.partner.id === p.id).length}
                </span>
              </button>
            ))}
          </div>

          {/* Recherche */}
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher une récompense..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-sm"
            />
          </div>
        </div>

        <div className="flex items-start gap-2">
          {/* Toggle vue */}
          <div className="flex items-center border border-border rounded-lg p-0.5">
            <button
              onClick={() => setViewMode("table")}
              className={cn(
                "p-1.5 rounded-md transition-colors",
                viewMode === "table" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "p-1.5 rounded-md transition-colors",
                viewMode === "grid" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          <Button onClick={() => setRewardToEdit(null)} className="gap-2">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nouvelle récompense</span>
          </Button>
        </div>
      </div>

      {/* Mini stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center">
              <Gift className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{rewards.length}</p>
              <p className="text-xs text-muted-foreground">Total récompenses</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{activeRewards}</p>
              <p className="text-xs text-muted-foreground">Actives</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center">
              <Package className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalStock}</p>
              <p className="text-xs text-muted-foreground">Stock total</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contenu principal */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Gift className="w-8 h-8 text-muted-foreground/40" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">
              Aucune récompense trouvée
            </h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-sm">
              {searchQuery 
                ? "Aucun résultat ne correspond à votre recherche." 
                : "Commencez par ajouter votre première récompense."}
            </p>
            {!searchQuery && (
              <Button onClick={() => setRewardToEdit(null)}>
                <Plus className="w-4 h-4 mr-2" />
                Ajouter une récompense
              </Button>
            )}
          </CardContent>
        </Card>
      ) : viewMode === "table" ? (
        <Card>
          <ScrollArea className="max-h-[600px]">
            <table className="w-full text-sm">
              <thead className="sticky top-0 z-10">
                <tr className="border-b border-border bg-muted/50 backdrop-blur-sm">
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                    Récompense
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                    Partenaire
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                    Type
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                    Points
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                    Expiration
                  </th>
                  <th className="px-4 py-3 w-10" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((r) => {
                  const typeConfig = REWARD_TYPE_CONFIG[r.rewardType];
                  const isLowStock = !r.isUnlimited && r.stockQuantity < 10;
                  const isExpiringSoon = r.expiresAt && new Date(r.expiresAt) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

                  return (
                    <tr 
                      key={r.id} 
                      className={cn(
                        "hover:bg-muted/30 transition-colors group",
                        !r.isActive && "opacity-60"
                      )}
                    >
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-9 h-9 rounded-lg flex items-center justify-center",
                            typeConfig.bgColor || "bg-primary/10"
                          )}>
                            <Gift className={cn("w-4 h-4", typeConfig.iconColor || "text-primary")} />
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-foreground truncate">
                              {r.title}
                            </p>
                            {r.description && (
                              <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                                {r.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-sm text-muted-foreground">
                          {r.partner.name}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <Badge 
                          variant="outline" 
                          className={cn("text-xs font-medium", typeConfig.color)}
                        >
                          {typeConfig.icon && <typeConfig.icon className="w-3 h-3 mr-1" />}
                          {typeConfig.label}
                        </Badge>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center gap-1 text-sm font-bold text-primary">
                          <TrendingUp className="w-3.5 h-3.5" />
                          {r.pointsCost} pts
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        {r.isUnlimited ? (
                          <span className="inline-flex items-center gap-1 text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                            <Infinity className="w-3.5 h-3.5" />
                            Illimité
                          </span>
                        ) : (
                          <span className={cn(
                            "text-sm font-medium",
                            isLowStock ? "text-red-600 dark:text-red-400" : "text-foreground"
                          )}>
                            {isLowStock && <AlertCircle className="w-3.5 h-3.5 inline mr-1" />}
                            {r.stockQuantity}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        <Badge 
                          variant={r.isActive ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {r.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3.5">
                        {r.expiresAt ? (
                          <span className={cn(
                            "text-xs",
                            isExpiringSoon ? "text-amber-600 dark:text-amber-400 font-medium" : "text-muted-foreground"
                          )}>
                            {isExpiringSoon && <Clock className="w-3 h-3 inline mr-1" />}
                            {formatDate(r.expiresAt)}
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setRewardToEdit(r)}>
                              <Pencil className="mr-2 h-4 w-4" /> Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Copy className="mr-2 h-4 w-4" /> Dupliquer
                            </DropdownMenuItem>
                            {r.isActive && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-amber-600"
                                  onClick={() => setRewardToDeactivate(r)}
                                >
                                  <PowerOff className="mr-2 h-4 w-4" /> Désactiver
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </ScrollArea>
        </Card>
      ) : (
        /* Vue en grille */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((r) => {
            const typeConfig = REWARD_TYPE_CONFIG[r.rewardType];
            return (
              <Card key={r.id} className="hover:shadow-lg transition-all duration-300 group">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center",
                        typeConfig.bgColor || "bg-primary/10"
                      )}>
                        <Gift className={cn("w-5 h-5", typeConfig.iconColor || "text-primary")} />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{r.title}</p>
                        <p className="text-xs text-muted-foreground">{r.partner.name}</p>
                      </div>
                    </div>
                    <Badge variant={r.isActive ? "default" : "secondary"} className="text-[10px]">
                      {r.isActive ? "Actif" : "Inactif"}
                    </Badge>
                  </div>
                  
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                    {r.description}
                  </p>

                  <div className="flex items-center justify-between text-sm">
                    <span className="font-bold text-primary">{r.pointsCost} pts</span>
                    <span className="text-muted-foreground">
                      {r.isUnlimited ? "∞" : r.stockQuantity} en stock
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modals */}
      <RewardFormModal
        open={rewardToEdit !== undefined}
        reward={rewardToEdit}
        partners={partners}
        isLoading={create.isPending || update.isPending}
        onClose={() => setRewardToEdit(undefined)}
        onSubmit={handleSubmit}
      />

      <ConfirmModal
        open={!!rewardToDeactivate}
        variant="warning"
        title="Désactiver la récompense"
        description={`Vous êtes sur le point de désactiver "${rewardToDeactivate?.title}". Cette récompense ne sera plus visible pour les donneurs.`}
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