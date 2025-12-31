import { FileText, BarChart, Users, LayoutDashboard } from "lucide-react";

export function getNavItemsForRole(role) {
  if (role === "user") {
    return [
      { label: "My Articles", href: "/user/dashboard", icon: FileText },
      { label: "All Articles", href: "/user/articles", icon: BarChart },
    ];
  }

  if (role === "admin") {
    return [
      { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
      { label: "Articles", href: "/admin/articles", icon: FileText },
      { label: "Users", href: "/admin/users", icon: Users },
    ];
  }

  return [];
}
