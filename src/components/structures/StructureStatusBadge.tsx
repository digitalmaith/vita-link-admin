import { STATUS_CONFIG } from "../../lib/constants/structures.constants";

type Status = keyof typeof STATUS_CONFIG;

export function StructureStatusBadge({ status }: { status: Status }) {
  const config = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${config.className}`}>
      {config.label}
    </span>
  );
}