import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { fetchAdminUsers } from "@/services/api";

export const Route = createFileRoute(
  "/dashboard/admin/users"
)({
  component: UsersManagement,
});

function UsersManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetchAdminUsers();
      setUsers(res.users || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users
    .filter((user) =>
      user.name
        ?.toLowerCase()
        .includes(search.toLowerCase())
    )
    .filter((user) =>
      roleFilter
        ? user.role === roleFilter
        : true
    );

  return (
    <div className="rounded-2xl border bg-card p-6">

      <div className="flex items-center justify-between mb-6">

        <div>
          <h1 className="text-3xl font-bold">
            Users Management
          </h1>

          <p className="text-muted-foreground">
            Manage all registered users
          </p>
        </div>

        <div className="bg-teal text-white px-5 py-3 rounded-xl">
          Total Users: {users.length}
        </div>

      </div>

      <div className="flex gap-3 mb-5">

        <input
          type="text"
          placeholder="Search User..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="border p-3 rounded-xl w-80"
        />

        <select
          value={roleFilter}
          onChange={(e) =>
            setRoleFilter(e.target.value)
          }
          className="border p-3 rounded-xl"
        >
          <option value="">
            All Roles
          </option>

          <option value="patient">
            Patient
          </option>

          <option value="doctor">
            Doctor
          </option>

          <option value="admin">
            Admin
          </option>
        </select>

      </div>

      {loading ? (
        <div className="text-center py-10">
          Loading Users...
        </div>
      ) : (
        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>
              <tr className="border-b">

                <th className="p-4 text-left">
                  Name
                </th>

                <th className="p-4 text-left">
                  Email
                </th>

                <th className="p-4 text-left">
                  Phone
                </th>

                <th className="p-4 text-left">
                  Role
                </th>

                <th className="p-4 text-left">
                  Verified
                </th>

              </tr>
            </thead>

            <tbody>

              {filteredUsers.map((user) => (
                <tr
                  key={user._id}
                  className="border-b hover:bg-slate-50"
                >

                  <td className="p-4">
                    {user.name}
                  </td>

                  <td className="p-4">
                    {user.email}
                  </td>

                  <td className="p-4">
                    {user.phone || "N/A"}
                  </td>

                  <td className="p-4">
                    <span className="capitalize">
                      {user.role}
                    </span>
                  </td>

                  <td className="p-4">

                    {user.isVerified ? (
                      <span className="text-green-600 font-semibold">
                        Verified
                      </span>
                    ) : (
                      <span className="text-red-500 font-semibold">
                        Not Verified
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