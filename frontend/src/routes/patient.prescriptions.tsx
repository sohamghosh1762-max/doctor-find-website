import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Heart, Search, Download, RefreshCw, Bell, Star, CheckCircle, Clock, FileText, Pill } from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";
import { navItems } from "./patient.dashboard";
import { useState, useEffect } from "react";
import { fetchMyPrescriptions, requestPrescriptionRefill } from "@/services/api";

export const Route = createFileRoute("/patient/prescriptions")({
  head: () => ({ meta: [{ title: "Prescriptions — DoctorFind AI" }] }),
  component: PatientPrescriptionsPage,
});

export default function PatientPrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("Current");
  const [searchQuery, setSearchQuery] = useState("");
  const [reminderActive, setReminderActive] = useState(true);

  const loadPrescriptions = async () => {
    try {
      setLoading(true);
      const res = await fetchMyPrescriptions({ status: activeTab, search: searchQuery });
      if (res?.prescriptions) {
        setPrescriptions(res.prescriptions);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPrescriptions();
  }, [activeTab, searchQuery]);

  const handleRefill = async (id: string) => {
    try {
      await requestPrescriptionRefill(id);
      alert("Refill request submitted to clinic!");
      loadPrescriptions();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownloadPdf = (p: any) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Prescription - ${p.prescribingDoctor}</title>
          <style>
            body { font-family: sans-serif; padding: 30px; color: #333; }
            .header { border-bottom: 2px solid #0d9488; padding-bottom: 15px; margin-bottom: 20px; }
            .title { font-size: 24px; font-weight: bold; color: #0d9488; }
            .meta { font-size: 14px; margin-top: 5px; color: #666; }
            .med-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            .med-table th, .med-table td { border: 1px solid #ddd; padding: 10px; text-align: left; font-size: 14px; }
            .med-table th { background: #f0fdf4; color: #0d9488; }
            .notes { margin-top: 25px; font-size: 13px; font-style: italic; background: #fafafa; padding: 15px; border-left: 4px solid #0d9488; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">DoctorFind AI — Official Medical Prescription</div>
            <div class="meta"><strong>Doctor:</strong> ${p.prescribingDoctor} (${p.doctorSpecialty})</div>
            <div class="meta"><strong>Hospital:</strong> ${p.hospital}</div>
            <div class="meta"><strong>Date Issued:</strong> ${p.date}</div>
          </div>
          <h3>Prescribed Medicines:</h3>
          <table class="med-table">
            <thead>
              <tr>
                <th>Medicine Name</th>
                <th>Dosage</th>
                <th>Frequency</th>
                <th>Duration</th>
                <th>Instructions</th>
              </tr>
            </thead>
            <tbody>
              ${p.medicines?.map((m: any) => `
                <tr>
                  <td><strong>${m.name}</strong></td>
                  <td>${m.dosage || "-"}</td>
                  <td>${m.frequency || "-"}</td>
                  <td>${m.duration || "-"}</td>
                  <td>${m.instructions || "-"}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
          <div class="notes">
            <strong>Clinical Advice / Notes:</strong><br/>
            ${p.notes || "Follow dosage instructions strictly."}
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <DashboardShell role="PATIENT" roleColor="oklch(0.68 0.13 190)" nav={navItems} user={{ name: "Rahul" }}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Prescription Portal</h1>
          <p className="mt-1 text-muted-foreground">Manage active medications, download digital Rx PDFs, and request refills</p>
        </div>

        {/* Medicine Reminder Status Pill */}
        <div className="flex items-center gap-3 rounded-2xl border bg-card p-3 shadow-sm">
          <Bell className="h-5 w-5 text-teal" />
          <div className="text-xs">
            <div className="font-semibold">Daily Medicine Reminder</div>
            <div className="text-muted-foreground">{reminderActive ? "Active · Next 09:00 PM" : "Disabled"}</div>
          </div>
          <button
            onClick={() => setReminderActive(!reminderActive)}
            className={`ml-2 rounded-xl px-3 py-1 text-xs font-semibold ${reminderActive ? "bg-teal text-white" : "bg-accent"}`}
          >
            {reminderActive ? "ON" : "OFF"}
          </button>
        </div>
      </div>

      {/* Tabs & Search Bar */}
      <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border bg-card p-4">
        <div className="flex flex-wrap items-center gap-2">
          {["Current", "Expired", "Completed", "All"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
                activeTab === tab ? "bg-teal text-white shadow" : "bg-accent/60 text-muted-foreground hover:bg-accent"
              }`}
            >
              {tab} Prescriptions
            </button>
          ))}
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search medicine name..."
            className="w-full rounded-xl border bg-background py-1.5 pl-9 pr-3 text-xs outline-none focus:ring-2 focus:ring-teal/30"
          />
        </div>
      </div>

      {/* Prescriptions List */}
      <div className="mt-6 space-y-4">
        {loading ? (
          <div className="py-12 text-center text-sm text-muted-foreground">Loading prescriptions...</div>
        ) : prescriptions.length > 0 ? (
          prescriptions.map((p: any) => (
            <motion.div key={p._id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border bg-card p-5 space-y-4 shadow-sm hover:shadow-md transition">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3">
                <div>
                  <div className="font-display font-bold text-lg text-foreground flex items-center gap-2">
                    <Pill className="h-5 w-5 text-teal" /> {p.prescribingDoctor}
                  </div>
                  <div className="text-xs text-muted-foreground">{p.doctorSpecialty} · {p.hospital}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                    p.status === "Current" ? "bg-emerald-100 text-emerald-700" :
                    p.status === "Completed" ? "bg-blue-100 text-blue-700" : "bg-rose-100 text-rose-700"
                  }`}>
                    {p.status}
                  </span>
                  <span className="text-xs font-medium text-muted-foreground">{p.date}</span>
                </div>
              </div>

              {/* Medicines Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b text-muted-foreground">
                      <th className="py-2 font-semibold">Medicine Name</th>
                      <th className="py-2 font-semibold">Dosage</th>
                      <th className="py-2 font-semibold">Frequency</th>
                      <th className="py-2 font-semibold">Duration</th>
                      <th className="py-2 font-semibold">Instructions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {p.medicines?.map((m: any, i: number) => (
                      <tr key={i} className="border-b last:border-0 hover:bg-accent/40">
                        <td className="py-2.5 font-bold text-foreground">{m.name}</td>
                        <td className="py-2.5">{m.dosage || "650mg"}</td>
                        <td className="py-2.5"><span className="rounded bg-teal/10 px-2 py-0.5 font-bold text-teal">{m.frequency || "1-0-1"}</span></td>
                        <td className="py-2.5">{m.duration || "5 Days"}</td>
                        <td className="py-2.5 text-muted-foreground">{m.instructions || "Take after meals"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Clinical Advice & Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t pt-3 text-xs">
                <div className="text-muted-foreground italic">
                  <strong>Notes:</strong> {p.notes || "Maintain proper hydration and rest."}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => handleDownloadPdf(p)} className="inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 font-semibold hover:bg-accent">
                    <Download className="h-3.5 w-3.5 text-teal" /> Download PDF
                  </button>
                  <button onClick={() => handleRefill(p._id)} className="inline-flex items-center gap-1.5 rounded-xl bg-teal px-4 py-2 font-semibold text-white shadow hover:opacity-90">
                    <RefreshCw className="h-3.5 w-3.5" /> Refill Request
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="rounded-2xl border bg-card p-12 text-center text-sm text-muted-foreground">
            No prescriptions found for category "{activeTab}"
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
