import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { User, Phone, Mail, Calendar, MapPin, Shield, AlertTriangle, Key, Save, Trash2, Camera, Heart, Activity } from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";
import { navItems } from "./patient.dashboard";
import { useState, useEffect } from "react";
import { fetchPatientProfile, updatePatientProfile, changePassword } from "@/services/api";

export const Route = createFileRoute("/patient/profile")({
  head: () => ({ meta: [{ title: "Profile Settings — DoctorFind AI" }] }),
  component: ProfileSettingsPage,
});

export default function ProfileSettingsPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [profile, setProfile] = useState<any>({
    patientId: "PAT-849201",
    name: "Rahul Verma",
    email: "rahul@example.com",
    phone: "+91 98765 43210",
    profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
    gender: "Male",
    dateOfBirth: "1995-08-15",
    bloodGroup: "O+",
    address: "72/A Park Street, Flat 4B, Kolkata, West Bengal 700016",
    height: 175,
    weight: 70,
    emergencyContact: {
      name: "Sunita Verma",
      relationship: "Mother",
      phone: "+91 98765 99999"
    },
    insurance: {
      provider: "Star Health Insurance",
      policyNumber: "SH-987214-X",
      coverage: "₹5,00,000",
      expiry: "2027-12-31"
    },
    medicalConditions: ["Mild Hypertension", "Seasonal Asthma"],
    allergies: ["Penicillin", "Dust Mites"],
    currentMedications: ["Amlodipine 5mg", "Montair LC"],
    preferredHospital: "Apollo Gleneagles Hospital",
    preferredDoctor: "Dr. Ananya Sharma"
  });

  // Security Password State
  const [passwordState, setPasswordState] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [passwordMsg, setPasswordMsg] = useState("");

  const loadProfile = async () => {
    try {
      setLoading(true);
      const res = await fetchPatientProfile();
      if (res?.patient) {
        setProfile(res.patient);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      await updatePatientProfile(profile);
      alert("Profile updated successfully!");
      loadProfile();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleChangePasswordSubmit = async () => {
    if (passwordState.newPassword !== passwordState.confirmPassword) {
      setPasswordMsg("New passwords do not match");
      return;
    }
    try {
      await changePassword({ currentPassword: passwordState.currentPassword, newPassword: passwordState.newPassword });
      setPasswordMsg("Password changed successfully!");
      setPasswordState({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: any) {
      setPasswordMsg(err.response?.data?.message || "Failed to change password");
    }
  };

  return (
    <DashboardShell role="PATIENT" roleColor="oklch(0.68 0.13 190)" nav={navItems} user={{ name: profile.name, img: profile.profileImage }}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Patient Profile & Settings</h1>
          <p className="mt-1 text-muted-foreground">Manage personal details, medical background, emergency contacts & account security</p>
        </div>
        <button
          onClick={handleSaveProfile}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal to-[oklch(0.55_0.18_260)] px-5 py-2.5 text-sm font-semibold text-white shadow transition hover:opacity-90 disabled:opacity-50 shrink-0"
        >
          <Save className="h-4 w-4" /> {saving ? "Saving Changes..." : "Save Profile"}
        </button>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Profile Card & Avatar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-2xl border bg-card p-6 text-center shadow-sm">
            <div className="relative mx-auto h-28 w-28 overflow-hidden rounded-full border-2 border-teal">
              <img src={profile.profileImage} alt={profile.name} className="h-full w-full object-cover" />
            </div>
            <h2 className="mt-4 font-display text-xl font-bold">{profile.name}</h2>
            <div className="text-xs text-teal font-semibold">Patient Unique ID: {profile.patientId || "PAT-849201"}</div>
            <div className="text-xs text-muted-foreground mt-1">{profile.email}</div>

            <div className="mt-4 border-t pt-4 text-xs">
              <label className="font-semibold text-muted-foreground">Profile Photo Image URL</label>
              <input
                value={profile.profileImage || ""}
                onChange={(e) => setProfile({ ...profile, profileImage: e.target.value })}
                className="mt-1 w-full rounded-xl border bg-background p-2 text-xs outline-none"
              />
            </div>
          </div>

          {/* Insurance Details */}
          <div className="rounded-2xl border bg-card p-5 space-y-3 text-xs shadow-sm">
            <h3 className="font-display font-bold text-sm flex items-center gap-2">
              <Shield className="h-4 w-4 text-teal" /> Active Health Insurance
            </h3>
            <div>
              <label className="font-semibold text-muted-foreground">Insurance Provider</label>
              <input value={profile.insurance?.provider || ""} onChange={(e) => setProfile({ ...profile, insurance: { ...profile.insurance, provider: e.target.value } })} className="mt-1 w-full rounded-xl border bg-background p-2 text-xs outline-none" />
            </div>
            <div>
              <label className="font-semibold text-muted-foreground">Policy Number</label>
              <input value={profile.insurance?.policyNumber || ""} onChange={(e) => setProfile({ ...profile, insurance: { ...profile.insurance, policyNumber: e.target.value } })} className="mt-1 w-full rounded-xl border bg-background p-2 text-xs outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-semibold text-muted-foreground">Sum Insured</label>
                <input value={profile.insurance?.coverage || ""} onChange={(e) => setProfile({ ...profile, insurance: { ...profile.insurance, coverage: e.target.value } })} className="mt-1 w-full rounded-xl border bg-background p-2 text-xs outline-none" />
              </div>
              <div>
                <label className="font-semibold text-muted-foreground">Expiry Date</label>
                <input value={profile.insurance?.expiry || ""} onChange={(e) => setProfile({ ...profile, insurance: { ...profile.insurance, expiry: e.target.value } })} className="mt-1 w-full rounded-xl border bg-background p-2 text-xs outline-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Personal & Medical Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="rounded-2xl border bg-card p-6 space-y-4 shadow-sm">
            <h3 className="font-display font-bold text-base border-b pb-3">Personal & Contact Details</h3>
            <div className="grid gap-4 sm:grid-cols-2 text-xs">
              <div>
                <label className="font-semibold">Full Name</label>
                <input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="mt-1 w-full rounded-xl border bg-background p-2.5 text-xs outline-none" />
              </div>
              <div>
                <label className="font-semibold">Phone Number</label>
                <input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className="mt-1 w-full rounded-xl border bg-background p-2.5 text-xs outline-none" />
              </div>
              <div>
                <label className="font-semibold">Email Address</label>
                <input value={profile.email} disabled className="mt-1 w-full rounded-xl border bg-accent/50 p-2.5 text-xs outline-none cursor-not-allowed" />
              </div>
              <div>
                <label className="font-semibold">Date of Birth</label>
                <input type="date" value={profile.dateOfBirth} onChange={(e) => setProfile({ ...profile, dateOfBirth: e.target.value })} className="mt-1 w-full rounded-xl border bg-background p-2.5 text-xs outline-none" />
              </div>
              <div>
                <label className="font-semibold">Gender</label>
                <select value={profile.gender} onChange={(e) => setProfile({ ...profile, gender: e.target.value })} className="mt-1 w-full rounded-xl border bg-background p-2.5 text-xs outline-none">
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="font-semibold">Blood Group</label>
                <select value={profile.bloodGroup} onChange={(e) => setProfile({ ...profile, bloodGroup: e.target.value })} className="mt-1 w-full rounded-xl border bg-background p-2.5 text-xs outline-none">
                  <option value="A+">A+</option><option value="A-">A-</option>
                  <option value="B+">B+</option><option value="B-">B-</option>
                  <option value="O+">O+</option><option value="O-">O-</option>
                  <option value="AB+">AB+</option><option value="AB-">AB-</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="font-semibold">Residential Address</label>
                <input value={profile.address} onChange={(e) => setProfile({ ...profile, address: e.target.value })} className="mt-1 w-full rounded-xl border bg-background p-2.5 text-xs outline-none" />
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="rounded-2xl border bg-card p-6 space-y-4 shadow-sm">
            <h3 className="font-display font-bold text-base border-b pb-3 flex items-center gap-2">
              <Phone className="h-4 w-4 text-rose-500" /> Emergency Contact
            </h3>
            <div className="grid gap-4 sm:grid-cols-3 text-xs">
              <div>
                <label className="font-semibold">Contact Name</label>
                <input value={profile.emergencyContact?.name || ""} onChange={(e) => setProfile({ ...profile, emergencyContact: { ...profile.emergencyContact, name: e.target.value } })} className="mt-1 w-full rounded-xl border bg-background p-2.5 text-xs outline-none" />
              </div>
              <div>
                <label className="font-semibold">Relationship</label>
                <input value={profile.emergencyContact?.relationship || ""} onChange={(e) => setProfile({ ...profile, emergencyContact: { ...profile.emergencyContact, relationship: e.target.value } })} className="mt-1 w-full rounded-xl border bg-background p-2.5 text-xs outline-none" />
              </div>
              <div>
                <label className="font-semibold">Emergency Phone</label>
                <input value={profile.emergencyContact?.phone || ""} onChange={(e) => setProfile({ ...profile, emergencyContact: { ...profile.emergencyContact, phone: e.target.value } })} className="mt-1 w-full rounded-xl border bg-background p-2.5 text-xs outline-none" />
              </div>
            </div>
          </div>

          {/* Security Password Change */}
          <div className="rounded-2xl border bg-card p-6 space-y-4 shadow-sm">
            <h3 className="font-display font-bold text-base border-b pb-3 flex items-center gap-2">
              <Key className="h-4 w-4 text-teal" /> Security & Password
            </h3>
            <div className="grid gap-4 sm:grid-cols-3 text-xs">
              <div>
                <label className="font-semibold">Current Password</label>
                <input type="password" value={passwordState.currentPassword} onChange={(e) => setPasswordState({ ...passwordState, currentPassword: e.target.value })} className="mt-1 w-full rounded-xl border bg-background p-2.5 text-xs outline-none" />
              </div>
              <div>
                <label className="font-semibold">New Password</label>
                <input type="password" value={passwordState.newPassword} onChange={(e) => setPasswordState({ ...passwordState, newPassword: e.target.value })} className="mt-1 w-full rounded-xl border bg-background p-2.5 text-xs outline-none" />
              </div>
              <div>
                <label className="font-semibold">Confirm New Password</label>
                <input type="password" value={passwordState.confirmPassword} onChange={(e) => setPasswordState({ ...passwordState, confirmPassword: e.target.value })} className="mt-1 w-full rounded-xl border bg-background p-2.5 text-xs outline-none" />
              </div>
            </div>
            {passwordMsg && <div className="text-xs font-semibold text-teal">{passwordMsg}</div>}
            <button onClick={handleChangePasswordSubmit} className="rounded-xl border px-4 py-2 text-xs font-semibold hover:bg-accent">
              Update Password
            </button>
          </div>

          {/* Danger Zone */}
          <div className="rounded-2xl border border-rose-200 bg-rose-500/5 p-6 space-y-3">
            <h3 className="font-display font-bold text-base text-rose-600 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" /> Danger Zone
            </h3>
            <p className="text-xs text-muted-foreground">Once deleted, your medical profile, appointment history, and prescriptions cannot be recovered.</p>
            <button onClick={() => confirm("Are you sure you want to delete your account?") && navigate({ to: "/" })} className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-rose-700">
              Delete Patient Account
            </button>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
