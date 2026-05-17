"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { jambaarService } from "@/services/jambaars.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getInitials } from "@/lib/utils";
import { Trophy, Medal, MapPin } from "lucide-react";
import type { Jambaar } from "@/types";

const GRADE_LABELS: Record<string, string> = {
  ASPIRANT: "🩸 Aspirant",
  SENTINELLE: "🛡️ Sentinelle",
  AMBASSADEUR: "🌟 Ambassadeur",
  // Fallbacks
  RECRUE: "🩸 Recrue",
  JAMBAAR: "⚔️ Jambaar",
  JAMBAAR_ELITE: "🌟 Élite",
  CHAMPION: "🏆 Champion",
};

export function Leaderboard() {
  const { data, isLoading } = useQuery({
    queryKey: ["jambaars-leaderboard"],
    // We fetch Jambaars sorted by points (assuming backend handles this if we pass a sort param, 
    // or we just fetch and sort locally for the demo)
    queryFn: () => jambaarService.getAll({ sort: "points", limit: 10 } as any),
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            Classement des Jambaars
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </CardContent>
      </Card>
    );
  }

  // Assuming data.data is our list. Let's sort locally just in case the backend didn't.
  const jambaars: Jambaar[] = [...(data?.data ?? [])].sort((a, b) => b.points - a.points).slice(0, 10);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500" />
          Top 10 des Jambaars
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {jambaars.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">Aucun Jambaar classé pour le moment.</p>
        ) : (
          jambaars.map((jambaar, index) => {
            const isTop3 = index < 3;
            let icon = null;
            if (index === 0) icon = <Trophy className="w-5 h-5 text-yellow-500" />;
            else if (index === 1) icon = <Medal className="w-5 h-5 text-gray-400" />;
            else if (index === 2) icon = <Medal className="w-5 h-5 text-amber-700" />;

            return (
              <div 
                key={jambaar.id} 
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  isTop3 ? 'bg-amber-50/50 dark:bg-amber-950/10 border-amber-100 dark:border-amber-900/50' : 'bg-background'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 flex justify-center font-bold text-muted-foreground">
                    {icon || `#${index + 1}`}
                  </div>
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className={`${isTop3 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300' : 'bg-primary/10 text-primary'}`}>
                      {getInitials(`${jambaar.firstName} ${jambaar.lastName}`)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-sm">
                      {jambaar.firstName} {jambaar.lastName}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                      <span>{GRADE_LABELS[jambaar.grade] || jambaar.grade}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {jambaar.city}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={isTop3 ? "default" : "secondary"} className={isTop3 ? "bg-amber-500 hover:bg-amber-600" : ""}>
                    {jambaar.points} pts
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1 text-right">
                    {jambaar.totalDonations} dons
                  </p>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
