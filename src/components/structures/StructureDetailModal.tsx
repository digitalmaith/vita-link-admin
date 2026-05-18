"use client";

import {
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StructureStatusBadge } from "./StructureStatusBadge";
import type { HealthStructure } from "@/services/structures.service";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import {
  Building2, 
  MapPin, 
  Phone, 
  Mail,
  Calendar, 
  Hash, 
  Users, 
  Bell, 
  Heart,
  CheckCircle, 
  XCircle, 
  PauseCircle,
  AlertTriangle,
  Shield,
  ExternalLink,
} from "lucide-react";

interface Props {
  structure: HealthStructure | null;
  open: boolean;
  onClose: () => void;
  onVerify: (id: string) => void;
  onSuspend: (id: string) => void;
  onReject: (id: string) => void;
  onReactivate: (id: string) => void;
}

export function StructureDetailModal({
  structure, open, onClose, onVerify, onSuspend, onReject, onReactivate,
}: Props) {
  if (!structure) return null;

  const stats = [
    { icon: Users, label: "Agents", value: structure._count.staffMembers },
    { icon: Bell, label: "Alertes", value: structure._count.alerts },
    { icon: Heart, label: "Dons", value: structure._count.donations },
  ];

  const infos = [
    { icon: Hash, label: "N° Enregistrement", value: structure.registrationNumber },
    { icon: MapPin, label: "Adresse", value: structure.address },
    { icon: Phone, label: "Téléphone", value: structure.phone, href: structure.phone ? `tel:${structure.phone}` : undefined },
    { icon: Mail, label: "Email", value: structure.email, href: structure.email ? `mailto:${structure.email}` : undefined },
    { icon: Calendar, label: "Inscrite le", value: formatDate(structure.createdAt) },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] flex flex-col p-0 gap-0">
        {/* En-tête fixe */}
        <div className="shrink-0 px-5 pt-5 pb-3">
          <DialogHeader className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 shrink-0">
                  <Building2 className="w-4 h-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <DialogTitle className="text-base font-bold truncate">
                    {structure.name}
                  </DialogTitle>
                  <DialogDescription className="text-xs truncate mt-0.5">
                    Structure de santé
                  </DialogDescription>
                </div>
              </div>
              <StructureStatusBadge status={structure.status} />
            </div>

            {/* Alerte certification */}
            {structure.verifiedAt && (
              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/30 text-xs">
                <Shield className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                  Certifiée le {formatDate(structure.verifiedAt)}
                </span>
              </div>
            )}

            {structure.status === "PENDING" && (
              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/30 text-xs">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                <span className="text-amber-700 dark:text-amber-400 font-medium">
                  En attente de vérification
                </span>
              </div>
            )}
          </DialogHeader>
        </div>

        {/* Contenu scrollable */}
        <ScrollArea className="flex-1 px-5 py-3">
          <div className="space-y-4">
            {/* Statistiques */}
            <div className="grid grid-cols-3 gap-2">
              {stats.map(({ icon: Icon, label, value }) => (
                <div 
                  key={label} 
                  className="bg-muted/50 rounded-lg p-2.5 text-center"
                >
                  <Icon className="w-4 h-4 mx-auto text-muted-foreground mb-1" />
                  <p className="text-lg font-bold leading-none">{value}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            <Separator />

            {/* Informations */}
            <div className="space-y-1">
              {infos.map(({ icon: Icon, label, value, href }) => (
                <div 
                  key={label} 
                  className="flex items-center gap-2.5 px-2.5 py-2 rounded-md hover:bg-muted/50 transition-colors group"
                >
                  <Icon className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-muted-foreground leading-tight">{label}</p>
                    <p className="text-sm font-medium truncate">{value || "—"}</p>
                  </div>
                  {href && (
                    <a 
                      href={href}
                      className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>

        {/* Actions fixes en bas */}
        <div className="shrink-0 px-5 py-3 border-t border-border bg-muted/30">
          <div className="flex gap-2">
            {structure.status === "PENDING" && (
              <>
                <Button 
                  size="sm"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => { onVerify(structure.id); onClose(); }}
                >
                  <CheckCircle className="mr-1.5 w-3.5 h-3.5" /> 
                  Certifier
                </Button>
                <Button 
                  size="sm"
                  variant="destructive"
                  className="flex-1"
                  onClick={() => { onReject(structure.id); onClose(); }}
                >
                  <XCircle className="mr-1.5 w-3.5 h-3.5" /> 
                  Rejeter
                </Button>
              </>
            )}
            
            {structure.status === "VERIFIED" && (
              <>
                <Button 
                  size="sm"
                  variant="outline" 
                  className="flex-1 text-amber-600 border-amber-300"
                  onClick={() => { onSuspend(structure.id); onClose(); }}
                >
                  <PauseCircle className="mr-1.5 w-3.5 h-3.5" /> 
                  Suspendre
                </Button>
                <Button 
                  size="sm"
                  variant="ghost" 
                  onClick={onClose}
                >
                  Fermer
                </Button>
              </>
            )}
            
            {structure.status === "SUSPENDED" && (
              <>
                <Button 
                  size="sm"
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  onClick={() => { onReactivate(structure.id); onClose(); }}
                >
                  <CheckCircle className="mr-1.5 w-3.5 h-3.5" /> 
                  Réactiver
                </Button>
                <Button 
                  size="sm"
                  variant="ghost" 
                  onClick={onClose}
                >
                  Fermer
                </Button>
              </>
            )}

            {structure.status === "REJECTED" && (
              <Button 
                size="sm"
                variant="ghost" 
                onClick={onClose}
                className="w-full"
              >
                Fermer
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}