"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
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
import { MoreHorizontal, PauseCircle, CheckCircle, MapPin, Mail, Sparkles, ShieldCheck } from "lucide-react";
import { getInitials } from "@/lib/utils";
import { toast } from "sonner";
import type { Jambaar } from "@/types";

// Stylisation fine par grade pour l'affichage de l'annuaire
const GRADE_METADATA: Record<Jambaar["grade"], { label: string; text: string; bg: string; borderL: string; badge: string }> = {
  ASPIRANT: {
    label: "🩸 Aspirant",
    text: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-500/5",
    borderL: "border-l-rose-500",
    badge: "bg-rose-500/10 hover:bg-rose-500/15 border-rose-500/20 text-rose-600 dark:text-rose-400"
  },
  SENTINELLE: {
    label: "🛡️ Sentinelle",
    text: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-500/5",
    borderL: "border-l-blue-500",
    badge: "bg-blue-500/10 hover:bg-blue-500/15 border-blue-500/20 text-blue-600 dark:text-blue-400"
  },
  AMBASSADEUR: {
    label: "🌟 Ambassadeur",
    text: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/5",
    borderL: "border-l-amber-500",
    badge: "bg-amber-500/10 hover:bg-amber-500/15 border-amber-500/20 text-amber-600 dark:text-amber-400"
  },
};

