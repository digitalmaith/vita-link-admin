"use client";

import { useQuery } from "@tanstack/react-query";
import { rewardsService } from "@/services/rewards.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Plus, Building2 } from "lucide-react";
import type { Partner } from "@/types";

const CATEGORY_LABELS: Record<Partner["category"], string> = {
  TELECOM: "Télécom",
  RETAIL: "Grande distribution",
  TRANSPORT: "Transport",
  HEALTH: "Santé",
  FOOD: "Alimentation",
  OTHER: "Autre",
};

export function PartnersTab() {
  const { data, isLoading } = useQuery({
    queryKey: ["partners"],
    queryFn: () => rewardsService.getPartners(),
  });

  const partners: Partner[] = data?.data ?? [];

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          Ajouter un partenaire
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
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
            <Card key={partner.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{partner.name}</CardTitle>
                  <Badge variant={partner.isActive ? "default" : "secondary"}>
                    {partner.isActive ? "Actif" : "Inactif"}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {CATEGORY_LABELS[partner.category]}
                </p>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {partner.rewards.length} récompense(s) configurée(s)
                </p>
                <div className="flex gap-2 mt-3">
                  <Button variant="outline" size="sm" className="flex-1">
                    Modifier
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Récompenses
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}