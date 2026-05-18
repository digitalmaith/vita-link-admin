"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PartnersTab } from "@/components/rewards/PartnersTab";
import { RewardsTab } from "@/components/rewards/RewardsTab";

export default function RewardsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Régie Jambaar Life</h2>
        <p className="text-sm text-muted-foreground">
          Partenaires · Récompenses
        </p>
      </div>

      <Tabs defaultValue="partners">
        <TabsList>
          <TabsTrigger value="partners">Partenaires</TabsTrigger>
          <TabsTrigger value="rewards">Récompenses</TabsTrigger>
        </TabsList>
        <TabsContent value="partners" className="mt-4">
          <PartnersTab />
        </TabsContent>
        <TabsContent value="rewards" className="mt-4">
          <RewardsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}