export function JambaarDirectory() {
  const [page, setPage] = useState(1);
  const { filters } = useFiltersStore();
  const queryClient = useQueryClient();
  const { status: sessionStatus } = useSession();

  const { data, isLoading, error } = useQuery({
    queryKey: ["jambaars", filters, page],
    queryFn: () =>
      jambaarService.getAll(
        {
          bloodGroup: filters.bloodGroup,
          // grade: filters.grade,
          search: filters.search,
        },
        page
      ),
    enabled: sessionStatus === "authenticated",
  });

  const suspend = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      jambaarService.suspend(id, reason),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jambaars"] });
      toast.success("Jambaar suspendu");
    },

    onError: (error) => {
      console.error("Erreur suspension :", error);

      toast.error("Erreur lors de la suspension");
    },
  });

  const reactivate = useMutation({
    mutationFn: (id: string) => jambaarService.reactivate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jambaars"] });
      toast.success("Jambaar réactivé");
    },
    onError: (err: any) => {
      console.error("Erreur réactivation:", err);
      toast.error("Erreur lors de la réactivation", {
        description: err?.message || "Vérifiez la console pour plus de détails.",
      });
    },
  });

  if (sessionStatus === "loading" || isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-44 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 text-center border border-dashed rounded-2xl bg-destructive/5 border-destructive/20 text-sm text-destructive font-medium">
        Une erreur est survenue lors du chargement des Jambaars.
      </div>
    );
  }

  const jambaars: Jambaar[] = data?.data ?? [];
  const filteredJambaars = jambaars.filter((j) => {
  const matchBloodGroup =
    !filters.bloodGroup || j.bloodGroup === filters.bloodGroup;

  const matchGrade =
    !filters.grade || j.grade === filters.grade;

  const matchSearch =
    !filters.search ||
    `${j.firstName} ${j.lastName}`
      .toLowerCase()
      .includes(filters.search.toLowerCase());

  return matchBloodGroup && matchGrade && matchSearch;
});

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredJambaars.length === 0 ? (
          <div className="col-span-full py-16 text-center border border-dashed rounded-2xl bg-card">
            <p className="text-muted-foreground font-semibold">Aucun Jambaar trouvé.</p>
          </div>
        ) : (
          filteredJambaars.map((j) => {
            const currentGrade = GRADE_METADATA[j.grade] || {
              label: j.grade,
              text: "text-muted-foreground",
              bg: "bg-muted/50",
              borderL: "border-l-muted",
              badge: ""
            };

            const isSuspended = j.status !== "ACTIVE";

            return (
              <Card
                key={j.id}
                className={`overflow-hidden border border-border/60 bg-gradient-to-br from-card to-card/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-l-4 ${currentGrade.borderL} relative group ${isSuspended ? 'opacity-85' : ''}`}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-11 w-11 ring-2 ring-primary/5 transition-transform duration-300 group-hover:scale-105">
                        <AvatarFallback className="bg-primary/10 text-primary text-sm font-bold">
                          {getInitials(`${j.firstName} ${j.lastName}`)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-0.5">
                        <p className="font-extrabold text-sm text-foreground group-hover:text-primary transition-colors">
                          {j.firstName} {j.lastName}
                        </p>
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${currentGrade.badge}`}>
                            {currentGrade.label}
                          </span>
                        </div>
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-muted">
                          <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44">
                        {j.status === "ACTIVE" ? (
                          <DropdownMenuItem
                            className="text-amber-600 font-semibold focus:text-amber-600 focus:bg-amber-500/5 cursor-pointer"
                            onClick={() =>
                              suspend.mutate({ id: j.id, reason: "Absence répétée" })
                            }
                          >
                            <PauseCircle className="mr-2 h-4 w-4" />
                            Suspendre
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            className="text-emerald-600 font-semibold focus:text-emerald-600 focus:bg-emerald-500/5 cursor-pointer"
                            onClick={() => reactivate.mutate(j.id)}
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Réactiver
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Premier Grid Statistique */}
                  <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                    <div className="bg-muted/30 rounded-xl py-2 px-1 border border-border/20 transition-colors hover:bg-muted/40">
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Groupe</p>
                      <p className="text-sm font-black text-rose-500 mt-0.5">{j.bloodGroup}</p>
                    </div>
                    <div className="bg-muted/30 rounded-xl py-2 px-1 border border-border/20 transition-colors hover:bg-muted/40">
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Dons</p>
                      <p className="text-sm font-black text-foreground mt-0.5">{j.totalDonations}</p>
                    </div>
                    <div className="bg-muted/30 rounded-xl py-2 px-1 border border-border/20 transition-colors hover:bg-muted/40">
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Présence</p>
                      <p className="text-sm font-black text-foreground mt-0.5">{j.commitmentRate}%</p>
                    </div>
                  </div>

                  {/* Second Grid Statistique */}
                  <div className="mt-2 grid grid-cols-2 gap-2 text-center">
                    <div className="bg-gradient-to-br from-amber-500/[0.03] to-amber-600/[0.01] rounded-xl py-2 px-1 border border-amber-500/10 transition-colors hover:bg-amber-500/[0.06]">
                      <p className="text-[10px] text-amber-600/80 dark:text-amber-400 uppercase font-bold tracking-wider flex items-center justify-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-500 fill-amber-500/20" /> Points
                      </p>
                      <p className="text-sm font-black text-amber-600 dark:text-amber-400 mt-0.5">{j.points}</p>
                    </div>
                    <div className="bg-muted/30 rounded-xl py-2 px-1 border border-border/20 transition-colors hover:bg-muted/40">
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Téléphone</p>
                      <p className="text-xs font-bold text-foreground mt-1 truncate px-1">{j.phone}</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3.5 border-t border-border/60 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground font-semibold flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-muted-foreground/60" />
                      {j.city !== "—" ? j.city : "Ville non renseignée"}
                    </span>
                    <StatusBadge status={j.status} />
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Pagination moderne */}
      {data && data.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 p-4 rounded-xl border bg-card text-sm text-muted-foreground shadow-sm">
          <span className="font-medium text-xs sm:text-sm">
            Page <strong className="text-foreground">{page}</strong> sur <strong className="text-foreground">{data.totalPages}</strong> · <strong className="text-foreground">{data.total}</strong> Jambaars
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="font-semibold text-xs py-1.5 h-9 rounded-lg"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Précédent
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="font-semibold text-xs py-1.5 h-9 rounded-lg"
              disabled={page === data.totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Suivant
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}