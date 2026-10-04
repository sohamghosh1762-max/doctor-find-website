import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Activity } from "lucide-react";
import heroDoctor from "@/assets/hero-doctor.jpg";
import { useState } from "react";
import { registerApi } from "@/services/api";

export const Route = createFileRoute("/signup")({ component: Signup });

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    gender: "Male",
    dateOfBirth: "1998-05-20",
    bloodGroup: "O+",
    address: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!form.name || !form.email || !form.password) {
      setErrorMsg("Please fill in Name, Email, and Password.");
      return;
    }

    if (form.password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }

    try {
      setLoading(true);
      const res = await registerApi(form);

      if (res?.success) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("user", JSON.stringify(res.user));

        alert("Account created successfully! Welcome to DoctorFind AI.");
        navigate({ to: "/patient/dashboard" });
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2 bg-background">
      <div className="grid place-items-center p-6 md:p-12 order-2 lg:order-1 overflow-y-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md my-auto">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-teal to-navy text-white">
              <Activity className="h-5 w-5" />
            </div>
            <span className="font-display font-bold text-lg">DoctorFind AI</span>
          </Link>

          <h1 className="mt-6 font-display text-3xl font-bold">Create your patient account</h1>
          <p className="mt-1 text-sm text-muted-foreground">Sign up to access your personal dashboard, medical records & AI care.</p>

          {errorMsg && (
            <div className="mt-4 rounded-xl bg-rose-500/10 border border-rose-500/30 p-3 text-xs font-semibold text-rose-600">
              {errorMsg}
            </div>
          )}

          <form className="mt-6 space-y-3" onSubmit={handleSignup}>
            <div>
              <label className="text-xs font-semibold">Full Name *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-1 w-full rounded-xl border bg-background px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-teal/30"
                placeholder="e.g. Rahul Verma"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold">Email *</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="mt-1 w-full rounded-xl border bg-background px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-teal/30"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="text-xs font-semibold">Phone Number</label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="mt-1 w-full rounded-xl border bg-background px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-teal/30"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold">Password *</label>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="mt-1 w-full rounded-xl border bg-background px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-teal/30"
                placeholder="••••••••"
              />
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <label className="font-semibold">Gender</label>
                <select
                  value={form.gender}
                  onChange={(e) => setForm({ ...form, gender: e.target.value })}
                  className="mt-1 w-full rounded-xl border bg-background px-2 py-2 outline-none"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="font-semibold">Blood Group</label>
                <select
                  value={form.bloodGroup}
                  onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}
                  className="mt-1 w-full rounded-xl border bg-background px-2 py-2 outline-none"
                >
                  <option value="O+">O+</option>
                  <option value="A+">A+</option>
                  <option value="B+">B+</option>
                  <option value="AB+">AB+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
              <div>
                <label className="font-semibold">Date of Birth</label>
                <input
                  type="date"
                  value={form.dateOfBirth}
                  onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
                  className="mt-1 w-full rounded-xl border bg-background px-2 py-1.5 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold">Residential Address</label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="mt-1 w-full rounded-xl border bg-background px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-teal/30"
                placeholder="Street address, City, State"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-xl bg-gradient-to-r from-teal to-[oklch(0.55_0.18_260)] py-2.5 text-sm font-semibold text-white shadow transition hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Creating Patient Account..." : "Create Patient Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-teal hover:underline">
              Sign In
            </Link>
          </p>
        </motion.div>
      </div>

      <div className="relative hidden lg:block order-1 lg:order-2">
        <img src={heroDoctor} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-bl from-navy/80 via-navy/40 to-teal/30" />
        <div className="absolute bottom-12 right-12 text-white text-right">
          <h2 className="font-display text-4xl font-bold">
            Healthcare,
            <br />
            reimagined.
          </h2>
          <p className="mt-3 text-white/80 max-w-sm ml-auto">Trusted by 3.2M+ patients across India.</p>
        </div>
      </div>
    </div>
  );
}
