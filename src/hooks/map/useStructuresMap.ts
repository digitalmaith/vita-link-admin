import { useRef, useState, useMemo, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import { useQuery } from "@tanstack/react-query";
import Supercluster from "supercluster";
import { structuresService } from "@/services/structures.service";
import { REGIONS } from "@/lib/constants";
import { SENEGAL_CENTER, MAP_STYLES, type MapStyle } from "@/lib/constants/map.constants";
import type { Region } from "@/types";

export function useStructuresMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const clusterRef = useRef<Supercluster | null>(null);

  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<Region | "ALL">("ALL");
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showLegend, setShowLegend] = useState(false);
  const [mapStyle, setMapStyle] = useState<MapStyle>("satellite");

  const { data } = useQuery({
    queryKey: ["structures"],
    queryFn: () => structuresService.getAll(),
  });

  const structures = data?.structures ?? [];

  const filteredStructures = useMemo(() => {
    let filtered =
      selectedRegion === "ALL"
        ? structures
        : structures.filter((s) =>
            s.address.toLowerCase().includes(selectedRegion.toLowerCase())
          );

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(query) ||
          s.address.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [structures, selectedRegion, searchQuery]);

  const regionCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    REGIONS.forEach((region) => {
      counts[region] = structures.filter((s) =>
        s.address.toLowerCase().includes(region.toLowerCase())
      ).length;
    });
    return counts;
  }, [structures]);

  const stats = useMemo(
    () => ({
      total: filteredStructures.length,
      verified: filteredStructures.filter((s) => s.status === "VERIFIED").length,
      pending: filteredStructures.filter((s) => s.status === "PENDING_REVIEW").length,
      suspended: filteredStructures.filter((s) => s.status === "SUSPENDED").length,
      totalAlerts: filteredStructures.reduce((acc, s) => acc + (s._count?.alerts || 0), 0),
      totalDonations: filteredStructures.reduce((acc, s) => acc + (s._count?.donations || 0), 0),
    }),
    [filteredStructures]
  );

  const handleRegionSelect = useCallback((region: Region | "ALL") => {
    setSelectedRegion(region);
  }, []);

  const handleZoomIn = useCallback(() => mapRef.current?.zoomIn({ duration: 500 }), []);
  const handleZoomOut = useCallback(() => mapRef.current?.zoomOut({ duration: 500 }), []);
  const handleResetView = useCallback(() => {
    mapRef.current?.flyTo({ center: SENEGAL_CENTER, zoom: 6.2, duration: 1500 });
  }, []);

  return {
    // refs
    mapContainer,
    mapRef,
    markersRef,
    clusterRef,
    // state
    mapLoaded,
    setMapLoaded,
    selectedRegion,
    showSearch,
    setShowSearch,
    searchQuery,
    setSearchQuery,
    showLegend,
    setShowLegend,
    mapStyle,
    setMapStyle,
    // data
    filteredStructures,
    regionCounts,
    stats,
    // handlers
    handleRegionSelect,
    handleZoomIn,
    handleZoomOut,
    handleResetView,
  };
}