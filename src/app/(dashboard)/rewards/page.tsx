"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PartnersTab } from "@/components/rewards/PartnersTab";
import { RewardsTab } from "@/components/rewards/RewardsTab";
import { Gift, Store, Sparkles } from "lucide-react";

export default function RewardsPage() {
  return (
    <div className="space-y-6 w-full"> {/* ✅ Ajouter w-full */}
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h1 className="text-xl font-bold text-foreground">
              Jambaar Life
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Gérez les récompenses et les partenaires du programme de fidélité
          </p>
        </div>
      </div>

      {/* Tabs en haut */}
      <Tabs defaultValue="partners" className="w-full flex-col">
        <TabsList className="w-ful sm:w-[250px] ">
          <TabsTrigger value="partners" className="gap-2">
            <Store className="w-4 h-4" />
            Partenaires
          </TabsTrigger>
          <TabsTrigger value="rewards" className="gap-2">
            <Gift className="w-4 h-4" />
            Récompenses
          </TabsTrigger>
        </TabsList>

        <TabsContent value="partners" className="mt-6">
          <PartnersTab />
        </TabsContent>

        <TabsContent value="rewards" className="mt-6">
          <RewardsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}