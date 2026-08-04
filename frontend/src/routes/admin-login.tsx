import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import axios from "axios";

export const Route = createFileRoute("/admin-login")({
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleAdminLogin = async () => {
    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        }
      );

      if (
        res.data.user.role !== "admin"
      ) {
        alert(
          "Only Admin can login here"
        );
        return;
      }

      localStorage.setItem(
        "token",
        res.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      alert("Admin Login Successful");

      navigate({
        to: "/dashboard/admin",
      });

    } catch (error: any) {
      alert(
        error.response?.data?.message ||
          "Login Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">

      <div className="w-full max-w-md rounded-3xl border bg-card p-8 shadow-lg">

        <h1 className="text-3xl font-bold mb-2">
          Admin Login
        </h1>

        <p className="text-muted-foreground mb-6">
          Secure Administrator Access
        </p>

        <div className="space-y-4">

          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="w-full border rounded-xl px-4 py-3"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="w-full border rounded-xl px-4 py-3"
          />

          <button
            onClick={handleAdminLogin}
            disabled={loading}
            className="w-full rounded-xl bg-teal-600 py-3 text-white font-semibold"
          >
            {loading
              ? "Signing In..."
              : "Admin Login"}
          </button>

        </div>

      </div>

    </div>
  );
}