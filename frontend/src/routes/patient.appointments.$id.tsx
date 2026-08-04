import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Clock, MapPin, Video, User, FileText, ArrowLeft, ShieldCheck, DollarSign } from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";
import { navItems } from "./patient.dashboard";
import { useState, useEffect } from "react";
import { fetchAppointmentById } from "@/services/api";

export const Route = createFileRoute("/patient/appointments/$id")({
  head: () => ({ meta: [{ title: "Appointment Details — DoctorFind AI" }] }),
  component: AppointmentDetailPage,
});

export default function AppointmentDetailPage() {
  const { id } = Route.useParams();
  const [appointment, setAppointment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDetail = async () => {
      try {
        setLoading(true);
        const res = await fetchAppointmentById(id);
        if (res?.appointment) {
          setAppointment(res.appointment);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadDetail();
  }, [id]);

  return (
    <DashboardShell role="PATIENT" roleColor="oklch(0.68 0.13 190)" nav={navItems} user={{ name: "Rahul" }}>
      <div className="flex items-center gap-3">
        <Link to="/patient/appointments" className="rounded-xl border p-2 hover:bg-accent">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="font-display text-2xl font-bold">Appointment Details</h1>
          <p className="text-xs text-muted-foreground">Reference ID: {id}</p>
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-sm text-muted-foreground">Loading details...</div>
      ) : appointment ? (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Doctor Info Card */}
            <div className="rounded-2xl border bg-card p-6">
              <div className="flex items-start gap-4">
                <img src={appointment.doctorImage || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=300&auto=format&fit=crop"} alt={appointment.doctorName} className="h-20 w-20 rounded-2xl object-cover border" />
                <div>
                  <h2 className="font-display text-xl font-bold">{appointment.doctorName}</h2>
                  <div className="text-sm font-semibold text-teal">{appointment.specialization}</div>
                  <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" /> {appointment.hospital}
                  </div>
                </div>
              </div>
            </div>

            {/* Schedule & Consultation Specs */}
            <div className="rounded-2xl border bg-card p-6 space-y-4 text-sm">
              <h3 className="font-display font-bold text-base border-b pb-3">Consultation Overview</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-muted-foreground">Date & Time</div>
                  <div className="font-semibold mt-0.5">{appointment.appointmentDate} at {appointment.appointmentTime}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Consultation Mode</div>
                  <div className="font-semibold mt-0.5">{appointment.mode}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Current Status</div>
                  <span className="inline-block mt-0.5 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                    {appointment.status}
                  </span>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Consultation Fee</div>
                  <div className="font-semibold mt-0.5">₹{appointment.consultationFee || 800} (Paid via Insurance)</div>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="text-xs text-muted-foreground">Stated Reason / Symptoms</div>
                <div className="mt-1 rounded-xl bg-accent/50 p-3 text-xs leading-relaxed">
                  {appointment.symptoms || "Regular checkup consultation"}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Quick Action */}
          <div className="space-y-6">
            {appointment.mode === "Online" && (
              <div className="rounded-2xl border bg-gradient-to-br from-teal/10 to-[oklch(0.55_0.18_260)]/10 p-6 space-y-3">
                <h3 className="font-display font-bold text-base flex items-center gap-2">
                  <Video className="h-5 w-5 text-teal" /> Telehealth Video Room
                </h3>
                <p className="text-xs text-muted-foreground">Click below to join the secure HIPAA-compliant video session with your doctor.</p>
                <a href={appointment.videoCallUrl || "https://meet.jit.si/DoctorFindAI"} target="_blank" rel="noreferrer" className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-teal py-3 text-sm font-semibold text-white shadow hover:opacity-90">
                  <Video className="h-4 w-4" /> Launch Video Call Now
                </a>
              </div>
            )}

            <div className="rounded-2xl border bg-card p-6 text-xs space-y-3">
              <h4 className="font-semibold text-sm">Need Help or Change?</h4>
              <p className="text-muted-foreground">You can reschedule or cancel up to 2 hours prior to slot time.</p>
              <Link to="/patient/appointments" className="inline-block font-semibold text-teal hover:underline">
                Manage All Appointments →
              </Link>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="py-12 text-center text-sm text-muted-foreground">Appointment not found</div>
      )}
    </DashboardShell>
  );
}
