import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import axios from "axios";

import {
  LayoutDashboard,
  Users,
  UserCheck,
  Building2,
  Pill,
  Calendar,
  BarChart3,
  Star,
  Settings,
  LogOut,
} from "lucide-react";

export const Route = createFileRoute(
  "/dashboard/admin/doctors"
)({
  component: DoctorsManagement,
});

function DoctorsManagement() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [specializationFilter, setSpecializationFilter] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const doctorsPerPage = 10;

 const [formData, setFormData] = useState({
  name: "",
  email: "",
  phone: "",
  specialization: "",
  qualification: "",
  experience: "",
  hospital: "",
  fees: "",
  location: "",
  licenseNumber: "",
  profileImage: "",
});

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/doctors"
        );

        setDoctors(res.data.doctors || []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const handleAddDoctor = async () => {
  try {
    await axios.post(
      "http://localhost:5000/api/doctors",
      {
        ...formData,
        verified: true,
      }
    );

    alert("Doctor Added Successfully");

    setShowModal(false);

    window.location.reload();

  } catch (error: any) {
    console.log(error);

    alert(
      error.response?.data?.message ||
      "Failed to add doctor"
    );
  }
};

const handleEdit = (doctor: any) => {
  setSelectedDoctor(doctor);

  setFormData({
    name: doctor.name || "",
    email: doctor.email || "",
    phone: doctor.phone || "",
    specialization: doctor.specialization || "",
    qualification: doctor.qualification || "",
    experience: doctor.experience || "",
    hospital: doctor.hospital || "",
    fees: doctor.fees || "",
    location: doctor.location || "",
    licenseNumber: doctor.licenseNumber || "",
    profileImage: doctor.profileImage || "",
  });

  setEditModal(true);
};

const handleDelete = async (doctor: any) => {
  const confirmDelete = window.confirm(
    `Delete ${doctor.name}?`
  );

  if (!confirmDelete) return;

  try {
    await axios.delete(
      `http://localhost:5000/api/doctors/${doctor._id}`
    );

    setDoctors(
      doctors.filter(
        (d) => d._id !== doctor._id
      )
    );

    alert("Doctor deleted successfully");
  } catch (error) {
    console.log(error);
    alert("Failed to delete doctor");
  }
};

const handleUpdateDoctor = async () => {
  try {
    await axios.put(
      `http://localhost:5000/api/doctors/${selectedDoctor._id}`,
      formData
    );

    alert("Doctor Updated Successfully");

    setEditModal(false);

    window.location.reload();

  } catch (error) {
    console.log(error);

    alert("Failed to update doctor");
  }
};


  const filteredDoctors = doctors
  .filter((doctor) =>
    doctor.name.toLowerCase().includes(search.toLowerCase())
  )
  .filter((doctor) =>
    specializationFilter
      ? doctor.specialization === specializationFilter
      : true
  )
  .sort((a, b) => {
    if (sortBy === "experience") {
      return b.experience - a.experience;
    }

    if (sortBy === "fees") {
      return a.fees - b.fees;
    }

    return 0;
  });

const indexOfLastDoctor =
  currentPage * doctorsPerPage;

const indexOfFirstDoctor =
  indexOfLastDoctor - doctorsPerPage;

const currentDoctors =
  filteredDoctors.slice(
    indexOfFirstDoctor,
    indexOfLastDoctor
  );

const totalPages = Math.ceil(
  filteredDoctors.length / doctorsPerPage
);

return (
    <>
      <div className="rounded-2xl border bg-card p-6">
        <div className="flex items-center justify-between mb-6">
  <div>
    <h1 className="text-3xl font-bold">
      Doctors Management
    </h1>

    <p className="text-muted-foreground mt-1">
      Manage all registered doctors
    </p>
  </div>

  <div className="flex gap-3 flex-wrap">

  <input
    type="text"
    placeholder="Search doctor..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="border px-4 py-2 rounded-xl w-72"
  />

  <select
    value={specializationFilter}
    onChange={(e) =>
      setSpecializationFilter(e.target.value)
    }
    className="border px-4 py-2 rounded-xl"
  >
    <option value="">
      All Specializations
    </option>

    <option value="Cardiologist">
      Cardiologist
    </option>

    <option value="Neurologist">
      Neurologist
    </option>

    <option value="Dentist">
      Dentist
    </option>

    <option value="Dermatologist">
      Dermatologist
    </option>

    <option value="Orthopedic">
      Orthopedic
    </option>
  </select>

  <select
    value={sortBy}
    onChange={(e) =>
      setSortBy(e.target.value)
    }
    className="border px-4 py-2 rounded-xl"
  >
    <option value="">
      Sort By
    </option>

    <option value="experience">
      Experience High → Low
    </option>

    <option value="fees">
      Fees Low → High
    </option>
  </select>

  <button
    onClick={() => setShowModal(true)}
    className="px-5 py-2 rounded-xl bg-teal text-white"
  >
    + Add Doctor
  </button>

</div>
</div>

        {loading ? (
          <div className="py-10 text-center">
            Loading Doctors...
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
                    Specialization
                  </th>

                  <th className="p-4 text-left">
                    Experience
                  </th>

                  <th className="p-4 text-left">
                    Fees
                  </th>

                  <th className="p-4 text-left">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {currentDoctors.map((doctor) => (
                  <tr
                    key={doctor._id}
                    className="border-b hover:bg-slate-50"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            doctor.profileImage ||
                            "/doctor-placeholder.png"
                          }
                          alt={doctor.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />

                        <div>
                          <p className="font-semibold">
                            {doctor.name}
                          </p>

                          <p className="text-sm text-gray-500">
                            {doctor.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      {doctor.specialization}
                    </td>

                    <td className="p-4">
                      {doctor.experience} Years
                    </td>

                    <td className="p-4">
                      ₹{doctor.fees}
                    </td>

                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
  onClick={() => handleEdit(doctor)}
  className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
>
  Edit
</button>

<button
  onClick={() => handleDelete(doctor)}
  className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
>
  Delete
</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-center items-center gap-4 mt-6">

  <button
    disabled={currentPage === 1}
    onClick={() =>
      setCurrentPage(currentPage - 1)
    }
  >
    Previous
  </button>

  <span>
    Page {currentPage} of {totalPages}
  </span>

  <button
    disabled={currentPage === totalPages}
    onClick={() =>
      setCurrentPage(currentPage + 1)
    }
  >
    Next
  </button>

</div>

            {filteredDoctors.length === 0 && (
              <div className="text-center py-10 text-gray-500">
                No doctors found
              </div>
            )}
          </div>
                )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-[700px] rounded-3xl p-8">
            <h2 className="text-2xl font-bold mb-6">
              Add New Doctor
            </h2>

            <div className="grid grid-cols-2 gap-4">

              <input
                placeholder="Doctor Name"
                className="border p-3 rounded-xl"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name: e.target.value,
                  })
                }
              />

              <input
                placeholder="Email"
                className="border p-3 rounded-xl"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    email: e.target.value,
                  })
                }
              />

              <input
                placeholder="Phone"
                className="border p-3 rounded-xl"
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
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    specialization: e.target.value,
                  })
                }
              />

              <input
                placeholder="Qualification"
                className="border p-3 rounded-xl"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    qualification: e.target.value,
                  })
                }
              />

              <input
                placeholder="Experience"
                className="border p-3 rounded-xl"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    experience: e.target.value,
                  })
                }
              />

              <input
                placeholder="Hospital"
                className="border p-3 rounded-xl"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    hospital: e.target.value,
                  })
                }
              />

              <input
                placeholder="Fees"
                className="border p-3 rounded-xl"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    fees: e.target.value,
                  })
                }
              />

              <input
                placeholder="Location"
                className="border p-3 rounded-xl"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    location: e.target.value,
                  })
                }
              />

              <input
                placeholder="License Number"
                className="border p-3 rounded-xl"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    licenseNumber: e.target.value,
                  })
                }
              />

              <input
  placeholder="Profile Image URL"
  className="border p-3 rounded-xl"
  onChange={(e) =>
    setFormData({
      ...formData,
      profileImage: e.target.value,
    })
  }
