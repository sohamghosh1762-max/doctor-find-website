import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  fetchHospitals,
  addHospitalApi,
  deleteHospitalApi,
} from "@/services/api";

export const Route = createFileRoute(
  "/dashboard/admin/hospitals"
)({
  component: HospitalsManagement,
});

function HospitalsManagement() {
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    specialization: "",
  });

  const [search, setSearch] = useState("");

  const loadHospitals = async () => {
    try {
      const res = await fetchHospitals();
      setHospitals(res.hospitals || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHospitals();
  }, []);

  const handleAddHospital = async () => {
    try {
      await addHospitalApi(formData);
      alert("Hospital Added Successfully");
      setShowModal(false);
      setFormData({
        name: "",
        address: "",
        phone: "",
        specialization: "",
      });
      loadHospitals();
    } catch (error) {
      console.log(error);
      alert("Failed to add hospital.");
    }
  };

  const handleDeleteHospital = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this hospital?"
    );

    if (!confirmDelete) return;

    try {
      await deleteHospitalApi(id);
      alert("Hospital Deleted");
      loadHospitals();
    } catch (error) {
      console.log(error);
      alert("Failed to delete hospital.");
    }
  };

  const filteredHospitals = hospitals.filter((hospital) =>
    hospital.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="rounded-2xl border bg-card p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Hospitals Management</h1>
          <p className="text-muted-foreground">Manage all partner healthcare facilities</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-2 rounded-xl bg-teal-600 text-white hover:bg-teal-700 transition"
        >
          + Add Hospital
        </button>
      </div>

      {/* Stats Card */}
      <div className="mb-6 bg-blue-50 border rounded-2xl p-5">
        <h3 className="font-semibold text-blue-900">Total Hospitals</h3>
        <p className="text-3xl font-bold mt-2 text-blue-950">{hospitals.length}</p>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search Hospital..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border rounded-xl p-3 mb-5 bg-background"
      />

      {/* Table */}
      {loading ? (
        <div className="text-center py-10">Loading Hospitals...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-xs uppercase text-muted-foreground">
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Address</th>
                <th className="p-4 text-left">Phone</th>
                <th className="p-4 text-left">Specialization</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredHospitals.map((hospital) => (
                <tr key={hospital._id} className="border-b hover:bg-slate-50/50">
                  <td className="p-4 font-medium">{hospital.name}</td>
                  <td className="p-4 text-muted-foreground">{hospital.address}</td>
                  <td className="p-4">{hospital.phone}</td>
                  <td className="p-4">{hospital.specialization}</td>
                  <td className="p-4">
                    <button
                      onClick={() => handleDeleteHospital(hospital._id)}
                      className="bg-red-500 text-white text-xs px-3 py-1 rounded-lg hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredHospitals.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              No hospitals found
            </div>
          )}
        </div>
      )}

      {/* Add Hospital Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-[600px] rounded-3xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold mb-6">Add Hospital</h2>

            <div className="grid gap-4">
              <input
                placeholder="Hospital Name"
                className="border p-3 rounded-xl"
                value={formData.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name: e.target.value,
                  })
                }
              />

              <input
                placeholder="Address"
                className="border p-3 rounded-xl"
                value={formData.address}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: e.target.value,
                  })
                }
              />

              <input
                placeholder="Phone"
                className="border p-3 rounded-xl"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    phone: e.target.value,
                  })
                }
              />

              <input
                placeholder="Specialization"
                className="border p-3 rounded-xl"
                value={formData.specialization}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    specialization: e.target.value,
                  })
                }
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2 border rounded-xl hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={handleAddHospital}
                className="px-5 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700"
              >
                Add Hospital
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}