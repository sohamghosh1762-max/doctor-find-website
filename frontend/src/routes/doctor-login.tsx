import { createFileRoute } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/doctor-login")({
  component: DoctorLoginPage,
});

function DoctorLoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleLogin = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/doctors/login",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data =
        await response.json();

      if (!data.success) {
        alert(data.message);
        return;
      }

      localStorage.setItem(
        "doctorToken",
        data.token
      );

      localStorage.setItem(
  "doctor",
  JSON.stringify(data.doctor)
);

      if (
        data.mustChangePassword
      ) {
        navigate({
          to:
            "/doctor/change-password",
        });
      } else {
        navigate({
          to:
            "/dashboard/doctor",
        });
      }

    } catch (error) {
      console.error(error);

      alert(
        "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">

        <h1 className="mb-2 text-center text-3xl font-bold">
          Doctor Login
        </h1>

        <p className="mb-6 text-center text-gray-500">
          Login using your
          registered email
        </p>

        <form
          onSubmit={handleLogin}
          className="space-y-4"
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
            className="w-full rounded-lg border p-3"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
            className="w-full rounded-lg border p-3"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-teal-600 p-3 font-semibold text-white hover:bg-teal-700"
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-500">
          Default password:
          <span className="font-semibold">
            {" "}
            123456
          </span>
        </div>
      </div>
    </div>
  );
}