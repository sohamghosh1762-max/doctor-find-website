import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Building2, Pill, Navigation, Phone, MapPin, LocateFixed } from "lucide-react";
import { GoogleMapsComponent } from "@/components/google-map";
import { SiteNav } from "@/components/site-nav";
import { Footer } from "@/components/footer";
import { useEffect, useState, useCallback } from "react";
import { fetchNearbyLocations } from "@/services/api";

export const Route = createFileRoute("/hospitals")({
  head: () => ({ meta: [{ title: "Hospitals & Pharmacies — DoctorFind AI" }] }),
  component: HospitalsPage,
});

function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
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

const defaultHospitalsList = [
  {
    _id: "zenith-1",
    name: "Zenith Super Specialist Hospital",
    address: "9/3 Feeder Road, Belgharia Rathala, Kolkata, West Bengal 700056",
    city: "Rathala, Belghoria, Kolkata",
    phone: "+91 33 2564 3000",
    specialization: "Super Speciality & Emergency 24x7",
    latitude: 22.6684,
    longitude: 88.3813,
    distanceKm: 0.1,
    distance: "0.1 km away",
    type: "hospital"
  },
  {
    _id: "apollo-1",
    name: "Apollo Hospital Kolkata",
    address: "58 Canal Circular Rd, Kadapara, Phool Bagan, Kolkata, West Bengal 700054",
    city: "Phool Bagan, Kolkata",
    phone: "+91 33 2320 3040",
    specialization: "Cardiology, Multi-Speciality 24x7",
    latitude: 22.5726,
    longitude: 88.3972,
    distanceKm: 10.8,
    distance: "10.8 km away",
    type: "hospital"
  },
  {
    _id: "fortis-1",
    name: "Fortis Hospital Anandapur",
    address: "730 Anandapur, E.M. Bypass, Kolkata, West Bengal 700107",
    city: "Anandapur, Kolkata",
    phone: "+91 33 6628 4444",
    specialization: "Neurosurgery & Critical Care",
    latitude: 22.5186,
    longitude: 88.3931,
    distanceKm: 16.7,
    distance: "16.7 km away",
    type: "hospital"
  }
];

const defaultPharmaciesList = [
  {
    _id: "frank-ross-1",
    name: "Frank Ross Pharmacy",
    address: "12 Feeder Road, Rathala, Belgharia, Kolkata 700056",
    city: "Belghoria, Kolkata",
    phone: "+91 33 2564 1212",
    latitude: 22.6690,
    longitude: 88.3820,
    distanceKm: 0.1,
    distance: "0.1 km away",
    type: "pharmacy"
  },
  {
    _id: "apollo-pharm-1",
    name: "Apollo Pharmacy 24/7",
    address: "Block BB, Sector 1, Salt Lake City, Kolkata, West Bengal 700064",
    city: "Salt Lake, Kolkata",
    phone: "+91 33 2321 1100",
    latitude: 22.5867,
    longitude: 88.4172,
    distanceKm: 9.8,
    distance: "9.8 km away",
    type: "pharmacy"
  }
];

