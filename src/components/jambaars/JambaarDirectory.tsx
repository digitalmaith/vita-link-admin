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
import { MoreHorizontal, PauseCircle, CheckCircle } from "lucide-react";
import { getInitials } from "@/lib/utils";
import { toast } from "sonner";
import type { Jambaar } from "@/types";

const GRADE_EMOJIS: Record<Jambaar["grade"], string> = {
  ASPIRANT: "🩸 Aspirant",
  SENTINELLE: "⚔️ Sentinelle",
  AMBASSADEUR: "🌟 Ambassadeur",
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
          region: filters.region,
        },
        page
      ),
    enabled: sessionStatus === "authenticated",
  });

  const suspend = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      jambaarService.suspend(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jambaars"] });
      toast.success("Jambaar suspendu");
    },
    onError: () => toast.error("Erreur lors de la suspension"),
  });

  const reactivate = useMutation({
    mutationFn: (id: string) => jambaarService.reactivate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jambaars"] });
      toast.success("Jambaar réactivé");
    },
    onError: () => toast.error("Erreur lors de la réactivation"),
  });

  if (sessionStatus === "loading" || isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-36 rounded-lg" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-10 text-center text-sm text-destructive">
        Une erreur est survenue lors du chargement des Jambaars.
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
            <Card key={j.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary text-sm font-bold">
                        {getInitials(`${j.firstName} ${j.lastName}`)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-sm">
                        {j.firstName} {j.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {GRADE_EMOJIS[j.grade]}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {j.email}
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
                      {j.status === "ACTIVE" ? (
                        <DropdownMenuItem
                          className="text-amber-600"
                          onClick={() =>
                            suspend.mutate({ id: j.id, reason: "Absence répétée" })
                          }
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

                <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                  <div className="bg-muted/50 rounded-md py-1.5">
                    <p className="text-xs text-muted-foreground">Groupe</p>
                    <p className="text-sm font-bold text-primary">{j.bloodGroup}</p>
                  </div>
                  <div className="bg-muted/50 rounded-md py-1.5">
                    <p className="text-xs text-muted-foreground">Dons</p>
                    <p className="text-sm font-bold">{j.totalDonations}</p>
                  </div>
                  <div className="bg-muted/50 rounded-md py-1.5">
                    <p className="text-xs text-muted-foreground">Présence</p>
                    <p className="text-sm font-bold">{j.commitmentRate}%</p>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-center">
                  <div className="bg-muted/50 rounded-md py-1.5">
                    <p className="text-xs text-muted-foreground">Points</p>
                    <p className="text-sm font-bold">{j.points}</p>
                  </div>
                  <div className="bg-muted/50 rounded-md py-1.5">
                    <p className="text-xs text-muted-foreground">Téléphone</p>
                    <p className="text-sm font-bold">{j.phone}</p>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {j.city !== "—" ? j.city : "Ville non renseignée"}
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
          <span>
            Page {page} sur {data.totalPages} · {data.total} Jambaars
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Précédent
            </Button>
            <Button
              variant="outline"
              size="sm"
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