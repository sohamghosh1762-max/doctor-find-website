import { createFileRoute, Outlet } from "@tanstack/react-router";
import { DashboardShell } from "@/components/dashboard-shell";
import AdminProtectedRoute from "@/components/AdminProtectedRoute";

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

export const Route = createFileRoute("/dashboard/admin")({
  component: AdminLayout,
});

const nav = [
  { label: "Dashboard", to: "/dashboard/admin", icon: LayoutDashboard },
  { label: "Users", to: "/dashboard/admin/users", icon: Users, },
  { label: "Doctors", to: "/dashboard/admin/doctors", icon: UserCheck },
  { label: "Hospitals", to: "/dashboard/admin/hospitals", icon: Building2 },
  { label: "Pharmacies", to: "/dashboard/admin/pharmacies", icon: Pill },
  { label: "Appointments", to: "/dashboard/admin/appointments", icon: Calendar },
  { label: "Reports & Analytics", to: "/dashboard/admin/reports", icon: BarChart3 },
  { label: "Reviews", to: "/dashboard/admin/reviews", icon: Star },
  { label: "Settings", to: "/dashboard/admin/settings", icon: Settings },
  {
  label: "Logout",
  to: "/",
  icon: LogOut,
  onClick: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
},
];

function AdminLayout() {
  return (
    <AdminProtectedRoute>

      <DashboardShell
        role="ADMIN"
        roleColor="oklch(0.6 0.22 25)"
        nav={nav}
        user={{ name: "Admin" }}
      >
        <Outlet />
      </DashboardShell>

    </AdminProtectedRoute>
  );
}