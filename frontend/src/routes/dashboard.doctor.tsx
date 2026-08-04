import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LayoutDashboard, Calendar, Users, FileText, Clock, IndianRupee, Star, LogOut, UserCircle } from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";

export const Route = createFileRoute("/dashboard/doctor")({
  head: () => ({ meta: [{ title: "Doctor Dashboard — DoctorFind AI" }] }),
  component: DoctorDashboard,
});

const nav = [
  { label: "Dashboard", to: "/dashboard/doctor", icon: LayoutDashboard },
  { label: "Appointments", to: "/dashboard/doctor", icon: Calendar },
  { label: "Availability", to: "/dashboard/doctor/availability", icon: Clock },
  { label: "Logout", to: "/", icon: LogOut },
];

function DoctorDashboard() {
  const [doctor, setDoctor] = useState<any>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("doctor") || localStorage.getItem("doctorData");
      if (stored) {
        setDoctor(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error reading doctor session:", error);
    }
  }, []);

  return (
    <DashboardShell
      role="DOCTOR"
      roleColor="oklch(0.5 0.18 260)"
      nav={nav}
      user={{
        name: doctor?.name ?? "Dr. Ananya Sharma",
        img: doctor?.profileImage ?? "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=300&auto=format&fit=crop",
      }}
    >
      <Outlet />
    </DashboardShell>
  );
}
