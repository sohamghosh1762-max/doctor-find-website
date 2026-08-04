import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Calendar as CalendarIcon, Clock, Video, Search, Filter, Plus, CheckCircle, AlertCircle, X, ChevronRight, MapPin, User, FileText } from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";
import { navItems } from "./patient.dashboard";
import { useState, useEffect } from "react";
import { fetchMyAppointments, bookAppointment, rescheduleAppointment, cancelAppointment } from "@/services/api";

export const Route = createFileRoute("/patient/appointments/")({
  head: () => ({ meta: [{ title: "Appointments — DoctorFind AI" }] }),
  component: PatientAppointmentsPage,
});

export default function PatientAppointmentsPage() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [activeTab, setActiveTab] = useState("Upcoming");
  const [modeFilter, setModeFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");

  // Book Modal state
  const [bookModalOpen, setBookModalOpen] = useState(false);
  const [bookForm, setBookForm] = useState({
    doctorName: "Dr. Ananya Sharma",
    specialization: "Cardiologist",
    hospital: "Apollo Gleneagles Hospital",
    appointmentDate: "2026-08-05",
    appointmentTime: "10:30 AM",
    mode: "Online",
    symptoms: "General cardiology consultation",
    consultationFee: 800
  });

  // Reschedule Modal
  const [rescheduleModalAppt, setRescheduleModalAppt] = useState<any>(null);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const res = await fetchMyAppointments({ status: activeTab, mode: modeFilter, search: searchQuery });
      if (res?.appointments) {
        setAppointments(res.appointments);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, [activeTab, modeFilter, searchQuery]);

  const handleBookSubmit = async () => {
    try {
      await bookAppointment(bookForm);
      setBookModalOpen(false);
      alert("Appointment booked successfully!");
      loadAppointments();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRescheduleSubmit = async () => {
    if (!rescheduleModalAppt) return;
    try {
      await rescheduleAppointment(rescheduleModalAppt._id, { appointmentDate: rescheduleDate, appointmentTime: rescheduleTime });
      setRescheduleModalAppt(null);
      loadAppointments();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancel = async (id: string) => {
    if (confirm("Are you sure you want to cancel this appointment?")) {
      try {
        await cancelAppointment(id);
        loadAppointments();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <DashboardShell role="PATIENT" roleColor="oklch(0.68 0.13 190)" nav={navItems} user={{ name: "Rahul" }}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Appointment Management</h1>
          <p className="mt-1 text-muted-foreground">Book, view, reschedule, or cancel your consultations</p>
        </div>
        <button
          onClick={() => setBookModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal to-[oklch(0.55_0.18_260)] px-4 py-2.5 text-sm font-semibold text-white shadow transition hover:opacity-90 shrink-0"
        >
          <Plus className="h-4 w-4" /> Book New Appointment
        </button>
      </div>

      {/* Tabs & Search Filter Bar */}
      <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border bg-card p-4">
        <div className="flex flex-wrap items-center gap-2">
          {["Upcoming", "Completed", "Cancelled", "All"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
                activeTab === tab ? "bg-teal text-white shadow" : "bg-accent/60 text-muted-foreground hover:bg-accent"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {/* Mode Selector */}
          <select
            value={modeFilter}
            onChange={(e) => setModeFilter(e.target.value)}
            className="rounded-xl border bg-background px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-teal/30"
          >
            <option value="All">All Modes</option>
            <option value="Online">Online Video</option>
            <option value="Offline">In-Hospital Visit</option>
          </select>

          {/* Search Field */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search doctor or hospital..."
              className="rounded-xl border bg-background py-1.5 pl-9 pr-3 text-xs outline-none focus:ring-2 focus:ring-teal/30"
            />
          </div>

          {/* View Toggle */}
          <button
            onClick={() => setViewMode(viewMode === "list" ? "calendar" : "list")}
            className="rounded-xl border p-2 text-xs font-medium hover:bg-accent"
            title="Toggle Calendar View"
          >
            <CalendarIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* View Content */}
      {viewMode === "calendar" ? (
        <div className="mt-6 rounded-2xl border bg-card p-6 text-center">
          <div className="font-display font-bold text-lg">Calendar View — July & August 2026</div>
          <div className="mt-4 grid grid-cols-7 gap-2 text-xs font-semibold text-muted-foreground">
            <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
          </div>
          <div className="mt-2 grid grid-cols-7 gap-2 text-xs">
            {Array.from({ length: 31 }).map((_, i) => {
              const day = i + 1;
              const hasAppt = day === 28 || day === 4;
              return (
                <div key={day} className={`h-16 rounded-xl border p-1.5 flex flex-col justify-between ${hasAppt ? "bg-teal/10 border-teal font-bold" : "bg-card"}`}>
                  <span>{day}</span>
                  {hasAppt && <span className="rounded bg-teal text-[9px] text-white p-0.5 truncate">Appt</span>}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {loading ? (
            <div className="py-12 text-center text-sm text-muted-foreground">Loading appointments...</div>
          ) : appointments.length > 0 ? (
            appointments.map((a: any) => (
              <motion.div key={a._id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border bg-card p-5 transition hover:shadow-md">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <img src={a.doctorImage || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=300&auto=format&fit=crop"} alt={a.doctorName} className="h-14 w-14 rounded-2xl object-cover border" />
                    <div>
                      <div className="font-display font-bold text-base flex items-center gap-2">
                        {a.doctorName}
                        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          a.status === "Confirmed" ? "bg-emerald-100 text-emerald-700" :
                          a.status === "Pending" ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700"
                        }`}>
                          {a.status}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">{a.specialization} · {a.hospital}</div>
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs font-medium text-teal">
                        <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {a.appointmentDate} at {a.appointmentTime}</span>
                        <span className="rounded-md bg-accent px-2 py-0.5 text-[10px] uppercase font-bold text-foreground">{a.mode}</span>
                        <span>Fee: ₹{a.consultationFee || 800}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2 text-xs shrink-0">
                    <Link to={`/patient/appointments/${a._id}`} className="rounded-xl border px-3.5 py-2 font-medium hover:bg-accent">
                      View Details
                    </Link>
                    {a.status !== "Cancelled" && (
                      <>
                        <button onClick={() => { setRescheduleModalAppt(a); setRescheduleDate(a.appointmentDate); setRescheduleTime(a.appointmentTime); }} className="rounded-xl border px-3.5 py-2 font-medium hover:bg-accent">
                          Reschedule
                        </button>
                        <button onClick={() => handleCancel(a._id)} className="rounded-xl border px-3.5 py-2 font-medium text-rose-500 hover:bg-rose-50">
                          Cancel
                        </button>
                      </>
                    )}
                    {a.mode === "Online" && a.status === "Confirmed" && (
                      <a href={a.videoCallUrl || "https://meet.jit.si/DoctorFindAI"} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-xl bg-teal px-4 py-2 font-semibold text-white shadow hover:opacity-90">
                        <Video className="h-4 w-4" /> Join Video Call
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="rounded-2xl border bg-card p-12 text-center text-sm text-muted-foreground">
              No appointments found matching current filters
            </div>
          )}
        </div>
      )}

      {/* Book Appointment Modal */}
      {bookModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-card p-6 border shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-display font-bold text-lg">Book New Consultation</h3>
              <button onClick={() => setBookModalOpen(false)}><X className="h-5 w-5" /></button>
            </div>
            <div className="grid gap-3 text-xs">
              <div>
                <label className="font-semibold">Doctor Name</label>
                <input value={bookForm.doctorName} onChange={(e) => setBookForm({ ...bookForm, doctorName: e.target.value })} className="mt-1 w-full rounded-xl border bg-background p-2.5 text-xs outline-none" />
              </div>
              <div>
                <label className="font-semibold">Specialization</label>
                <input value={bookForm.specialization} onChange={(e) => setBookForm({ ...bookForm, specialization: e.target.value })} className="mt-1 w-full rounded-xl border bg-background p-2.5 text-xs outline-none" />
              </div>
              <div>
                <label className="font-semibold">Hospital / Clinic</label>
                <input value={bookForm.hospital} onChange={(e) => setBookForm({ ...bookForm, hospital: e.target.value })} className="mt-1 w-full rounded-xl border bg-background p-2.5 text-xs outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold">Date</label>
                  <input type="date" value={bookForm.appointmentDate} onChange={(e) => setBookForm({ ...bookForm, appointmentDate: e.target.value })} className="mt-1 w-full rounded-xl border bg-background p-2.5 text-xs outline-none" />
                </div>
                <div>
                  <label className="font-semibold">Time Slot</label>
                  <select value={bookForm.appointmentTime} onChange={(e) => setBookForm({ ...bookForm, appointmentTime: e.target.value })} className="mt-1 w-full rounded-xl border bg-background p-2.5 text-xs outline-none">
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="10:30 AM">10:30 AM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="04:30 PM">04:30 PM</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="font-semibold">Consultation Mode</label>
                <select value={bookForm.mode} onChange={(e) => setBookForm({ ...bookForm, mode: e.target.value })} className="mt-1 w-full rounded-xl border bg-background p-2.5 text-xs outline-none">
                  <option value="Online">Online Video Call</option>
                  <option value="Offline">In-Hospital Visit</option>
                </select>
              </div>
              <div>
                <label className="font-semibold">Reason for Visit / Symptoms</label>
                <textarea value={bookForm.symptoms} onChange={(e) => setBookForm({ ...bookForm, symptoms: e.target.value })} className="mt-1 w-full h-16 rounded-xl border bg-background p-2.5 text-xs outline-none" />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setBookModalOpen(false)} className="rounded-xl border px-4 py-2 text-xs font-semibold">Cancel</button>
              <button onClick={handleBookSubmit} className="rounded-xl bg-teal px-4 py-2 text-xs font-semibold text-white shadow">Confirm Booking</button>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {rescheduleModalAppt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-card p-6 border shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-display font-bold text-lg">Reschedule Appointment</h3>
              <button onClick={() => setRescheduleModalAppt(null)}><X className="h-5 w-5" /></button>
            </div>
            <div className="mt-4 space-y-4 text-xs">
              <div>
                <label className="font-semibold">New Date</label>
                <input type="date" value={rescheduleDate} onChange={(e) => setRescheduleDate(e.target.value)} className="mt-1 w-full rounded-xl border bg-background p-2.5 text-xs outline-none" />
              </div>
              <div>
                <label className="font-semibold">New Time Slot</label>
                <select value={rescheduleTime} onChange={(e) => setRescheduleTime(e.target.value)} className="mt-1 w-full rounded-xl border bg-background p-2.5 text-xs outline-none">
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="10:30 AM">10:30 AM</option>
                  <option value="02:00 PM">02:00 PM</option>
                  <option value="04:30 PM">04:30 PM</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => setRescheduleModalAppt(null)} className="rounded-xl border px-4 py-2 text-xs font-semibold">Cancel</button>
              <button onClick={handleRescheduleSubmit} className="rounded-xl bg-teal px-4 py-2 text-xs font-semibold text-white shadow">Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
