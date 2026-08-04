import { Navigate } from "@tanstack/react-router";

export default function AdminProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  if (typeof window === "undefined") {
    return null;
  }

  const storedUser =
    localStorage.getItem("user");

  if (!storedUser) {
    return <Navigate to="/login" />;
  }

  const user = JSON.parse(storedUser);

  if (user.role !== "admin") {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}