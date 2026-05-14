"use client";

import { useState } from "react";
import { useStructures, useValidateStructure, useRejectStructure, useSuspendStructure } from "@/lib/hooks/useStructures";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, CheckCircle, XCircle, PauseCircle, FileText } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { HealthStructure } from "@/types";

export function StructuresTable() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useStructures(undefined, page);
  const validate = useValidateStructure();
  const reject = useRejectStructure();
  const suspend = useSuspendStructure();

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  const structures: HealthStructure[] = data?.data ?? [];

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Structure</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Région</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Statut</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Alertes</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Inscrite le</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {structures.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-muted-foreground">
                      Aucune structure trouvée.
                    </td>
                  </tr>
                ) : (
                  structures.map((s) => (
                    <tr key={s.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium">{s.name}</p>
                        <p className="text-xs text-muted-foreground">{s.email}</p>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{s.region}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={s.status} />
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-medium">{s.alertsCount}</span>
                        <span className="text-xs text-muted-foreground ml-1">
                          ({s.foundedAlerts} fondées)
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">
                        {formatDate(s.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <FileText className="mr-2 h-4 w-4" />
                              Voir les documents
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {s.status === "PENDING" && (
                              <>
                                <DropdownMenuItem
                                  className="text-green-600"
                                  onClick={() => validate.mutate(s.id)}
                                >
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Certifier
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() => reject.mutate({ id: s.id, reason: "Documents insuffisants" })}
                                >
                                  <XCircle className="mr-2 h-4 w-4" />
                                  Rejeter
                                </DropdownMenuItem>
                              </>
                            )}
                            {s.status === "ACTIVE" && (
                              <DropdownMenuItem
                                className="text-amber-600"
                                onClick={() => suspend.mutate({ id: s.id, reason: "Abus détecté" })}
                              >
                                <PauseCircle className="mr-2 h-4 w-4" />
                                Suspendre
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Page {page} sur {data.totalPages} · {data.total} structures
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