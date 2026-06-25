import mapboxgl from "mapbox-gl";

export const SENEGAL_BOUNDS: mapboxgl.LngLatBoundsLike = [
  [-17.5, 12.3],
  [-11.3, 15.0],
];

export const SENEGAL_CENTER: [number, number] = [-14.4524, 14.4974];

export const MAP_STYLES = {
  dark: "mapbox://styles/mapbox/dark-v11",
  light: "mapbox://styles/mapbox/light-v11",
  satellite: "mapbox://styles/mapbox/satellite-streets-v12",
} as const;

export const STATUS_CONFIG = {
  VERIFIED: { color: "#22C55E", bgColor: "#22C55E22", label: "Certifiée", icon: "✓" },
  PENDING_REVIEW: { color: "#F59E0B", bgColor: "#F59E0B22", label: "En attente", icon: "⏳" },
  SUSPENDED: { color: "#EF4444", bgColor: "#EF444422", label: "Suspendue", icon: "⚠" },
  REJECTED: { color: "#6B7280", bgColor: "#6B728022", label: "Rejetée", icon: "✕" },
} as const;

export type MapStyle = keyof typeof MAP_STYLES;
export type StructureStatus = keyof typeof STATUS_CONFIG;