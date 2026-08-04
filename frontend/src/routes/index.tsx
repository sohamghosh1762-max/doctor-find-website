import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Activity, Brain, ShieldCheck, CalendarClock, FileText, MapPin, Siren,
  Search, Star, Stethoscope, Pill, ChevronRight, Sparkles, Users, Building2, Heart,
} from "lucide-react";
import heroDoctor from "@/assets/hero-doctor.jpg";
import hospitalImg from "@/assets/hospital.jpg";
import { SiteNav } from "@/components/site-nav";
import { Footer } from "@/components/footer";
import { StatCounter } from "@/components/stat-counter";
import { useState, useEffect } from "react";
import axios from "axios";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DoctorFind AI — Healthcare Reimagined Through Intelligence" },
      { name: "description", content: "Find verified doctors, book instant appointments, locate nearby hospitals and pharmacies, and get AI-powered symptom analysis." },
    ],
  }),
  component: Landing,
});

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Brain, ShieldCheck, CalendarClock, FileText, MapPin, Siren,
};

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
};
const features = [
  {
    icon: "Brain",
    title: "AI Symptom Checker",
    desc: "Analyze symptoms instantly using AI"
  },
  {
    icon: "CalendarClock",
    title: "Instant Appointments",
    desc: "Book doctors in seconds"
  },
  {
    icon: "FileText",
    title: "Medical Records",
    desc: "Access your records securely"
  },
  {
    icon: "MapPin",
    title: "Nearby Hospitals",
    desc: "Find hospitals around you"
  },
  {
    icon: "Siren",
    title: "Emergency Support",
    desc: "Quick emergency assistance"
  },
  {
    icon: "ShieldCheck",
    title: "Verified Doctors",
    desc: "Only trusted professionals"
  }
];
function Landing() {
  const [tab, setTab] = useState<"Doctors" | "Hospitals" | "Medicines">("Doctors");
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
  const fetchDoctors = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/doctors"
      );
      console.log("Backend Doctors:", res.data.doctors);

      setDoctors(res.data.doctors);
      
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  fetchDoctors();
}, []);
  if (loading) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-teal border-t-transparent"></div>
    </div>
  );
}
  return (
    <div className="overflow-x-hidden">
      <SiteNav />

      {/* HERO */}
      <section className="relative min-h-screen pt-28">
        {/* floating blobs */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -left-32 top-24 h-96 w-96 rounded-full bg-teal/30 blur-3xl"
          animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -right-32 bottom-0 h-[28rem] w-[28rem] rounded-full bg-[oklch(0.6_0.18_260)]/25 blur-3xl"
          animate={{ x: [0, -30, 0], y: [0, 30, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-10 lg:grid-cols-[1.05fr_1fr] lg:items-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 rounded-full border bg-card/60 px-3 py-1 text-xs font-medium backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-teal" />
              <span>AI-Powered · People-Centered · Always Accessible</span>
            </div>
            <h1 className="mt-6 font-display text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Healthcare,<br />
              Reimagined Through{" "}
              <span className="text-blue-600">Intelligence</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              Find verified doctors, book instant appointments, locate nearby hospitals and pharmacies — all in one premium AI-powered platform.
            </p>

            {/* Search */}
            <motion.div {...fadeUp} className="glass mt-8 max-w-xl rounded-2xl p-3">
              <div className="flex gap-1 rounded-xl bg-secondary p-1">
                {(["Doctors", "Hospitals", "Medicines"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition ${tab === t ? "bg-card shadow text-foreground" : "text-muted-foreground"}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <div className="mt-3 flex items-center gap-2 rounded-xl border bg-background px-3 py-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input
                  placeholder={`Search ${tab.toLowerCase()}, specialties, locations...`}
                  className="flex-1 bg-transparent text-sm outline-none"
                />
                <button className="rounded-lg bg-gradient-to-r from-teal to-[oklch(0.55_0.18_260)] px-4 py-2 text-sm font-semibold text-white shadow">
                  Search
                </button>
              </div>
            </motion.div>

            {/* Floating stat cards */}
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { i: Users, v: "25K+", l: "Verified Doctors" },
                { i: Heart, v: "3.2M+", l: "Happy Patients" },
                { i: Building2, v: "1.8K+", l: "Hospitals" },
                { i: Pill, v: "4.5K+", l: "Pharmacies" },
              ].map((s, idx) => (
                <motion.div
                  key={s.l}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + idx * 0.1, duration: 0.6 }}
                  className="glass rounded-2xl p-4"
                >
                  <s.i className="h-5 w-5 text-teal" />
                  <div className="mt-2 font-display text-xl font-bold">{s.v}</div>
                  <div className="text-xs text-muted-foreground">{s.l}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Hero image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-[2rem] shadow-2xl">
              <img src={heroDoctor} alt="Doctor consulting patient" width={1536} height={1024} className="aspect-[4/5] w-full object-cover lg:aspect-[5/6]" />
              <div className="absolute inset-0 bg-gradient-to-tr from-navy/40 via-transparent to-teal/20" />
            </div>
            {/* Floating chips */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="glass absolute -left-4 top-10 hidden rounded-2xl p-4 sm:block"
            >
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-teal/15 text-teal"><ShieldCheck className="h-5 w-5" /></div>
                <div>
                  <div className="text-sm font-bold">Verified</div>
                  <div className="text-xs text-muted-foreground">25,000+ doctors</div>
                </div>
              </div>
            </motion.div>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="glass absolute -right-4 bottom-10 hidden rounded-2xl p-4 sm:block"
            >
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-[oklch(0.6_0.18_260)]/15 text-[oklch(0.5_0.18_260)]"><Brain className="h-5 w-5" /></div>
                <div>
                  <div className="text-sm font-bold">AI Checker</div>
                  <div className="text-xs text-muted-foreground">Analyze symptoms</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <motion.div {...fadeUp} className="text-center">
          <h2 className="font-display text-4xl font-bold sm:text-5xl">Everything You Need, In One Place</h2>
          <p className="mt-4 text-muted-foreground">Advanced healthcare solutions powered by AI and trusted by millions.</p>
        </motion.div>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => {
            const Icon = iconMap[f.icon];
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                whileHover={{ y: -6 }}
                className="group rounded-2xl border bg-card p-6 transition hover:shadow-xl"
              >
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-teal/20 to-[oklch(0.6_0.18_260)]/20 text-teal transition group-hover:scale-110">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 font-display text-lg font-bold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
                <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-teal opacity-0 transition group-hover:opacity-100">
                  Learn more <ChevronRight className="h-4 w-4" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* STATS */}
      <section className="relative overflow-hidden bg-[var(--color-navy-deep)] py-20 text-white">
        <div
          className="absolute inset-0 opacity-20"
          style={{ backgroundImage: `url(${hospitalImg})`, backgroundSize: "cover", backgroundPosition: "center" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-deep via-navy-deep/90 to-navy-deep/70" />
        <div className="relative mx-auto max-w-7xl px-6">
          <motion.h2 {...fadeUp} className="text-center font-display text-4xl font-bold">Trusted by Thousands, Every Day</motion.h2>
          <div className="mt-12 grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { v: 99.6, s: "%", l: "Satisfaction Rate", d: 1 },
              { v: 4.9, s: "/5", l: "Average Rating", d: 1 },
              { v: 50, s: "K+", l: "Daily Appointments", d: 0 },
              { v: 24, s: "/7", l: "Support Available", d: 0 },
            ].map((s, i) => (
              <motion.div
                key={s.l}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="text-center"
              >
                <div className="font-display text-5xl font-bold text-teal">
                  <StatCounter value={s.v} suffix={s.s} decimals={s.d} />
                </div>
                <div className="mt-2 text-sm text-white/70">{s.l}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* DOCTORS */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="flex items-end justify-between">
          <motion.div {...fadeUp}>
            <h2 className="font-display text-4xl font-bold sm:text-5xl">Find The Best Doctors</h2>
            <p className="mt-3 text-muted-foreground">Browse doctors by specialty and book appointments instantly.</p>
          </motion.div>
          <Link to="/doctors" className="hidden text-sm font-semibold text-teal hover:underline md:inline-flex">View All Doctors →</Link>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {doctors.map((d, i) => (
            <motion.div
              key={d._id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              whileHover={{ y: -6 }}
              className="overflow-hidden rounded-2xl border bg-card transition hover:shadow-xl"
            >
              <div className="aspect-square overflow-hidden bg-accent">
                <img src={d.profileImage || "https://via.placeholder.com/400" } alt={d.name} loading="lazy" width={512} height={512} className="h-full w-full object-cover transition duration-500 hover:scale-105"/>
              </div>
              <div className="p-5">
                <h3 className="font-display font-bold">{d.name}</h3>
                <p className="text-sm text-muted-foreground">{d.specialization}</p>
                <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                  <Stethoscope className="h-3.5 w-3.5" />{d.experience} Years Exp.
                </div>
                <div className="mt-2 flex items-center gap-1 text-xs">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-semibold">{d.rating}</span>
                  <span className="text-muted-foreground">(Verified)</span>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-display font-bold">₹{d.fees}</span>
                  <span className="text-xs font-medium text-teal">Verified Doctor</span>
                </div>
                <Link
  to="/doctors"
  className="mt-4 block w-full rounded-xl bg-gradient-to-r from-teal to-indigo-600 py-2 text-center text-sm font-semibold text-white"
>
  View Profile
</Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <motion.div
          {...fadeUp}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--color-navy)] via-[oklch(0.25_0.1_260)] to-[var(--color-teal-soft)] p-10 text-white md:p-16"
        >
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-teal/30 blur-3xl" />
          <div className="relative max-w-2xl">
            <h2 className="font-display text-4xl font-bold md:text-5xl">Start your AI-powered health journey today</h2>
            <p className="mt-4 text-white/80">Join millions trusting DoctorFind AI for verified care, instant access, and smarter outcomes.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/signup" className="breathing rounded-full bg-white px-6 py-3 text-sm font-bold text-navy shadow-lg">Get Started Free</Link>
              <Link to="/symptom-checker" className="rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-bold backdrop-blur transition hover:bg-white/20">Try AI Checker</Link>
            </div>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
