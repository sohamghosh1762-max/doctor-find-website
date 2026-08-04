import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Activity, Menu, X } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "./theme-toggle";

const links = [
  { to: "/", label: "Home" },
  { to: "/doctors", label: "Find Doctors" },
  { to: "/hospitals", label: "Hospitals" },
  { to: "/symptom-checker", label: "AI Checker" },
  { to: "/dashboard/patient", label: "Dashboard" },
];

export function SiteNav() {
  const [open, setOpen] = useState(false);
  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div className="mx-auto mt-4 max-w-7xl px-4">
        <div className="glass flex items-center justify-between rounded-full px-5 py-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-teal to-navy text-white shadow-lg">
              <Activity className="h-5 w-5" />
            </div>
            <span className="font-display text-lg font-bold tracking-tight">
              DoctorFind <span className="text-gradient">AI</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                activeOptions={{ exact: l.to === "/" }}
                className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground data-[status=active]:bg-accent data-[status=active]:text-foreground"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link to="/login" className="hidden rounded-full px-4 py-2 text-sm font-medium text-foreground hover:bg-accent md:inline-flex">
              Login
            </Link>
            <Link
              to="/signup"
              className="hidden rounded-full bg-gradient-to-r from-teal to-[oklch(0.55_0.18_260)] px-5 py-2 text-sm font-semibold text-white shadow-md transition hover:opacity-90 md:inline-flex"
            >
              Sign Up
            </Link>
            <button
              onClick={() => setOpen(!open)}
              className="grid h-9 w-9 place-items-center rounded-full hover:bg-accent md:hidden"
              aria-label="menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass mt-2 flex flex-col gap-1 rounded-2xl p-3 md:hidden"
          >
            {links.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="rounded-lg px-4 py-2 text-sm hover:bg-accent">
                {l.label}
              </Link>
            ))}
            <Link to="/login" onClick={() => setOpen(false)} className="rounded-lg px-4 py-2 text-sm hover:bg-accent">Login</Link>
            <Link to="/signup" onClick={() => setOpen(false)} className="rounded-lg bg-teal px-4 py-2 text-center text-sm font-semibold text-white">Sign Up</Link>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
}