import {
  LayoutDashboard,
  Compass,
  Users,
  FileText,
  Inbox,
  PenSquare,
  Info,
  Mail,
} from "lucide-react";

export function getNavItemsForRole(role) {
  if (role === "user") {
    return [
      { label: "Dashboard", href: "/user/dashboard", icon: LayoutDashboard },
      { label: "Explore", href: "/user/articles", icon: Compass },
      { label: "New article", href: "/user/articles/new", icon: PenSquare },
    ];
  }

  if (role === "admin") {
    return [
      { label: "Review queue", href: "/admin/dashboard", icon: Inbox },
      { label: "Articles", href: "/admin/articles", icon: FileText },
      { label: "Members", href: "/admin/users", icon: Users },
    ];
  }

  if (role === "guest") {
    return [
      { label: "Explore", href: "/#articles", icon: Compass },
      { label: "About", href: "/about", icon: Info },
      { label: "Contact", href: "/contact", icon: Mail },
    ];
  }

  return [];
}
