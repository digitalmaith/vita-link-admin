import type { Metadata } from "next";
import { JambaarDirectory } from "@/components/jambaars/JambaarDirectory";
import { FilterBar } from "@/components/shared/FilterBar";

export const metadata: Metadata = { title: "Jambaars" };

export default function JambaarPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Modération des Jambaars</h2>
        <p className="text-sm text-muted-foreground">
          Annuaire des donneurs · Gestion des litiges · Support
        </p>
      </div>
      <FilterBar showRegion showBloodGroup />
      <JambaarDirectory />
    </div>
  );
}
