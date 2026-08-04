import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

export const Route = createFileRoute(
  "/dashboard/admin/reports"
)({
  component: ReportsPage,
});

function ReportsPage() {
  const [stats, setStats] = useState({
    users: 0,
    doctors: 0,
    appointments: 0,
    hospitals: 0,
    medicines: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/admin/stats"
      );

      console.log("Stats API:", res.data);

      setStats(res.data.stats);
    } catch (error) {
      console.log(error);
    }
  };

  const chartData = [
    {
      name: "Users",
      value: stats.users,
    },
    {
      name: "Doctors",
      value: stats.doctors,
    },
    {
      name: "Appointments",
      value: stats.appointments,
    },
    {
      name: "Hospitals",
      value: stats.hospitals,
    },
    {
      name: "Medicines",
      value: stats.medicines,
    },
  ];

  const COLORS = [
  "#14b8a6",
  "#0ea5e9",
  "#2563eb",
  "#06b6d4",
  "#0891b2",
];

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-3xl font-bold">
          Reports & Analytics
        </h1>

        <p className="text-muted-foreground">
          Platform Statistics Overview
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">

        <div className="p-5 rounded-2xl border bg-card">
          <h3>Total Users</h3>
          <p className="text-3xl font-bold">
            {stats.users}
          </p>
        </div>

        <div className="p-5 rounded-2xl border bg-card">
          <h3>Total Doctors</h3>
          <p className="text-3xl font-bold">
            {stats.doctors}
          </p>
        </div>

        <div className="p-5 rounded-2xl border bg-card">
          <h3>Total Appointments</h3>
          <p className="text-3xl font-bold">
            {stats.appointments}
          </p>
        </div>

        <div className="p-5 rounded-2xl border bg-card">
          <h3>Total Hospitals</h3>
          <p className="text-3xl font-bold">
            {stats.hospitals}
          </p>
        </div>

        <div className="p-5 rounded-2xl border bg-card">
          <h3>Total Medicines</h3>
          <p className="text-3xl font-bold">
            {stats.medicines}
          </p>
        </div>

      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">

        <div className="rounded-2xl border bg-card p-5">

          <h2 className="text-xl font-bold mb-5">
            Platform Distribution
          </h2>

          <div className="h-[350px]">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar
  dataKey="value"
  fill="#14b8a6"
  radius={[8, 8, 0, 0]}
/>
              </BarChart>
            </ResponsiveContainer>

          </div>

        </div>

        <div className="rounded-2xl border bg-card p-5">

          <h2 className="text-xl font-bold mb-5">
            Platform Composition
          </h2>

          <div className="h-[350px]">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <PieChart>

                <Pie
  data={chartData}
  dataKey="value"
  nameKey="name"
  outerRadius={120}
  label
>
  {chartData.map((entry, index) => (
    <Cell
      key={`cell-${index}`}
      fill={
        COLORS[
          index % COLORS.length
        ]
      }
    />
  ))}
</Pie>

                <Tooltip />

                <Legend />

              </PieChart>
            </ResponsiveContainer>

          </div>

        </div>

      </div>

      {/* Summary */}
      <div className="rounded-2xl border bg-card p-6">

        <h2 className="text-xl font-bold mb-4">
          Platform Summary
        </h2>

        <div className="space-y-3">

          <div>
            Total Registered Users:
            <strong>
              {" "}
              {stats.users}
            </strong>
          </div>

          <div>
            Verified Doctors:
            <strong>
              {" "}
              {stats.doctors}
            </strong>
          </div>

          <div>
            Total Appointments:
            <strong>
              {" "}
              {stats.appointments}
            </strong>
          </div>

          <div>
            Registered Hospitals:
            <strong>
              {" "}
              {stats.hospitals}
            </strong>
          </div>

          <div>
            Available Medicines:
            <strong>
              {" "}
              {stats.medicines}
            </strong>
          </div>

        </div>

      </div>

    </div>
  );
}