import { FileText, BarChart, Users } from "lucide-react";

export function getNavItemsForRole(role) {
  if (role === "user") {
    return [
      { label: "My Articles", icon: FileText, href: "/user/articles" },
      { label: "Create Article", icon: FileText, href: "/user/articles/new" },
    ];
  }

  if (role === "admin") {
    return [
      { label: "Dashboard", icon: BarChart, href: "/admin/dashboard" },
      { label: "Manage Users", icon: Users, href: "/admin/users" },
    ];
  }

  return [];
}
