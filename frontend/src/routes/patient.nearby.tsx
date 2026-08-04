import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { MapPin, Phone, Star, Navigation, Clock, ShieldAlert, Building2, Stethoscope, Ambulance, Pill, Activity, Compass } from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";
import { navItems } from "./patient.dashboard";
import { useState, useEffect } from "react";
import { fetchNearbyServices } from "@/services/api";
import { GoogleMapsComponent } from "@/components/google-map";

export const Route = createFileRoute("/patient/nearby")({
  head: () => ({ meta: [{ title: "Nearby Healthcare Services — DoctorFind AI" }] }),
  component: NearbyServicesPage,
});

const categoryList = [
  { id: "all", label: "All Services", icon: MapPin },
  { id: "Hospitals", label: "Nearby Hospitals", icon: Building2 },
  { id: "Clinics", label: "Clinics", icon: Stethoscope },
  { id: "Ambulances", label: "Ambulances (24x7)", icon: Ambulance },
  { id: "Pharmacies", label: "Pharmacies", icon: Pill },
  { id: "Diagnostic Centers", label: "Diagnostic Centers", icon: Activity },
  { id: "Emergency Services", label: "Emergency Trauma", icon: ShieldAlert },
];

export default function NearbyServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedPlace, setSelectedPlace] = useState<any>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.log("Geolocation notice:", error);
        },
        { enableHighAccuracy: true }
      );
    }
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      const res = await fetchNearbyServices(
        activeCategory,
        userLocation?.lat,
        userLocation?.lng
      );
      if (res?.services) {
        setServices(res.services);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, [activeCategory, userLocation]);

  const handleCardClick = (place: any) => {
    setSelectedPlace({
      ...place,
      latitude: place.lat || place.latitude || userLocation?.lat || 22.6684,
      longitude: place.lng || place.longitude || userLocation?.lng || 88.3813
    });
  };

  const getDirectionsUrl = (s: any) => {
    const query = encodeURIComponent(`${s.name} ${s.address || ""}`);
    if (userLocation) {
      return `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${query}`;
    }
    return `https://www.google.com/maps/dir/?api=1&destination=${query}`;
  };

  return (
    <DashboardShell role="PATIENT" roleColor="oklch(0.68 0.13 190)" nav={navItems} user={{ name: "Rahul" }}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold flex items-center gap-2">
            <Compass className="h-7 w-7 text-teal" /> Nearby Healthcare Facilities
          </h1>
          <p className="mt-1 text-muted-foreground">Find real-time verified hospitals, emergency ambulances, pharmacies & diagnostic centers</p>
        </div>
      </div>

      {/* Categories Filter Bar */}
      <div className="mt-6 flex flex-wrap items-center gap-2 rounded-2xl border bg-card p-3">
        {categoryList.map((cat) => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition ${
                activeCategory === cat.id ? "bg-teal text-white shadow" : "bg-accent/60 text-muted-foreground hover:bg-accent"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Main Grid: Interactive Map + Facilities List */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Interactive Google Map Box */}
        <div className="lg:col-span-1 rounded-2xl border bg-card h-[500px] overflow-hidden relative shadow-sm">
          <GoogleMapsComponent filter={activeCategory === "Hospitals" ? "hospital" : activeCategory === "Pharmacies" ? "pharmacy" : "all"} selectedPlace={selectedPlace} onSelectPlace={setSelectedPlace} />
        </div>

        {/* Facilities Cards List */}
        <div className="lg:col-span-2 space-y-4 max-h-[500px] overflow-y-auto pr-1">
          {loading ? (
            <div className="py-12 text-center text-sm text-muted-foreground">Loading nearby facilities...</div>
          ) : services.length > 0 ? (
            services.map((s: any) => {
              const isSelected = selectedPlace && selectedPlace.name === s.name;
              return (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => handleCardClick(s)}
                  className={`rounded-2xl border p-4 flex flex-col sm:flex-row gap-4 transition cursor-pointer ${
                    isSelected ? "border-teal bg-teal/5 shadow-md" : "bg-card hover:shadow-md"
                  }`}
                >
                  <img src={s.image} alt={s.name} className="h-28 w-full sm:w-36 rounded-xl object-cover border shrink-0" />
                  <div className="flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-display font-bold text-base text-foreground">{s.name}</h3>
                        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${s.openNow ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                          {s.openNow ? "Open Now 24/7" : "Closed"}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-teal" /> {s.address}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t text-xs">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-teal flex items-center gap-1">★ {s.rating} ({s.reviews})</span>
                        <span className="font-semibold text-muted-foreground">{s.distance}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <a href={`tel:${s.phone}`} onClick={(e) => e.stopPropagation()} className="inline-flex items-center gap-1 rounded-xl border px-3 py-1.5 font-medium hover:bg-accent">
                          <Phone className="h-3.5 w-3.5 text-teal" /> Call
                        </a>
                        <a
                          href={getDirectionsUrl(s)}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 rounded-xl bg-teal px-3.5 py-1.5 font-semibold text-white shadow hover:opacity-90"
                        >
                          <Navigation className="h-3.5 w-3.5" /> Directions
                        </a>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="rounded-2xl border bg-card p-12 text-center text-sm text-muted-foreground">
              No services found matching category "{activeCategory}"
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
