import { RegionHeatmap } from "@/components/dashboard/RegionHeatmap";
import { FilterBar } from "@/components/shared/FilterBar";

export function HeatmapAndFiltersSection() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <div className="xl:col-span-2">
        <RegionHeatmap />
      </div>
      <div className="space-y-6">
        <FilterBar showRegion showDateRange />
      </div>
    </div>
  );
}