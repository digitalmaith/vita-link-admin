import type { Metadata } from "next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PartnersTab } from "@/components/rewards/PartnersTab";
import { BadgesTab } from "@/components/rewards/BadgesTab";

export const metadata: Metadata = { title: "Récompenses" };

export default function RewardsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Régie Jambaar Life</h2>
        <p className="text-sm text-muted-foreground">
          Partenaires · Récompenses · Badges saisonniers
        </p>
      </div>

      <Tabs defaultValue="partners">
        <TabsList>
          <TabsTrigger value="partners">Partenaires</TabsTrigger>
          <TabsTrigger value="badges">Badges & Défis</TabsTrigger>
        </TabsList>
        <TabsContent value="partners" className="mt-4">
          <PartnersTab />
        </TabsContent>
        <TabsContent value="badges" className="mt-4">
          <BadgesTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
