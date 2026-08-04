import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import PatientDashboardPage from "./patient.dashboard";

export const Route = createFileRoute("/dashboard/patient")({
  head: () => ({ meta: [{ title: "Patient Dashboard — DoctorFind AI" }] }),
  component: DashboardPatientRedirect,
});

function DashboardPatientRedirect() {
  return <PatientDashboardPage />;
}