/>

            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2 border rounded-xl"
              >
                Cancel
              </button>

              <button
                onClick={handleAddDoctor}
                className="px-5 py-2 bg-teal text-white rounded-xl"
              >
                Add Doctor
              </button>
            </div>
          </div>
        </div>
      )}

      {editModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white w-[700px] max-h-[90vh] overflow-y-auto rounded-3xl p-8">

      <h2 className="text-2xl font-bold mb-6">
        Edit Doctor
      </h2>

      <div className="grid grid-cols-2 gap-4">

  <input
    value={formData.name}
    placeholder="Doctor Name"
    className="border p-3 rounded-xl"
    onChange={(e) =>
      setFormData({ ...formData, name: e.target.value })
    }
  />

  <input
    value={formData.email}
    placeholder="Email"
    className="border p-3 rounded-xl"
    onChange={(e) =>
      setFormData({ ...formData, email: e.target.value })
    }
  />

  <input
    value={formData.phone}
    placeholder="Phone"
    className="border p-3 rounded-xl"
    onChange={(e) =>
      setFormData({ ...formData, phone: e.target.value })
    }
  />

  <input
    value={formData.specialization}
    placeholder="Specialization"
    className="border p-3 rounded-xl"
    onChange={(e) =>
      setFormData({ ...formData, specialization: e.target.value })
    }
  />

  <input
    value={formData.qualification}
    placeholder="Qualification"
    className="border p-3 rounded-xl"
    onChange={(e) =>
      setFormData({ ...formData, qualification: e.target.value })
    }
  />

  <input
    value={formData.experience}
    placeholder="Experience"
    className="border p-3 rounded-xl"
    onChange={(e) =>
      setFormData({ ...formData, experience: e.target.value })
    }
  />

  <input
    value={formData.hospital}
    placeholder="Hospital"
    className="border p-3 rounded-xl"
    onChange={(e) =>
      setFormData({ ...formData, hospital: e.target.value })
    }
  />

  <input
    value={formData.fees}
    placeholder="Fees"
    className="border p-3 rounded-xl"
    onChange={(e) =>
      setFormData({ ...formData, fees: e.target.value })
    }
  />

  <input
    value={formData.location}
    placeholder="Location"
    className="border p-3 rounded-xl"
    onChange={(e) =>
      setFormData({ ...formData, location: e.target.value })
    }
  />

  <input
    value={formData.licenseNumber}
    placeholder="License Number"
    className="border p-3 rounded-xl"
    onChange={(e) =>
      setFormData({ ...formData, licenseNumber: e.target.value })
    }
  />

  <input
    value={formData.profileImage}
    placeholder="Profile Image URL"
    className="border p-3 rounded-xl"
    onChange={(e) =>
      setFormData({ ...formData, profileImage: e.target.value })
    }
  />

</div>

<div className="flex justify-end gap-3 mt-6">
  <button
    onClick={() => setEditModal(false)}
    className="px-5 py-2 border rounded-xl"
  >
    Cancel
  </button>

  <button
    onClick={handleUpdateDoctor}
    className="px-5 py-2 bg-blue-600 text-white rounded-xl"
  >
    Update Doctor
  </button>
</div>
      

    </div>
  </div>
)}

    </>
  );
}
      
      
 