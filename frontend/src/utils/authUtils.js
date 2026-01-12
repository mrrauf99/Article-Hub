import { redirect } from "react-router-dom";

/**
 * Get dashboard path for a user role
 */
export function getDashboardPath(role) {
  if (role === "admin") return "/admin/dashboard";
  if (role === "user") return "/user/dashboard";
  return null;
}

/**
 * Redirect to role-based dashboard
 */
export function redirectToDashboard(role) {
  const path = getDashboardPath(role);
  return path ? redirect(path) : null;
}
