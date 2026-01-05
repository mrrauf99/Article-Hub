import { LayoutDashboard, Compass, Users, FileText, PenSquare } from "lucide-react";

export function getNavItemsForRole(role) {
  if (role === "user") {
    return [
      { label: "Dashboard", href: "/user/dashboard", icon: LayoutDashboard },
      { label: "Explore", href: "/user/articles", icon: Compass },
      { label: "Create", href: "/user/articles/new", icon: PenSquare },
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
