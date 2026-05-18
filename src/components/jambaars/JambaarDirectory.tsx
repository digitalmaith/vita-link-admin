"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { jambaarService } from "@/services/jambaars.service";
import { useFiltersStore } from "@/store/filters.store";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, PauseCircle, CheckCircle, Eye, Star } from "lucide-react";
import { SuspensionModal } from "./SuspensionModal";
import { PointsAdjustmentModal } from "./PointsAdjustmentModal";
import { JambaarDetailsSheet } from "./JambaarDetailsSheet";
import { getInitials, formatDate } from "@/lib/utils";
import { toast } from "sonner";
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

export function JambaarDirectory() {
  const [page, setPage] = useState(1);
  const { filters } = useFiltersStore();
  const queryClient = useQueryClient();

  const [selectedJambaar, setSelectedJambaar] = useState<Jambaar | null>(null);
  const [isSuspendOpen, setIsSuspendOpen] = useState(false);
  const [isPointsOpen, setIsPointsOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["jambaars", filters, page],
    queryFn: () =>
      jambaarService.getAll(
        { 
          bloodGroup: filters.bloodGroup, 
          region: filters.region,
          search: filters.search,
          grade: filters.grade
        },
        page
      ),
  });

  const reactivate = useMutation({
    mutationFn: (id: string) => jambaarService.reactivate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jambaars"] });
      toast.success("Jambaar réactivé");
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-36 rounded-lg" />
        ))}
      </div>
    );
  }

  const jambaars: Jambaar[] = data?.data ?? [];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {jambaars.length === 0 ? (
          <p className="text-muted-foreground col-span-full py-10 text-center">
            Aucun Jambaar trouvé.
          </p>
        ) : (
          jambaars.map((j) => (
            <Card 
              key={j.id} 
              className="group overflow-hidden relative hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-border/50 hover:border-primary/30 bg-gradient-to-b from-card to-card/50"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 to-rose-400/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 border-2 border-background shadow-sm group-hover:scale-105 transition-transform duration-300">
                      <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/5 text-primary text-sm font-bold">
                        {getInitials(`${j.firstName} ${j.lastName}`)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-bold text-base group-hover:text-primary transition-colors">
                        {j.firstName} {j.lastName}
                      </p>
                      <p className="text-xs font-medium text-muted-foreground/80 mt-0.5">
                        {GRADE_LABELS[j.grade]}
                      </p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedJambaar(j);
                          setIsDetailsOpen(true);
                        }}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Voir détails
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedJambaar(j);
                          setIsPointsOpen(true);
                        }}
                      >
                        <Star className="mr-2 h-4 w-4" />
                        Ajuster les points
                      </DropdownMenuItem>
                      
                      {j.status === "ACTIVE" ? (
                        <DropdownMenuItem
                          className="text-amber-600"
                          onClick={() => {
                            setSelectedJambaar(j);
                            setIsSuspendOpen(true);
                          }}
                        >
                          <PauseCircle className="mr-2 h-4 w-4" />
                          Suspendre
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem
                          className="text-green-600"
                          onClick={() => reactivate.mutate(j.id)}
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Réactiver
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                  <div className="bg-primary/5 hover:bg-primary/10 transition-colors rounded-xl py-2 px-1 border border-primary/10">
                    <p className="text-[10px] uppercase font-semibold text-primary/70 tracking-wider mb-1">Groupe</p>
                    <p className="text-lg font-black text-primary">{j.bloodGroup}</p>
                  </div>
                  <div className="bg-muted/40 hover:bg-muted/60 transition-colors rounded-xl py-2 px-1 border border-border/50">
                    <p className="text-[10px] uppercase font-semibold text-muted-foreground/70 tracking-wider mb-1">Dons</p>
                    <p className="text-lg font-bold">{j.totalDonations}</p>
                  </div>
                  <div className="bg-muted/40 hover:bg-muted/60 transition-colors rounded-xl py-2 px-1 border border-border/50">
                    <p className="text-[10px] uppercase font-semibold text-muted-foreground/70 tracking-wider mb-1">Présence</p>
                    <p className="text-lg font-bold">{j.commitmentRate}%</p>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {j.region} · {j.city}
                  </span>
                  <StatusBadge status={j.status} />
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Page {page} sur {data.totalPages} · {data.total} Jambaars</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
              Précédent
            </Button>
            <Button variant="outline" size="sm" disabled={page === data.totalPages} onClick={() => setPage((p) => p + 1)}>
              Suivant
            </Button>
          </div>
        </div>
      )}

      {/* Modals & Sheets */}
      <SuspensionModal
        jambaar={selectedJambaar}
        isOpen={isSuspendOpen}
        onClose={() => setIsSuspendOpen(false)}
      />
      <PointsAdjustmentModal
        jambaar={selectedJambaar}
        isOpen={isPointsOpen}
        onClose={() => setIsPointsOpen(false)}
      />
      <JambaarDetailsSheet
        jambaar={selectedJambaar}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
      />
    </div>
  );
}