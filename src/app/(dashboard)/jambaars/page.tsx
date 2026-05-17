import type { Metadata } from "next";
import { JambaarDirectory } from "@/components/jambaars/JambaarDirectory";
import { Leaderboard } from "@/components/jambaars/Leaderboard";
import { FilterBar } from "@/components/shared/FilterBar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const metadata: Metadata = { title: "Jambaars" };

export default function JambaarPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Jambaars & Modération</h2>
        <p className="text-sm text-muted-foreground">
          Annuaire des donneurs, classements, gestion des litiges et support.
        </p>
      </div>

      <Tabs defaultValue="directory" className="space-y-6">
        <TabsList>
          <TabsTrigger value="directory">Annuaire & Modération</TabsTrigger>
          <TabsTrigger value="jambaar-life">Jambaar Life</TabsTrigger>
        </TabsList>

        <TabsContent value="directory" className="space-y-6">
          <FilterBar showRegion showBloodGroup showSearch showGrade />
          <JambaarDirectory />
        </TabsContent>

        <TabsContent value="jambaar-life" className="space-y-6">
          <FilterBar showRegion />
          <Leaderboard />
        </TabsContent>
      </Tabs>
    </div>
  );
}
