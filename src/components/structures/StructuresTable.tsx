"use client";

import { useState } from "react";
import { useStructures, useVerifyStructure, useSuspendStructure, useRejectStructure } from "@/hooks/useStructures";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, CheckCircle, XCircle, PauseCircle, Users, Bell, Heart } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { HealthStructure } from "@/services/structures.service";
import { STATUS_CONFIG } from "@/lib/constants/structures.constants";

export function StructuresTable() {
  const { data, isLoading } = useStructures();
  const verify = useVerifyStructure();
  const suspend = useSuspendStructure();
  const reject = useRejectStructure();

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  const structures: HealthStructure[] = data?.structures ?? [];

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Structure</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Adresse</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Statut</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Activité</th>
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
                structures.map((s) => {
                  const statusConfig = STATUS_CONFIG[s.status];
                  return (
                    <tr key={s.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium">{s.name}</p>
                        <p className="text-xs text-muted-foreground">{s.email}</p>
                        <p className="text-xs text-muted-foreground">{s.registrationNumber}</p>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs max-w-[180px] truncate">
                        {s.address}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig.className}`}>
                          {statusConfig.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" /> {s._count.staffMembers}
                          </span>
                          <span className="flex items-center gap-1">
                            <Bell className="w-3 h-3" /> {s._count.alerts}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="w-3 h-3" /> {s._count.donations}
                          </span>
                        </div>
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
                            {s.status === "PENDING_REVIEW" && (
                              <>
                                <DropdownMenuItem
                                  className="text-green-600"
                                  onClick={() => verify.mutate(s.id)}
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
                            {s.status === "VERIFIED" && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-amber-600"
                                  onClick={() => suspend.mutate({ id: s.id, reason: "Abus détecté" })}
                                >
                                  <PauseCircle className="mr-2 h-4 w-4" />
                                  Suspendre
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}