import { useEffect } from "react";
import mapboxgl from "mapbox-gl";
import { SENEGAL_CENTER, SENEGAL_BOUNDS, MAP_STYLES, type MapStyle } from "@/lib/constants/map.constants";

interface UseMapInitProps {
  mapContainer: React.RefObject<HTMLDivElement | null>;
  mapRef: React.MutableRefObject<mapboxgl.Map | null>;
  mapStyle: MapStyle;
  setMapLoaded: (loaded: boolean) => void;
}

export function useMapInit({ mapContainer, mapRef, mapStyle, setMapLoaded }: UseMapInitProps) {
  // Init carte
  useEffect(() => {
    if (mapRef.current || !mapContainer.current) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: MAP_STYLES[mapStyle],
      center: SENEGAL_CENTER,
      zoom: 6.2,
      minZoom: 5.5,
      maxZoom: 12,
      maxBounds: SENEGAL_BOUNDS,
      attributionControl: false,
    });

    map.addControl(new mapboxgl.NavigationControl({ showCompass: true }), "top-right");
    map.addControl(new mapboxgl.AttributionControl({ compact: true }));

    map.on("load", () => {
      setMapLoaded(true);
      map.flyTo({ center: SENEGAL_CENTER, zoom: 6.5, duration: 2000 });
    });

    mapRef.current = map;
  }, []);

  // Changement de style
  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.setStyle(MAP_STYLES[mapStyle]);
  }, [mapStyle]);
}