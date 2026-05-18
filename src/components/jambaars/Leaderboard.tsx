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
                className={`group flex items-center justify-between p-4 rounded-xl border transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 ${
                  isTop3 
                    ? 'bg-gradient-to-r from-amber-50/80 to-amber-100/30 dark:from-amber-950/20 dark:to-amber-900/10 border-amber-200/60 dark:border-amber-800/40 shadow-sm' 
                    : 'bg-card hover:bg-muted/50 border-border/50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-8 flex justify-center font-black text-lg ${isTop3 ? 'scale-110 drop-shadow-sm' : 'text-muted-foreground'}`}>
                    {icon || `#${index + 1}`}
                  </div>
                  <Avatar className={`h-11 w-11 border-2 transition-transform duration-300 group-hover:scale-110 ${isTop3 ? 'border-amber-200 dark:border-amber-800' : 'border-background shadow-sm'}`}>
                    <AvatarFallback className={`${isTop3 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300 font-bold' : 'bg-gradient-to-br from-primary/20 to-primary/5 text-primary font-bold'}`}>
                      {getInitials(`${jambaar.firstName} ${jambaar.lastName}`)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className={`font-bold text-base transition-colors ${isTop3 ? 'text-amber-950 dark:text-amber-50' : 'group-hover:text-primary'}`}>
                      {jambaar.firstName} {jambaar.lastName}
                    </p>
                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground/80 mt-1">
                      <span className={isTop3 ? 'text-amber-700/80 dark:text-amber-400/80' : ''}>{GRADE_LABELS[jambaar.grade] || jambaar.grade}</span>
                      <span className="opacity-50">•</span>
                      <span className={`flex items-center gap-1 ${isTop3 ? 'text-amber-700/80 dark:text-amber-400/80' : ''}`}>
                        <MapPin className="w-3.5 h-3.5" />
                        {jambaar.city}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={isTop3 ? "default" : "secondary"} className={`text-sm px-3 py-1 font-bold ${isTop3 ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-sm border-none' : ''}`}>
                    {jambaar.points} pts
                  </Badge>
                  <p className={`text-xs mt-1.5 font-medium text-right ${isTop3 ? 'text-amber-700/70 dark:text-amber-400/70' : 'text-muted-foreground/70'}`}>
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
