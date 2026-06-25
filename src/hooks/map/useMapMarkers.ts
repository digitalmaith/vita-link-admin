import { useEffect } from "react";
import mapboxgl from "mapbox-gl";
import Supercluster from "supercluster";
import { STATUS_CONFIG } from "@/lib/constants/map.constants";
import type { Region } from "@/types";

interface UseMapMarkersProps {
  mapLoaded: boolean;
  mapRef: React.MutableRefObject<mapboxgl.Map | null>;
  markersRef: React.MutableRefObject<mapboxgl.Marker[]>;
  clusterRef: React.MutableRefObject<Supercluster | null>;
  filteredStructures: any[];
  selectedRegion: Region | "ALL";
}

export function useMapMarkers({
  mapLoaded,
  mapRef,
  markersRef,
  clusterRef,
  filteredStructures,
  selectedRegion,
}: UseMapMarkersProps) {
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    clusterRef.current = new Supercluster({ radius: 40, maxZoom: 16 });
    clusterRef.current.load(
      filteredStructures
        .filter((s) => s.latitude && s.longitude)
        .map((s) => ({
          type: "Feature" as const,
          geometry: { type: "Point" as const, coordinates: [s.longitude, s.latitude] },
          properties: { ...s },
        }))
    );

    const updateMarkers = () => {
      if (!mapRef.current || !clusterRef.current) return;

      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      const zoom = Math.floor(mapRef.current.getZoom());
      const bounds = mapRef.current.getBounds();
      if (!bounds) return;

      const bbox: [number, number, number, number] = [
        bounds.getWest(),
        bounds.getSouth(),
        bounds.getEast(),
        bounds.getNorth(),
      ];

      const clusters = clusterRef.current.getClusters(bbox, zoom);
      const mapBounds = new mapboxgl.LngLatBounds();

      clusters.forEach((cluster) => {
        const [lng, lat] = cluster.geometry.coordinates;
        const { cluster: isCluster, point_count, ...props } = cluster.properties;

        if (isCluster) {
          const el = document.createElement("div");
          el.style.cssText = `
            width: 44px; height: 44px; border-radius: 50%;
            background: rgba(239,68,68,0.85);
            border: 3px solid rgba(255,255,255,0.9);
            display: flex; align-items: center; justify-content: center;
            font-size: 13px; font-weight: 700; color: white;
            cursor: pointer;
            box-shadow: 0 0 20px rgba(239,68,68,0.5);
          `;
          el.textContent = String(point_count);

          el.addEventListener("click", () => {
            const expansionZoom = clusterRef.current!.getClusterExpansionZoom(
              cluster.properties.cluster_id
            );
            mapRef.current!.flyTo({ center: [lng, lat], zoom: expansionZoom, duration: 600 });
          });

          const marker = new mapboxgl.Marker(el)
            .setLngLat([lng, lat])
            .addTo(mapRef.current!);
          markersRef.current.push(marker);
        } else {
          const structure = props as typeof filteredStructures[0];
          const config = STATUS_CONFIG[structure.status as keyof typeof STATUS_CONFIG];
          const alertCount = structure._count?.alerts || 0;

          const el = document.createElement("div");
          el.style.cssText = `position: relative; width: 44px; height: 44px; cursor: pointer;`;

          const ring1 = document.createElement("div");
          ring1.style.cssText = `
            position: absolute; inset: 0; border-radius: 50%;
            background: ${config.color}; opacity: 0.3;
            animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          `;

          const ring2 = document.createElement("div");
          ring2.style.cssText = `
            position: absolute; inset: 4px; border-radius: 50%;
            background: ${config.color}; opacity: 0.2;
            animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite 0.5s;
          `;

          const dot = document.createElement("div");
          dot.style.cssText = `
            position: absolute; top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            width: 16px; height: 16px; border-radius: 50%;
            background: ${config.color};
            border: 2.5px solid rgba(255, 255, 255, 0.95);
            box-shadow: 0 0 16px ${config.color}, 0 0 32px ${config.color}44;
            transition: all 0.3s;
          `;

          if (alertCount > 0) {
            const badge = document.createElement("div");
            badge.style.cssText = `
              position: absolute; top: -6px; right: -6px;
              min-width: 20px; height: 20px; border-radius: 10px;
              background: linear-gradient(135deg, #EF4444, #DC2626);
              border: 2px solid #0f172a;
              display: flex; align-items: center; justify-content: center;
              padding: 0 5px; font-size: 10px; font-weight: 700;
              color: white; z-index: 10;
            `;
            badge.textContent = alertCount > 99 ? "99+" : String(alertCount);
            el.appendChild(badge);
          }

          el.appendChild(ring1);
          el.appendChild(ring2);
          el.appendChild(dot);

          el.addEventListener("mouseenter", () => {
            dot.style.transform = "translate(-50%, -50%) scale(1.5)";
          });
          el.addEventListener("mouseleave", () => {
            dot.style.transform = "translate(-50%, -50%) scale(1)";
          });

          const popup = new mapboxgl.Popup({
            offset: 25,
            closeButton: true,
            className: "vita-popup",
            maxWidth: "300px",
          }).setHTML(`
            <div class="popup-card">
              <div class="popup-header" style="border-left: 3px solid ${config.color};">
                <h3>${structure.name}</h3>
                <span class="status-badge" style="background:${config.bgColor};color:${config.color};border:1px solid ${config.color}44;">
                  ${config.icon} ${config.label}
                </span>
              </div>
              <p class="popup-address">📍 ${structure.address}</p>
              <div class="popup-stats">
                <div class="stat-item">
                  <span class="stat-value">${structure._count?.staffMembers || 0}</span>
                  <span class="stat-label">Agents</span>
                </div>
                <div class="stat-item">
                  <span class="stat-value">${structure._count?.alerts || 0}</span>
                  <span class="stat-label">Alertes</span>
                </div>
                <div class="stat-item">
                  <span class="stat-value" style="color:#F59E0B;">${structure._count?.donations || 0}</span>
                  <span class="stat-label">Dons</span>
                </div>
              </div>
            </div>
          `);

          const marker = new mapboxgl.Marker(el)
            .setLngLat([lng, lat])
            .setPopup(popup)
            .addTo(mapRef.current!);

          markersRef.current.push(marker);
          mapBounds.extend([lng, lat]);
        }
      });

      if (!mapBounds.isEmpty() && mapRef.current) {
        mapRef.current.fitBounds(mapBounds, {
          padding: { top: 80, bottom: 120, left: 50, right: 50 },
          maxZoom: selectedRegion === "ALL" ? 7 : 10,
          duration: 1000,
        });
      }
    };

    mapRef.current.on("move", updateMarkers);
    mapRef.current.on("zoom", updateMarkers);
    updateMarkers();

    return () => {
      mapRef.current?.off("move", updateMarkers);
      mapRef.current?.off("zoom", updateMarkers);
    };
  }, [mapLoaded, filteredStructures]);
}