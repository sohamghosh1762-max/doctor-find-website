import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Brain, Sparkles, RefreshCw, AlertTriangle, ShieldCheck, History, User, ChevronRight, Stethoscope, Activity, CheckCircle2 } from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";
import { navItems } from "./patient.dashboard";
import { useState, useEffect } from "react";
import { analyzeSymptomsApi, fetchSymptomHistory } from "@/services/api";

export const Route = createFileRoute("/patient/symptom-checker")({
  head: () => ({ meta: [{ title: "AI Symptom Checker — DoctorFind AI" }] }),
  component: SymptomCheckerDedicatedPage,
});

const quickTags = [
  "Fever & Chills", "Frequent Headache", "Dry Cough", "Chest Tightness",
  "Shortness of Breath", "Skin Rash & Itching", "Stomach Ache", "Fatigue & Weakness"
];

export default function SymptomCheckerDedicatedPage() {
  const [symptomsInput, setSymptomsInput] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"checker" | "history">("checker");

  const [historyList, setHistoryList] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const loadHistory = async () => {
    try {
      setLoadingHistory(true);
      const res = await fetchSymptomHistory();
      if (res?.history) {
        setHistoryList(res.history);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    if (activeTab === "history") {
      loadHistory();
    }
  }, [activeTab]);

  const handleAnalyze = async () => {
    if (!symptomsInput.trim()) return;
    try {
      setAnalyzing(true);
      const res = await analyzeSymptomsApi(symptomsInput);
      if (res?.analysis) {
        setCurrentAnalysis(res.analysis);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  const addTag = (tag: string) => {
    if (symptomsInput.includes(tag)) return;
    setSymptomsInput((prev) => (prev ? `${prev}, ${tag}` : tag));
  };

  return (
    <DashboardShell role="PATIENT" roleColor="oklch(0.68 0.13 190)" nav={navItems} user={{ name: "Rahul" }}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold flex items-center gap-2">
            <Brain className="h-7 w-7 text-teal" /> AI Symptom Checker & Clinical Intelligence
          </h1>
          <p className="mt-1 text-muted-foreground">Powered by clinical triage algorithms and medical knowledge graphs</p>
        </div>

        {/* Tab Switch */}
        <div className="flex items-center gap-1 rounded-2xl border bg-card p-1">
          <button
            onClick={() => setActiveTab("checker")}
            className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
              activeTab === "checker" ? "bg-teal text-white shadow" : "text-muted-foreground hover:bg-accent"
            }`}
          >
            New Analysis
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`rounded-xl px-4 py-2 text-xs font-semibold transition flex items-center gap-1.5 ${
              activeTab === "history" ? "bg-teal text-white shadow" : "text-muted-foreground hover:bg-accent"
            }`}
          >
            <History className="h-3.5 w-3.5" /> History ({historyList.length})
          </button>
        </div>
      </div>

      {activeTab === "checker" ? (
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* Input Panel */}
          <div className="lg:col-span-1 space-y-4">
            <div className="rounded-2xl border bg-card p-5 space-y-4">
              <h3 className="font-display font-bold text-base">Describe Symptoms</h3>
              
              {/* Quick Tags */}
              <div className="space-y-1.5">
                <div className="text-xs font-medium text-muted-foreground">Quick Select Symptoms:</div>
                <div className="flex flex-wrap gap-1.5">
                  {quickTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => addTag(tag)}
                      className="rounded-lg border bg-accent/50 px-2.5 py-1 text-[11px] font-medium transition hover:border-teal hover:text-teal"
                    >
                      + {tag}
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                value={symptomsInput}
                onChange={(e) => setSymptomsInput(e.target.value)}
                placeholder="Describe your symptoms in detail... e.g., High fever with body pain and mild dry cough starting yesterday morning."
                className="h-36 w-full resize-none rounded-xl border bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-teal/30"
              />

              <button
                onClick={handleAnalyze}
                disabled={analyzing || !symptomsInput.trim()}
                className="w-full rounded-xl bg-gradient-to-r from-teal to-[oklch(0.55_0.18_260)] py-3 text-sm font-semibold text-white shadow transition hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {analyzing ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" /> Analyzing Symptoms...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" /> Run AI Diagnosis
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Diagnosis Results Section */}
          <div className="lg:col-span-2">
            {currentAnalysis ? (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border bg-card p-6 space-y-6 shadow-md">
                {/* Header Summary */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 gap-2">
                  <div>
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Suggested Specialist</span>
                    <h2 className="font-display text-2xl font-bold text-teal">{currentAnalysis.suggestedSpecialist}</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                      currentAnalysis.severity === "Mild" ? "bg-emerald-100 text-emerald-700" :
                      currentAnalysis.severity === "High" ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"
                    }`}>
                      {currentAnalysis.severity} Severity
                    </span>
                  </div>
                </div>

                {/* Urgency Gauge */}
                <div className="rounded-xl bg-accent/60 p-3.5 text-xs font-medium flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
                  <span><strong>Urgency Guidance:</strong> {currentAnalysis.urgencyLevel}</span>
                </div>

                {/* Possible Conditions */}
                <div>
                  <h3 className="font-display font-bold text-base mb-3">Possible Medical Conditions</h3>
                  <div className="space-y-3">
                    {currentAnalysis.possibleConditions?.map((item: any, idx: number) => (
                      <div key={idx} className="rounded-xl border p-4">
                        <div className="flex items-center justify-between font-semibold text-sm">
                          <span>{item.condition}</span>
                          <span className="text-teal font-bold">{item.probability}</span>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendations & Suggested Tests */}
                <div className="grid sm:grid-cols-2 gap-4 text-xs">
                  <div className="rounded-xl border p-4 space-y-2">
                    <h4 className="font-bold text-foreground flex items-center gap-1.5 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-teal" /> Care Recommendations
                    </h4>
                    <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                      {currentAnalysis.recommendations?.map((r: string, i: number) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-xl border p-4 space-y-2">
                    <h4 className="font-bold text-foreground flex items-center gap-1.5 text-sm">
                      <Stethoscope className="h-4 w-4 text-teal" /> Suggested Lab Tests
                    </h4>
                    <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                      {currentAnalysis.suggestedTests?.map((t: string, i: number) => (
                        <li key={i}>{t}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Nearby Recommended Doctors */}
                <div>
                  <h3 className="font-display font-bold text-base mb-3">Recommended Nearby Doctors</h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {currentAnalysis.nearbyDoctors?.map((doc: any, i: number) => (
                      <div key={i} className="rounded-xl border p-3 text-xs flex items-center justify-between">
                        <div>
                          <div className="font-bold text-foreground">{doc.name}</div>
                          <div className="text-muted-foreground">{doc.specialty} · {doc.hospital}</div>
                        </div>
                        <span className="font-bold text-teal">★ {doc.rating}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Disclaimer */}
                <div className="rounded-xl border border-amber-200 bg-amber-500/10 p-3 text-[11px] text-muted-foreground italic">
                  <strong>Disclaimer:</strong> {currentAnalysis.disclaimer}
                </div>
              </motion.div>
            ) : (
              <div className="rounded-2xl border bg-card p-12 text-center text-sm text-muted-foreground">
                <Brain className="mx-auto h-12 w-12 text-teal/40 mb-3" />
                Input your symptoms on the left to receive immediate AI clinical evaluation.
              </div>
            )}
          </div>
        </div>
      ) : (
        /* History Tab */
        <div className="mt-6 space-y-4">
          {loadingHistory ? (
            <div className="py-12 text-center text-sm text-muted-foreground">Loading history...</div>
          ) : historyList.length > 0 ? (
            historyList.map((item: any) => (
              <div key={item._id} className="rounded-2xl border bg-card p-5 space-y-3">
                <div className="flex items-center justify-between border-b pb-2 text-xs">
                  <span className="font-bold text-teal">{item.suggestedSpecialist}</span>
                  <span className="text-muted-foreground">{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="text-sm font-semibold">"{item.symptomsText}"</div>
                <div className="text-xs text-muted-foreground">
                  <strong>Conditions:</strong> {item.possibleConditions?.map((c: any) => c.condition).join(", ")}
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border bg-card p-12 text-center text-sm text-muted-foreground">
              No previous AI symptom analyses saved
            </div>
          )}
        </div>
      )}
    </DashboardShell>
  );
}
