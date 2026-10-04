import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Clock, Calendar, Plus, Trash2, CheckCircle2, Save, AlertCircle } from "lucide-react";
import { fetchDoctorSlots, updateDoctorSlots } from "@/services/api";

export const Route = createFileRoute("/dashboard/doctor/availability")({
  head: () => ({ meta: [{ title: "Availability Settings — DoctorFind AI" }] }),
  component: AvailabilityPage,
});

const defaultDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function AvailabilityPage() {
  const [doctor, setDoctor] = useState<any>(null);
  const [slots, setSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const [newDay, setNewDay] = useState("Monday");
  const [newStartTime, setNewStartTime] = useState("09:00 AM");
  const [newEndTime, setNewEndTime] = useState("01:00 PM");
  const [slotDuration, setSlotDuration] = useState(30);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("doctor") || localStorage.getItem("doctorData");
      let docObj: any = null;
      if (stored) {
        docObj = JSON.parse(stored);
        setDoctor(docObj);
      }
      if (docObj?._id) {
        fetchSlots(docObj._id);
      } else {
        setLoading(false);
      }
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  }, []);

  const fetchSlots = async (docId: string) => {
    try {
      setLoading(true);
      const res = await fetchDoctorSlots(docId);
      const fetched = res.availabilitySlots || res.availability || [];
      if (fetched.length > 0) {
        setSlots(fetched);
      } else {
        setSlots([
          { day: "Monday", startTime: "09:00 AM", endTime: "01:00 PM", slotDuration: 30 },
          { day: "Tuesday", startTime: "09:00 AM", endTime: "01:00 PM", slotDuration: 30 },
          { day: "Wednesday", startTime: "09:00 AM", endTime: "01:00 PM", slotDuration: 30 },
          { day: "Thursday", startTime: "02:00 PM", endTime: "06:00 PM", slotDuration: 30 },
          { day: "Friday", startTime: "09:00 AM", endTime: "01:00 PM", slotDuration: 30 },
          { day: "Saturday", startTime: "10:00 AM", endTime: "02:00 PM", slotDuration: 30 }
        ]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSlot = () => {
    const newSlotItem = {
      day: newDay,
      startTime: newStartTime,
      endTime: newEndTime,
      slotDuration: Number(slotDuration)
    };
    setSlots(prev => [...prev, newSlotItem]);
  };

  const handleDeleteSlot = (index: number) => {
    setSlots(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveSlots = async () => {
    try {
      setSaving(true);
      setSuccessMsg("");
      const docId = doctor?._id;

      if (!docId) {
        alert("Please log in as a doctor to update your availability.");
        return;
      }

      await updateDoctorSlots(docId, {
        availabilitySlots: slots
      });

      setSuccessMsg("Schedule & consultation slots saved successfully!");
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err: any) {
      console.error("Save Error:", err);
      alert("Failed to save schedule slots.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold flex items-center gap-2">
            <Clock className="h-7 w-7 text-teal" /> Availability & Slot Management
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">Configure your weekly working hours, slot durations, and available consultation times.</p>
        </div>

        <button
          onClick={handleSaveSlots}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal px-5 py-2.5 text-xs font-bold text-white shadow hover:opacity-90 transition shrink-0 disabled:opacity-50"
        >
          <Save className="h-4 w-4" /> {saving ? "Saving Changes..." : "Save Availability Schedule"}
        </button>
      </div>

      {successMsg && (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs font-bold text-emerald-600 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" /> {successMsg}
        </div>
      )}

      {/* Add New Slot Form */}
      <div className="rounded-3xl border bg-card p-6 shadow-sm space-y-4">
        <h2 className="font-display font-bold text-base flex items-center gap-2">
          <Plus className="h-4 w-4 text-teal" /> Add New Practice Time Slot
        </h2>

        <div className="grid gap-4 sm:grid-cols-4 items-end">
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase block mb-1">Working Day</label>
            <select
              value={newDay}
              onChange={(e) => setNewDay(e.target.value)}
              className="w-full rounded-xl border bg-background px-3 py-2 text-xs font-semibold outline-none focus:border-teal"
            >
              {defaultDays.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase block mb-1">Start Time</label>
            <input
              type="text"
              value={newStartTime}
              onChange={(e) => setNewStartTime(e.target.value)}
              placeholder="e.g. 09:00 AM"
              className="w-full rounded-xl border bg-background px-3 py-2 text-xs font-semibold outline-none focus:border-teal"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase block mb-1">End Time</label>
            <input
              type="text"
              value={newEndTime}
              onChange={(e) => setNewEndTime(e.target.value)}
              placeholder="e.g. 01:00 PM"
              className="w-full rounded-xl border bg-background px-3 py-2 text-xs font-semibold outline-none focus:border-teal"
            />
          </div>

          <button
            type="button"
            onClick={handleAddSlot}
            className="rounded-xl bg-teal px-4 py-2.5 text-xs font-bold text-white shadow hover:opacity-90 transition flex items-center justify-center gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" /> Add Slot
          </button>
        </div>
      </div>

      {/* Active Slots Table / Grid */}
      <div className="rounded-3xl border bg-card p-6 shadow-sm space-y-4">
        <h2 className="font-display font-bold text-base flex items-center gap-2">
          <Calendar className="h-4 w-4 text-teal" /> Configured Weekly Slots
        </h2>

        {loading ? (
          <div className="py-12 text-center text-xs text-muted-foreground">Loading slots...</div>
        ) : slots.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {slots.map((slot, idx) => (
              <div key={idx} className="rounded-2xl border p-4 bg-accent/30 flex items-center justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-teal block">{slot.day}</span>
                  <span className="text-sm font-semibold text-foreground block">
                    {slot.startTime} - {slot.endTime}
                  </span>
                  <span className="text-[10px] text-muted-foreground block">
                    Duration: {slot.slotDuration || 30} mins per consultation
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteSlot(idx)}
                  className="rounded-xl p-2 text-rose-500 hover:bg-rose-100 transition shrink-0"
                  title="Delete Slot"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-xs text-muted-foreground">No availability slots configured. Use the form above to add your working hours.</div>
        )}
      </div>
    </div>
  );
}