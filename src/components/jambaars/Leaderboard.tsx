"use client";

import { useQuery } from "@tanstack/react-query";
import { jambaarService } from "@/services/jambaars.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getInitials } from "@/lib/utils";
import { Trophy, Medal, MapPin, Star } from "lucide-react";
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
    queryFn: () => jambaarService.getAll({ sort: "points", limit: 10 } as any),
  });

  if (isLoading) {
    return (
      <Card className="border-border/60">
        <CardHeader className="border-b pb-4">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500 animate-bounce" />
            Classement des Jambaars
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </CardContent>
      </Card>
    );
  }

  const jambaars: Jambaar[] = [...(data?.data ?? [])].sort((a, b) => b.points - a.points).slice(0, 10);

  return (
    <Card className="border-border/60 shadow-lg overflow-hidden relative">
      <div className="absolute right-0 top-0 -mt-10 -mr-10 w-40 h-40 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
      <CardHeader className="border-b bg-muted/20 pb-4">
        <CardTitle className="text-xl font-black flex items-center gap-2">
          <Trophy className="w-6 h-6 text-amber-500 drop-shadow" />
          Top 10 des Jambaars d'Élite
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3.5 pt-6">
        {jambaars.length === 0 ? (
          <p className="text-muted-foreground text-center py-8 font-semibold">Aucun Jambaar classé pour le moment.</p>
        ) : (
          jambaars.map((jambaar, index) => {
            const isTop3 = index < 3;
            let icon = null;
            let podiumStyle = "";
            let pointsBadgeStyle = "";

            if (index === 0) {
              icon = <Trophy className="w-6 h-6 text-yellow-500 animate-pulse drop-shadow-sm" />;
              podiumStyle = "bg-gradient-to-r from-yellow-500/10 via-amber-500/[0.05] to-transparent border-yellow-400 dark:border-yellow-600/60 shadow-md shadow-amber-500/5 scale-[1.01]";
              pointsBadgeStyle = "bg-gradient-to-r from-yellow-500 to-amber-500 text-white font-extrabold shadow-sm border-none";
            } else if (index === 1) {
              icon = <Medal className="w-6 h-6 text-slate-400 drop-shadow-sm" />;
              podiumStyle = "bg-gradient-to-r from-slate-400/10 via-slate-500/[0.03] to-transparent border-slate-300 dark:border-slate-700 shadow-sm";
              pointsBadgeStyle = "bg-gradient-to-r from-slate-400 to-slate-500 text-white font-extrabold border-none shadow-sm";
            } else if (index === 2) {
              icon = <Medal className="w-6 h-6 text-amber-700 dark:text-amber-600 drop-shadow-sm" />;
              podiumStyle = "bg-gradient-to-r from-amber-700/10 via-amber-800/[0.03] to-transparent border-amber-600/40 dark:border-amber-900/40 shadow-sm";
              pointsBadgeStyle = "bg-gradient-to-r from-amber-700 to-amber-800 text-white font-extrabold border-none shadow-sm";
            } else {
              podiumStyle = "bg-card hover:bg-muted/30 border-border/60 hover:border-primary/20";
              pointsBadgeStyle = "bg-secondary text-secondary-foreground font-bold hover:bg-secondary";
            }

            return (
              <div 
                key={jambaar.id} 
                className={`group flex items-center justify-between p-4 rounded-xl border transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 ${podiumStyle}`}
              >
                <div className="flex items-center gap-4">
                  {/* Position ou Médaille */}
                  <div className={`w-8 flex justify-center items-center font-black text-lg ${isTop3 ? 'scale-110 drop-shadow-sm' : 'text-muted-foreground/60'}`}>
                    {icon || `#${index + 1}`}
                  </div>
                  
                  {/* Avatar avec contour assorti */}
                  <Avatar className={`h-11 w-11 border-2 transition-transform duration-300 group-hover:scale-105 shadow-sm ${
                    index === 0 ? 'border-yellow-400' : index === 1 ? 'border-slate-300' : index === 2 ? 'border-amber-600' : 'border-background'
                  }`}>
                    <AvatarFallback className={`font-black ${
                      index === 0 
                        ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300' 
                        : index === 1 
                        ? 'bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300'
                        : index === 2
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-primary/10 text-primary'
                    }`}>
                      {getInitials(`${jambaar.firstName} ${jambaar.lastName}`)}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <p className={`font-bold text-base transition-colors flex items-center gap-1.5 ${isTop3 ? 'text-foreground' : 'group-hover:text-primary'}`}>
                      {jambaar.firstName} {jambaar.lastName}
                      {index === 0 && <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-500 animate-spin-slow" />}
                    </p>
                    <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground/80 mt-1">
                      <span>{GRADE_LABELS[jambaar.grade] || jambaar.grade}</span>
                      <span className="opacity-45">•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-muted-foreground/75" />
                        {jambaar.city}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <Badge variant="secondary" className={`text-xs px-3 py-1 font-extrabold tracking-wide ${pointsBadgeStyle}`}>
                    {jambaar.points} pts
                  </Badge>
                  <p className={`text-xs mt-1.5 font-bold ${isTop3 ? 'text-foreground/80' : 'text-muted-foreground/75'}`}>
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