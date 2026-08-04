import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import axios from "axios";

export const Route = createFileRoute(
  "/dashboard/admin/pharmacies"
)({
  component: PharmaciesManagement,
});

function PharmaciesManagement() {
  const [medicines, setMedicines] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [showModal, setShowModal] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [formData, setFormData] =
    useState({
      name: "",
      brand: "",
      category: "",
      price: "",
      stock: "",
      pharmacyName: "",
      location: "",
    });

  const fetchMedicines = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/medicines"
      );

      setMedicines(
        res.data.medicines || []
      );
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  const handleAddMedicine = async () => {
  try {
    await axios.post(
      "http://localhost:5000/api/medicines",
      formData
    );

    alert("Medicine Added");

    setShowModal(false);

    fetchMedicines();

  } catch (error) {
    console.log(error);
  }
};

const handleDeleteMedicine = async (
  id: string
) => {
  try {
    await axios.delete(
      `http://localhost:5000/api/medicines/${id}`
    );

    alert("Medicine Deleted");

    fetchMedicines();

  } catch (error) {
    console.log(error);
  }
};

const filteredMedicines =
  medicines.filter((medicine) =>
    medicine.name
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

return (
  <div className="rounded-2xl border bg-card p-6">

    <div className="flex justify-between items-center mb-6">

      <div>
        <h1 className="text-3xl font-bold">
          Medicines Management
        </h1>

        <p className="text-muted-foreground">
          Manage all medicines
        </p>
      </div>

      <button
        onClick={() => setShowModal(true)}
        className="bg-teal-600 text-white px-5 py-2 rounded-xl"
      >
        + Add Medicine
      </button>

    </div>

    <div className="mb-5 bg-green-50 p-5 rounded-xl border">
      <h3 className="font-semibold">
        Total Medicines
      </h3>

      <p className="text-3xl font-bold">
        {medicines.length}
      </p>
    </div>

    <input
      placeholder="Search Medicine..."
      value={search}
      onChange={(e) =>
        setSearch(e.target.value)
      }
      className="w-full border rounded-xl p-3 mb-5"
    />

    {loading ? (
      <div className="text-center py-10">
        Loading Medicines...
      </div>
    ) : (
      <div className="overflow-x-auto">

        <table className="w-full">

          <thead>
            <tr className="border-b">

              <th className="p-4 text-left">
                Medicine
              </th>

              <th className="p-4 text-left">
                Brand
              </th>

              <th className="p-4 text-left">
                Category
              </th>

              <th className="p-4 text-left">
                Price
              </th>

              <th className="p-4 text-left">
                Stock
              </th>

              <th className="p-4 text-left">
                Actions
              </th>

            </tr>
          </thead>

          <tbody>

            {filteredMedicines.map(
              (medicine) => (
                <tr
                  key={medicine._id}
                  className="border-b hover:bg-slate-50"
                >

                  <td className="p-4">
                    {medicine.name}
                  </td>

                  <td className="p-4">
                    {medicine.brand}
                  </td>

                  <td className="p-4">
                    {medicine.category}
                  </td>

                  <td className="p-4">
                    ₹{medicine.price}
                  </td>

                  <td className="p-4">
                    {medicine.stock}
                  </td>

                  <td className="p-4">

                    <button
                      onClick={() =>
                        handleDeleteMedicine(
                          medicine._id
                        )
                      }
                      className="bg-red-500 text-white px-3 py-1 rounded-lg"
                    >
                      Delete
                    </button>

                  </td>

                </tr>
              )
            )}

          </tbody>

        </table>

      </div>
    )}

    {showModal && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

        <div className="bg-white w-[700px] rounded-3xl p-8">

          <h2 className="text-2xl font-bold mb-6">
            Add Medicine
          </h2>

          <div className="grid grid-cols-2 gap-4">

            <input
              placeholder="Medicine Name"
              className="border p-3 rounded-xl"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name: e.target.value,
                })
              }
            />

            <input
              placeholder="Brand"
              className="border p-3 rounded-xl"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  brand: e.target.value,
                })
              }
            />

            <input
              placeholder="Category"
              className="border p-3 rounded-xl"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  category: e.target.value,
                })
              }
            />

            <input
              placeholder="Price"
              className="border p-3 rounded-xl"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  price: e.target.value,
                })
              }
            />

            <input
              placeholder="Stock"
              className="border p-3 rounded-xl"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  stock: e.target.value,
                })
              }
            />

            <input
              placeholder="Pharmacy Name"
              className="border p-3 rounded-xl"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  pharmacyName: e.target.value,
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

          </div>

          <div className="flex justify-end gap-3 mt-6">

            <button
              onClick={() =>
                setShowModal(false)
              }
              className="border px-5 py-2 rounded-xl"
            >
              Cancel
            </button>

            <button
              onClick={handleAddMedicine}
              className="bg-teal-600 text-white px-5 py-2 rounded-xl"
            >
              Add Medicine
            </button>

          </div>

        </div>

      </div>
    )}

  </div>
);
}