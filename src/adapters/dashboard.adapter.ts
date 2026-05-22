import type { DashboardKPIs } from "@/types";

/**
 * Type UI enrichi pour le dashboard
 * Ajoute les tendances et données calculées sans modifier le type backend
 */
export type DashboardUIKPIs = {
  // Données principales du backend
  livesSaved: number;
  avgResponseTime: number; // en minutes (number pour le calcul)
  avgResponseTimeFormatted: string; // formaté pour l'affichage
  criticalRegions: number;
  donors: number;
  structures: number;
  openAlerts: number;
  
  // Tendances calculées ou mockées (à remplacer par de vraies données plus tard)
  livesSavedTrend: number;
  responseTimeTrend: number;
  donorsTrend: number;
  structuresTrend: number;
  openAlertsTrend: number;
  
  // Données contextuelles pour les descriptions
  livesSavedThisMonth: number;
  newDonorsThisMonth: number;
  activeStructures: number;
  
  // Données optionnelles pour les cartes supplémentaires
  urgentRequests?: number;
  urgentRequestsTrend?: number;
  pendingUrgent?: number;
  bloodUnitsAvailable?: number;
  bloodUnitsTrend?: number;
  bloodUnitsMin?: number;
  
  // Résumé
  coverageRate: number;
  monthlyGoal: number;
  monthlyProgress: number;
  lastUpdated: string;
  
  // Rétrocompatibilité
  totalDonations?: number;
  totalAlerts?: number;
};

/**
 * Adapte les KPIs du backend vers le format UI enrichi
 */
export function adaptDashboardKPIs(kpis: DashboardKPIs): DashboardUIKPIs {
  // Calcul des tendances
  // Pour l'instant, on utilise des valeurs calculées basées sur les données disponibles
  // Idéalement, ces tendances viendront de l'API
  const livesSavedTrend = calculateMonthlyTrend(kpis.livesSavedEstimate, 1000); // Base de 1000 vies
  const donorsTrend = calculateMonthlyTrend(kpis.totalDonors, 800); // Base de 800 donneurs
  const structuresTrend = calculateMonthlyTrend(kpis.totalStructures, 60); // Base de 60 structures
  const openAlertsTrend = calculateMonthlyTrend(kpis.openAlerts, 10, true); // Inversé (moins d'alertes = mieux)
  const responseTimeTrend = -(kpis.avgResponseTimeMinutes * 0.1); // Simulation d'amélioration

  return {
    // Données principales
    livesSaved: kpis.livesSavedEstimate,
    avgResponseTime: kpis.avgResponseTimeMinutes,
    avgResponseTimeFormatted: formatResponseTime(kpis.avgResponseTimeMinutes),
    criticalRegions: kpis.criticalStocksCount,
    donors: kpis.totalDonors,
    structures: kpis.totalStructures,
    openAlerts: kpis.openAlerts,
    
    // Tendances (pourcentage)
    livesSavedTrend: Math.round(livesSavedTrend),
    responseTimeTrend: Math.round(responseTimeTrend * 10) / 10,
    donorsTrend: Math.round(donorsTrend),
    structuresTrend: Math.round(structuresTrend),
    openAlertsTrend: Math.round(openAlertsTrend),
    
    // Données contextuelles (estimations basées sur les totaux)
    livesSavedThisMonth: Math.round(kpis.livesSavedEstimate * 0.15), // ~15% du total ce mois
    newDonorsThisMonth: Math.round(kpis.totalDonors * 0.08), // ~8% nouveaux ce mois
    activeStructures: Math.round(kpis.totalStructures * 0.9), // ~90% actives
    
    // Données optionnelles (seulement si disponibles dans le backend)
    // Pour l'instant, on ne les inclut pas car pas dans le type DashboardKPIs
    // Elles seront ajoutées quand le backend les fournira
    
    // Résumé
    coverageRate: calculateCoverageRate(kpis),
    monthlyGoal: 1200, // Objectif mensuel par défaut
    monthlyProgress: calculateMonthlyProgress(kpis),
    lastUpdated: new Date().toISOString(),
    
    // Rétrocompatibilité
    totalDonations: kpis.totalDonations,
    totalAlerts: kpis.totalAlerts,
  };
}

/**
 * Calcule une tendance en pourcentage
 * @param current - Valeur actuelle
 * @param baseline - Valeur de référence (mois précédent)
 * @param inverse - Si true, une baisse est positive (ex: alertes)
 */
function calculateMonthlyTrend(
  current: number,
  baseline: number,
  inverse: boolean = false
): number {
  if (baseline === 0) return 0;
  
  const trend = ((current - baseline) / baseline) * 100;
  return inverse ? -trend : trend;
}

/**
 * Calcule le taux de couverture
 */
function calculateCoverageRate(kpis: DashboardKPIs): number {
  // Taux basé sur le ratio structures actives / total structures
  const totalStructures = kpis.totalStructures || 1;
  const activeEstimate = totalStructures * 0.9; // Estimation 90% actives
  
  return Math.round((activeEstimate / totalStructures) * 100);
}

/**
 * Calcule la progression mensuelle vers l'objectif
 */
function calculateMonthlyProgress(kpis: DashboardKPIs): number {
  const monthlyGoal = 1200;
  const currentProgress = kpis.totalDonations || kpis.livesSavedEstimate || 0;
  
  // On prend le progrès du mois (environ 15% du total annuel)
  const monthlyProgress = currentProgress * 0.15;
  
  return Math.min(Math.round((monthlyProgress / monthlyGoal) * 100), 100);
}

/**
 * Formate le temps de réponse pour l'affichage
 */
function formatResponseTime(minutes: number): string {
  if (!minutes || minutes === 0) return "—";
  
  if (minutes < 60) {
    return `${minutes} min`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours}h`;
  }
  
  return `${hours}h ${remainingMinutes}min`;
}