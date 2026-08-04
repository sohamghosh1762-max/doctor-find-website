import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { FileText, Upload, Download, Trash2, Search, Filter, Eye, X, Image as ImageIcon, FileCode } from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";
import { navItems } from "./patient.dashboard";
import { useState, useEffect } from "react";
import { fetchMedicalRecords, uploadMedicalRecord, deleteMedicalRecord } from "@/services/api";

export const Route = createFileRoute("/patient/medical-records")({
  head: () => ({ meta: [{ title: "Medical Records — DoctorFind AI" }] }),
  component: MedicalRecordsPage,
});

export default function MedicalRecordsPage() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Upload Modal State
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: "",
    category: "Lab Report",
    fileType: "PDF",
    fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    doctorName: "Dr. Ananya Sharma",
    hospitalName: "Apollo Gleneagles Hospital",
    notes: ""
  });

  const loadRecords = async () => {
    try {
      setLoading(true);
      const res = await fetchMedicalRecords({ category: activeCategory, search: searchQuery });
      if (res?.records) {
        setRecords(res.records);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
  }, [activeCategory, searchQuery]);

  const handleUploadSubmit = async () => {
    if (!uploadForm.title.trim()) {
      alert("Please enter document title");
      return;
    }
    try {
      await uploadMedicalRecord(uploadForm);
      setUploadModalOpen(false);
      setUploadForm({ ...uploadForm, title: "", notes: "" });
      alert("Medical record uploaded successfully!");
      loadRecords();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this medical record?")) {
      try {
        await deleteMedicalRecord(id);
        loadRecords();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <DashboardShell role="PATIENT" roleColor="oklch(0.68 0.13 190)" nav={navItems} user={{ name: "Rahul" }}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Medical Records Vault</h1>
          <p className="mt-1 text-muted-foreground">Secure cloud storage for PDFs, Blood Reports, X-rays, MRI, CT Scans & DICOM files</p>
        </div>
        <button
          onClick={() => setUploadModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal to-[oklch(0.55_0.18_260)] px-4 py-2.5 text-sm font-semibold text-white shadow transition hover:opacity-90 shrink-0"
        >
          <Upload className="h-4 w-4" /> Upload New Record
        </button>
      </div>

      {/* Category Filter & Search */}
      <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border bg-card p-4">
        <div className="flex flex-wrap items-center gap-2">
          {["All", "Blood Test", "X-Ray", "MRI", "CT Scan", "Lab Report", "Prescription"].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition ${
                activeCategory === cat ? "bg-teal text-white shadow" : "bg-accent/60 text-muted-foreground hover:bg-accent"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search report title or doctor..."
            className="w-full rounded-xl border bg-background py-1.5 pl-9 pr-3 text-xs outline-none focus:ring-2 focus:ring-teal/30"
          />
        </div>
      </div>

      {/* Grid of Medical Records */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <div className="col-span-full py-12 text-center text-sm text-muted-foreground">Loading medical records...</div>
        ) : records.length > 0 ? (
          records.map((r: any) => (
            <motion.div key={r._id} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="rounded-2xl border bg-card p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2 border-b pb-3">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-teal/10 text-teal">
                      {r.fileType === "PNG" || r.fileType === "JPEG" ? <ImageIcon className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
                    </div>
                    <div>
                      <div className="font-display font-bold text-sm text-foreground line-clamp-1">{r.title}</div>
                      <div className="text-[10px] text-muted-foreground">{r.dateUploaded}</div>
                    </div>
                  </div>
                  <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                    {r.fileType}
                  </span>
                </div>

                <div className="mt-3 text-xs space-y-1 text-muted-foreground">
                  <div><strong>Category:</strong> <span className="text-teal font-semibold">{r.category}</span></div>
                  <div><strong>Doctor / Lab:</strong> {r.doctorName || "General Lab"}</div>
                  <div><strong>Hospital:</strong> {r.hospitalName || "Apollo Hospital"}</div>
                  {r.notes && <div className="mt-2 text-foreground/80 italic bg-accent/40 p-2 rounded-lg text-[11px]">{r.notes}</div>}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="mt-4 flex items-center justify-between border-t pt-3 text-xs">
                <a href={r.fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-semibold text-teal hover:underline">
                  <Eye className="h-3.5 w-3.5" /> View / Download
                </a>
                <button onClick={() => handleDelete(r._id)} className="p-1.5 text-muted-foreground hover:text-rose-500 rounded-lg hover:bg-rose-50">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full rounded-2xl border bg-card p-12 text-center text-sm text-muted-foreground">
            No medical records found for category "{activeCategory}"
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-card p-6 border shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-display font-bold text-lg">Upload Medical Document</h3>
              <button onClick={() => setUploadModalOpen(false)}><X className="h-5 w-5" /></button>
            </div>
            <div className="grid gap-3 text-xs">
              <div>
                <label className="font-semibold">Document Title</label>
                <input value={uploadForm.title} onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })} placeholder="e.g. Annual Cholesterol Lab Report" className="mt-1 w-full rounded-xl border bg-background p-2.5 text-xs outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold">Category</label>
                  <select value={uploadForm.category} onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })} className="mt-1 w-full rounded-xl border bg-background p-2.5 text-xs outline-none">
                    <option value="Blood Test">Blood Test</option>
                    <option value="X-Ray">X-Ray</option>
                    <option value="MRI">MRI</option>
                    <option value="CT Scan">CT Scan</option>
                    <option value="Lab Report">Lab Report</option>
                    <option value="Prescription">Prescription</option>
                    <option value="Discharge Summary">Discharge Summary</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold">File Format</label>
                  <select value={uploadForm.fileType} onChange={(e) => setUploadForm({ ...uploadForm, fileType: e.target.value })} className="mt-1 w-full rounded-xl border bg-background p-2.5 text-xs outline-none">
                    <option value="PDF">PDF Document</option>
                    <option value="PNG">PNG Image</option>
                    <option value="JPEG">JPEG Image</option>
                    <option value="DICOM">DICOM Scan</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="font-semibold">File URL / Attachment</label>
                <input value={uploadForm.fileUrl} onChange={(e) => setUploadForm({ ...uploadForm, fileUrl: e.target.value })} placeholder="File link or URL" className="mt-1 w-full rounded-xl border bg-background p-2.5 text-xs outline-none" />
              </div>
              <div>
                <label className="font-semibold">Doctor & Hospital Name</label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <input value={uploadForm.doctorName} onChange={(e) => setUploadForm({ ...uploadForm, doctorName: e.target.value })} placeholder="Doctor Name" className="rounded-xl border bg-background p-2 text-xs outline-none" />
                  <input value={uploadForm.hospitalName} onChange={(e) => setUploadForm({ ...uploadForm, hospitalName: e.target.value })} placeholder="Hospital Name" className="rounded-xl border bg-background p-2 text-xs outline-none" />
                </div>
              </div>
              <div>
                <label className="font-semibold">Clinical Notes / Summary</label>
                <textarea value={uploadForm.notes} onChange={(e) => setUploadForm({ ...uploadForm, notes: e.target.value })} placeholder="Key findings or doctor notes..." className="mt-1 w-full h-16 rounded-xl border bg-background p-2.5 text-xs outline-none" />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setUploadModalOpen(false)} className="rounded-xl border px-4 py-2 text-xs font-semibold">Cancel</button>
              <button onClick={handleUploadSubmit} className="rounded-xl bg-teal px-4 py-2 text-xs font-semibold text-white shadow">Save Record</button>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
