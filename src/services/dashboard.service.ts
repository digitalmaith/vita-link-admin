import { api } from "@/lib/api/client";
import type { DashboardKPIs, Alert, Region, BloodGroup, HeatmapPoint, RegionStats } from "@/types";

export interface DashboardFilters {
  region?: Region;
  bloodGroup?: BloodGroup;
  dateFrom?: string;
  dateTo?: string;
}

// ✅ Type pour les données mensuelles de l'API
export interface MonthlyStat {
  month: string;      // "Jan", "Fév", "Mar", etc.
  donations: number;
  alerts: number;
  livesSaved: number;
}

// ✅ Type pour la réponse mensuelle
export interface MonthlyStatsResponse {
  success: boolean;
  data: MonthlyStat[];
}

// ✅ Type pour les données formatées du graphique
export interface ChartDataPoint {
  date: string;       // Format ISO ou mois
  donors: number;     // Pour la courbe "Donneurs"
  alerts: number;     // Pour la courbe "Alertes"
  donations: number;  // Pour la courbe "Dons"
  livesSaved: number; // Pour info supplémentaire
}

export interface ChartDataResponse {
  success: boolean;
  data: ChartDataPoint[];
  year: number;
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

  // ✅ Récupérer les statistiques mensuelles (endpoint réel)
  async getMonthlyStats(year?: number): Promise<MonthlyStatsResponse> {
    const res = await api.get<MonthlyStatsResponse>(
      "/admin/stats/monthly",
      { params: { year: year || new Date().getFullYear() } }
    );
    return res;
  },

  // ✅ Récupérer les données formatées pour le graphique
  async getChartData(params: {
    year?: number;
    region?: Region;
    bloodGroup?: BloodGroup;
  } = {}): Promise<ChartDataResponse> {
    try {
      const year = params.year || new Date().getFullYear();
      
      // Appel au vrai endpoint
      const monthlyRes = await this.getMonthlyStats(year);
      
      // Transformer les données pour le graphique
      const chartData: ChartDataPoint[] = monthlyRes.data.map((stat, index) => {
        // Créer une date ISO à partir du mois
        const monthIndex = getMonthIndex(stat.month);
        const date = new Date(year, monthIndex, 1);
        
        return {
          date: date.toISOString().split('T')[0],
          donors: 0, // À adapter selon vos données
          alerts: stat.alerts,
          donations: stat.donations,
          livesSaved: stat.livesSaved,
        };
      });

      return {
        success: true,
        data: chartData,
        year,
      };
    } catch (error) {
      console.error("Erreur lors de la récupération des données du graphique :", error);
      
      // Fallback avec données mockées
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
      return Array.isArray(res) ? res : (res as any).data || (res as any).stats || [];
    } catch (error) {
      console.error("Erreur lors de la récupération des stats régionales :", error);
      return [];
    }
  },

  // Récupérer les données de la heatmap
  getHeatmapData: async (filters?: DashboardFilters): Promise<HeatmapPoint[]> => {
    const res = await api.get<{ data: HeatmapPoint[] }>("/dashboard/heatmap", {
      params: filters,
    });
    return res.data;
  },

  // Récupérer les alertes système
  getSystemAlerts: () =>
    api.get<Alert[]>("/dashboard/alerts"),

  // Récupérer les alertes récentes
  getRecentAlerts: (limit = 10) =>
    api.get<Alert[]>("/alerts", {
      params: { limit, sort: "createdAt:desc" },
    }),

  // Récupérer les statistiques des régions (nouveau format)
  async getRegionsStats(filters?: any): Promise<RegionStats[]> {
    const res = await api.get<{ success: boolean; data: RegionStats[] }>(
      '/admin/stats/regions',
      { params: filters }
    );
    return res.data;
  },
};

/**
 * Convertit un mois abrégé en index (0-11)
 */
function getMonthIndex(month: string): number {
  const months: Record<string, number> = {
    "Jan": 0, 
    "Fév": 1, 
    "Fev": 1,  // Version sans accent
    "Mar": 2, 
    "Avr": 3, 
    "Mai": 4, 
    "Juin": 5, 
    "Juil": 6, 
    "Aoû": 7,
    "Aou": 7,  // Version sans accent
    "Sep": 8, 
    "Oct": 9, 
    "Nov": 10, 
    "Déc": 11,
    "Dec": 11, // Version sans accent
  };
  return months[month] ?? 0;
}

/**
 * Génère des données mockées pour le graphique (fallback)
 */
function generateMockMonthlyData(year: number): ChartDataPoint[] {
  const months = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];

  return months.map((_, index) => {
    const date = new Date(year, index, 1);
    const seasonMultiplier = 1 + Math.sin((index / 12) * Math.PI * 2) * 0.3;
    
    return {
      date: date.toISOString().split('T')[0],
      donors: Math.floor((Math.random() * 200 + 100) * seasonMultiplier),
      alerts: Math.floor((Math.random() * 80 + 20) * seasonMultiplier),
      donations: Math.floor((Math.random() * 150 + 50) * seasonMultiplier),
      livesSaved: Math.floor((Math.random() * 50 + 10) * seasonMultiplier),
    };
  });
}