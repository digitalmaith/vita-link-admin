"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal, CheckCircle, XCircle, PauseCircle,
  Users, Bell, Heart, MapPin, Phone, Building2,
} from "lucide-react";
import { StructureStatusBadge } from "./StructureStatusBadge";
import type { HealthStructure } from "@/services/structures.service";

interface Props {
  structures: HealthStructure[];
  onSelect: (s: HealthStructure) => void;
  onVerify: (id: string) => void;
  onSuspend: (id: string) => void;
  onReject: (id: string) => void;
}

export function StructuresCardView({ structures, onSelect, onVerify, onSuspend, onReject }: Props) {
  if (structures.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <Building2 className="w-10 h-10 mx-auto mb-3 opacity-30" />
        <p>Aucune structure trouvée.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {structures.map((s) => (
        <Card key={s.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onSelect(s)}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Building2 className="w-4 h-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm truncate">{s.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{s.registrationNumber}</p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onSelect(s); }}>
                    Voir les détails
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {s.status === "PENDING" && (
                    <>
                      <DropdownMenuItem className="text-green-600"
                        onClick={(e) => { e.stopPropagation(); onVerify(s.id); }}>
                        <CheckCircle className="mr-2 h-4 w-4" /> Certifier
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive"
                        onClick={(e) => { e.stopPropagation(); onReject(s.id); }}>
                        <XCircle className="mr-2 h-4 w-4" /> Rejeter
                      </DropdownMenuItem>
                    </>
                  )}
                  {s.status === "VERIFIED" && (
                    <DropdownMenuItem className="text-amber-600"
                      onClick={(e) => { e.stopPropagation(); onSuspend(s.id); }}>
                      <PauseCircle className="mr-2 h-4 w-4" /> Suspendre
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="space-y-1.5 mb-3">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="w-3 h-3 shrink-0" />
                <span className="truncate">{s.address}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Phone className="w-3 h-3 shrink-0" />
                <span>{s.phone}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <StructureStatusBadge status={s.status} />
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {s._count.staffMembers}</span>
                <span className="flex items-center gap-1"><Bell className="w-3 h-3" /> {s._count.alerts}</span>
                <span className="flex items-center gap-1"><Heart className="w-3 h-3" /> {s._count.donations}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}