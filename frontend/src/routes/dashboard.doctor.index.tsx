import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Calendar, Video, Clock, IndianRupee, Star, CheckCircle2, ArrowUpRight } from "lucide-react";
import axios from "axios";

export const Route = createFileRoute("/dashboard/doctor/")({
  head: () => ({ meta: [{ title: "Doctor Overview — DoctorFind AI" }] }),
  component: DoctorDashboardOverview,
});

const defaultAvatar = "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=400&auto=format&fit=crop";

export default function DoctorDashboardOverview() {
  const [doctor, setDoctor] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedDoctor = localStorage.getItem("doctor") || localStorage.getItem("doctorData");
      if (storedDoctor) {
        const parsed = JSON.parse(storedDoctor);
        setDoctor(parsed);
        fetchDoctorAppointments(parsed._id || parsed.name);
      } else {
        const defaultDoc = {
          _id: "doc-1",
          name: "Dr. Ananya Sharma",
          specialization: "Cardiologist",
          hospital: "Apollo Gleneagles Hospital",
          profileImage: defaultAvatar,
          fees: 800,
          rating: 4.9
        };
        setDoctor(defaultDoc);
        fetchDoctorAppointments("doc-1");
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }, []);

  const fetchDoctorAppointments = async (docId: string) => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/api/appointments/doctor/${docId}`);
      if (res.data?.appointments && res.data.appointments.length > 0) {
        setAppointments(res.data.appointments);
      } else {
        setAppointments([
          {
            _id: "apt-101",
            patientName: "Rahul Verma",
            patientAge: 29,
            patientGender: "Male",
            appointmentDate: "Today",
            appointmentTime: "10:30 AM",
            mode: "Online",
            status: "Confirmed",
            symptoms: "Occasional chest tightness and shortness of breath after exercise",
            videoCallUrl: "https://meet.jit.si/DoctorFindAI-Consult-101",
            consultationFee: 800
          },
          {
            _id: "apt-102",
            patientName: "Priya Mukherjee",
            patientAge: 34,
            patientGender: "Female",
            appointmentDate: "Today",
            appointmentTime: "11:30 AM",
            mode: "In-Person",
            status: "Confirmed",
            symptoms: "High blood pressure follow-up & medication review",
            consultationFee: 800
          },
          {
            _id: "apt-103",
            patientName: "Amitabh Sen",
            patientAge: 52,
            patientGender: "Male",
            appointmentDate: "Tomorrow",
            appointmentTime: "04:00 PM",
            mode: "Online",
            status: "Pending",
            symptoms: "ECG report evaluation & cholesterol advice",
            videoCallUrl: "https://meet.jit.si/DoctorFindAI-Consult-103",
            consultationFee: 800
          }
        ]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = (id: string, newStatus: string) => {
    setAppointments(prev =>
      prev.map(a => (a._id === id ? { ...a, status: newStatus } : a))
    );
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-3xl border bg-gradient-to-r from-teal/10 via-indigo-500/5 to-transparent p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold">
            Welcome Back, <span className="text-teal">{doctor?.name || "Dr. Ananya Sharma"}</span> 👋
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {doctor?.specialization || "Cardiology Specialist"} • {doctor?.hospital || "Apollo Gleneagles Hospital"}
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-2xl border bg-card px-4 py-2 text-xs font-semibold text-teal shadow-sm">
          <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Active Practice Status: Available
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border bg-card p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold">
            <span>Today's Appointments</span>
            <Calendar className="h-4 w-4 text-teal" />
          </div>
          <div className="font-display text-2xl font-bold text-foreground">
            {appointments.length} Consultations
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <ArrowUpRight className="h-3 w-3" /> 2 Online, 1 Clinic Visit
          </p>
        </div>

        <div className="rounded-2xl border bg-card p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold">
            <span>Total Consulted Patients</span>
            <Users className="h-4 w-4 text-teal" />
          </div>
          <div className="font-display text-2xl font-bold text-foreground">148 Patients</div>
          <p className="text-[11px] text-muted-foreground">Across all hospital & online channels</p>
        </div>

        <div className="rounded-2xl border bg-card p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold">
            <span>Monthly Revenue</span>
            <IndianRupee className="h-4 w-4 text-teal" />
          </div>
          <div className="font-display text-2xl font-bold text-foreground">₹1,18,400</div>
          <p className="text-[11px] text-emerald-600 font-semibold">Payout scheduled for 1st of month</p>
        </div>

        <div className="rounded-2xl border bg-card p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold">
            <span>Patient Satisfaction</span>
            <Star className="h-4 w-4 text-amber-500 fill-amber-400" />
          </div>
          <div className="font-display text-2xl font-bold text-foreground">4.9 / 5.0</div>
          <p className="text-[11px] text-muted-foreground">Based on 320 verified reviews</p>
        </div>
      </div>

      {/* Patient Queue & Appointments List */}
      <div className="rounded-3xl border bg-card p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-4">
          <div>
            <h2 className="font-display text-lg font-bold">Upcoming Patient Consultations</h2>
            <p className="text-xs text-muted-foreground">Manage your scheduled appointments, join video calls, or update consultation statuses.</p>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-muted-foreground">Loading appointment schedule...</div>
        ) : appointments.length > 0 ? (
          <div className="space-y-4">
            {appointments.map((apt) => (
              <motion.div
                key={apt._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border p-4 md:p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card hover:border-teal/50 transition"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display font-bold text-base text-foreground">
                      {apt.patientName || apt.patient?.name || "Patient Consultation"}
                    </h3>
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      apt.mode === "Online" ? "bg-teal/10 text-teal" : "bg-purple-100 text-purple-700"
                    }`}>
                      {apt.mode || "Online"} Consultation
                    </span>
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      apt.status === "Completed" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"
                    }`}>
                      {apt.status || "Confirmed"}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-teal" /> {apt.appointmentDate} at {apt.appointmentTime}</span>
                    <span className="font-medium text-foreground">Fee: ₹{apt.consultationFee || 800}</span>
                  </div>

                  {apt.symptoms && (
                    <p className="text-xs text-muted-foreground/90 bg-accent/40 rounded-xl p-2.5 mt-2 border">
                      <strong>Symptoms / Reason:</strong> {apt.symptoms}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0 w-full md:w-auto">
                  {apt.mode === "Online" && (
                    <a
                      href={apt.videoCallUrl || `https://meet.jit.si/DoctorFindAI-${apt._id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-teal px-4 py-2 text-xs font-bold text-white shadow hover:opacity-90 transition flex-1 md:flex-initial"
                    >
                      <Video className="h-3.5 w-3.5" /> Start Video Session
                    </a>
                  )}

                  {apt.status !== "Completed" && (
                    <button
                      onClick={() => handleUpdateStatus(apt._id, "Completed")}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-emerald-500 bg-emerald-50 px-3.5 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition flex-1 md:flex-initial"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Mark Complete
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-xs text-muted-foreground">No upcoming appointments scheduled for today.</div>
        )}
      </div>
    </div>
  );
}
