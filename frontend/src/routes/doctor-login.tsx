import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { doctorLoginApi } from "@/services/api";

export const Route = createFileRoute("/doctor-login")({
  component: DoctorLoginPage,
});

function DoctorLoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = await doctorLoginApi({
        email,
        password,
      });

      if (!data.success) {
        alert(data.message || "Login failed");
        return;
      }

      localStorage.setItem("doctorToken", data.token);
      localStorage.setItem("token", data.token);
      localStorage.setItem("doctor", JSON.stringify(data.doctor));
      localStorage.setItem("user", JSON.stringify({ ...data.doctor, role: "doctor" }));

      if (data.mustChangePassword) {
        navigate({
          to: "/doctor/change-password",
        });
      } else {
        navigate({
          to: "/dashboard/doctor",
        });
      }
    } catch (error: any) {
      alert(error.response?.data?.message || "Doctor login failed. Please verify your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="mb-2 text-center text-3xl font-bold">Doctor Login</h1>
        <p className="mb-6 text-center text-gray-500">
          Login with your registered medical credentials
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Doctor Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border p-3"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border p-3"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-teal-600 p-3 font-semibold text-white hover:bg-teal-700 transition"
          >
            {loading ? "Logging in..." : "Login to Doctor Portal"}
          </button>
        </form>
      </div>
    </div>
  );
}