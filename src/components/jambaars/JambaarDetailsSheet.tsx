"use client";

import { useQuery } from "@tanstack/react-query";
import { jambaarService } from "@/services/jambaars.service";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { getInitials, formatDate } from "@/lib/utils";
import { Award, MapPin, Phone, Mail, Droplet, Clock, Calendar, Check, Hospital } from "lucide-react";
import type { Jambaar } from "@/types";

interface JambaarDetailsSheetProps {
  jambaar: Jambaar | null;
  isOpen: boolean;
  onClose: () => void;
}

// Configuration dynamique pour un rendu premium par grade
const GRADE_CONFIG: Record<string, { label: string; text: string; bg: string; ring: string }> = {
  ASPIRANT: { label: "🩸 Aspirant", text: "text-rose-600 dark:text-rose-400", bg: "bg-rose-500/10", ring: "ring-rose-500/30" },
  SENTINELLE: { label: "🛡️ Sentinelle", text: "text-blue-600 dark:text-blue-400", bg: "bg-blue-500/10", ring: "ring-blue-500/30" },
  AMBASSADEUR: { label: "🌟 Ambassadeur", text: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500/10", ring: "ring-amber-500/30" },
  // Fallbacks
  RECRUE: { label: "🩸 Recrue", text: "text-rose-600 dark:text-rose-400", bg: "bg-rose-500/10", ring: "ring-rose-500/30" },
  JAMBAAR: { label: "⚔️ Jambaar", text: "text-slate-600 dark:text-slate-400", bg: "bg-slate-500/10", ring: "ring-slate-500/30" },
  JAMBAAR_ELITE: { label: "🌟 Élite", text: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500/10", ring: "ring-amber-500/30" },
  CHAMPION: { label: "🏆 Champion", text: "text-purple-600 dark:text-purple-400", bg: "bg-purple-500/10", ring: "ring-purple-500/30" },
};

export function JambaarDetailsSheet({ jambaar, isOpen, onClose }: JambaarDetailsSheetProps) {
  const { data: historyData, isLoading } = useQuery({
    queryKey: ["jambaar-donations", jambaar?.id],
    queryFn: () => jambaar ? jambaarService.getDonationHistory(jambaar.id) : null,
    enabled: !!jambaar,
  });

  if (!jambaar) return null;

  const currentGradeConfig = GRADE_CONFIG[jambaar.grade] || {
    label: jambaar.grade,
    text: "text-muted-foreground",
    bg: "bg-muted",
    ring: "ring-transparent",
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto border-l border-border/80">
        <SheetHeader className="text-left border-b pb-5 mb-6">
          <SheetTitle className="text-2xl font-bold tracking-tight">Profil du Jambaar</SheetTitle>
          <SheetDescription className="text-sm">
            Détails, statistiques et historique des dons.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6">
          {/* Header Profile avec glow */}
          <div className="flex items-center gap-4 bg-gradient-to-br from-muted/40 to-transparent p-4 rounded-xl border border-border/50">
            <Avatar className={`h-16 w-16 ring-4 ${currentGradeConfig.ring} transition-transform duration-300 hover:scale-105`}>
              <AvatarFallback className="bg-primary/10 text-primary text-xl font-black">
                {getInitials(`${jambaar.firstName} ${jambaar.lastName}`)}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1.5">
              <h3 className="text-xl font-extrabold tracking-tight">
                {jambaar.firstName} {jambaar.lastName}
              </h3>
              <div className="flex items-center gap-2 flex-wrap">
                <StatusBadge status={jambaar.status} />
                <Badge variant="secondary" className={`font-semibold text-xs py-0.5 ${currentGradeConfig.text} ${currentGradeConfig.bg}`}>
                  {currentGradeConfig.label}
                </Badge>
              </div>
            </div>
          </div>

          {/* Contact & Info */}
          <div className="bg-card border border-border/60 rounded-xl p-4 space-y-3.5 text-sm shadow-sm">
            <div className="flex items-center gap-3 text-muted-foreground group">
              <div className="p-2 rounded-lg bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors">
                <MapPin className="w-4 h-4 text-blue-500" />
              </div>
              <span className="font-medium text-foreground">{jambaar.city}, {jambaar.region}</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground group">
              <div className="p-2 rounded-lg bg-green-500/5 group-hover:bg-green-500/10 transition-colors">
                <Phone className="w-4 h-4 text-green-500" />
              </div>
              <span className="font-semibold text-foreground tracking-wide">{jambaar.phone}</span>
            </div>
            {jambaar.email && (
              <div className="flex items-center gap-3 text-muted-foreground group">
                <div className="p-2 rounded-lg bg-indigo-500/5 group-hover:bg-indigo-500/10 transition-colors">
                  <Mail className="w-4 h-4 text-indigo-500" />
                </div>
                <span className="font-medium text-foreground break-all">{jambaar.email}</span>
              </div>
            )}
            <div className="flex items-center gap-3 text-muted-foreground group border-t pt-3 mt-1">
              <div className="p-2 rounded-lg bg-purple-500/5">
                <Calendar className="w-4 h-4 text-purple-500" />
              </div>
              <span className="text-xs">Inscrit le {formatDate(jambaar.createdAt)}</span>
            </div>
          </div>

          {/* Stats Grid avec style Premium */}
          <div className="grid grid-cols-2 gap-3">
            {/* Groupe Sanguin */}
            <div className="bg-gradient-to-br from-rose-500/5 to-rose-600/[0.02] rounded-xl p-3.5 border border-rose-500/10 transition-all duration-300 hover:shadow-sm">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 mb-1">
                <Droplet className="w-4 h-4 fill-current animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Groupe</span>
              </div>
              <p className="text-3xl font-black text-rose-600 dark:text-rose-400">{jambaar.bloodGroup}</p>
            </div>

            {/* Points */}
            <div className="bg-gradient-to-br from-amber-500/5 to-amber-600/[0.02] rounded-xl p-3.5 border border-amber-500/10 transition-all duration-300 hover:shadow-sm">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 mb-1">
                <Award className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Points</span>
              </div>
              <p className="text-3xl font-black text-amber-600 dark:text-amber-400">{jambaar.points}</p>
            </div>

            {/* Dons totaux */}
            <div className="bg-gradient-to-br from-slate-500/5 to-slate-600/[0.02] border rounded-xl p-3.5 transition-all duration-300 hover:shadow-sm">
              <span className="text-[10px] text-muted-foreground mb-1 uppercase font-bold tracking-wider block">Dons totaux</span>
              <p className="text-2xl font-extrabold">{jambaar.totalDonations}</p>
            </div>

            {/* Taux de présence */}
            <div className="bg-gradient-to-br from-emerald-500/5 to-emerald-600/[0.02] border border-emerald-500/10 rounded-xl p-3.5 transition-all duration-300 hover:shadow-sm">
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 mb-1 uppercase font-bold tracking-wider block">Taux présence</span>
              <div className="flex items-baseline gap-1">
                <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">{jambaar.commitmentRate}%</p>
              </div>
            </div>
          </div>

          {/* Timeline de l'Historique des dons */}
          <div className="pt-2">
            <h4 className="font-bold text-sm mb-4 uppercase tracking-wider flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4" />
              Historique des dons
            </h4>
            
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-16 w-full rounded-xl" />
                <Skeleton className="h-16 w-full rounded-xl" />
              </div>
            ) : (historyData as any)?.data && ((historyData as any).data as any[]).length > 0 ? (
              <div className="relative pl-4 border-l-2 border-muted space-y-5 py-1">
                {((historyData as any).data as any[]).map((donation, idx) => (
                  <div key={idx} className="relative group">
                    {/* Indicateur point sur la timeline */}
                    <div className="absolute -left-[23px] top-1.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-background shadow group-hover:scale-125 transition-transform duration-300" />
                    
                    <div className="bg-card border border-border/70 rounded-xl p-3.5 text-sm shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/20">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <div className="flex items-center gap-1.5 font-bold text-foreground">
                            <Hospital className="w-3.5 h-3.5 text-muted-foreground" />
                            {donation.structureName || "Hôpital"}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(donation.date || new Date().toISOString())}
                          </p>
                        </div>
                        <Badge className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold px-2 py-0.5 rounded-md">
                          {donation.pointsEarned ? `+${donation.pointsEarned} pts` : <Check className="w-3.5 h-3.5" />}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-muted/20 border border-dashed rounded-xl p-8 text-center text-sm text-muted-foreground">
                Aucun don enregistré pour le moment.
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}