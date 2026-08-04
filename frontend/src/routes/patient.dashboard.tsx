import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, Calendar, FileText, Heart, Brain, MapPin, Bell, Settings, LogOut, Star, Video, Clock, CheckCircle, AlertCircle, Download, RefreshCw, X, ShieldAlert, Sparkles, User, ChevronRight } from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";
import { useState, useEffect } from "react";
import { fetchPatientDashboard, analyzeSymptomsApi, rescheduleAppointment, cancelAppointment, requestPrescriptionRefill } from "@/services/api";

export const Route = createFileRoute("/patient/dashboard")({
  head: () => ({ meta: [{ title: "Patient Dashboard — DoctorFind AI" }] }),
  component: PatientDashboardPage,
});

export const navItems = [
  { label: "Dashboard", to: "/patient/dashboard", icon: LayoutDashboard },
  { label: "Appointments", to: "/patient/appointments", icon: Calendar },
  { label: "Medical History", to: "/patient/medical-history", icon: FileText },
  { label: "Prescriptions", to: "/patient/prescriptions", icon: Heart },
  { label: "Medical Records", to: "/patient/medical-records", icon: FileText },
  { label: "AI Symptom Checker", to: "/patient/symptom-checker", icon: Brain },
  { label: "Nearby Services", to: "/patient/nearby", icon: MapPin },
  { label: "Notifications", to: "/patient/notifications", icon: Bell },
  { label: "Profile Settings", to: "/patient/profile", icon: Settings },
  { label: "Logout", to: "/login", icon: LogOut },
];

function Kpi({ label, value, sub, to }: { label: string; value: string; sub: string; to?: string }) {
  return (
    <motion.div whileHover={{ y: -3 }} className="rounded-2xl border bg-card p-5 transition hover:shadow-lg">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="mt-2 font-display text-3xl font-bold">{value}</div>
      {to ? (
        <Link to={to} className="mt-1 inline-block text-xs font-semibold text-teal hover:underline">
          {sub} →
        </Link>
      ) : (
        <div className="mt-1 text-xs text-teal font-medium">{sub}</div>
      )}
    </motion.div>
  );
}

