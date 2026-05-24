import type { Metadata } from "next";
import { BadgesTab } from "@/components/badges/BadgesTab";

export const metadata: Metadata = { title: "Badges & Défis" };

export default function BadgesPage() {
  return (
    <div className="space-y-6">
     
      <BadgesTab />
    </div>
  );
}