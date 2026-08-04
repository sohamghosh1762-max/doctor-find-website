import { createFileRoute } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import axios from "axios";

export const Route = createFileRoute(
  "/doctor/change-password"
)({
  component: ChangePassword,
});

function ChangePassword() {
  const navigate = useNavigate();

  const [password, setPassword] =
    useState("");

  const [confirmPassword,
    setConfirmPassword] =
    useState("");

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const doctor = JSON.parse(
      localStorage.getItem(
        "doctorData"
      ) || "{}"
    );

    try {
      await axios.put(
        `http://localhost:5000/api/doctors/change-password/${doctor._id}`,
        {
          password,
        }
      );

      alert(
        "Password changed successfully"
      );

      navigate({
        to: "/dashboard/doctor",
      });

    } catch (error: any) {
      alert(
        error.response?.data?.message ||
        "Something went wrong"
      );
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100">

      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow">

        <h1 className="mb-6 text-center text-3xl font-bold">
          Change Password
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
            className="w-full border rounded-lg p-3"
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(
                e.target.value
              )
            }
            className="w-full border rounded-lg p-3"
          />

          <button
            type="submit"
            className="w-full bg-teal-600 text-white rounded-lg p-3"
          >
            Update Password
          </button>
        </form>

      </div>

    </div>
  );
}