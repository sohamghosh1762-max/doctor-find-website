import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  fetchMyAppointments,
  updateAppointmentStatusApi,
  cancelAppointment,
} from "@/services/api";

export const Route = createFileRoute(
  "/dashboard/admin/appointments"
)({
  component: AppointmentsManagement,
});

function AppointmentsManagement() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchAppointments = async () => {
    try {
      const res = await fetchMyAppointments();
      setAppointments(res.appointments || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleConfirm = async (id: string) => {
    try {
      await updateAppointmentStatusApi(id, "Confirmed");
      fetchAppointments();
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = async (id: string) => {
    try {
      await cancelAppointment(id);
      fetchAppointments();
    } catch (error) {
      console.log(error);
    }
  };

  const filteredAppointments = appointments.filter((appointment) => {
    const docName = appointment.doctorName || appointment.doctor?.name || "";
    const patName = appointment.patient?.name || "";
    const s = search.toLowerCase();
    return docName.toLowerCase().includes(s) || patName.toLowerCase().includes(s);
  });

  return (
    <div className="rounded-2xl border bg-card p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Appointments Management</h1>
          <p className="text-muted-foreground">Manage and review all patient consultations</p>
        </div>

        <div className="bg-teal text-white px-5 py-3 rounded-xl font-semibold">
          Total: {appointments.length}
        </div>
      </div>

      <input
        type="text"
        placeholder="Search Doctor or Patient..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-3 rounded-xl w-full mb-5 bg-background"
      />

      {loading ? (
        <div className="text-center py-10">Loading Appointments...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-xs uppercase text-muted-foreground">
                <th className="p-4 text-left">Doctor</th>
                <th className="p-4 text-left">Patient</th>
                <th className="p-4 text-left">Date</th>
                <th className="p-4 text-left">Time</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredAppointments.map((appointment) => (
                <tr key={appointment._id} className="border-b hover:bg-slate-50/50">
                  <td className="p-4 font-medium">
                    {appointment.doctorName || appointment.doctor?.name || "Dr. Medical Specialist"}
                  </td>

                  <td className="p-4 text-muted-foreground">
                    {appointment.patient?.name || "Registered Patient"}
                  </td>

                  <td className="p-4">
                    {appointment.appointmentDate}
                  </td>

                  <td className="p-4">
                    {appointment.appointmentTime}
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold
                      ${
                        appointment.status === "Confirmed"
                          ? "bg-green-100 text-green-700"
                          : appointment.status === "Cancelled"
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
                          onClick={() => handleConfirm(appointment._id)}
                          className="bg-green-600 text-white text-xs px-3 py-1 rounded-lg hover:bg-green-700"
                        >
                          Confirm
                        </button>

                        <button
                          onClick={() => handleCancel(appointment._id)}
                          className="bg-red-500 text-white text-xs px-3 py-1 rounded-lg hover:bg-red-600"
                        >
                          Cancel
                        </button>
                      </>
                    )}

                    {appointment.status === "Confirmed" && (
                      <span className="text-green-600 font-medium text-xs">
                        Active Confirmed
                      </span>
                    )}

                    {appointment.status === "Cancelled" && (
                      <span className="text-red-600 font-medium text-xs">
                        Cancelled
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}