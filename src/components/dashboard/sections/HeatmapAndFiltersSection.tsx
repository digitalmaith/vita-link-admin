import { RegionHeatmap } from "@/components/dashboard/heatmap/RegionHeatmap";
import { FilterBar } from "@/components/shared/FilterBar";
import { AlertsPanel } from "../AlertsPanel";
// import { RegionHeatmap } from "../heatmap/RegionHeatmap";

export function HeatmapAndFiltersSection() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <div className="xl:col-span-4">
        <RegionHeatmap />
      </div>
      {/* <div>
        <AlertsPanel />
      </div> */}
    </div>
  );
}