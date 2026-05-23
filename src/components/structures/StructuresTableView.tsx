"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal, CheckCircle, XCircle,
  PauseCircle, Users, Bell, Heart, Building2,
} from "lucide-react";
import { StructureStatusBadge } from "./StructureStatusBadge";
import type { HealthStructure } from "@/services/structures.service";
import { formatDate } from "@/lib/utils";

interface Props {
  structures: HealthStructure[];
  onSelect: (s: HealthStructure) => void;
  onVerify: (id: string) => void;
  onSuspend: (id: string) => void;
  onReject: (id: string) => void;
  onReactivate: (id: string) => void;
}

export function StructuresTableView({ structures, onSelect, onVerify, onSuspend, onReject, onReactivate }: Props) {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Structure</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Contact</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Statut</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Activité</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Inscrite le</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {structures.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-muted-foreground">
                    <Building2 className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    Aucune structure trouvée.
                  </td>
                </tr>
              ) : structures.map((s) => (
                <tr key={s.id}
                  className="hover:bg-muted/30 transition-colors cursor-pointer"
                  onClick={() => onSelect(s)}
                >
                  <td className="px-4 py-3">
                    <p className="font-medium">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.registrationNumber}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-xs text-muted-foreground">{s.email}</p>
                    <p className="text-xs text-muted-foreground">{s.phone}</p>
                  </td>
                  <td className="px-4 py-3">
                    <StructureStatusBadge status={s.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {s._count.staffMembers}</span>
                      <span className="flex items-center gap-1"><Bell className="w-3 h-3" /> {s._count.alerts}</span>
                      <span className="flex items-center gap-1"><Heart className="w-3 h-3" /> {s._count.donations}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {formatDate(s.createdAt)}
                  </td>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onSelect(s)}>
                          Voir les détails
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {s.status === "PENDING_REVIEW" && (
                          <>
                            <DropdownMenuItem className="text-green-600" onClick={() => onVerify(s.id)}>
                              <CheckCircle className="mr-2 h-4 w-4" /> Certifier
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive" onClick={() => onReject(s.id)}>
                              <XCircle className="mr-2 h-4 w-4" /> Rejeter
                            </DropdownMenuItem>
                          </>
                        )}
                        {s.status === "VERIFIED" && (
                          <DropdownMenuItem className="text-amber-600" onClick={() => onSuspend(s.id)}>
                            <PauseCircle className="mr-2 h-4 w-4" /> Suspendre
                          </DropdownMenuItem>
                        )}
                        {s.status === "SUSPENDED" && (
                          <DropdownMenuItem className="text-blue-600" onClick={() => onReactivate(s.id)}>
                            <CheckCircle className="mr-2 h-4 w-4" /> Réactiver
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}