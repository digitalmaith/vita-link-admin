"use client";

import { useQuery } from "@tanstack/react-query";
import { rewardsService } from "@/services/rewards.service";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Award } from "lucide-react";
import type { Badge as BadgeType } from "@/types";

export function BadgesTab() {
  const { data, isLoading } = useQuery({
    queryKey: ["badges"],
    queryFn: () => rewardsService.getBadges(),
  });

  const badges: BadgeType[] = data?.data ?? [];

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          Créer un badge
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-lg" />
          ))}
        </div>
      ) : badges.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Award className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>Aucun badge configuré.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {badges.map((badge) => (
            <Card key={badge.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{badge.icon}</span>
                    <div>
                      <p className="font-semibold text-sm">{badge.name}</p>
                      {badge.isSeasonal && (
                        <Badge variant="outline" className="text-xs mt-0.5">
                          {badge.season ?? "Saisonnier"}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Badge variant={badge.isActive ? "default" : "secondary"}>
                    {badge.isActive ? "Actif" : "Inactif"}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-1">{badge.description}</p>
                <p className="text-xs text-muted-foreground">
                  Attribué à{" "}
                  <span className="font-semibold text-foreground">{badge.awardedCount}</span>{" "}
                  Jambaars
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}