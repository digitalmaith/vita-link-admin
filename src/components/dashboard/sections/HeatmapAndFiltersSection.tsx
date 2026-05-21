import { RegionHeatmap } from "@/components/dashboard/RegionHeatmap";
import { FilterBar } from "@/components/shared/FilterBar";
import { AlertsPanel } from "../AlertsPanel";

export function HeatmapAndFiltersSection() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <div className="xl:col-span-3">
        <RegionHeatmap />
      </div>
      {/* <div>
        <AlertsPanel />
      </div> */}
    </div>
  );
}