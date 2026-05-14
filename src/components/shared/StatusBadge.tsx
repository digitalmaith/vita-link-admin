import { cn } from "@/lib/utils";
import type { Status } from "@/types";

const STATUS_CONFIG: Record<Status, { label: string; className: string }> = {
  ACTIVE: {
    label: "Actif",
    className: "bg-green-100 text-green-700 border-green-200",
  },
  PENDING: {
    label: "En attente",
    className: "bg-amber-100 text-amber-700 border-amber-200",
  },
  SUSPENDED: {
    label: "Suspendu",
    className: "bg-red-100 text-red-700 border-red-200",
  },
  REJECTED: {
    label: "Rejeté",
    className: "bg-gray-100 text-gray-600 border-gray-200",
  },
};

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
