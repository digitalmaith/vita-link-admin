"use client";

import { JambaarDirectory } from "@/components/jambaars/JambaarDirectory";
import { Leaderboard } from "@/components/jambaars/Leaderboard";
import { FilterBar } from "@/components/shared/FilterBar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Trophy, Activity } from "lucide-react";
import { useFiltersStore } from "@/store/filters.store";
import { useQuery } from "@tanstack/react-query";
import { jambaarService } from "@/services/jambaars.service";

export default function JambaarPage() {
  const { filters } = useFiltersStore();
 const { data } = useQuery({
  queryKey: ["jambaars-count", filters],
  queryFn: () =>
    jambaarService.getAll(
      {
        bloodGroup: filters.bloodGroup,
        search: filters.search,
        grade: filters.grade,
      },
      1
    ),
  enabled: true,
});
const jambaarCount = data?.total ?? data?.data?.length ?? 0;


  return (
    <div className="space-y-6 w-full">
      {/* 1. En-tête global et unique */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 md:p-8 text-white shadow-xl border border-slate-800">
        <div className="absolute right-0 top-0 -mt-6 -mr-6 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute left-1/3 bottom-0 -mb-6 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary-foreground tracking-wider uppercase">
              <Activity className="w-3.5 h-3.5 animate-pulse text-rose-500" />
              Panneau d'administration
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-rose-200 bg-clip-text text-transparent">
              Jambaars & Modération
            </h1>
            <p className="text-slate-400 text-sm md:text-base max-w-2xl font-medium">
              Gérez l'annuaire des donneurs, suivez les classements et animez la communauté Jambaar Life.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Tabs avec design amélioré */}
      <Tabs defaultValue="directory" className="w-full flex-col">
        <TabsList className="w-full sm:w-auto bg-muted/30 p-1 rounded-xl gap-1">
          <TabsTrigger 
            value="directory" 
            className="gap-2 px-5 py-2.5 rounded-lg transition-all duration-300 
              data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/10 data-[state=active]:to-primary/5 
              data-[state=active]:text-primary data-[state=active]:shadow-md 
              data-[state=active]:border data-[state=active]:border-primary/20
              data-[state=active]:scale-105
              hover:bg-muted/50 hover:scale-102
              font-semibold text-sm"
          >
            <Shield className="w-4 h-4 transition-all duration-300 data-[state=active]:text-primary data-[state=active]:scale-110" />
            Annuaire & Modération
            <span className="hidden md:inline-flex ml-1.5 px-1.5 py-0.5 text-[10px] font-bold bg-primary/10 rounded-full data-[state=active]:bg-primary/20">
           {jambaarCount}
            </span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="jambaar-life" 
            className="gap-2 px-5 py-2.5 rounded-lg transition-all duration-300 
              data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500/10 data-[state=active]:to-amber-500/5 
              data-[state=active]:text-amber-600 data-[state=active]:shadow-md 
              data-[state=active]:border data-[state=active]:border-amber-500/20
              data-[state=active]:scale-105
              hover:bg-muted/50 hover:scale-102
              font-semibold text-sm group"
          >
            <Trophy className="w-4 h-4 text-amber-500 transition-all duration-300 group-hover:rotate-12 data-[state=active]:rotate-0 data-[state=active]:scale-110" />
            Jambaar Life
            <span className="hidden md:inline-flex ml-1.5 px-1.5 py-0.5 text-[10px] font-bold bg-amber-500/10 rounded-full text-amber-600 data-[state=active]:bg-amber-500/20">
              Top 10
            </span>
          </TabsTrigger>
        </TabsList>

        {/* 3. Contenu Annuaire & Modération */}
        <TabsContent value="directory" className="mt-6 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="bg-card/70 border border-border/60 backdrop-blur-sm rounded-2xl p-5 shadow-md transition-all duration-300 hover:shadow-lg hover:border-primary/20">
            <div className="flex items-center justify-between mb-4">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <div className="w-1 h-4 bg-primary rounded-full"></div>
                Recherche & Filtres rapides
              </div>
              <div className="text-[10px] text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
                {filters.bloodGroup || filters.grade || filters.search ? "Filtres actifs" : "Tous les filtres"}
              </div>
            </div>
            <FilterBar showBloodGroup showSearch showGrade />
          </div>
          
          <JambaarDirectory />
        </TabsContent>

        {/* 4. Contenu Jambaar Life */}
        <TabsContent value="jambaar-life" className="mt-6 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
          {/* <div className="bg-card/70 border border-border/60 backdrop-blur-sm rounded-2xl p-5 shadow-md transition-all duration-300 hover:shadow-lg hover:border-amber-500/20">
            <div className="flex items-center justify-between mb-4">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <div className="w-1 h-4 bg-amber-500 rounded-full"></div>
                Filtres de classement
              </div>
              <div className="text-[10px] text-amber-600 bg-amber-500/10 px-2 py-1 rounded-full">
                {filters.bloodGroup ? "Filtre actif" : "Classement général"}
              </div>
            </div>
            <FilterBar showBloodGroup />
          </div> */}
          <Leaderboard />
        </TabsContent>
      </Tabs>
    </div>
  );
}