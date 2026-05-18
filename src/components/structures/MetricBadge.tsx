import { cn } from "@/lib/utils";
import { METRIC_CONFIG} from "@/lib/constants/structures.constants";

// Composant pour les métriques
export const MetricBadge = ({ value, config }: { value: number; config: typeof METRIC_CONFIG.staffMembers }) => {
  const Icon = config.icon;
  return (
    <div className="group relative">
      <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-gradient-to-br from-background to-muted/50 border border-border/30 hover:border-border/60 hover:shadow-sm transition-all duration-200 cursor-help">
        <div className={cn("p-0.5 rounded", `bg-gradient-to-br ${config.color}`)}>
          <Icon className="w-2.5 h-2.5 text-white" />
        </div>
        <span className="text-xs font-bold">{value}</span>
        <span className="text-[10px] text-muted-foreground group-hover:text-foreground transition-colors">{config.label}</span>
      </div>
      {/* Tooltip personnalisé simple */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 pointer-events-none">
        {value} {config.label}
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-popover" />
      </div>
    </div>
  );
};