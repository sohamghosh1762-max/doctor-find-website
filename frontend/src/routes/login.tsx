import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Activity } from "lucide-react";
import heroDoctor from "@/assets/hero-doctor.jpg";

import { useState } from "react";
import axios from "axios";

export const Route = createFileRoute("/login")({
  component: Login,
});

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        }
      );

      console.log(res.data);

      localStorage.setItem(
        "token",
        res.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      alert("Login Successful");

      if (res.data.user.role === "admin") {
  navigate({
    to: "/dashboard/admin",
  });

} else if (
  res.data.user.role === "doctor"
) {
  navigate({
    to: "/dashboard/doctor",
  });

} else {
  navigate({
    to: "/dashboard/patient",
  });
}
    } catch (error: any) {
      console.log(error.response?.data);

      alert(
        error.response?.data?.message ||
          "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">

      {/* Left Side Image */}

      <div className="relative hidden lg:block">
        <img
          src={heroDoctor}
          alt=""
          className="h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-br from-navy/80 via-navy/40 to-teal/30" />

        <div className="absolute bottom-12 left-12 text-white">
          <h2 className="font-display text-4xl font-bold">
            Welcome back to
            <br />
            DoctorFind AI
          </h2>

          <p className="mt-3 max-w-sm text-white/80">
            Continue your healthcare journey
            with intelligent care.
          </p>
        </div>
      </div>

      {/* Login Form */}

      <div className="grid place-items-center p-8">

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="w-full max-w-md"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2"
          >
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-teal to-navy text-white">
              <Activity className="h-5 w-5" />
            </div>

            <span className="font-display font-bold">
              DoctorFind AI
            </span>
          </Link>

          <h1 className="mt-8 font-display text-3xl font-bold">
            Sign In
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Welcome back. Please enter your
            details.
          </p>

          <form
            className="mt-8 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
          >

            {/* Email */}

            <div>
              <label className="text-sm font-medium">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                className="mt-1 w-full rounded-xl border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal/30"
                placeholder="you@example.com"
              />
            </div>

            {/* Password */}

            <div>
              <label className="text-sm font-medium">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                className="mt-1 w-full rounded-xl border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal/30"
                placeholder="••••••••"
              />
            </div>

            {/* Submit */}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-teal to-[oklch(0.55_0.18_260)] py-2.5 text-sm font-semibold text-white shadow transition hover:opacity-90"
            >
              {loading
                ? "Signing In..."
                : "Sign In"}
            </button>

          </form>

          {/* Signup */}

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold text-teal"
            >
              Sign Up
            </Link>
          </p>

          {/* Demo Buttons */}

          <div className="mt-6 flex gap-2 text-xs">
            <Link
              to="/dashboard/patient"
              className="flex-1 rounded-lg border py-2 text-center hover:bg-accent"
            >
              Patient Demo
            </Link>

            <Link
  to="/doctor-login"
  className="rounded-lg border py-2 text-center hover:bg-accent"
>
  Doctor Login
</Link>

            <Link
  to="/admin-login"
  className="flex-1 rounded-lg border py-2 text-center hover:bg-accent"
>
  Admin
</Link>
          </div>
        </motion.div>

      </div>
    </div>
  );
}