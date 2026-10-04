import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useEffect, useState } from "react";
import api, {
  fetchDoctors,
  fetchAdminStats,
  fetchMonthlyAppointments,
} from "@/services/api";

export const Route = createFileRoute("/dashboard/admin/")({
  head: () => ({ meta: [{ title: "Admin Dashboard — DoctorFind AI" }] }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [statsRes, chartRes, actRes] = await Promise.all([
          fetchAdminStats().catch(() => ({ stats: null })),
          fetchMonthlyAppointments().catch(() => ({ data: [] })),
          api.get("/activities").catch(() => ({ data: { activities: [] } })),
        ]);

        if (statsRes?.stats) setStats(statsRes.stats);
        if (chartRes?.data) setChartData(chartRes.data);
        if (actRes?.data?.activities) setActivities(actRes.data.activities);
      } catch (error) {
        console.log("Admin dashboard error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20">
        Loading Dashboard Overview...
      </div>
    );
  }

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold">Admin Dashboard</h1>
        <p className="mt-1 text-muted-foreground">Platform Overview & Healthcare Analytics</p>
      </motion.div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[
          {
            l: "Total Users",
            v: stats?.users || 0,
            d: "Registered Patients & Staff",
          },
          {
            l: "Total Doctors",
            v: stats?.doctors || 0,
            d: `${stats?.verifiedDoctors || 0} Verified Doctors`,
          },
          {
            l: "Appointments",
            v: stats?.appointments || 0,
            d: `${stats?.confirmedAppointments || 0} Confirmed`,
          },
          {
            l: "Hospitals",
            v: stats?.hospitals || 0,
            d: "Partner Facilities",
          },
          {
            l: "Medicines",
            v: stats?.medicines || 0,
            d: "Dispensary Catalog",
          },
        ].map((k, i) => (
          <motion.div
            key={k.l}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="rounded-2xl border bg-card p-5 shadow-sm"
          >
            <div className="text-sm text-muted-foreground">{k.l}</div>
            <div className="mt-2 font-display text-3xl font-bold">{k.v}</div>
            <div className="mt-1 text-xs font-semibold text-emerald-600">{k.d}</div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl border bg-card p-5 shadow-sm"
        >
          <h3 className="font-display font-bold">Monthly Appointments Trend</h3>
          <div className="mt-4 h-72">
            <ResponsiveContainer>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.01 240)" />
                <XAxis dataKey="month" stroke="#888" fontSize={12} />
                <YAxis stroke="#888" fontSize={12} />
                <Tooltip />
                <Bar
                  dataKey="appointments"
                  fill="oklch(0.68 0.13 190)"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border bg-card p-5 shadow-sm"
        >
          <h3 className="font-display font-bold">Recent System Activities</h3>
          <div className="mt-4 space-y-3 text-sm max-h-72 overflow-y-auto">
            {activities.length === 0 ? (
              <div className="text-xs text-muted-foreground py-4">No recent activity logged.</div>
            ) : (
              activities.map((activity: any) => (
                <div
                  key={activity._id}
                  className="flex items-start gap-3 rounded-xl border p-3 bg-slate-50/50"
                >
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-teal" />
                  <div className="flex-1">
                    <div className="font-medium text-xs">{activity.title}</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">
                      {new Date(activity.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </>
  );
}
