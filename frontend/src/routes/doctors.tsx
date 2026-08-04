import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Star, Stethoscope, Search, Filter, MapPin, Building2, Video, CheckCircle2 } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { Footer } from "@/components/footer";
import { useState, useEffect } from "react";
import axios from "axios";

export const Route = createFileRoute("/doctors")({
  head: () => ({ meta: [{ title: "Find Doctors — DoctorFind AI" }, { name: "description", content: "Browse verified doctors by specialty and book instantly." }] }),
  component: DoctorsPage,
});

const defaultAvatar = "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=400&auto=format&fit=crop";

function DoctorsPage() {
  const [s, setS] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/doctors");
        if (res.data?.doctors) {
          setDoctors(res.data.doctors);
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const dynamicSpecialties = ["All", ...Array.from(new Set(doctors.map(d => d.specialization).filter(Boolean)))];

  const filtered = doctors.filter((d) => {
    const matchesSpec = s === "All" || d.specialization === s;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      d.name?.toLowerCase().includes(query) ||
      d.specialization?.toLowerCase().includes(query) ||
      d.hospital?.toLowerCase().includes(query) ||
      d.location?.toLowerCase().includes(query);

    return matchesSpec && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <section className="mx-auto max-w-7xl px-6 pt-32 pb-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-4xl font-bold sm:text-5xl">
            Find Your <span className="text-teal">Specialist Doctor</span>
          </h1>
          <p className="mt-3 text-muted-foreground text-base">Browse verified medical specialists, check live availability, and book online or in-person consultations.</p>
        </motion.div>

        {/* Search & Specialty Filter Controls */}
        <div className="glass mt-8 flex flex-col md:flex-row items-stretch md:items-center gap-4 rounded-2xl border p-4 shadow-sm">
          <div className="flex flex-1 items-center gap-2.5 rounded-xl border bg-card px-3.5 py-2.5">
            <Search className="h-4 w-4 text-muted-foreground shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by doctor name, specialty, hospital, or city..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/70"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1 shrink-0 pl-1">
              <Filter className="h-3.5 w-3.5 text-teal" /> Specialty:
            </span>
            <div className="flex items-center gap-1.5 shrink-0">
              {dynamicSpecialties.map((sp) => (
                <button
                  key={sp}
                  onClick={() => setS(sp)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition shrink-0 ${
                    s === sp ? "bg-teal text-white shadow" : "bg-accent/70 text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  {sp}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Doctors Grid */}
        {loading ? (
          <div className="py-24 text-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-teal border-t-transparent mx-auto"></div>
            <p className="mt-3 text-sm text-muted-foreground">Loading verified doctors...</p>
          </div>
        ) : filtered.length > 0 ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((d, i) => (
              <motion.div
                key={d._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group overflow-hidden rounded-2xl border bg-card shadow-sm transition hover:shadow-lg hover:border-teal/50 flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[4/3] overflow-hidden bg-accent">
                    <img
                      src={d.profileImage || defaultAvatar}
                      alt={d.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      onError={(e: any) => { e.target.src = defaultAvatar; }}
                    />
                    <div className="absolute top-3 right-3 rounded-full bg-card/90 backdrop-blur px-2.5 py-1 text-[11px] font-bold text-teal shadow flex items-center gap-1 border">
                      <CheckCircle2 className="h-3 w-3 text-teal" /> Verified
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-display font-bold text-lg text-foreground group-hover:text-teal transition">{d.name}</h3>
                        <span className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-50 rounded-md px-1.5 py-0.5 border border-amber-200">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" /> {d.rating || 4.9}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-teal mt-0.5">{d.specialization}</p>
                    </div>

                    <div className="space-y-1.5 text-xs text-muted-foreground pt-1 border-t">
                      <div className="flex items-center gap-1.5">
                        <Stethoscope className="h-3.5 w-3.5 text-teal shrink-0" />
                        <span>{d.experience || 10}+ Years Clinical Experience</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Building2 className="h-3.5 w-3.5 text-teal shrink-0" />
                        <span className="truncate">{d.hospital || "Central Multi-Specialty Hospital"}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-teal shrink-0" />
                        <span className="truncate">{d.location || "City Medical Center"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <div className="flex items-center justify-between pt-3 border-t text-xs">
                    <div>
                      <span className="text-[10px] text-muted-foreground block">Consultation Fee</span>
                      <span className="font-display font-extrabold text-base text-foreground">₹{d.fees || 800}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100">
                      <Video className="h-3 w-3" /> Online & In-Clinic
                    </div>
                  </div>

                  <Link
                    to="/doctor/$id"
                    params={{ id: String(d._id) }}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-teal py-2.5 text-center text-xs font-bold text-white shadow hover:opacity-90 transition"
                  >
                    View Doctor & Book Slot →
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="mt-12 rounded-2xl border bg-card p-12 text-center text-muted-foreground">
            No doctors found matching "{searchQuery || s}". Try adjusting your filters.
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
}
