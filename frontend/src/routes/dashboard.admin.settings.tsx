import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import axios from "axios";

export const Route = createFileRoute(
  "/dashboard/admin/settings"
)({
  component: SettingsPage,
});

function SettingsPage() {
  const [loading, setLoading] =
    useState(true);

  const [settings, setSettings] =
    useState({
      platformName: "",
      supportEmail: "",
      supportPhone: "",
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
      const res = await axios.get(
        "http://localhost:5000/api/settings"
      );

      setSettings(
        res.data.settings
      );
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await axios.put(
        "http://localhost:5000/api/settings",
        settings
      );

      alert(
        "Settings Updated Successfully"
      );
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        Loading Settings...
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-3xl font-bold">
          Settings
        </h1>

        <p className="text-muted-foreground">
          Manage platform settings
        </p>
      </div>

      {/* General Settings */}

      <div className="rounded-2xl border bg-card p-6">

        <h2 className="text-xl font-bold mb-5">
          General Settings
        </h2>

        <div className="grid md:grid-cols-2 gap-4">

          <input
            className="border p-3 rounded-xl"
            placeholder="Platform Name"
            value={settings.platformName}
            onChange={(e) =>
              setSettings({
                ...settings,
                platformName:
                  e.target.value,
              })
            }
          />

          <input
            className="border p-3 rounded-xl"
            placeholder="Support Email"
            value={settings.supportEmail}
            onChange={(e) =>
              setSettings({
                ...settings,
                supportEmail:
                  e.target.value,
              })
            }
          />

          <input
            className="border p-3 rounded-xl"
            placeholder="Support Phone"
            value={settings.supportPhone}
            onChange={(e) =>
              setSettings({
                ...settings,
                supportPhone:
                  e.target.value,
              })
            }
          />

        </div>

      </div>

      {/* System Settings */}

      <div className="rounded-2xl border bg-card p-6">

        <h2 className="text-xl font-bold mb-5">
          System Settings
        </h2>

        <div className="space-y-4">

          <label className="flex items-center gap-3">

            <input
              type="checkbox"
              checked={
                settings.maintenanceMode
              }
              onChange={(e) =>
                setSettings({
                  ...settings,
                  maintenanceMode:
                    e.target.checked,
                })
              }
            />

            Maintenance Mode

          </label>

          <label className="flex items-center gap-3">

            <input
              type="checkbox"
              checked={
                settings.allowRegistrations
              }
              onChange={(e) =>
                setSettings({
                  ...settings,
                  allowRegistrations:
                    e.target.checked,
                })
              }
            />

            Allow Registrations

          </label>

          <label className="flex items-center gap-3">

            <input
              type="checkbox"
              checked={
                settings.doctorVerification
              }
              onChange={(e) =>
                setSettings({
                  ...settings,
                  doctorVerification:
                    e.target.checked,
                })
              }
            />

            Doctor Verification

          </label>

          <label className="flex items-center gap-3">

            <input
              type="checkbox"
              checked={
                settings.emailNotifications
              }
              onChange={(e) =>
                setSettings({
                  ...settings,
                  emailNotifications:
                    e.target.checked,
                })
              }
            />

            Email Notifications

          </label>

        </div>

      </div>

      <button
        onClick={handleSave}
        className="bg-teal-600 text-white px-6 py-3 rounded-xl"
      >
        Save Settings
      </button>

    </div>
  );
}