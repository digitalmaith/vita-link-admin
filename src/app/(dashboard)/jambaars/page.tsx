import type { Metadata } from "next";
import { JambaarDirectory } from "@/components/jambaars/JambaarDirectory";
import { Leaderboard } from "@/components/jambaars/Leaderboard";
import { FilterBar } from "@/components/shared/FilterBar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Shield, Trophy } from "lucide-react";

export const metadata: Metadata = { title: "Jambaars & Modération" };

export default function JambaarPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-rose-400 bg-clip-text text-transparent">
          Jambaars & Modération
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Gérez l'annuaire des donneurs, suivez les classements et animez la communauté Jambaar Life.
        </p>
      </div>

      <Tabs defaultValue="directory" className="space-y-6">
        <TabsList className="bg-muted/50 p-1 border">
          <TabsTrigger value="directory" className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Shield className="w-4 h-4" />
            Annuaire & Modération
          </TabsTrigger>
          <TabsTrigger value="jambaar-life" className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Trophy className="w-4 h-4 text-amber-500" />
            Jambaar Life
          </TabsTrigger>
        </TabsList>

        <TabsContent value="directory" className="space-y-6 focus-visible:outline-none focus-visible:ring-0">
          <div className="bg-card border rounded-xl p-4 shadow-sm">
            <FilterBar showRegion showBloodGroup showSearch showGrade />
          </div>
          <JambaarDirectory />
        </TabsContent>

        <TabsContent value="jambaar-life" className="space-y-6 focus-visible:outline-none focus-visible:ring-0">
          <div className="bg-card border rounded-xl p-4 shadow-sm">
            <FilterBar showRegion />
          </div>
          <Leaderboard />
        </TabsContent>
      </Tabs>
    </div>
  );
}