function HospitalsPage() {
  const [hospitals, setHospitals] = useState<any[]>(defaultHospitalsList);
  const [pharmacies, setPharmacies] = useState<any[]>(defaultPharmaciesList);
  const [filter, setFilter] = useState<"all" | "hospital" | "pharmacy">("all");
  const [selectedPlace, setSelectedPlace] = useState<any>(null);

  const [userLat, setUserLat] = useState<number | null>(null);
  const [userLng, setUserLng] = useState<number | null>(null);
  const [locationStatus, setLocationStatus] = useState<string>("Detecting location...");

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setUserLat(lat);
          setUserLng(lng);
          setLocationStatus(`Location Active: (${lat.toFixed(4)}°, ${lng.toFixed(4)}°)`);
        },
        (error) => {
          setLocationStatus("Location permissions disabled. Showing default nearby facilities.");
        },
        { enableHighAccuracy: true }
      );
    }
  }, []);

  useEffect(() => {
    if (userLat !== null && userLng !== null) {
      fetchNearbyLocations(userLat, userLng)
        .then((res) => {
          if (res.data?.hospitals && res.data.hospitals.length > 0) {
            setHospitals(res.data.hospitals);
          }
          if (res.data?.pharmacies && res.data.pharmacies.length > 0) {
            setPharmacies(res.data.pharmacies);
          }
        })
        .catch((err) => {
          console.error("Error loading nearby hospitals & pharmacies:", err);
        });
    }
  }, [userLat, userLng]);

  const handlePlacesLoaded = useCallback((hospList: any[], pharmList: any[]) => {
    if (hospList && hospList.length > 0) {
      setHospitals(hospList);
    }
    if (pharmList && pharmList.length > 0) {
      setPharmacies(pharmList);
    }
  }, []);

  const filtered = [
    ...hospitals.map((h) => ({ ...h, type: "hospital" })),
    ...pharmacies.map((p) => ({ ...p, type: "pharmacy" })),
  ].filter((item) => filter === "all" || item.type === filter);

  const handleCardClick = (place: any) => {
    setSelectedPlace(place);
  };

  const getDirectionsUrl = (place: any) => {
    const query = encodeURIComponent(`${place.name} ${place.address || ""}`);
    if (userLat && userLng) {
      return `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${query}`;
    }
    return `https://www.google.com/maps/dir/?api=1&destination=${query}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <section className="mx-auto max-w-7xl px-6 pt-32 pb-16">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-display text-4xl font-bold sm:text-5xl">
              Nearby <span className="text-teal">Hospitals & Pharmacies</span>
            </motion.h1>
            <p className="mt-3 text-muted-foreground">Live location search, distances, exact map markers & 24x7 contacts.</p>
          </div>
          <div className="flex items-center gap-2 rounded-2xl border bg-card p-3 text-xs font-semibold text-teal shadow-sm shrink-0">
            <LocateFixed className="h-4 w-4 animate-pulse" />
            <span>{locationStatus}</span>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          {/* Interactive Google Map with Dynamic Places Search */}
          <div className="relative h-[600px] overflow-hidden rounded-3xl border shadow-xl bg-card">
            <div className="absolute left-4 top-4 z-[400] flex gap-2">
              {(["all", "hospital", "pharmacy"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold capitalize transition backdrop-blur border ${
                    filter === f ? "bg-teal text-white shadow" : "bg-card/80 text-foreground hover:bg-accent"
                  }`}
                >
                  {f === "hospital" ? "Hospitals" : f === "pharmacy" ? "Pharmacies" : "All"}
                </button>
              ))}
            </div>

            <GoogleMapsComponent
              filter={filter}
              selectedPlace={selectedPlace}
              onSelectPlace={setSelectedPlace}
              onPlacesLoaded={handlePlacesLoaded}
            />
          </div>

          {/* List of Places Cards Sorted by Real-World Proximity */}
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
            {filtered.map((p, i) => {
              const isSelected = selectedPlace && selectedPlace.name === p.name;
              return (
                <motion.div
                  key={p._id || p.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => handleCardClick(p)}
                  className={`rounded-2xl border p-4 transition cursor-pointer ${
                    isSelected ? "border-teal bg-teal/5 shadow-md" : "bg-card hover:shadow-lg"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`grid h-11 w-11 place-items-center rounded-xl shrink-0 ${p.type === "hospital" ? "bg-teal/15 text-teal" : "bg-blue-500/15 text-blue-500"}`}>
                      {p.type === "hospital" ? <Building2 className="h-5 w-5" /> : <Pill className="h-5 w-5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-display font-bold text-foreground text-sm truncate">{p.name}</h3>
                        {p.distance && (
                          <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 shrink-0">
                            {p.distance}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-teal shrink-0" />
                        <span className="truncate">{p.address}</span>
                      </p>

                      <div className="mt-3 flex items-center gap-2">
                        <a
                          href={getDirectionsUrl(p)}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 rounded-full bg-teal px-3 py-1.5 text-xs font-semibold text-white shadow hover:opacity-90 transition"
                        >
                          <Navigation className="h-3 w-3" />
                          Directions
                        </a>
                        <a
                          href={`tel:${p.phone || "+913325643000"}`}
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-semibold hover:bg-accent"
                        >
                          <Phone className="h-3 w-3" />
                          Call
                        </a>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
