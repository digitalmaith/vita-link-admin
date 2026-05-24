import { api } from "@/lib/api/client";
import type { DashboardKPIs, Alert, Region, BloodGroup, HeatmapPoint, RegionStats } from "@/types";

export interface DashboardFilters {
  region?: Region;
  bloodGroup?: BloodGroup;
  dateFrom?: string;
  dateTo?: string;
}

export interface MonthlyStat {
  month: string;
  donations: number;
  alerts: number;
  livesSaved: number;
}

export interface MonthlyStatsResponse {
  success: boolean;
  data: MonthlyStat[]; // ✅ Garantir que c'est un tableau
}

export interface ChartDataPoint {
  date: string;
  donors: number;
  alerts: number;
  donations: number;
  livesSaved: number;
}

export interface ChartDataResponse {
  success: boolean;
  data: ChartDataPoint[];
  year: number;
}

export interface ChartDataParams {
  year?: number;
  region?: Region;      // ✅ Pas string
  bloodGroup?: BloodGroup; // ✅ Pas string
}

export const dashboardService = {
  // Récupérer les KPIs du dashboard
  async getKPIs(filters?: DashboardFilters): Promise<DashboardKPIs> {
    const res = await api.get<{ success: boolean; kpis: DashboardKPIs }>(
      "/admin/dashboard",
      { params: filters }
    );
    return res.kpis;
  },

  // ✅ Récupérer les statistiques mensuelles
  async getMonthlyStats(year?: number): Promise<MonthlyStatsResponse> {
    const res = await api.get<MonthlyStatsResponse>(
      "/admin/stats/monthly",
      { params: { year: year || new Date().getFullYear() } }
    );
    
    // ✅ S'assurer que data est toujours un tableau
    return {
      success: res.success ?? true,
      data: Array.isArray(res.data) ? res.data : [],
    };
  },

  // ✅ Récupérer les données formatées pour le graphique
  async getChartData(params: {
    year?: number;
    region?: Region;      // ✅ Region
    bloodGroup?: BloodGroup; // ✅ BloodGroup
  } = {}): Promise<ChartDataResponse> {
    try {
      const year = params.year || new Date().getFullYear();
      const monthlyRes = await this.getMonthlyStats(year);
      
      // ✅ Vérifier que monthlyRes.data existe et est un tableau
      const monthlyData = Array.isArray(monthlyRes.data) ? monthlyRes.data : [];

      const chartData: ChartDataPoint[] = monthlyData.map((stat: MonthlyStat) => {
        const monthIndex = getMonthIndex(stat.month);
        const date = new Date(year, monthIndex, 1);
        
        return {
          date: date.toISOString().split('T')[0],
          donors: 0,
          alerts: stat.alerts || 0,
          donations: stat.donations || 0,
          livesSaved: stat.livesSaved || 0,
        };
      });

      return {
        success: true,
        data: chartData,
        year,
      };
    } catch (error) {
      console.error("Erreur lors de la récupération des données du graphique :", error);
      
      return {
        success: false,
        data: generateMockMonthlyData(params.year || new Date().getFullYear()),
        year: params.year || new Date().getFullYear(),
      };
    }
  },

  // Récupérer les statistiques par région
  async getRegionStats(filters?: DashboardFilters): Promise<any[]> {
    try {
      const res = await api.get<{ success: boolean; data: any[] } | any[]>(
        "/admin/stats/regions",
        { params: filters }
      );
      const data = Array.isArray(res) ? res : (res as any).data || (res as any).stats || [];
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Erreur lors de la récupération des stats régionales :", error);
      return [];
    }
  },

  getHeatmapData: async (filters?: DashboardFilters): Promise<HeatmapPoint[]> => {
    const res = await api.get<{ data: HeatmapPoint[] }>("/dashboard/heatmap", {
      params: filters,
    });
    return res.data ?? [];
  },

  getSystemAlerts: () =>
    api.get<Alert[]>("/dashboard/alerts"),

  getRecentAlerts: (limit = 10) =>
    api.get<Alert[]>("/alerts", {
      params: { limit, sort: "createdAt:desc" },
    }),

  async getRegionsStats(filters?: any): Promise<RegionStats[]> {
    const res = await api.get<{ success: boolean; data: RegionStats[] }>(
      '/admin/stats/regions',
      { params: filters }
    );
    return res.data ?? [];
  },
};

// ✅ Fonction getMonthIndex corrigée
function getMonthIndex(month: string): number {
  const key = month.trim().toLowerCase();
  
  const monthMap: Record<string, number> = {
    "jan": 0, "janvier": 0,
    "fév": 1, "fev": 1, "février": 1, "fevrier": 1,
    "mar": 2, "mars": 2,
    "avr": 3, "avril": 3,
    "mai": 4,
    "juin": 5,
    "juil": 6, "juillet": 6,
    "aoû": 7, "aou": 7, "août": 7, "aout": 7,
    "sep": 8, "septembre": 8,
    "oct": 9, "octobre": 9,
    "nov": 10, "novembre": 10,
    "déc": 11, "dec": 11, "décembre": 11, "decembre": 11,
  };
  
  return monthMap[key] ?? 0;
}

// ✅ Fonction mock corrigée avec types explicites
function generateMockMonthlyData(year: number): ChartDataPoint[] {
  const months = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];

  return months.map((_, index: number): ChartDataPoint => {
    const date = new Date(year, index, 1);
    const seasonMultiplier: number = 1 + Math.sin((index / 12) * Math.PI * 2) * 0.3;
    
    return {
      date: date.toISOString().split('T')[0],
      donors: Math.floor((Math.random() * 200 + 100) * seasonMultiplier),
      alerts: Math.floor((Math.random() * 80 + 20) * seasonMultiplier),
      donations: Math.floor((Math.random() * 150 + 50) * seasonMultiplier),
      livesSaved: Math.floor((Math.random() * 50 + 10) * seasonMultiplier),
    };
  });
}