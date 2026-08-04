import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { FileText, Calendar, Activity, User, Plus, Filter, ShieldCheck, Stethoscope, Syringe, Scissors } from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";
import { navItems } from "./patient.dashboard";
import { useState, useEffect } from "react";
import { fetchMedicalHistory } from "@/services/api";

export const Route = createFileRoute("/patient/medical-history")({
  head: () => ({ meta: [{ title: "Medical History — DoctorFind AI" }] }),
  component: MedicalHistoryPage,
});

export default function MedicalHistoryPage() {
  const [historyData, setHistoryData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("All");

  useEffect(() => {
    const loadHistory = async () => {
      try {
        setLoading(true);
        const res = await fetchMedicalHistory();
        if (res?.history) {
          setHistoryData(res.history);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadHistory();
  }, []);

  const timeline = historyData?.timeline || [
    {
      year: 2026,
      date: "15 July 2026",
      title: "Cardiovascular Checkup & Hypertension Management",
      type: "Checkup",
      diagnosis: "Mild Essential Hypertension",
      doctor: "Dr. Ananya Sharma",
      hospital: "Apollo Gleneagles Hospital",
      treatment: "Dietary sodium restriction & daily Amlodipine 5mg",
      reports: ["Comprehensive Blood Panel (July 2026)"],
      prescriptions: ["Amlodipine 5mg", "Telmisartan 40mg"]
    },
    {
      year: 2025,
      date: "10 November 2025",
      title: "Seasonal Asthma Exacerbation & Inhaler Review",
      type: "Diagnosis",
      diagnosis: "Allergic Bronchial Asthma",
      doctor: "Dr. S. K. Mukherjee",
      hospital: "AMRI Hospital",
      treatment: "Budecort Inhaler 200mcg twice daily for 2 weeks",
      reports: ["Spirometry Test Report"],
      prescriptions: ["Montair LC", "Budecort Inhaler"]
    },
    {
      year: 2024,
      date: "04 May 2024",
      title: "Laparoscopic Appendectomy",
      type: "Operation",
      diagnosis: "Acute Appendicitis",
      doctor: "Dr. R. N. Roy",
      hospital: "Belle Vue Clinic",
      treatment: "Successful uncomplicated appendectomy procedure",
      reports: ["Abdominal Ultrasound", "Post-Op Histopathology"],
      prescriptions: ["Painkillers", "Antibiotics Course"],
      operations: "Laparoscopic Appendectomy"
    },
    {
      year: 2023,
      date: "12 August 2023",
      title: "Hepatitis B & Tetanus Booster Vaccination",
      type: "Vaccination",
      diagnosis: "Preventive Immunization",
      doctor: "Dr. Swati Sen",
      hospital: "Kolkata Diagnostic Center",
      treatment: "Standard intramuscular vaccination dosage",
      vaccinations: "Hepatitis B (Dose 3), Tetanus Toxoid"
    }
  ];

  // Group by Year
  const filteredTimeline = filterType === "All" ? timeline : timeline.filter((t: any) => t.type === filterType);
  const years = Array.from(new Set(filteredTimeline.map((t: any) => t.year))).sort((a: any, b: any) => b - a);

  return (
    <DashboardShell role="PATIENT" roleColor="oklch(0.68 0.13 190)" nav={navItems} user={{ name: "Rahul" }}>
      <div>
        <h1 className="font-display text-3xl font-bold">Medical History Timeline</h1>
        <p className="mt-1 text-muted-foreground">Comprehensive longitudinal electronic health record grouped by year</p>
      </div>

      {/* Profile Overview Card */}
      <div className="mt-6 grid gap-4 sm:grid-cols-4 rounded-2xl border bg-card p-5">
        <div>
          <div className="text-xs text-muted-foreground">Blood Group</div>
          <div className="font-display text-lg font-bold text-teal">{historyData?.bloodGroup || "O+"}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Known Allergies</div>
          <div className="font-semibold text-xs mt-1">{historyData?.allergies?.join(", ") || "Penicillin, Dust Mites"}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Chronic Conditions</div>
          <div className="font-semibold text-xs mt-1">{historyData?.chronicDiseases?.join(", ") || "Mild Hypertension"}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Past Surgeries</div>
          <div className="font-semibold text-xs mt-1">{historyData?.pastSurgeries?.join(", ") || "Appendectomy (2021)"}</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mt-6 flex flex-wrap items-center gap-2 rounded-2xl border bg-card p-3">
        {["All", "Diagnosis", "Checkup", "Operation", "Vaccination"].map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
              filterType === type ? "bg-teal text-white shadow" : "bg-accent/60 text-muted-foreground hover:bg-accent"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Timeline Section */}
      <div className="mt-8 space-y-8">
        {years.map((yr: any) => (
          <div key={yr} className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-xl bg-teal px-4 py-1.5 font-display text-sm font-bold text-white shadow">
              <Calendar className="h-4 w-4" /> Year {yr}
            </div>

            <div className="relative border-l-2 border-teal/30 ml-4 pl-6 space-y-6">
              {filteredTimeline
                .filter((t: any) => t.year === yr)
                .map((entry: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="relative rounded-2xl border bg-card p-5 shadow-sm hover:shadow-md transition"
                  >
                    {/* Circle Node */}
                    <div className="absolute -left-[31px] top-6 h-4 w-4 rounded-full border-2 border-teal bg-background" />

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-3 gap-2">
                      <div>
                        <h3 className="font-display text-lg font-bold">{entry.title}</h3>
                        <div className="text-xs text-muted-foreground">{entry.date} · {entry.doctor} ({entry.hospital})</div>
                      </div>
                      <span className="w-fit rounded-full bg-teal/10 px-3 py-1 text-xs font-bold text-teal">
                        {entry.type}
                      </span>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2 text-xs">
                      {entry.diagnosis && (
                        <div>
                          <span className="font-semibold text-muted-foreground">Diagnosis:</span>
                          <p className="font-medium text-foreground mt-0.5">{entry.diagnosis}</p>
                        </div>
                      )}
                      {entry.treatment && (
                        <div>
                          <span className="font-semibold text-muted-foreground">Treatment:</span>
                          <p className="font-medium text-foreground mt-0.5">{entry.treatment}</p>
                        </div>
                      )}
                      {entry.reports?.length > 0 && (
                        <div>
                          <span className="font-semibold text-muted-foreground">Reports:</span>
                          <p className="font-medium text-teal mt-0.5">{entry.reports.join(", ")}</p>
                        </div>
                      )}
                      {entry.prescriptions?.length > 0 && (
                        <div>
                          <span className="font-semibold text-muted-foreground">Prescriptions:</span>
                          <p className="font-medium text-teal mt-0.5">{entry.prescriptions.join(", ")}</p>
                        </div>
                      )}
                      {entry.operations && (
                        <div>
                          <span className="font-semibold text-muted-foreground">Operation Performed:</span>
                          <p className="font-medium text-foreground mt-0.5">{entry.operations}</p>
                        </div>
                      )}
                      {entry.vaccinations && (
                        <div>
                          <span className="font-semibold text-muted-foreground">Vaccinations:</span>
                          <p className="font-medium text-foreground mt-0.5">{entry.vaccinations}</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </DashboardShell>
  );
}
