import type { Metadata } from "next";
import { StructuresTable } from "@/components/structures/StructuresTable";
import { FilterBar } from "@/components/shared/FilterBar";

export const metadata: Metadata = { title: "Structures de Santé" };

export default function StructuresPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Structures de Santé</h2>
          <p className="text-sm text-muted-foreground">
            Validation et certification des établissements
          </p>
        </div>
      </div>

      <FilterBar showRegion showStatus />
      <StructuresTable />
    </div>
  );
}
