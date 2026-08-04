import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import axios from "axios";

export const Route = createFileRoute("/my-appointments")({
  component: MyAppointments,
});

function MyAppointments() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          "http://localhost:5000/api/appointments/my-appointments",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setAppointments(res.data.appointments);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-10">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-4xl font-bold mb-8">
          My Appointments
        </h1>

        {appointments.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 shadow">
            No appointments found
          </div>
        ) : (
          <div className="grid gap-5">
            {appointments.map((appointment) => (
              <div
                key={appointment._id}
                className="bg-white rounded-3xl p-6 shadow"
              >
                <div className="flex justify-between items-center">

                  <div>
                    <h2 className="text-xl font-bold">
                      {appointment.doctor?.name}
                    </h2>

                    <p className="text-gray-500">
                      {appointment.doctor?.specialization}
                    </p>

                    <p className="mt-2">
                      Date:
                      {" "}
                      {new Date(
                        appointment.appointmentDate
                      ).toLocaleDateString()}
                    </p>

                    <p>
                      Time:
                      {" "}
                      {appointment.appointmentTime}
                    </p>
                  </div>

                  <div>
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-medium ${
                        appointment.status === "Confirmed"
                          ? "bg-green-100 text-green-700"
                          : appointment.status === "Cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {appointment.status}
                    </span>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}