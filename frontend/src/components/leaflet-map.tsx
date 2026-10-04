import { useEffect, useState } from "react";
import { fetchGooglePlacesNearby } from "@/services/api";

export function LeafletMap({
  filter,
}: {
  filter: string;
}) {
  const [isClient, setIsClient] = useState(false);
  const [locations, setLocations] = useState<any[]>([]);
  const [userLat, setUserLat] = useState<number | null>(null);
  const [userLng, setUserLng] = useState<number | null>(null);

  useEffect(() => {
    setIsClient(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLat(position.coords.latitude);
          setUserLng(position.coords.longitude);
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }, []);

  useEffect(() => {
    if (userLat && userLng) {
      fetchLocations();
    }
  }, [userLat, userLng]);

  const fetchLocations = async () => {
    try {
      if (!userLat || !userLng) return;
      const res = await fetchGooglePlacesNearby(userLat, userLng);
      const places = (res.data || []).map((place: any) => ({
        name: place.name,
        address: place.vicinity,
        phone: place.international_phone_number || "Not Available",
        lat: place.geometry?.location?.lat,
        lng: place.geometry?.location?.lng,
        type: place.types?.includes("pharmacy") ? "pharmacy" : "hospital",
      }));
      setLocations(places);
    } catch (error) {
      console.log(error);
    }
  };

  const filtered = locations.filter(
    (item) => filter === "all" || item.type === filter
  );

  if (!isClient) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-card text-xs text-muted-foreground">
        Loading Map...
      </div>
    );
  }

  return (
    <div className="h-full w-full rounded-2xl bg-card p-4 overflow-y-auto space-y-3">
      {filtered.map((p) => (
        <div key={p.name} className="rounded-xl border p-3 text-xs">
          <div className="font-bold text-foreground">{p.name}</div>
          <div className="text-muted-foreground mt-1">{p.address}</div>
          <div className="text-muted-foreground">📞 {p.phone}</div>
          {p.lat && p.lng && (
            <a
              href={`https://www.google.com/maps?q=${p.lat},${p.lng}`}
              target="_blank"
              rel="noreferrer"
              className="text-teal font-semibold mt-2 inline-block hover:underline"
            >
              Open in Google Maps ↗
            </a>
          )}
        </div>
      ))}
    </div>
  );
}
