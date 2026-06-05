"use client";

import { ConfirmModal } from "@/components/shared/ConfirmModal";
import type { Badge } from "@/services/badges.service";

interface BadgeConfirmModalsProps {
  badgeToDeactivate: Badge | null;
  badgeToReactivate: Badge | null;
  isLoadingDeactivate: boolean;
  isLoadingReactivate: boolean;
  onCloseDeactivate: () => void;
  onCloseReactivate: () => void;
  onConfirmDeactivate: () => void;
  onConfirmReactivate: () => void;
}

export function BadgeConfirmModals({
  badgeToDeactivate,
  badgeToReactivate,
  isLoadingDeactivate,
  isLoadingReactivate,
  onCloseDeactivate,
  onCloseReactivate,
  onConfirmDeactivate,
  onConfirmReactivate,
}: BadgeConfirmModalsProps) {
  return (
    <>
      <ConfirmModal
        open={!!badgeToDeactivate}
        variant="warning"
        title="Désactiver le badge"
        description={
          <span>
            Vous êtes sur le point de désactiver{" "}
            <span className="font-semibold text-foreground">{badgeToDeactivate?.name}</span>.
            Ce badge ne sera plus attribué aux donneurs.
          </span>
        }
        confirmLabel="Désactiver"
        isLoading={isLoadingDeactivate}
        onClose={onCloseDeactivate}
        onConfirm={onConfirmDeactivate}
      />

      <ConfirmModal
        open={!!badgeToReactivate}
        variant="info"
        title="Réactiver le badge"
        description={
          <span>
            Vous êtes sur le point de réactiver{" "}
            <span className="font-semibold text-foreground">{badgeToReactivate?.name}</span>.
            Ce badge pourra à nouveau être attribué aux donneurs.
          </span>
        }
        confirmLabel="Réactiver"
        isLoading={isLoadingReactivate}
        onClose={onCloseReactivate}
        onConfirm={onConfirmReactivate}
      />
    </>
  );
}