"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { jambaarService } from "@/services/jambaars.service";
import { useFiltersStore } from "@/store/filters.store";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {
  MoreHorizontal,
  PauseCircle,
  CheckCircle,
  MapPin,
  Mail,
  ShieldCheck,
  Phone,
  Heart,
  Clock,
  X,
  Star,
  Trophy,
  Crown,
  Flame,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import { getInitials } from "@/lib/utils";
import { toast } from "sonner";
import type { Jambaar } from "@/types";
import { cn } from "@/lib/utils";

const GRADE_CONFIG: Record<Jambaar["grade"], {
  label: string;
  color: string;
  icon: React.ReactNode;
  emoji: string;
}> = {
  ASPIRANT: { label: "Aspirant", color: "#f43f5e", icon: <Flame className="w-3 h-3" />, emoji: "🔥" },
  SENTINELLE: { label: "Sentinelle", color: "#3b82f6", icon: <ShieldCheck className="w-3 h-3" />, emoji: "🛡️" },
  AMBASSADEUR: { label: "Ambassadeur", color: "#f59e0b", icon: <Crown className="w-3 h-3" />, emoji: "👑" },
};

const BLOOD_COLORS: Record<string, string> = {
  "A+": "#ef4444", "A-": "#f87171", "B+": "#8b5cf6", "B-": "#a78bfa",
  "AB+": "#ec4899", "AB-": "#f472b6", "O+": "#f59e0b", "O-": "#fbbf24",
};

// Extrait un message lisible depuis n'importe quelle erreur
function extractErrorMessage(err: unknown): string {
  if (!err) return "Erreur inconnue";
  if (err instanceof Error) return err.message;
  if (typeof err === "object") {
    const e = err as Record<string, unknown>;
    if (typeof e.message === "string") return e.message;
    if (typeof e.error === "string") return e.error;
    const json = JSON.stringify(e);
    if (json !== "{}") return json;
  }
  return String(err);
}

export function JambaarDirectory() {
  const [page, setPage] = useState(1);
  const [selectedJambaar, setSelectedJambaar] = useState<Jambaar | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // État du dialog de confirmation suspension
  const [confirmSuspend, setConfirmSuspend] = useState<{ id: string; name: string } | null>(null);

  const { filters } = useFiltersStore();
  const queryClient = useQueryClient();
  const { status: sessionStatus } = useSession();

  const { data, isLoading, error } = useQuery({
    queryKey: ["jambaars", filters, page],
    queryFn: () =>
      jambaarService.getAll(
        { bloodGroup: filters.bloodGroup, search: filters.search },
        page
      ),
    enabled: sessionStatus === "authenticated",
  });

  const suspend = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      jambaarService.suspend(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jambaars"] });
      setSelectedJambaar(prev => prev ? { ...prev, status: "SUSPENDED" } : null);
      setConfirmSuspend(null);
      toast.success("Jambaar suspendu");
    },
    onError: (err: unknown) => {
      const message = extractErrorMessage(err);
      console.error("Erreur suspension :", message);
      toast.error("Erreur lors de la suspension", { description: message });
    },
  });

  const reactivate = useMutation({
    mutationFn: (id: string) => jambaarService.reactivate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jambaars"] });
      setSelectedJambaar(prev => prev ? { ...prev, status: "ACTIVE" } : null);
      toast.success("Jambaar réactivé");
    },
    onError: (err: unknown) => {
      const message = extractErrorMessage(err);
      console.error("Erreur réactivation :", message);
      toast.error("Erreur lors de la réactivation", { description: message });
    },
  });

  // Ouvre le dialog de confirmation avant de suspendre
  function handleSuspendRequest(id: string, name: string) {
    setConfirmSuspend({ id, name });
  }

  function handleSuspendConfirm() {
    if (!confirmSuspend) return;
    suspend.mutate({ id: confirmSuspend.id, reason: "Absence répétée" });
  }

  if (sessionStatus === "loading" || isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton key={i} className="h-[76px] rounded-2xl" />
        ))}
      </div>
    );
  }

  if (error) {
    console.error("Erreur chargement Jambaars:", error);
  }

  const jambaars: Jambaar[] = data?.data ?? [];
  const filteredJambaars = jambaars.filter((j) => {
    const matchBloodGroup = !filters.bloodGroup || j.bloodGroup === filters.bloodGroup;
    const matchGrade = !filters.grade || j.grade === filters.grade;
    const matchSearch =
      !filters.search ||
      `${j.firstName} ${j.lastName}`.toLowerCase().includes(filters.search.toLowerCase());
    return matchBloodGroup && matchGrade && matchSearch;
  });

  return (
    <div className="space-y-4">
      {/* Grille */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {filteredJambaars.length === 0 ? (
          <div className="col-span-full py-20 text-center">
            <p className="text-sm text-muted-foreground/50 font-light">Aucun Jambaar trouvé</p>
          </div>
        ) : (
          filteredJambaars.map((j) => {
            const grade = GRADE_CONFIG[j.grade] || GRADE_CONFIG.ASPIRANT;
            const bloodColor = BLOOD_COLORS[j.bloodGroup] || "#6b7280";
            const isSuspended = j.status !== "ACTIVE";

            return (
              <div
                key={j.id}
                className={cn(
                  "group relative transition-all duration-300",
                  isSuspended && "opacity-40"
                )}
              >
                <div
                  onClick={() => {
                    setSelectedJambaar(j);
                    setDialogOpen(true);
                  }}
                  className="relative flex items-center gap-4 p-3.5 rounded-2xl bg-card border border-border/30 shadow-sm hover:shadow-md hover:border-border/50 transition-all duration-300 cursor-pointer"
                >
                  <div
                    className="absolute left-0 top-3 bottom-3 w-[2px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ backgroundColor: grade.color }}
                  />

                  <div className="relative shrink-0">
                    <div
                      className="absolute inset-0 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{ backgroundColor: grade.color + "30" }}
                    />
                    <Avatar className="relative h-10 w-10 ring-1 ring-border/30 group-hover:ring-0 transition-all">
                      <AvatarFallback
                        className="text-xs font-bold text-white"
                        style={{ background: `linear-gradient(135deg, ${grade.color}dd, ${grade.color})` }}
                      >
                        {getInitials(`${j.firstName} ${j.lastName}`)}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate group-hover:text-primary transition-colors">
                      {j.firstName} {j.lastName}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-2.5 h-2.5" />
                        {j.city !== "—" ? j.city : "N/A"}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-muted-foreground/20" />
                      <span className="text-[11px] font-bold" style={{ color: bloodColor }}>
                        {j.bloodGroup}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="text-right">
                      <p className="text-sm font-bold tabular-nums">{j.totalDonations}</p>
                      <p className="text-[9px] text-muted-foreground/60">dons</p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-muted">
                          <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44">
                        {j.status === "ACTIVE" ? (
                          <DropdownMenuItem
                            className="text-amber-600 font-semibold focus:text-amber-600 focus:bg-amber-500/5 cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSuspendRequest(j.id, `${j.firstName} ${j.lastName}`);
                            }}
                          >
                            <PauseCircle className="mr-2 h-4 w-4" />
                            Suspendre
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            className="text-emerald-600 font-semibold focus:text-emerald-600 focus:bg-emerald-500/5 cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              reactivate.mutate(j.id);
                            }}
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Réactiver
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Dialog de confirmation suspension */}
      <Dialog open={!!confirmSuspend} onOpenChange={(open) => { if (!open) setConfirmSuspend(null); }}>
        <DialogContent className="max-w-xs rounded-2xl border-border/30 shadow-2xl">
          <div className="flex flex-col items-center text-center gap-3 pt-2">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold">Suspendre ce Jambaar ?</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground mt-1">
                <span className="font-semibold text-foreground">{confirmSuspend?.name}</span> ne pourra
                plus accéder à la plateforme tant que la suspension n'est pas levée.
              </DialogDescription>
            </div>
          </div>
          <DialogFooter className="flex gap-2 mt-2">
            <Button
              variant="outline"
              className="flex-1 rounded-xl"
              onClick={() => setConfirmSuspend(null)}
              disabled={suspend.isPending}
            >
              Annuler
            </Button>
            <Button
              className="flex-1 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold"
              onClick={handleSuspendConfirm}
              disabled={suspend.isPending}
            >
              {suspend.isPending ? "En cours…" : "Confirmer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Popup détail Jambaar */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-sm p-0 gap-0 overflow-hidden rounded-3xl border-border/30 shadow-2xl bg-card">
          <VisuallyHidden>
            <DialogTitle>
              {selectedJambaar
                ? `${selectedJambaar.firstName} ${selectedJambaar.lastName}`
                : "Détails"}
            </DialogTitle>
          </VisuallyHidden>

          {selectedJambaar && (() => {
            const grade = GRADE_CONFIG[selectedJambaar.grade] || GRADE_CONFIG.ASPIRANT;
            const bloodColor = BLOOD_COLORS[selectedJambaar.bloodGroup] || "#6b7280";
            const isSuspended = selectedJambaar.status !== "ACTIVE";

            const createdAt = selectedJambaar.createdAt
              ? new Date(selectedJambaar.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
              : null;

            const updatedAt = selectedJambaar.createdAt
              ? new Date(selectedJambaar.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
              : null;

            return (
              <div className="relative">
                {/* Overlay décoratif — ne doit pas capturer les clics */}
                <div
                  className="absolute inset-0 opacity-[0.03] pointer-events-none"
                  style={{ background: `radial-gradient(circle at 50% 0%, ${grade.color} 0%, transparent 70%)` }}
                />

                <button
                  onClick={() => setDialogOpen(false)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center z-20 hover:bg-background transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>

                <div className="relative z-10 pt-10 pb-6 flex flex-col items-center text-center px-6">
                  <div className="relative mb-4">
                    <div
                      className="absolute inset-0 rounded-full blur-xl opacity-20 pointer-events-none"
                      style={{ backgroundColor: grade.color }}
                    />
                    <Avatar className="relative h-16 w-16 ring-2 ring-background shadow-sm">
                      <AvatarFallback
                        className="text-xl font-bold text-white"
                        style={{ background: `linear-gradient(135deg, ${grade.color}, ${grade.color}cc)` }}
                      >
                        {getInitials(`${selectedJambaar.firstName} ${selectedJambaar.lastName}`)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <h2 className="text-lg font-bold tracking-tight">
                    {selectedJambaar.firstName} {selectedJambaar.lastName}
                  </h2>
                  <div className="flex items-center gap-2 mt-1.5">
                    <Badge
                      className="text-[10px] font-medium gap-1 px-2 py-0 border-0 shadow-sm"
                      style={{ backgroundColor: grade.color + "10", color: grade.color }}
                    >
                      {grade.emoji} {grade.label}
                    </Badge>
                    <Badge
                      className="text-[10px] font-bold px-2 py-0 border-0 shadow-sm"
                      style={{ backgroundColor: bloodColor + "10", color: bloodColor }}
                    >
                      {selectedJambaar.bloodGroup}
                    </Badge>
                  </div>
                </div>

                <div className="relative z-10 grid grid-cols-3 divide-x divide-border/30 border-y border-border/30 bg-muted/20">
                  {[
                    { value: selectedJambaar.totalDonations, label: "Dons" },
                    { value: `${selectedJambaar.commitmentRate}%`, label: "Présence" },
                    { value: selectedJambaar.points, label: "Points" },
                  ].map((stat, i) => (
                    <div key={i} className="py-4 text-center">
                      <p className="text-lg font-extrabold tracking-tight">{stat.value}</p>
                      <p className="text-[10px] text-muted-foreground/60 uppercase tracking-wider">{stat.label}</p>
                    </div>
                  ))}
                </div>

                <div className="relative z-10 px-6 py-4 space-y-3">
                  <div className="flex items-center gap-2.5 text-sm">
                    <Phone className="w-3.5 h-3.5 text-muted-foreground/40 shrink-0" />
                    <span className="text-muted-foreground">{selectedJambaar.phone}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm">
                    <MapPin className="w-3.5 h-3.5 text-muted-foreground/40 shrink-0" />
                    <span className="text-muted-foreground">{selectedJambaar.city !== "—" ? selectedJambaar.city : "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm">
                    <Mail className="w-3.5 h-3.5 text-muted-foreground/40 shrink-0" />
                    <span className="text-muted-foreground truncate">{selectedJambaar.email || "—"}</span>
                  </div>
                </div>

                <div className="relative z-10 px-6 pb-3 space-y-2">
                  {createdAt && (
                    <div className="flex items-center gap-2.5 text-xs text-muted-foreground/60">
                      <Calendar className="w-3 h-3 shrink-0" />
                      <span>Inscrit le {createdAt}</span>
                    </div>
                  )}
                  {updatedAt && (
                    <div className="flex items-center gap-2.5 text-xs text-muted-foreground/60">
                      <Clock className="w-3 h-3 shrink-0" />
                      <span>Dernière modification : {updatedAt}</span>
                    </div>
                  )}
                </div>

                <div className="relative z-10 px-6 pb-2">
                  <div className="h-1 rounded-full bg-muted/50 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{
                        width: `${selectedJambaar.commitmentRate}%`,
                        background: `linear-gradient(90deg, ${grade.color}, ${grade.color}66)`,
                      }}
                    />
                  </div>
                </div>

                <div className="relative z-10 px-6 py-3 flex flex-wrap gap-1.5">
                  {[
                    { cond: selectedJambaar.totalDonations >= 1, icon: Heart, label: "1er don" },
                    { cond: selectedJambaar.totalDonations >= 5, icon: ShieldCheck, label: "5 dons" },
                    { cond: selectedJambaar.totalDonations >= 10, icon: Trophy, label: "10 dons" },
                    { cond: selectedJambaar.commitmentRate >= 80, icon: Star, label: "Assidu" },
                  ].filter(b => b.cond).map((b, i) => (
                    <Badge key={i} variant="outline" className="gap-1 px-2 py-0.5 text-[10px] rounded-full border-border/30">
                      <b.icon className="w-2.5 h-2.5" /> {b.label}
                    </Badge>
                  ))}
                </div>

                <div className="relative z-10 p-4 border-t border-border/30">
                  {isSuspended ? (
                    <Button
                      className="w-full h-10 rounded-xl font-semibold text-sm bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm"
                      disabled={reactivate.isPending}
                      onClick={() => reactivate.mutate(selectedJambaar.id)}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      {reactivate.isPending ? "En cours…" : "Réactiver"}
                    </Button>
                  ) : (
                    <Button
                      variant="destructive"
                      className="w-full h-10 rounded-xl font-semibold text-sm shadow-sm"
                      disabled={suspend.isPending}
                      onClick={() => handleSuspendRequest(
                        selectedJambaar.id,
                        `${selectedJambaar.firstName} ${selectedJambaar.lastName}`
                      )}
                    >
                      <PauseCircle className="w-4 h-4 mr-2" />
                      Suspendre
                    </Button>
                  )}
                </div>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs font-medium"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            ← Précédent
          </Button>
          <span className="text-xs text-muted-foreground/50 tabular-nums">
            {page} / {data.totalPages}
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs font-medium"
            disabled={page === data.totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Suivant →
          </Button>
        </div>
      )}
    </div>
  );
}