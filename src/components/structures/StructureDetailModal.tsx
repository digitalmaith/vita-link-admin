"use client";

import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { StructureStatusBadge } from "./StructureStatusBadge";
import type { HealthStructure } from "@/services/structures.service";
import { formatDate } from "@/lib/utils";
import {
  Building2, MapPin, Phone, Mail,
  Calendar, Hash, Users, Bell, Heart,
  CheckCircle, XCircle, PauseCircle,
} from "lucide-react";

interface Props {
  structure: HealthStructure | null;
  open: boolean;
  onClose: () => void;
  onVerify: (id: string) => void;
  onSuspend: (id: string) => void;
  onReject: (id: string) => void;
}

export function StructureDetailModal({
  structure, open, onClose, onVerify, onSuspend, onReject,
}: Props) {
  if (!structure) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            {structure.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <StructureStatusBadge status={structure.status} />
            {structure.verifiedAt && (
              <span className="text-xs text-muted-foreground">
                Certifiée le {formatDate(structure.verifiedAt)}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3">
            {[
              { icon: Hash, label: "Numéro d'enregistrement", value: structure.registrationNumber },
              { icon: MapPin, label: "Adresse", value: structure.address },
              { icon: Phone, label: "Téléphone", value: structure.phone },
              { icon: Mail, label: "Email", value: structure.email },
              { icon: Calendar, label: "Inscrite le", value: formatDate(structure.createdAt) },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-2 text-sm">
                <Icon className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="font-medium">{value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Users, label: "Agents", value: structure._count.staffMembers },
              { icon: Bell, label: "Alertes", value: structure._count.alerts },
              { icon: Heart, label: "Dons", value: structure._count.donations },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="bg-muted/50 rounded-lg p-3 text-center">
                <Icon className="w-4 h-4 mx-auto text-muted-foreground mb-1" />
                <p className="text-xl font-bold">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-2 pt-2 border-t border-border">
            {structure.status === "PENDING" && (
              <>
                <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={() => { onVerify(structure.id); onClose(); }}>
                  <CheckCircle className="mr-2 w-4 h-4" /> Certifier
                </Button>
                <Button size="sm" variant="destructive" className="flex-1"
                  onClick={() => { onReject(structure.id); onClose(); }}>
                  <XCircle className="mr-2 w-4 h-4" /> Rejeter
                </Button>
              </>
            )}
            {structure.status === "VERIFIED" && (
              <Button size="sm" variant="outline" className="flex-1 text-amber-600 border-amber-300"
                onClick={() => { onSuspend(structure.id); onClose(); }}>
                <PauseCircle className="mr-2 w-4 h-4" /> Suspendre
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}