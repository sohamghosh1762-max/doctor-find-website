import { useEffect, useState } from "react";
import axios from "axios";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Star, ShieldCheck, Stethoscope, Building2, MapPin, Video, UserCheck, Calendar, Clock, CheckCircle2, ArrowLeft } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { Footer } from "@/components/footer";

export const Route = createFileRoute("/doctor/$id")({
  head: () => ({ meta: [{ title: "Book Doctor Appointment — DoctorFind AI" }] }),
  component: DoctorProfile,
});

const defaultAvatar = "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=400&auto=format&fit=crop";

function getUpcomingDates() {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const isoDate = d.toISOString().split("T")[0];
    const dayName = i === 0 ? "Today" : i === 1 ? "Tomorrow" : d.toLocaleDateString("en-US", { weekday: "short" });
    const formatted = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    dates.push({ isoDate, dayName, formatted });
  }
  return dates;
}

const defaultTimeSlots = [
  "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "02:00 PM", "02:30 PM", "03:00 PM", "04:00 PM", "05:00 PM"
];

function DoctorProfile() {
  const { id } = Route.useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState<any>(null);
  const [slots, setSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const upcomingDates = getUpcomingDates();
  const [selectedDate, setSelectedDate] = useState(upcomingDates[0].isoDate);
  const [selectedTime, setSelectedTime] = useState(defaultTimeSlots[1]);
  const [mode, setMode] = useState<"Online" | "In-Person">("Online");
  const [symptoms, setSymptoms] = useState("General Health Checkup");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<any>(null);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        setLoading(true);
        const doctorRes = await axios.get(`http://localhost:5000/api/doctors/${id}`);
        if (doctorRes.data?.doctor) {
          setDoctor(doctorRes.data.doctor);
        }

        try {
          const slotRes = await axios.get(`http://localhost:5000/api/doctors/${id}/slots`);
          const fetchedSlots = slotRes.data?.availabilitySlots || slotRes.data?.availability || [];
          setSlots(fetchedSlots);
        } catch (err) {
          console.log("Using default slots fallback");
        }
      } catch (error) {
        console.error("Error loading doctor profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [id]);

  const handleBookAppointment = async () => {
    if (!selectedTime) {
      alert("Please select a consultation time slot.");
      return;
    }

    try {
      setBookingLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:5000/api/appointments",
        {
          doctor: doctor?._id,
          doctorName: doctor?.name,
          doctorImage: doctor?.profileImage || defaultAvatar,
          specialization: doctor?.specialization,
          hospital: doctor?.hospital,
          appointmentDate: selectedDate,
          appointmentTime: selectedTime,
          mode: mode,
          symptoms: symptoms,
          consultationFee: doctor?.fees || 800
        },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        }
      );

      if (response.data?.success) {
        setBookingSuccess(response.data.appointment);
      }
    } catch (error: any) {
      console.error("Booking Error:", error.response?.data);
      alert(error.response?.data?.message || "Appointment booking failed. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-teal border-t-transparent mx-auto"></div>
          <p className="mt-3 text-sm text-muted-foreground">Loading doctor details...</p>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen bg-background">
        <SiteNav />
        <div className="mx-auto max-w-md px-6 pt-40 text-center">
          <h2 className="text-2xl font-bold">Doctor Not Found</h2>
          <p className="mt-2 text-sm text-muted-foreground">The doctor profile you requested is unavailable.</p>
          <Link to="/doctors" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-teal px-4 py-2 text-sm font-semibold text-white">
            <ArrowLeft className="h-4 w-4" /> Back to All Doctors
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />

      <main className="mx-auto max-w-7xl px-6 pt-32 pb-20">
        <Link to="/doctors" className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal hover:underline mb-6">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Doctors Directory
        </Link>

        {/* Doctor Header Banner Card */}
        <div className="rounded-3xl border bg-card p-6 md:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="relative shrink-0 mx-auto md:mx-0">
              <img
                src={doctor.profileImage || defaultAvatar}
                alt={doctor.name}
                className="h-48 w-48 md:h-56 md:w-56 rounded-2xl object-cover border shadow"
                onError={(e: any) => { e.target.src = defaultAvatar; }}
              />
              <span className="absolute top-3 right-3 rounded-full bg-card/90 backdrop-blur px-2.5 py-1 text-[11px] font-bold text-teal shadow flex items-center gap-1 border">
                <ShieldCheck className="h-3.5 w-3.5 text-teal" /> Verified
              </span>
            </div>

            <div className="flex-1 space-y-4 text-center md:text-left">
              <div>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                  <h1 className="font-display text-3xl font-bold text-foreground">{doctor.name}</h1>
                  <span className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-50 rounded-md px-2 py-0.5 border border-amber-200">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> {doctor.rating || 4.9} ({doctor.totalReviews || 240} reviews)
                  </span>
                </div>
                <p className="text-base font-semibold text-teal mt-1">{doctor.specialization}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{doctor.qualification || "MBBS, MD Specialist"}</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t text-xs">
                <div className="rounded-xl border bg-accent/40 p-3">
                  <span className="text-[10px] text-muted-foreground block">Experience</span>
                  <span className="font-bold text-foreground flex items-center gap-1 mt-0.5">
                    <Stethoscope className="h-3.5 w-3.5 text-teal" /> {doctor.experience || 10}+ Years
                  </span>
                </div>

                <div className="rounded-xl border bg-accent/40 p-3">
                  <span className="text-[10px] text-muted-foreground block">Hospital Affiliation</span>
                  <span className="font-bold text-foreground truncate block mt-0.5" title={doctor.hospital}>
                    {doctor.hospital || "City Hospital"}
                  </span>
                </div>

                <div className="rounded-xl border bg-accent/40 p-3">
                  <span className="text-[10px] text-muted-foreground block">Location</span>
                  <span className="font-bold text-foreground truncate block mt-0.5" title={doctor.location}>
                    {doctor.location || "Central Plaza"}
                  </span>
                </div>

                <div className="rounded-xl border bg-accent/40 p-3">
                  <span className="text-[10px] text-muted-foreground block">Consultation Fee</span>
                  <span className="font-display font-extrabold text-teal text-sm block mt-0.5">₹{doctor.fees || 800}</span>
                </div>
              </div>

              {doctor.about && (
                <p className="text-xs text-muted-foreground leading-relaxed pt-2">{doctor.about}</p>
              )}
            </div>
          </div>
        </div>

        {/* Appointment Slot Booking Section */}
        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          {/* Main Booking Controls */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-3xl border bg-card p-6 md:p-8 shadow-sm space-y-6">
              <h2 className="font-display text-xl font-bold flex items-center gap-2">
                <Calendar className="h-5 w-5 text-teal" /> Schedule Consultation Slot
              </h2>

              {/* Consultation Mode Selection */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-3">1. Select Consultation Mode</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setMode("Online")}
                    className={`flex items-center justify-center gap-2 rounded-2xl border p-4 text-xs font-bold transition ${
                      mode === "Online" ? "border-teal bg-teal/10 text-teal shadow-sm" : "bg-card text-muted-foreground hover:bg-accent"
                    }`}
                  >
                    <Video className="h-4 w-4" /> Online Video Call
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode("In-Person")}
                    className={`flex items-center justify-center gap-2 rounded-2xl border p-4 text-xs font-bold transition ${
                      mode === "In-Person" ? "border-teal bg-teal/10 text-teal shadow-sm" : "bg-card text-muted-foreground hover:bg-accent"
                    }`}
                  >
                    <Building2 className="h-4 w-4" /> In-Person Clinic Visit
                  </button>
                </div>
              </div>

              {/* Date Selection */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-3">2. Select Appointment Date</label>
                <div className="grid grid-cols-3 sm:grid-cols-7 gap-2">
                  {upcomingDates.map((item) => {
                    const isSelected = selectedDate === item.isoDate;
                    return (
                      <button
                        key={item.isoDate}
                        type="button"
                        onClick={() => setSelectedDate(item.isoDate)}
                        className={`rounded-2xl border p-3 text-center transition ${
                          isSelected ? "border-teal bg-teal text-white shadow-md font-bold" : "bg-card text-foreground hover:border-teal/50"
                        }`}
                      >
                        <span className="text-[10px] block opacity-80 uppercase">{item.dayName}</span>
                        <span className="text-xs font-semibold block mt-0.5">{item.formatted}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Slot Selection */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-3">3. Select Available Time Slot</label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {defaultTimeSlots.map((time) => {
                    const isSelected = selectedTime === time;
                    return (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setSelectedTime(time)}
                        className={`flex items-center justify-center gap-1.5 rounded-xl border p-3 text-xs font-semibold transition ${
                          isSelected ? "border-teal bg-teal text-white shadow-sm" : "bg-accent/40 text-foreground hover:bg-accent hover:border-teal/50"
                        }`}
                      >
                        <Clock className="h-3.5 w-3.5 shrink-0" /> {time}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Reason / Symptoms Input */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">4. Reason / Symptoms (Optional)</label>
                <input
                  type="text"
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="e.g. Chest discomfort, routine checkup, skin rash..."
                  className="w-full rounded-xl border bg-background px-4 py-2.5 text-sm outline-none focus:border-teal"
                />
              </div>
            </div>
          </div>

          {/* Booking Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="rounded-3xl border bg-card p-6 shadow-sm sticky top-28 space-y-5">
              <h3 className="font-display font-bold text-lg border-b pb-3">Booking Summary</h3>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Doctor:</span>
                  <span className="font-semibold text-foreground">{doctor.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Specialty:</span>
                  <span className="font-semibold text-teal">{doctor.specialization}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Mode:</span>
                  <span className="font-semibold text-foreground">{mode} Consultation</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Date:</span>
                  <span className="font-semibold text-foreground">{selectedDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Time Slot:</span>
                  <span className="font-semibold text-foreground">{selectedTime}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t text-sm font-bold">
                  <span>Total Consultation Fee:</span>
                  <span className="text-teal">₹{doctor.fees || 800}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleBookAppointment}
                disabled={bookingLoading}
                className="w-full rounded-xl bg-teal py-3 text-sm font-bold text-white shadow hover:opacity-90 transition disabled:opacity-50"
              >
                {bookingLoading ? "Confirming Booking..." : "Confirm & Book Appointment"}
              </button>

              <p className="text-[11px] text-center text-muted-foreground">
                🔒 Instant confirmation. Free cancellation up to 2 hours before slot.
              </p>
            </div>
          </div>
        </div>

        {/* Success Modal */}
        {bookingSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-md rounded-3xl bg-card border p-8 shadow-2xl text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-10 w-10" />
              </div>

              <h3 className="font-display text-2xl font-bold">Appointment Confirmed!</h3>
              <p className="text-xs text-muted-foreground">
                Your appointment with <strong className="text-foreground">{bookingSuccess.doctorName}</strong> is scheduled for <strong className="text-teal">{bookingSuccess.appointmentDate}</strong> at <strong className="text-teal">{bookingSuccess.appointmentTime}</strong>.
              </p>

              <div className="pt-2 flex flex-col gap-2">
                <Link
                  to="/patient/appointments"
                  className="w-full rounded-xl bg-teal py-2.5 text-xs font-bold text-white shadow hover:opacity-90"
                >
                  View My Appointments →
                </Link>
                <button
                  type="button"
                  onClick={() => setBookingSuccess(null)}
                  className="w-full rounded-xl border py-2 text-xs font-semibold text-muted-foreground hover:bg-accent"
                >
                  Close Window
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}