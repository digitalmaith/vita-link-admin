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
import { Award, MapPin, Phone, Mail, Droplet, Clock, Calendar } from "lucide-react";
import type { Jambaar } from "@/types";

interface JambaarDetailsSheetProps {
  jambaar: Jambaar | null;
  isOpen: boolean;
  onClose: () => void;
}

const GRADE_LABELS: Record<string, string> = {
  ASPIRANT: "🩸 Aspirant",
  SENTINELLE: "🛡️ Sentinelle",
  AMBASSADEUR: "🌟 Ambassadeur",
  // Fallbacks for old data
  RECRUE: "🩸 Recrue",
  JAMBAAR: "⚔️ Jambaar",
  JAMBAAR_ELITE: "🌟 Élite",
  CHAMPION: "🏆 Champion",
};

export function JambaarDetailsSheet({ jambaar, isOpen, onClose }: JambaarDetailsSheetProps) {
  const { data: historyData, isLoading } = useQuery({
    queryKey: ["jambaar-donations", jambaar?.id],
    queryFn: () => jambaar ? jambaarService.getDonationHistory(jambaar.id) : null,
    enabled: !!jambaar,
  });

  if (!jambaar) return null;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="text-left">
          <SheetTitle>Profil du Jambaar</SheetTitle>
          <SheetDescription>
            Détails, statistiques et historique des dons.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Header Profile */}
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                {getInitials(`${jambaar.firstName} ${jambaar.lastName}`)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-bold">
                {jambaar.firstName} {jambaar.lastName}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <StatusBadge status={jambaar.status} />
                <Badge variant="outline" className="font-normal">
                  {GRADE_LABELS[jambaar.grade] || jambaar.grade}
                </Badge>
              </div>
            </div>
          </div>

          {/* Contact & Info */}
          <div className="bg-muted/30 rounded-lg p-4 space-y-3 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>{jambaar.city}, {jambaar.region}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="w-4 h-4" />
              <span>{jambaar.phone}</span>
            </div>
            {jambaar.email && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>{jambaar.email}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>Inscrit le {formatDate(jambaar.createdAt)}</span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-primary/5 rounded-lg p-3 border border-primary/10">
              <div className="flex items-center gap-2 text-primary mb-1">
                <Droplet className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase">Groupe Sanguin</span>
              </div>
              <p className="text-2xl font-bold">{jambaar.bloodGroup}</p>
            </div>
            <div className="bg-amber-500/5 rounded-lg p-3 border border-amber-500/10">
              <div className="flex items-center gap-2 text-amber-600 mb-1">
                <Award className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase">Points</span>
              </div>
              <p className="text-2xl font-bold text-amber-600">{jambaar.points}</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1 uppercase font-semibold">Dons totaux</p>
              <p className="text-xl font-bold">{jambaar.totalDonations}</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1 uppercase font-semibold">Taux de présence</p>
              <p className="text-xl font-bold">{jambaar.commitmentRate}%</p>
            </div>
          </div>

          {/* Historique des dons */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              Historique des dons
            </h4>
            
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-16 w-full rounded-lg" />
                <Skeleton className="h-16 w-full rounded-lg" />
              </div>
            ) : (historyData as any)?.data && ((historyData as any).data as any[]).length > 0 ? (
              <div className="space-y-3">
                {/* Simulated history data rendering. The actual API returns might differ */}
                {((historyData as any).data as any[]).map((donation, idx) => (
                  <div key={idx} className="bg-background border rounded-lg p-3 text-sm flex justify-between items-center">
                    <div>
                      <p className="font-medium">{donation.structureName || "Hôpital"}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(donation.date || new Date().toISOString())}</p>
                    </div>
                    <Badge variant={donation.status === 'COMPLETED' ? 'default' : 'secondary'}>
                      {donation.pointsEarned ? `+${donation.pointsEarned} pts` : 'Terminé'}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-muted/30 border border-dashed rounded-lg p-6 text-center text-sm text-muted-foreground">
                Aucun don enregistré pour le moment.
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
