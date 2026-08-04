import { createFileRoute, Outlet } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { LayoutDashboard, Users, UserCheck, Building2, Pill, Calendar, BarChart3, Star, Settings, LogOut } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useEffect, useState } from "react";
import axios from "axios";

export const Route = createFileRoute("/dashboard/admin/")({
  head: () => ({ meta: [{ title: "Admin Dashboard — DoctorFind AI" }] }),
  component: AdminDashboard,
});

const nav = [
  { label: "Dashboard", to: "/dashboard/admin", icon: LayoutDashboard },
  { label: "Users", to: "/dashboard/admin", icon: Users },
  { label: "Doctors", to: "/dashboard/admin/doctors", icon: UserCheck },
  { label: "Hospitals", to: "/dashboard/admin", icon: Building2 },
  { label: "Pharmacies", to: "/dashboard/admin", icon: Pill },
  { label: "Appointments", to: "/dashboard/admin", icon: Calendar },
  { label: "Reports & Analytics", to: "/dashboard/admin", icon: BarChart3 },
  { label: "Reviews", to: "/dashboard/admin", icon: Star },
  { label: "Settings", to: "/dashboard/admin", icon: Settings },
  { label: "Logout", to: "/", icon: LogOut },
];

function AdminDashboard() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [activities, setActivities] =
  useState<any[]>([]);
 
 const [chartData, setChartData] =
  useState<any[]>([]);

const fetchChartData = async () => {
  try {
    const res = await axios.get(
      "http://localhost:5000/api/admin/monthly-appointments"
    );

    setChartData(res.data.data || []);
  } catch (error) {
    console.log(error);
  }
};

const fetchActivities = async () => {
  try {
    const res = await axios.get(
      "http://localhost:5000/api/activities"
    );

    setActivities(res.data.activities || []);
  } catch (error) {
    console.log(error);
  }
};
  useEffect(() => {
  const fetchDoctors = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/doctors"
      );

      setDoctors(res.data.doctors);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/admin/stats"
      );

      setStats(res.data.stats);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

fetchDoctors();
fetchStats();
fetchChartData();
fetchActivities();
}, []);

if (loading) {
  return (
    <div className="text-center py-20">
      Loading Dashboard...
    </div>
  );
}

  return (<>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold">Admin Dashboard</h1>
        <p className="mt-1 text-muted-foreground">Platform Overview</p>
      </motion.div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[
  {
    l: "Total Users",
    v: stats?.users || 0,
    d: "Live Data",
  },

  {
    l: "Total Doctors",
    v: stats?.doctors || 0,
    d: "Live Data",
  },

  {
    l: "Appointments",
    v: stats?.appointments || 0,
    d: "Live Data",
  },

  {
    l: "Hospitals",
    v: stats?.hospitals || 0,
    d: "Live Data",
  },

  {
    l: "Medicines",
    v: stats?.medicines || 0,
    d: "Live Data",
  },
].map((k, i) => (
          <motion.div key={k.l} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="rounded-2xl border bg-card p-5">
            <div className="text-sm text-muted-foreground">{k.l}</div>
            <div className="mt-2 font-display text-3xl font-bold">{k.v}</div>
            <div className="mt-1 text-xs font-semibold text-emerald-600">{k.d}</div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="rounded-2xl border bg-card p-5">
          <h3 className="font-display font-bold">Analytics Overview</h3>
          <div className="mt-4 h-72">
            <ResponsiveContainer>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.01 240)" />
                <XAxis
  dataKey="month"
  stroke="#888"
  fontSize={12}
/>

<YAxis
  stroke="#888"
  fontSize={12}
/>

<Tooltip />

<Bar
  dataKey="appointments"
  fill="oklch(0.68 0.13 190)"
  radius={[8,8,0,0]}
/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-2xl border bg-card p-5">
          <h3 className="font-display font-bold">Recent Activities</h3>
          <div className="mt-4 space-y-3 text-sm">
            {activities.map((activity: any) => (
  <div
    key={activity._id}
    className="flex items-start gap-3 rounded-xl border p-3"
  >
    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-teal" />

    <div className="flex-1">
      <div>{activity.title}</div>

      <div className="text-xs text-muted-foreground">
        {new Date(
          activity.createdAt
        ).toLocaleString()}
      </div>
    </div>
  </div>
))}
          </div>
        </motion.div>
      </div>
      </>
  );
}
