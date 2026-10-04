import { useEffect, useState, useRef, useCallback } from "react";
import { LocateFixed } from "lucide-react";
import { fetchNearbyLocations } from "@/services/api";

function calculateHaversineKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  if (isNaN(lat1) || isNaN(lon1) || isNaN(lat2) || isNaN(lon2)) return 0.1;
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export function GoogleMapsComponent({
  filter,
  selectedPlace,
  onSelectPlace,
  onPlacesLoaded,
}: {
  filter: string;
  selectedPlace?: any;
  onSelectPlace?: (place: any) => void;
  onPlacesLoaded?: (hospitals: any[], pharmacies: any[]) => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<{ [key: string]: any }>({});
  const userMarkerRef = useRef<any>(null);
  const leafletRef = useRef<any>(null);

  const [isClient, setIsClient] = useState(false);
  const [locations, setLocations] = useState<any[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selected, setSelected] = useState<any>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Initialize Map Instance dynamically on client side
  useEffect(() => {
    if (!isClient || !containerRef.current || mapRef.current) return;

    let isMounted = true;

    async function initMap() {
      if (typeof window === "undefined") return;
      const L = await import("leaflet");
      await import("leaflet/dist/leaflet.css");
      leafletRef.current = L.default || L;

      if (!containerRef.current || mapRef.current || !isMounted) return;

      const map = leafletRef.current.map(containerRef.current, {
        center: [22.6684, 88.3813],
        zoom: 13,
        zoomControl: true,
      });

      leafletRef.current.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      mapRef.current = map;
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [isClient]);

  const createCustomIcon = useCallback((type: "hospital" | "pharmacy" | "user", isSelected: boolean = false) => {
    const L = leafletRef.current;
    if (!L) return null;

    if (type === "user") {
      return L.divIcon({
        className: "custom-user-marker",
        html: `<div style="background:#0d9488;width:22px;height:22px;border-radius:50%;border:3px solid white;box-shadow:0 0 12px rgba(13,148,136,0.8);"></div>`,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      });
    }

    const bgColor = isSelected ? "#059669" : type === "hospital" ? "#0d9488" : "#2563eb";
    const label = type === "hospital" ? "H" : "P";

    return L.divIcon({
      className: "custom-place-marker",
      html: `
        <div style="
          background: ${bgColor};
          width: 32px;
          height: 32px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          box-shadow: 0 4px 10px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid white;
        ">
          <span style="transform: rotate(45deg); color: white; font-weight: 800; font-size: 12px; font-family: sans-serif;">${label}</span>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -28],
    });
  }, []);

  // Detect Geolocation
  useEffect(() => {
    if (!isClient) return;
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setUserLocation(loc);
        },
        (err) => console.log("Geolocation notice:", err),
        { enableHighAccuracy: true }
      );
    }
  }, [isClient]);

  // Center map and Update User Location Marker when userLocation is set
  useEffect(() => {
    if (!mapRef.current || !userLocation || !leafletRef.current) return;
    const L = leafletRef.current;
    
    // Set view to user location
    mapRef.current.setView([userLocation.lat, userLocation.lng], 13);

    const icon = createCustomIcon("user");
    if (!icon) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.setLatLng([userLocation.lat, userLocation.lng]);
    } else {
      userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], {
        icon,
        title: "You Are Here",
      }).addTo(mapRef.current);
    }
  }, [userLocation, createCustomIcon]);

  // Fetch Nearby Places
  const fetchNearbyPlaces = useCallback(async (currentLoc: { lat: number; lng: number } | null) => {
    try {
      const refLat = currentLoc?.lat ?? 22.6684;
      const refLng = currentLoc?.lng ?? 88.3813;

      const res = await fetchNearbyLocations(refLat, refLng);

      let rawHospitals: any[] = res.data?.hospitals || [];
      let rawPharmacies: any[] = res.data?.pharmacies || [];

      const hospList = rawHospitals.map((h) => {
        const latVal = Number(h.latitude ?? h.lat);
        const lngVal = Number(h.longitude ?? h.lng);
        const dist = !isNaN(latVal) && !isNaN(lngVal) ? calculateHaversineKm(refLat, refLng, latVal, lngVal) : 0.1;
        return {
          ...h,
          type: "hospital",
          lat: latVal,
          lng: lngVal,
          distanceKm: dist,
          distance: `${dist} km away`,
        };
      });

      const pharmList = rawPharmacies.map((p) => {
        const latVal = Number(p.latitude ?? p.lat);
        const lngVal = Number(p.longitude ?? p.lng);
        const dist = !isNaN(latVal) && !isNaN(lngVal) ? calculateHaversineKm(refLat, refLng, latVal, lngVal) : 0.1;
        return {
          ...p,
          type: "pharmacy",
          lat: latVal,
          lng: lngVal,
          distanceKm: dist,
          distance: `${dist} km away`,
        };
      });

      hospList.sort((a, b) => a.distanceKm - b.distanceKm);
      pharmList.sort((a, b) => a.distanceKm - b.distanceKm);

      const allLocations = [...hospList, ...pharmList];
      setLocations(allLocations);

      if (onPlacesLoaded) {
        onPlacesLoaded(hospList, pharmList);
      }
    } catch (err) {
      console.error("Error fetching nearby places:", err);
    }
  }, [onPlacesLoaded]);

  useEffect(() => {
    if (!isClient) return;
    fetchNearbyPlaces(userLocation);
  }, [isClient, userLocation, fetchNearbyPlaces]);

  // Render Place Markers
  useEffect(() => {
    if (!mapRef.current || !leafletRef.current) return;
    const map = mapRef.current;
    const L = leafletRef.current;

    Object.values(markersRef.current).forEach((m: any) => m.remove());
    markersRef.current = {};

    const filteredLocations = locations.filter(
      (item) => filter === "all" || item.type === filter
    );

    filteredLocations.forEach((place) => {
      if (isNaN(place.lat) || isNaN(place.lng)) return;

      const isSelected = selected && selected.name === place.name;
      const icon = createCustomIcon(place.type as "hospital" | "pharmacy", isSelected);
      if (!icon) return;

      const marker = L.marker([place.lat, place.lng], {
        icon,
        title: place.name,
      });

      const popupContent = `
        <div style="font-family: sans-serif; padding: 4px; min-width: 180px;">
          <div style="font-weight: 700; font-size: 14px; color: #0d9488;">${place.name}</div>
          <div style="font-size: 12px; color: #64748b; margin-top: 2px;">${place.address}</div>
          ${place.distance ? `<div style="font-size: 12px; font-weight: 700; color: #059669; margin-top: 4px;">📍 ${place.distance}</div>` : ""}
          ${place.phone ? `<div style="font-size: 12px; color: #334155; margin-top: 2px;">📞 ${place.phone}</div>` : ""}
          <div style="margin-top: 8px;">
            <a href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(place.name + " " + place.address)}" 
               target="_blank" rel="noreferrer" 
               style="display: inline-block; background: #0d9488; color: white; padding: 4px 10px; border-radius: 6px; text-decoration: none; font-size: 11px; font-weight: 600;">
               Get Directions ↗
            </a>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on("click", () => {
        setSelected(place);
        if (onSelectPlace) {
          onSelectPlace(place);
        }
      });

      marker.addTo(map);
      markersRef.current[place._id || place.name] = marker;
    });
  }, [locations, filter, selected, onSelectPlace, createCustomIcon]);

  // Fly to externally selected place (card click)
  useEffect(() => {
    if (selectedPlace && mapRef.current) {
      const latVal = Number(selectedPlace.lat ?? selectedPlace.latitude);
      const lngVal = Number(selectedPlace.lng ?? selectedPlace.longitude);

      if (!isNaN(latVal) && !isNaN(lngVal)) {
        setSelected(selectedPlace);
        mapRef.current.flyTo([latVal, lngVal], 15, { duration: 0.8 });

        const key = selectedPlace._id || selectedPlace.name;
        if (markersRef.current[key]) {
          markersRef.current[key].openPopup();
        }
      }
    }
  }, [selectedPlace]);

  const handleRecenterUser = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setUserLocation(loc);
          if (mapRef.current) {
            mapRef.current.flyTo([loc.lat, loc.lng], 14);
          }
        },
        (err) => alert("Please allow location access in your browser settings.")
      );
    }
  };

  if (!isClient) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-card text-muted-foreground p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal mb-2" />
        Loading Interactive Map...
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {/* Recenter Button */}
      <button
        onClick={handleRecenterUser}
        className="absolute right-4 top-4 z-[400] flex items-center gap-1.5 rounded-full bg-card/90 px-3 py-1.5 text-xs font-semibold text-foreground shadow-lg border hover:bg-accent backdrop-blur"
        title="Center on My Location"
      >
        <LocateFixed className="h-3.5 w-3.5 text-teal animate-pulse" /> My Location
      </button>

      {/* Leaflet Map Canvas Container */}
      <div ref={containerRef} className="w-full h-full rounded-2xl z-0" />
    </div>
  );
}