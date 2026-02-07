import { redirect } from "react-router-dom";

/**
 * Get dashboard path for a user role
 */
function getDashboardPath(role) {
  if (role === "admin") return "/admin/dashboard";
  if (role === "user") return "/user/dashboard";
  return null;
}

/**
 * Redirect to role-based dashboard
 */
export function redirectToDashboard(role, doRedirect = true) {
  const path = getDashboardPath(role);
  if (!path) return null;
  return doRedirect ? redirect(path) : path;
}
