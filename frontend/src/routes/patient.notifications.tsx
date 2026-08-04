import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Bell, Check, Trash2, CheckCheck, Calendar, Pill, FileText, Heart, MessageSquare } from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";
import { navItems } from "./patient.dashboard";
import { useState, useEffect } from "react";
import { fetchNotifications, markNotificationRead, deleteNotification } from "@/services/api";

export const Route = createFileRoute("/patient/notifications")({
  head: () => ({ meta: [{ title: "Notification Center — DoctorFind AI" }] }),
  component: NotificationsPage,
});

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("all");

  const loadNotificationsData = async () => {
    try {
      setLoading(true);
      const res = await fetchNotifications();
      if (res?.notifications) {
        setNotifications(res.notifications);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotificationsData();
  }, []);

  const handleMarkRead = async (id: string) => {
    try {
      await markNotificationRead(id);
      loadNotificationsData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNotification(id);
      loadNotificationsData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleClearAll = async () => {
    if (confirm("Are you sure you want to delete all notifications?")) {
      try {
        await deleteNotification("all");
        loadNotificationsData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const filtered = filterType === "all" ? notifications : notifications.filter((n) => n.type === filterType);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <DashboardShell role="PATIENT" roleColor="oklch(0.68 0.13 190)" nav={navItems} user={{ name: "Rahul" }}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold flex items-center gap-2">
            <Bell className="h-7 w-7 text-teal" /> Real-time Notification Center
          </h1>
          <p className="mt-1 text-muted-foreground">Appointment reminders, medicine schedule alerts, doctor messages, and lab reports</p>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => handleMarkRead("all")} className="inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-semibold hover:bg-accent">
            <CheckCheck className="h-4 w-4 text-teal" /> Mark All as Read
          </button>
          <button onClick={handleClearAll} className="inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-semibold text-rose-500 hover:bg-rose-50">
            <Trash2 className="h-4 w-4" /> Clear All
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-6 flex flex-wrap items-center gap-2 rounded-2xl border bg-card p-3">
        {[
          { id: "all", label: `All (${notifications.length})` },
          { id: "appointment", label: "Appointments" },
          { id: "medicine", label: "Medicine Reminders" },
          { id: "report", label: "Lab Reports" },
          { id: "prescription", label: "Prescriptions" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id)}
            className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
              filterType === tab.id ? "bg-teal text-white shadow" : "bg-accent/60 text-muted-foreground hover:bg-accent"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="mt-6 space-y-3">
        {loading ? (
          <div className="py-12 text-center text-sm text-muted-foreground">Loading notifications...</div>
        ) : filtered.length > 0 ? (
          filtered.map((n: any) => (
            <motion.div
              key={n._id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-2xl border p-4 transition flex items-start justify-between gap-4 ${
                n.read ? "bg-card" : "bg-teal/5 border-teal/40 font-medium"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`mt-1 grid h-9 w-9 place-items-center rounded-xl shrink-0 ${
                  n.type === "appointment" ? "bg-blue-100 text-blue-600" :
                  n.type === "medicine" ? "bg-teal/20 text-teal" :
                  n.type === "report" ? "bg-purple-100 text-purple-600" : "bg-emerald-100 text-emerald-600"
                }`}>
                  {n.type === "appointment" ? <Calendar className="h-4 w-4" /> :
                   n.type === "medicine" ? <Pill className="h-4 w-4" /> :
                   n.type === "report" ? <FileText className="h-4 w-4" /> : <Heart className="h-4 w-4" />}
                </div>

                <div>
                  <div className="font-display font-bold text-sm text-foreground flex items-center gap-2">
                    {n.title}
                    {!n.read && <span className="h-2 w-2 rounded-full bg-teal" />}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{n.message}</div>
                  <div className="text-[10px] text-muted-foreground mt-2">{new Date(n.createdAt).toLocaleString()}</div>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                {!n.read && (
                  <button onClick={() => handleMarkRead(n._id)} className="p-2 rounded-lg hover:bg-accent text-teal" title="Mark Read">
                    <Check className="h-4 w-4" />
                  </button>
                )}
                <button onClick={() => handleDelete(n._id)} className="p-2 rounded-lg hover:bg-rose-50 text-muted-foreground hover:text-rose-500" title="Delete">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="rounded-2xl border bg-card p-12 text-center text-sm text-muted-foreground">
            No notifications found
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
