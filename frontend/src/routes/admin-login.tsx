import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { loginApi } from "@/services/api";

export const Route = createFileRoute("/admin-login")({
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdminLogin = async () => {
    try {
      setLoading(true);

      const res = await loginApi({
        email,
        password,
      });

      if (res.user.role !== "admin") {
        alert("Access Denied: Administrator account required.");
        return;
      }

      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));

      alert("Admin Login Successful");

      navigate({
        to: "/dashboard/admin",
      });
    } catch (error: any) {
      alert(
        error.response?.data?.message ||
          "Login Failed. Please check your admin credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md rounded-3xl border bg-card p-8 shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Admin Login</h1>
        <p className="text-muted-foreground mb-6">Secure Administrator Access</p>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-xl px-4 py-3"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-xl px-4 py-3"
          />

          <button
            onClick={handleAdminLogin}
            disabled={loading}
            className="w-full rounded-xl bg-teal-600 py-3 text-white font-semibold hover:bg-teal-700 transition"
          >
            {loading ? "Signing In..." : "Admin Login"}
          </button>
        </div>
      </div>
    </div>
  );
}