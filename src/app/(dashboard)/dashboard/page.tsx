import type { Metadata } from "next";
import { DashboardHeader } from "@/components/dashboard/composant/DashboardHeader";
import { DashboardContent } from "@/components/dashboard/composant/DashboardContent";
import { StructuresMap } from "@/components/dashboard/StructuresMap";

export const metadata: Metadata = {
  title: "Dashboard | Vita-Link",
  description: "Tableau de bord de gestion des dons de sang au Sénégal",
};

export default function DashboardPage() {
  return (
    <div className="space-y-6 p-6">
      {/* <DashboardHeader /> */}
      <DashboardContent />
      {/* <StructuresMap /> */}
    </div>
  );
}