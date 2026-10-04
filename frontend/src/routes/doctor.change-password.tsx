import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { changeDoctorPasswordApi } from "@/services/api";

export const Route = createFileRoute("/doctor/change-password")({
  component: ChangePassword,
});

function ChangePassword() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }

    const doctor = JSON.parse(
      localStorage.getItem("doctor") || localStorage.getItem("doctorData") || "{}"
    );

    try {
      setLoading(true);
      await changeDoctorPasswordApi(doctor._id, { password });

      alert("Password updated successfully! Welcome to your dashboard.");
      navigate({
        to: "/dashboard/doctor",
      });
    } catch (error: any) {
      alert(error.response?.data?.message || "Something went wrong while updating password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow">
        <h1 className="mb-2 text-center text-3xl font-bold">Set New Password</h1>
        <p className="mb-6 text-center text-xs text-gray-500">
          Please update your password to secure your doctor account.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="New Password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-lg p-3"
            required
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border rounded-lg p-3"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 text-white rounded-lg p-3 font-semibold hover:bg-teal-700 transition"
          >
            {loading ? "Updating..." : "Update Password & Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}