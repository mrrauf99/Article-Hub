import { FileText, BarChart, Users } from "lucide-react";

export function getNavItemsForRole(role) {
  if (role === "user") {
    return [
      { label: "My Articles", href: "/user/dashboard" },
      { label: "All Articles", href: "/user/articles" },
    ];
  }

  if (role === "admin") {
    return [
      { label: "Dashboard", href: "/admin/dashboard" },
      { label: "Manage Users", href: "/admin/users" },
    ];
  }

  return [];
}