export default function PatientDashboardPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [localUser, setLocalUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Symptom Checker State
  const [symptomsInput, setSymptomsInput] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<any>(null);

  // Modal states for Appointments
  const [rescheduleModalAppt, setRescheduleModalAppt] = useState<any>(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [detailModalAppt, setDetailModalAppt] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("user");
      const token = localStorage.getItem("token");
      if (stored && token) {
        try {
          setLocalUser(JSON.parse(stored));
          setIsAuthenticated(true);
        } catch (e) {}
      } else {
        setIsAuthenticated(false);
      }
    }
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const res = await fetchPatientDashboard();
      if (res?.success) {
        setData(res);
      }
    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleSymptomAnalysis = async () => {
    if (!symptomsInput.trim()) return;
    try {
      setAnalyzing(true);
      const res = await analyzeSymptomsApi(symptomsInput);
      if (res?.analysis) {
        setAiAnalysisResult(res.analysis);
      }
    } catch (err) {
      console.error("Analysis error:", err);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleRescheduleSubmit = async () => {
    if (!rescheduleModalAppt || !newDate || !newTime) return;
    try {
      await rescheduleAppointment(rescheduleModalAppt._id, { appointmentDate: newDate, appointmentTime: newTime });
      setRescheduleModalAppt(null);
      loadDashboard();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancelAppt = async (id: string) => {
    if (confirm("Are you sure you want to cancel this appointment?")) {
      try {
        await cancelAppointment(id);
        loadDashboard();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleRefill = async (id: string) => {
    try {
      await requestPrescriptionRefill(id);
      alert("Refill request submitted to clinic!");
      loadDashboard();
    } catch (err) {
      console.error(err);
    }
  };

  const patientName = localUser?.name || data?.patient?.name || "Rahul";
  const patientImage = localUser?.profileImage || data?.patient?.profileImage;

  const kpis = data?.kpis || {
    upcomingAppointments: 2,
    activePrescriptions: 5,
    medicalRecords: 12,
    healthScore: { score: "85/100", status: "Good" }
  };
  const appointments = data?.upcomingAppointments || [];
  const prescriptions = data?.recentPrescriptions || [];

  return (
    <DashboardShell role="PATIENT" roleColor="oklch(0.68 0.13 190)" nav={navItems} user={{ name: patientName, img: patientImage }}>
      {/* Unauthenticated Auth Banner */}
      {!isAuthenticated && (
        <div className="mb-6 rounded-2xl border border-teal/30 bg-gradient-to-r from-teal/10 to-navy/10 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="font-display font-bold text-base text-foreground">Sign In or Create an Account</div>
            <div className="text-xs text-muted-foreground mt-0.5">
              Access your personal patient records, appointments, prescriptions & AI symptom history.
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link to="/login" className="rounded-xl border bg-card px-4 py-2 text-xs font-semibold text-foreground hover:bg-accent">
              Log In
            </Link>
            <Link to="/signup" className="rounded-xl bg-teal px-4 py-2 text-xs font-semibold text-white shadow hover:opacity-90">
              Create Account
            </Link>
          </div>
        </div>
      )}

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold">Welcome back, {patientName} 👋</h1>
        <p className="mt-1 text-muted-foreground">Here's your real-time health overview and medical schedule</p>
      </motion.div>


      {/* KPI Cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi label="Upcoming Appointments" value={String(kpis.upcomingAppointments)} sub="View all" to="/patient/appointments" />
        <Kpi label="Prescriptions" value={String(kpis.activePrescriptions)} sub="View all" to="/patient/prescriptions" />
        <Kpi label="Medical Records" value={String(kpis.medicalRecords)} sub="View all" to="/patient/medical-records" />
        <Kpi label="Health Score" value={kpis.healthScore?.score || "85/100"} sub={kpis.healthScore?.status || "Good"} />
      </div>

      {/* Health Score Detailed Progress Bar */}
      {kpis.healthScore && (
        <div className="mt-4 rounded-2xl border bg-card p-4">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span>Dynamic Health Score Rating: <span className="text-teal">{kpis.healthScore.status}</span></span>
            <span>BMI: {kpis.healthScore.bmi || "22.9"} (Optimal)</span>
          </div>
          <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-accent">
            <div
              className={`h-full transition-all duration-500 ${
                kpis.healthScore.color === "emerald" ? "bg-emerald-500" :
                kpis.healthScore.color === "teal" ? "bg-teal" :
                kpis.healthScore.color === "amber" ? "bg-amber-500" : "bg-rose-500"
              }`}
              style={{ width: `${kpis.healthScore.numericScore || 85}%` }}
            />
          </div>
        </div>
      )}

      {/* Main Grid Section */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Upcoming Appointments Card */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl border bg-card p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-lg">Upcoming Appointments</h3>
            <Link to="/patient/appointments" className="text-xs font-semibold text-teal hover:underline">
              View All
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {appointments.length > 0 ? (
              appointments.map((a: any) => (
                <div key={a._id} className="rounded-xl border p-4 transition hover:border-teal/50">
                  <div className="flex items-start gap-3">
                    <img src={a.doctorImage || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=300&auto=format&fit=crop"} alt={a.doctorName} className="h-12 w-12 rounded-full object-cover shrink-0 border" />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm truncate">{a.doctorName}</div>
                      <div className="text-xs text-muted-foreground">{a.specialization} · {a.hospital}</div>
                      <div className="mt-1 flex items-center gap-2 text-xs font-medium text-teal">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{a.appointmentDate} · {a.appointmentTime}</span>
                        <span className="rounded-md bg-accent px-1.5 py-0.5 text-[10px] uppercase font-bold text-foreground">{a.mode}</span>
                      </div>
                    </div>
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      a.status === "Confirmed" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" :
                      a.status === "Pending" ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300" :
                      "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                    }`}>
                      {a.status}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="mt-3 flex flex-wrap items-center gap-2 border-t pt-3 text-xs">
                    <button onClick={() => setDetailModalAppt(a)} className="rounded-lg border px-3 py-1.5 font-medium hover:bg-accent">
                      View Details
                    </button>
                    <button onClick={() => { setRescheduleModalAppt(a); setNewDate(a.appointmentDate); setNewTime(a.appointmentTime); }} className="rounded-lg border px-3 py-1.5 font-medium hover:bg-accent">
                      Reschedule
                    </button>
                    <button onClick={() => handleCancelAppt(a._id)} className="rounded-lg border px-3 py-1.5 font-medium text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950">
                      Cancel
                    </button>
                    {a.mode === "Online" && a.status === "Confirmed" && (
                      <a href={a.videoCallUrl || "https://meet.jit.si/DoctorFindAI"} target="_blank" rel="noreferrer" className="ml-auto inline-flex items-center gap-1 rounded-lg bg-teal px-3 py-1.5 font-semibold text-white shadow hover:opacity-90">
                        <Video className="h-3.5 w-3.5" /> Join Call
                      </a>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-sm text-muted-foreground">No upcoming appointments scheduled</div>
            )}
          </div>
        </motion.div>

        {/* AI Symptom Checker Card */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="rounded-2xl border bg-gradient-to-br from-teal/10 to-[oklch(0.55_0.18_260)]/10 p-5 flex flex-col">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-lg flex items-center gap-2">
              <Brain className="h-5 w-5 text-teal" /> AI Symptom Checker
            </h3>
            <Link to="/patient/symptom-checker" className="text-xs font-semibold text-teal hover:underline">
              Full Diagnostics →
            </Link>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">Describe your symptoms in natural language for AI medical analysis</p>
          
          <textarea
            value={symptomsInput}
            onChange={(e) => setSymptomsInput(e.target.value)}
            placeholder="Describe your symptoms... e.g. Frequent headaches with fever and fatigue for 2 days"
            className="mt-4 h-24 w-full resize-none rounded-xl border bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-teal/30"
          />
          
          <button
            onClick={handleSymptomAnalysis}
            disabled={analyzing || !symptomsInput.trim()}
            className="mt-3 w-full rounded-xl bg-gradient-to-r from-teal to-[oklch(0.55_0.18_260)] py-2.5 text-sm font-semibold text-white shadow transition hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {analyzing ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" /> Analyzing Symptoms...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" /> Start AI Analysis
              </>
            )}
          </button>

          {/* AI Analysis Result Display */}
          {aiAnalysisResult && (
            <div className="mt-4 rounded-xl border bg-card p-4 text-xs space-y-2">
              <div className="flex items-center justify-between font-bold text-sm">
                <span>Suggested Specialist: <span className="text-teal">{aiAnalysisResult.suggestedSpecialist}</span></span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  aiAnalysisResult.severity === "Mild" ? "bg-emerald-100 text-emerald-700" :
                  aiAnalysisResult.severity === "High" ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"
                }`}>
                  {aiAnalysisResult.severity} Severity
                </span>
              </div>
              <div className="text-muted-foreground">{aiAnalysisResult.urgencyLevel}</div>
              <div className="font-semibold mt-2">Possible Conditions:</div>
              <ul className="list-disc pl-4 space-y-1">
                {aiAnalysisResult.possibleConditions?.map((c: any, i: number) => (
                  <li key={i}><strong>{c.condition}</strong> ({c.probability}) — {c.description}</li>
                ))}
              </ul>
              <div className="text-[10px] text-muted-foreground italic border-t pt-2 mt-2">{aiAnalysisResult.disclaimer}</div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Recent Prescriptions */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-6 rounded-2xl border bg-card p-5">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-lg">Recent Prescriptions</h3>
          <Link to="/patient/prescriptions" className="text-sm font-semibold text-teal hover:underline">
            View All
          </Link>
        </div>
        <div className="mt-4 space-y-3">
          {prescriptions.length > 0 ? (
            prescriptions.map((p: any) => (
              <div key={p._id} className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border p-3.5 text-sm gap-3">
                <div className="flex items-center gap-3">
                  <Star className="h-4 w-4 text-teal shrink-0" />
                  <div>
                    <div className="font-semibold text-foreground">
                      {p.medicines?.map((m: any) => m.name).join(", ") || "Prescription Medicines"}
                    </div>
                    <div className="text-xs text-muted-foreground">{p.prescribingDoctor} · {p.hospital}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <span className="rounded-md bg-accent px-2 py-1 text-muted-foreground font-medium">{p.status}</span>
                  <span className="text-muted-foreground">{p.date}</span>
                  <button onClick={() => handleRefill(p._id)} className="font-semibold text-teal hover:underline">
                    Refill Request
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-6 text-center text-sm text-muted-foreground">No prescriptions on record</div>
          )}
        </div>
      </motion.div>

      {/* Reschedule Modal */}
      {rescheduleModalAppt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-card p-6 border shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-display font-bold text-lg">Reschedule Appointment</h3>
              <button onClick={() => setRescheduleModalAppt(null)}><X className="h-5 w-5" /></button>
            </div>
            <div className="mt-4 space-y-4 text-sm">
              <div>
                <label className="font-medium text-xs">New Appointment Date</label>
                <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} className="mt-1 w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none" />
              </div>
              <div>
                <label className="font-medium text-xs">New Time Slot</label>
                <select value={newTime} onChange={(e) => setNewTime(e.target.value)} className="mt-1 w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none">
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="10:30 AM">10:30 AM</option>
                  <option value="11:30 AM">11:30 AM</option>
                  <option value="02:00 PM">02:00 PM</option>
                  <option value="04:30 PM">04:30 PM</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => setRescheduleModalAppt(null)} className="rounded-xl border px-4 py-2 text-sm font-semibold">Cancel</button>
              <button onClick={handleRescheduleSubmit} className="rounded-xl bg-teal px-4 py-2 text-sm font-semibold text-white shadow">Confirm Reschedule</button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {detailModalAppt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-card p-6 border shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-display font-bold text-lg">Appointment Details</h3>
              <button onClick={() => setDetailModalAppt(null)}><X className="h-5 w-5" /></button>
            </div>
            <div className="text-sm space-y-2">
              <div><strong>Doctor:</strong> {detailModalAppt.doctorName}</div>
              <div><strong>Specialization:</strong> {detailModalAppt.specialization}</div>
              <div><strong>Hospital:</strong> {detailModalAppt.hospital}</div>
              <div><strong>Date & Time:</strong> {detailModalAppt.appointmentDate} at {detailModalAppt.appointmentTime}</div>
              <div><strong>Mode:</strong> {detailModalAppt.mode}</div>
              <div><strong>Status:</strong> {detailModalAppt.status}</div>
              <div><strong>Consultation Fee:</strong> ₹{detailModalAppt.consultationFee || 800}</div>
              <div><strong>Reason / Symptoms:</strong> {detailModalAppt.symptoms}</div>
            </div>
            <button onClick={() => setDetailModalAppt(null)} className="w-full rounded-xl bg-teal py-2 text-sm font-semibold text-white">Close</button>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
