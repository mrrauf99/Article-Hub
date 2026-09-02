import { redirect } from "react-router-dom";

export function getDashboardPath(role) {
  if (role === "admin") return "/admin/dashboard";
  if (role === "user") return "/user/dashboard";
  return null;
}

export function redirectToDashboard(role) {
  const path = getDashboardPath(role);
  if (!path) return null;
  return redirect(path);
}
