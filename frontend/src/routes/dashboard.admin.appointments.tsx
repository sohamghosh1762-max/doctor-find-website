import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import axios from "axios";

export const Route = createFileRoute(
  "/dashboard/admin/appointments"
)({
  component: AppointmentsManagement,
});

function AppointmentsManagement() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/appointments"
      );

      setAppointments(res.data.appointments || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

const handleConfirm = async (
  id: string
) => {
  try {
    await axios.put(
      `http://localhost:5000/api/appointments/${id}/confirm`
    );

    fetchAppointments();
  } catch (error) {
    console.log(error);
  }
};

const handleCancel = async (
  id: string
) => {
  try {
    await axios.put(
      `http://localhost:5000/api/appointments/${id}/cancel`
    );

    fetchAppointments();
  } catch (error) {
    console.log(error);
  }
};

  const filteredAppointments =
    appointments.filter((appointment) =>
      appointment.doctor?.name
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );

  return (
    <div className="rounded-2xl border bg-card p-6">
      <div className="flex justify-between items-center mb-6">

        <div>
          <h1 className="text-3xl font-bold">
            Appointments Management
          </h1>

          <p className="text-muted-foreground">
            Manage all appointments
          </p>
        </div>

        <div className="bg-teal text-white px-5 py-3 rounded-xl">
          Total: {appointments.length}
        </div>

      </div>

      <input
        type="text"
        placeholder="Search Doctor..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        className="border p-3 rounded-xl w-full mb-5"
      />

      {loading ? (
        <div className="text-center py-10">
          Loading...
        </div>
      ) : (
        <div className="overflow-x-auto">

          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="p-4 text-left">
                  Doctor
                </th>

                <th className="p-4 text-left">
                  Date
                </th>

                <th className="p-4 text-left">
                  Time
                </th>

                <th className="p-4 text-left">
                  Status
                </th>

                <th className="p-4 text-left">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredAppointments.map(
                (appointment) => (
                  <tr
                    key={appointment._id}
                    className="border-b"
                  >
                    <td className="p-4">
                      {
                        appointment.doctor
                          ?.name
                      }
                    </td>

                    <td className="p-4">
                      {new Date(
                        appointment.appointmentDate
                      ).toLocaleDateString()}
                    </td>

                    <td className="p-4">
                      {
                        appointment.appointmentTime
                      }
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm
                        ${
                          appointment.status ===
                          "Confirmed"
                            ? "bg-green-100 text-green-700"
                            : appointment.status ===
                              "Cancelled"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {appointment.status}
                      </span>
                    </td>

                    <td className="p-4 flex gap-2">

  {appointment.status === "Pending" && (
    <>
      <button
        onClick={() =>
          handleConfirm(
            appointment._id
          )
        }
        className="bg-green-500 text-white px-3 py-1 rounded-lg"
      >
        Confirm
      </button>

      <button
        onClick={() =>
          handleCancel(
            appointment._id
          )
        }
        className="bg-red-500 text-white px-3 py-1 rounded-lg"
      >
        Cancel
      </button>
    </>
  )}

  {appointment.status === "Confirmed" && (
    <span className="text-green-600 font-medium">
      Confirmed
    </span>
  )}

  {appointment.status === "Cancelled" && (
    <span className="text-red-600 font-medium">
      Cancelled
    </span>
  )}

</td>
                  </tr>
                )
              )}
            </tbody>
          </table>

        </div>
      )}
    </div>
  );
}