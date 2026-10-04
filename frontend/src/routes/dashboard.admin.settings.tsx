import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { fetchSettingsApi, updateSettingsApi } from "@/services/api";

export const Route = createFileRoute(
  "/dashboard/admin/settings"
)({
  component: SettingsPage,
});

function SettingsPage() {
  const [loading, setLoading] = useState(true);

  const [settings, setSettings] = useState({
    siteName: "DoctorFind AI",
    supportEmail: "support@doctorfind.com",
    contactNumber: "+91 33 2564 3000",
    emergencyHotline: "112",
    maintenanceMode: false,
    allowRegistrations: true,
    doctorVerification: true,
    emailNotifications: true,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetchSettingsApi();
      if (res.settings) {
        setSettings({
          siteName: res.settings.siteName || "DoctorFind AI",
          supportEmail: res.settings.supportEmail || "support@doctorfind.com",
          contactNumber: res.settings.contactNumber || "+91 33 2564 3000",
          emergencyHotline: res.settings.emergencyHotline || "112",
          maintenanceMode: !!res.settings.maintenanceMode,
          allowRegistrations: res.settings.allowRegistrations ?? true,
          doctorVerification: res.settings.doctorVerification ?? true,
          emailNotifications: res.settings.emailNotifications ?? true,
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await updateSettingsApi(settings);
      alert("Settings Updated Successfully");
    } catch (error) {
      console.log(error);
      alert("Failed to update settings.");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20">Loading Settings...</div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Platform Settings</h1>
        <p className="text-muted-foreground">Manage global portal configurations and security parameters</p>
      </div>

      {/* General Settings */}
      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-5">General Platform Configuration</h2>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold mb-1 block text-muted-foreground">Platform Name</label>
            <input
              className="border p-3 rounded-xl w-full bg-background"
              placeholder="Platform Name"
              value={settings.siteName}
              onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
            />
          </div>

          <div>
            <label className="text-xs font-semibold mb-1 block text-muted-foreground">Support Email</label>
            <input
              className="border p-3 rounded-xl w-full bg-background"
              placeholder="Support Email"
              value={settings.supportEmail}
              onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
            />
          </div>

          <div>
            <label className="text-xs font-semibold mb-1 block text-muted-foreground">Contact Hotline</label>
            <input
              className="border p-3 rounded-xl w-full bg-background"
              placeholder="Contact Number"
              value={settings.contactNumber}
              onChange={(e) => setSettings({ ...settings, contactNumber: e.target.value })}
            />
          </div>

          <div>
            <label className="text-xs font-semibold mb-1 block text-muted-foreground">Emergency Hotline</label>
            <input
              className="border p-3 rounded-xl w-full bg-background"
              placeholder="Emergency Hotline (112 / 102)"
              value={settings.emergencyHotline}
              onChange={(e) => setSettings({ ...settings, emergencyHotline: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* System Settings */}
      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-5">Security & Workflow Toggles</h2>

        <div className="space-y-4 text-sm">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="rounded"
              checked={settings.maintenanceMode}
              onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
            />
            <span>Maintenance Mode (Restrict non-admin access)</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="rounded"
              checked={settings.allowRegistrations}
              onChange={(e) => setSettings({ ...settings, allowRegistrations: e.target.checked })}
            />
            <span>Allow Public Patient Registration</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="rounded"
              checked={settings.doctorVerification}
              onChange={(e) => setSettings({ ...settings, doctorVerification: e.target.checked })}
            />
            <span>Require Admin Verification for Newly Registered Doctors</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="rounded"
              checked={settings.emailNotifications}
              onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
            />
            <span>Send Automated Email & Consultation Reminders</span>
          </label>
        </div>
      </div>

      <button
        onClick={handleSave}
        className="bg-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-teal-700 transition"
      >
        Save Settings
      </button>
    </div>
  );
}